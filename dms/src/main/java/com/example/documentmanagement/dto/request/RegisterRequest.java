package com.example.documentmanagement.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email must be less than 100 characters")
    private String email;

    @Size(max = 20, message = "Phone number too long")
    private String phoneNumber;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100, message = "Password must be at least 6 characters")
    private String password;

    private String requestedRole;

    private String otpCode;

    // New profile fields
    private String fullName;
    private String dateOfBirth;  // ISO date string, e.g. "1995-06-15"
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

    // EMAIL or PHONE
    @Builder.Default
    private String registrationMethod = "EMAIL";

    private String zone;
    private String promoCode;
    private String photoUrl;
}
