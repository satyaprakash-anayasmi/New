package com.example.documentmanagement.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class DistributionVerificationResponse {
    private Long id;
    private Long assignmentId;
    private String dealerUsername;
    private String productName;
    private Integer targetQuantity;
    private String customerName;
    private String details;
    private String photoProofUrl;
    private LocalDateTime distributionDate;
    private String verificationStatus;
    private LocalDateTime createdAt;
}
