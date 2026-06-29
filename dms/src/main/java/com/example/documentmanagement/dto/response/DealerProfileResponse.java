package com.example.documentmanagement.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DealerProfileResponse {
    private Long id;
    private String username;
    private String email;
    private String photoUrl;
    private String aadhaarNumber;
    private String panNumber;
    private String area;
    private String state;
    private String district;
    private String pinCode;
    private String address;
    private boolean verified;
    private String verificationStatus;
    private boolean active;
    private LocalDateTime createdAt;
}
