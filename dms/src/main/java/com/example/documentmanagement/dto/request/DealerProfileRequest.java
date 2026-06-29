package com.example.documentmanagement.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;

@Data
public class DealerProfileRequest {
    private String photoUrl;

    @NotBlank(message = "Aadhaar number is required")
    @Pattern(regexp = "^[2-9]{1}[0-9]{11}$", message = "Invalid Aadhaar number format")
    private String aadhaarNumber;
    
    private String aadhaarUrl;

    @NotBlank(message = "PAN number is required")
    @Pattern(regexp = "^[A-Z]{5}[0-9]{4}[A-Z]{1}$", message = "Invalid PAN number format")
    private String panNumber;
    
    private String panUrl;
    
    private String area;
    private String state;
    private String district;
    
    @Pattern(regexp = "^[0-9]{6}$", message = "Invalid PIN code format")
    private String pinCode;
    
    @NotBlank(message = "Address is required")
    private String address;
}
