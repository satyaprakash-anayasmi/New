package com.example.documentmanagement.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateRequest {
    private String fullName;
    private String email;
    private String phoneNumber;
    private String gender;
    private String dateOfBirth;
    private String address;
    private String block;
    private String town;
    private String state;
    private String village;
    private String landmark;
    private String district;
    private String country;
    private String pinCode;
    private String zone;
    private String requestedRole;
    private String paymentStatus;
    private Boolean isActive;
}
