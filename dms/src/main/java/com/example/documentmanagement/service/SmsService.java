package com.example.documentmanagement.service;

/**
 * SMS sending service interface.
 * Currently implemented via Fast2SMS (Indian SMS gateway).
 */
public interface SmsService {
    /**
     * Send an OTP message to the given mobile number.
     *
     * @param phoneNumber mobile number (10 digits, without country code)
     * @param otp         6-digit OTP code
     */
    void sendOtp(String phoneNumber, String otp);
}
