package com.example.documentmanagement.controller;

import com.example.documentmanagement.dto.request.PaymentRequest;
import com.example.documentmanagement.dto.response.ApiResponse;
import com.example.documentmanagement.dto.response.PaymentResponse;
import com.example.documentmanagement.dto.response.RazorpayOrderResponse;
import com.example.documentmanagement.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.example.documentmanagement.util.MessageConstants;

@RestController
@RequestMapping("/api/payments")
@Tag(name = "Payment", description = "User payment submission endpoints")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order")
    @Operation(summary = "Create an online payment order for a plan")
    public ResponseEntity<ApiResponse<RazorpayOrderResponse>> createOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam Long planId) {

        RazorpayOrderResponse response = paymentService.createOrder(userDetails.getUsername(), planId);
        return ResponseEntity.ok(ApiResponse.success(MessageConstants.Success.PAYMENT_ORDER_CREATED, response));
    }

    @PostMapping("/submit")
    @Operation(summary = "Submit a payment record")
    public ResponseEntity<ApiResponse<PaymentResponse>> submitPayment(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody PaymentRequest request) {

        PaymentResponse response = paymentService.submitPayment(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success(MessageConstants.Success.PAYMENT_SUBMITTED, response));
    }

    @GetMapping("/my")
    @Operation(summary = "Get the logged-in user's latest payment record")
    public ResponseEntity<ApiResponse<PaymentResponse>> getMyPayment(
            @AuthenticationPrincipal UserDetails userDetails) {

        PaymentResponse response = paymentService.getMyPayment(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(MessageConstants.Success.PAYMENT_RECORD_FETCHED, response));
    }
}
