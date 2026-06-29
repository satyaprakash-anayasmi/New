package com.example.documentmanagement.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phoneNumber;
    private String paymentStatus;

    @JsonProperty("isPaid")
    private boolean isPaid;

    @JsonProperty("isActive")
    private boolean isActive;

    private String registrationStatus;
    private String requestedRole;
    private java.util.List<String> roles;

    private String referralCode;
    private String createdAt;
}
