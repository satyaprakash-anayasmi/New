package com.example.documentmanagement.service;

import com.example.documentmanagement.dto.request.PaymentRequest;
import com.example.documentmanagement.dto.request.PaymentReviewRequest;
import com.example.documentmanagement.dto.response.PaymentResponse;
import com.example.documentmanagement.dto.response.RazorpayOrderResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PaymentService {

    /**
     * Create an online payment order for a selected plan.
     */
    RazorpayOrderResponse createOrder(String username, Long planId);

    /**
     * Submit a payment record for the currently authenticated user.
     */
    PaymentResponse submitPayment(String username, PaymentRequest request);

    /**
     * Get the latest payment record for the currently authenticated user.
     */
    PaymentResponse getMyPayment(String username);

    /**
     * Admin: Get all payments filtered by status (PENDING / APPROVED / REJECTED / ALL).
     */
    Page<PaymentResponse> getAllPayments(String status, Pageable pageable);

    /**
     * Admin: Approve a payment and activate the user.
     */
    PaymentResponse approvePayment(Long paymentId, PaymentReviewRequest reviewRequest, String adminUsername);

    /**
     * Admin: Reject a payment submission.
     */
    PaymentResponse rejectPayment(Long paymentId, PaymentReviewRequest reviewRequest, String adminUsername);
}
