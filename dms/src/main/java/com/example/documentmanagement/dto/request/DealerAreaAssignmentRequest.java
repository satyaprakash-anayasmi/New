package com.example.documentmanagement.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class DealerAreaAssignmentRequest {
    
    @NotBlank(message = "State is required")
    private String state;
    
    @NotBlank(message = "District is required")
    private String district;
    
    @NotBlank(message = "Local Area is required")
    private String area;
    
    @NotBlank(message = "PIN Code is required")
    @Size(min = 6, max = 6, message = "PIN Code must be exactly 6 digits")
    private String pinCode;
}
