package com.example.documentmanagement.service;

public interface EmailService {
    void sendOtp(String to, String otp);

    void sendApprovalEmail(String to, String role);

    void sendRejectionEmail(String to, String reason);

    void sendDeletionEmail(String to);

    void sendFacilityInterestEmail(String adminEmail, String username, com.example.documentmanagement.entity.User user, String facilityName);
}
