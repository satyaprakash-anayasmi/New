package com.example.documentmanagement.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class DistributionVerificationRequest {
    
    @NotNull(message = "Assignment ID is required")
    private Long assignmentId;
    
    @NotBlank(message = "Customer name is required")
    @Size(max = 100, message = "Customer name cannot exceed 100 characters")
    private String customerName;
    
    private String details;
    
    @NotBlank(message = "Photo proof URL is required")
    private String photoProofUrl;
}
