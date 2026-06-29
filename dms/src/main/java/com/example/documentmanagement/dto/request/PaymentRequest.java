package com.example.documentmanagement.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentRequest {

    @NotNull(message = "Subscription plan is required")
    private Long subscriptionPlanId;

    private BigDecimal amount; // Optional, defaults to plan price

    @NotBlank(message = "Payment method is required")
    @Size(max = 50, message = "Payment method too long")
    private String paymentMethod; // UPI, CARD, NETBANKING, etc.

    @Size(max = 200, message = "Transaction reference too long")
    private String transactionReference;

    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;

    @Size(max = 500, message = "Remarks too long")
    private String remarks;
}
