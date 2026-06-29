package com.example.documentmanagement.dto;

import lombok.Data;

@Data
public class FacilityInterestRequest {
    private String facilityName;
    private UserDetails userDetails;

    @Data
    public static class UserDetails {
        private String sub; // username (JWT subject)
        private String username;
    }
}
