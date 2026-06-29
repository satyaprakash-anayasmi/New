package com.example.documentmanagement.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileResponse {

    private Long id;
    private String username;
    private String email;
    private String phoneNumber;
    private String fullName;
    private LocalDate dateOfBirth;
    private String gender;

    // Address fields
    private String address;
    private String block;
    private String town;
    private String state;
    private String village;
    private String landmark;
    private String district;
    private String country;
    private String pinCode;

    private String registrationMethod;
    private String profilePhotoUrl;
    private String paymentStatus;   // PENDING or COMPLETED
    private String profileStatus;   // "Active" or "Inactive"
    
    @JsonProperty("isActive")
    private boolean isActive;        // true only after admin approval
    
    private String registrationStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private String zone;
    private String referralCode;
    private String referredByUsername;
}
