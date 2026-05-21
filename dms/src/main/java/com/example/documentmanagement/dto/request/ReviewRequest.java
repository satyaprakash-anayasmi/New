package com.example.documentmanagement.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReviewRequest {
    @NotBlank(message = "Action is required")
    private String action; // APPROVED or REJECTED
    
    private String comments;
}
