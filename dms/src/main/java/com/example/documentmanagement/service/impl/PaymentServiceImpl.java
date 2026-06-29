package com.example.documentmanagement.service.impl;

import com.example.documentmanagement.dto.request.PaymentRequest;
import com.example.documentmanagement.dto.request.PaymentReviewRequest;
import com.example.documentmanagement.dto.response.PaymentResponse;
import com.example.documentmanagement.dto.response.RazorpayOrderResponse;
import com.example.documentmanagement.entity.Payment;
import com.example.documentmanagement.entity.User;
import com.example.documentmanagement.entity.SubscriptionPlan;
import com.example.documentmanagement.exception.BusinessException;
import com.example.documentmanagement.repository.PaymentRepository;
import com.example.documentmanagement.repository.UserRepository;
import com.example.documentmanagement.util.MessageConstants;
import com.example.documentmanagement.repository.SubscriptionPlanRepository;
import com.example.documentmanagement.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private static final String STATUS_PENDING = "PENDING";
    private static final String STATUS_APPROVED = "APPROVED";
    private static final String STATUS_REJECTED = "REJECTED";

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final SubscriptionPlanRepository subscriptionPlanRepository;

    @Value("${app.razorpay.key-id:}")
    private String keyId;

    @Value("${app.razorpay.key-secret:}")
    private String keySecret;

    @Override
    @Transactional
    public RazorpayOrderResponse createOrder(String username, Long planId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException(MessageConstants.Error.USER_NOT_FOUND + ": " + username));

        SubscriptionPlan plan = subscriptionPlanRepository.findById(planId)
                .orElseThrow(() -> new BusinessException(MessageConstants.Error.SUBSCRIPTION_PLAN_NOT_FOUND + ": " + planId));

        BigDecimal amount = plan.getPrice();
        String orderId;
        boolean isMock = true;

        if (keyId != null && !keyId.isBlank() && keySecret != null && !keySecret.isBlank()) {
            try {
                RestTemplate restTemplate = new RestTemplate();
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.setBasicAuth(keyId, keySecret);

                Map<String, Object> requestMap = new HashMap<>();
                requestMap.put("amount", amount.multiply(new BigDecimal("100")).intValue());
                requestMap.put("currency", "INR");
                requestMap.put("receipt", "receipt_plan_" + planId + "_" + System.currentTimeMillis());

                HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestMap, headers);
                ResponseEntity<Map> response = restTemplate.postForEntity(
                        "https://api.razorpay.com/v1/orders", requestEntity, Map.class);

                if (response.getStatusCode() == HttpStatus.CREATED && response.getBody() != null) {
                    orderId = (String) response.getBody().get("id");
                    isMock = false;
                } else {
                    log.warn("Razorpay API returned status {}. Falling back to mock order.", response.getStatusCode());
                    orderId = "order_mock_" + UUID.randomUUID().toString().replace("-", "").substring(0, 14);
                }
            } catch (Exception e) {
                log.error("Failed to create Razorpay order, falling back to mock order: {}", e.getMessage());
                orderId = "order_mock_" + UUID.randomUUID().toString().replace("-", "").substring(0, 14);
            }
        } else {
            orderId = "order_mock_" + UUID.randomUUID().toString().replace("-", "").substring(0, 14);
        }

        return RazorpayOrderResponse.builder()
                .orderId(orderId)
                .amount(amount)
                .currency("INR")
                .keyId(keyId)
                .isMock(isMock)
                .planId(plan.getId())
                .planName(plan.getName())
                .build();
    }

    @Override
    @Transactional
    public PaymentResponse submitPayment(String username, PaymentRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException(MessageConstants.Error.USER_NOT_FOUND + ": " + username));

        // Prevent duplicate pending payments
        if (paymentRepository.existsByUserIdAndStatus(user.getId(), STATUS_PENDING)) {
            throw new BusinessException(MessageConstants.Error.PAYMENT_ALREADY_PENDING);
        }

        SubscriptionPlan plan = subscriptionPlanRepository.findById(request.getSubscriptionPlanId())
                .orElseThrow(() -> new BusinessException(MessageConstants.Error.SUBSCRIPTION_PLAN_NOT_FOUND + ": " + request.getSubscriptionPlanId()));

        // Verification logic
        boolean isOnline = false;
        if (request.getRazorpayOrderId() != null && request.getRazorpayOrderId().startsWith("order_mock_")) {
            if (request.getRazorpayPaymentId() == null || !request.getRazorpayPaymentId().startsWith("pay_mock_")) {
                throw new BusinessException(MessageConstants.Error.PAYMENT_INVALID_SIMULATED);
            }
            isOnline = true;
        } else if (request.getRazorpayOrderId() != null && !request.getRazorpayOrderId().isBlank()) {
            boolean valid = verifySignature(request.getRazorpayOrderId(), request.getRazorpayPaymentId(), request.getRazorpaySignature());
            if (!valid) {
                throw new BusinessException(MessageConstants.Error.PAYMENT_SIGNATURE_FAILED);
            }
            isOnline = true;
        } else {
            throw new BusinessException(MessageConstants.Error.PAYMENT_VERIFICATION_REQUIRED);
        }

        String status = isOnline ? STATUS_APPROVED : STATUS_PENDING;
        Payment payment = Payment.builder()
                .user(user)
                .subscriptionPlan(plan)
                .amount(plan.getPrice())
                .paymentMethod(request.getPaymentMethod())
                .transactionReference(request.getTransactionReference())
                .razorpayOrderId(request.getRazorpayOrderId())
                .razorpayPaymentId(request.getRazorpayPaymentId())
                .razorpaySignature(request.getRazorpaySignature())
                .remarks(request.getRemarks())
                .status(status)
                .submittedAt(LocalDateTime.now())
                .build();

        if (isOnline) {
            user.setPaymentStatus("COMPLETED");
            user.setActive(true);
            user.setRegistrationStatus("APPROVED");
            user.setUpdatedAt(LocalDateTime.now());
            user.setUpdatedBy("SYSTEM_AUTO");
            userRepository.save(user);

            payment.setReviewedAt(LocalDateTime.now());
            payment.setReviewedBy("SYSTEM_AUTO");
        }

        Payment saved = paymentRepository.save(payment);
        log.info("PAYMENT SUBMITTED: User={}, Plan={}, Amount={}, Method={}, Status={}", username, plan.getCode(), plan.getPrice(), request.getPaymentMethod(), status);
        return toResponse(saved);
    }

    private boolean verifySignature(String orderId, String paymentId, String signature) {
        try {
            if (keySecret == null || keySecret.isBlank()) {
                return false;
            }
            String data = orderId + "|" + paymentId;
            javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA256");
            javax.crypto.spec.SecretKeySpec secretKeySpec = new javax.crypto.spec.SecretKeySpec(keySecret.getBytes("UTF-8"), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] rawHmac = mac.doFinal(data.getBytes("UTF-8"));

            StringBuilder hexString = new StringBuilder();
            for (byte b : rawHmac) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString().equals(signature);
        } catch (Exception e) {
            log.error("Razorpay signature verification exception: {}", e.getMessage());
            return false;
        }
    }

    @Override
    public PaymentResponse getMyPayment(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException(MessageConstants.Error.USER_NOT_FOUND + ": " + username));

        return paymentRepository.findTopByUserIdOrderBySubmittedAtDesc(user.getId())
                .map(this::toResponse)
                .orElse(null);
    }

    @Override
    public Page<PaymentResponse> getAllPayments(String status, Pageable pageable) {
        Page<Payment> page;
        if (status == null || status.isBlank() || "ALL".equalsIgnoreCase(status)) {
            page = paymentRepository.findAll(pageable);
        } else if ("ACTIVE".equalsIgnoreCase(status)) {
            page = paymentRepository.findByStatusIn(List.of(STATUS_PENDING, STATUS_APPROVED), pageable);
        } else {
            page = paymentRepository.findByStatus(status.toUpperCase(), pageable);
        }
        return page.map(this::toResponse);
    }

    @Override
    @Transactional
    public PaymentResponse approvePayment(Long paymentId, PaymentReviewRequest reviewRequest, String adminUsername) {
        Payment payment = getPaymentOrThrow(paymentId);

        if (!STATUS_PENDING.equals(payment.getStatus())) {
            throw new BusinessException(MessageConstants.Error.PAYMENT_NOT_PENDING_APPROVAL + payment.getStatus());
        }

        payment.setStatus(STATUS_APPROVED);
        payment.setAdminRemarks(reviewRequest != null ? reviewRequest.getAdminRemarks() : null);
        payment.setReviewedAt(LocalDateTime.now());
        payment.setReviewedBy(adminUsername);

        // Activate the user upon payment approval — this is the ONLY trigger for isActive=true
        // for users who chose to pay. Admin payment approval = user activation.
        User user = payment.getUser();
        user.setPaymentStatus("COMPLETED");
        user.setActive(true);
        user.setRegistrationStatus("APPROVED");   // sync registration panel
        user.setUpdatedAt(LocalDateTime.now());
        user.setUpdatedBy(adminUsername);
        userRepository.save(user);

        Payment saved = paymentRepository.save(payment);
        log.info("PAYMENT APPROVED: PaymentId={}, UserId={}, Admin={}", paymentId, user.getId(), adminUsername);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public PaymentResponse rejectPayment(Long paymentId, PaymentReviewRequest reviewRequest, String adminUsername) {
        Payment payment = getPaymentOrThrow(paymentId);

        if (!STATUS_PENDING.equals(payment.getStatus())) {
            throw new BusinessException(MessageConstants.Error.PAYMENT_NOT_PENDING_REJECTION + payment.getStatus());
        }

        payment.setStatus(STATUS_REJECTED);
        payment.setAdminRemarks(reviewRequest != null ? reviewRequest.getAdminRemarks() : null);
        payment.setReviewedAt(LocalDateTime.now());
        payment.setReviewedBy(adminUsername);

        Payment saved = paymentRepository.save(payment);
        log.info("PAYMENT REJECTED: PaymentId={}, UserId={}, Admin={}", paymentId, payment.getUser().getId(), adminUsername);
        return toResponse(saved);
    }

    // ─── Private Helpers ──────────────────────────────────────────────────────

    private Payment getPaymentOrThrow(Long paymentId) {
        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> new BusinessException(MessageConstants.Error.PAYMENT_NOT_FOUND + " with id: " + paymentId));
    }

    private PaymentResponse toResponse(Payment p) {
        User u = p.getUser();
        SubscriptionPlan plan = p.getSubscriptionPlan();
        return PaymentResponse.builder()
                .id(p.getId())
                .userId(u.getId())
                .username(u.getUsername())
                .fullName(u.getFullName())
                .email(u.getEmail())
                .phoneNumber(u.getPhoneNumber())
                .amount(p.getAmount())
                .paymentMethod(p.getPaymentMethod())
                .transactionReference(p.getTransactionReference())
                .razorpayOrderId(p.getRazorpayOrderId())
                .razorpayPaymentId(p.getRazorpayPaymentId())
                .planId(plan != null ? plan.getId() : null)
                .planName(plan != null ? plan.getName() : "Legacy/Direct Payment")
                .planCode(plan != null ? plan.getCode() : null)
                .remarks(p.getRemarks())
                .status(p.getStatus())
                .adminRemarks(p.getAdminRemarks())
                .submittedAt(p.getSubmittedAt())
                .reviewedAt(p.getReviewedAt())
                .reviewedBy(p.getReviewedBy())
                .build();
    }
}
