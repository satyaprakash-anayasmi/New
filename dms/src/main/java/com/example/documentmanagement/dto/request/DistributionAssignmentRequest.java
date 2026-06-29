package com.example.documentmanagement.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

@Data
public class DistributionAssignmentRequest {
    
    @NotNull(message = "Dealer ID is required")
    private Long dealerId;
    
    @NotNull(message = "Product IDs are required")
    private java.util.List<Long> productIds;
    
    @NotNull(message = "Target quantity is required")
    @Min(value = 1, message = "Target quantity must be at least 1")
    private Integer targetQuantity;
    
    private String attachmentUrl;
    
    private String state;
    private String district;
    private String block;
    private String pinCode;
    
    private java.util.List<Long> assignedUserIds;
}
