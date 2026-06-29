package com.example.documentmanagement.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class DistributionAssignmentResponse {
    private Long id;
    private Long dealerId;
    private String dealerUsername;
    private Long productId;
    private String productName;
    private Integer targetQuantity;
    private String attachmentUrl;
    private boolean active;
    private LocalDateTime createdAt;
    
    private String state;
    private String district;
    private String block;
    private String pinCode;
    
    private java.util.List<AssignedUserResponse> assignedUsers;
    
    @Data
    @Builder
    public static class AssignedUserResponse {
        private Long id;
        private String fullName;
        private String phoneNumber;
    }
}
