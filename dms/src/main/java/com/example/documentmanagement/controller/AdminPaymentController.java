package com.example.documentmanagement.controller;

import com.example.documentmanagement.dto.request.PaymentReviewRequest;
import com.example.documentmanagement.dto.response.ApiResponse;
import com.example.documentmanagement.dto.response.PaymentResponse;
import com.example.documentmanagement.service.PaymentService;
import com.example.documentmanagement.util.MessageConstants;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/payments")
@Tag(name = "Admin Payment Management", description = "Admin endpoints to review and approve member payments")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminPaymentController {

    private final PaymentService paymentService;

    @GetMapping
    @Operation(summary = "Get all payment submissions (filterable by status: PENDING, APPROVED, REJECTED, ALL)")
    public ResponseEntity<ApiResponse<Page<PaymentResponse>>> getAllPayments(
            @RequestParam(defaultValue = "ALL") String status,
            Pageable pageable) {

        return ResponseEntity.ok(
                ApiResponse.success(MessageConstants.Success.PAYMENTS_FETCHED, paymentService.getAllPayments(status, pageable)));
    }

    @PutMapping("/{paymentId}/approve")
    @Operation(summary = "Approve a payment and activate the member")
    public ResponseEntity<ApiResponse<PaymentResponse>> approvePayment(
            @PathVariable Long paymentId,
            @RequestBody(required = false) PaymentReviewRequest reviewRequest,
            @AuthenticationPrincipal UserDetails adminDetails) {

        PaymentResponse response = paymentService.approvePayment(paymentId, reviewRequest, adminDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(MessageConstants.Success.PAYMENT_APPROVED, response));
    }

    @PutMapping("/{paymentId}/reject")
    @Operation(summary = "Reject a payment submission")
    public ResponseEntity<ApiResponse<PaymentResponse>> rejectPayment(
            @PathVariable Long paymentId,
            @RequestBody(required = false) PaymentReviewRequest reviewRequest,
            @AuthenticationPrincipal UserDetails adminDetails) {

        PaymentResponse response = paymentService.rejectPayment(paymentId, reviewRequest, adminDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(MessageConstants.Success.PAYMENT_REJECTED, response));
    }
}
