package com.example.documentmanagement.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponse {

    private Long id;
    private Long userId;
    private String username;
    private String fullName;
    private String email;
    private String phoneNumber;
    private BigDecimal amount;
    private String paymentMethod;
    private String transactionReference;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private Long planId;
    private String planName;
    private String planCode;
    private String remarks;
    private String status;
    private String adminRemarks;
    private LocalDateTime submittedAt;
    private LocalDateTime reviewedAt;
    private String reviewedBy;
}
