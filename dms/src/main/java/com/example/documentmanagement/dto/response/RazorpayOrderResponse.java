package com.example.documentmanagement.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RazorpayOrderResponse {
    private String orderId;     // Razorpay order ID or simulated order ID
    private BigDecimal amount;  // Amount in rupees (multiply ×100 for paise on frontend)
    private String currency;    // e.g. INR
    private String keyId;       // Razorpay key_id (empty string when mock)
    private boolean isMock;     // True if mock sandbox payment processing is active
    private Long planId;        // The plan that was ordered
    private String planName;    // Human-readable plan name
}
