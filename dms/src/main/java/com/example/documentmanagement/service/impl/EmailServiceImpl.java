package com.example.documentmanagement.service.impl;

import com.example.documentmanagement.service.EmailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import com.example.documentmanagement.util.MessageConstants;

@Service
@Slf4j
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @org.springframework.beans.factory.annotation.Value("${app.otp.debug:false}")
    private boolean otpDebug;

    @Override
    public void sendOtp(String to, String otp) {
        log.info("Sending OTP email to {}", to);
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Your DMS Registration OTP");
        message.setText("Your OTP for registration is: " + otp + ". This OTP is valid for 10 minutes.");

        if (otpDebug) {
            log.info("DEBUG MODE: OTP for {} is {}", to, otp);
        }

        try {
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send OTP email to {}: {}", to, e.getMessage());
            if (!otpDebug) {
                throw new RuntimeException(MessageConstants.Error.EMAIL_OTP_FAILED);
            }
        }
    }

    @Override
    public void sendApprovalEmail(String to, String role) {
        log.info("Sending Approval email to {}", to);
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("DMS Account Approved");
        message.setText(
                "Congratulations! Your account has been approved. You can now log in with the assigned role: " + role);

        try {
            mailSender.send(message);
            log.info("Approval email sent successfully to {}", to);
        } catch (Exception e) {
            log.error("Failed to send approval email to {}: {}", to, e.getMessage());
            if (otpDebug) {
                log.warn("DEBUG MODE: Approval email failed but registration was updated in database.");
            } else {
                throw new RuntimeException(MessageConstants.Error.EMAIL_NOTIFICATION_FAILED);
            }
        }
    }

    @Override
    public void sendRejectionEmail(String to, String reason) {
        log.info("Sending Rejection email to {}", to);
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("DMS Application Update");
        message.setText("We regret to inform you that your application has been rejected.\nReason: "
                + (reason != null ? reason : "Submission does not meet our requirements."));

        try {
            mailSender.send(message);
            log.info("Rejection email sent successfully to {}", to);
        } catch (Exception e) {
            log.error("Failed to send rejection email to {}: {}", to, e.getMessage());
            if (!otpDebug) {
                log.warn("Non-critical: Rejection email failed to send.");
            }
        }
    }

    @Override
    public void sendDeletionEmail(String to) {
        log.info("Sending Deletion email to {}", to);
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("DMS Account Status Update");
        message.setText(
                "Your registration request has been deleted from our system. If this was not expected, you may reapply through the registration portal.");

        try {
            mailSender.send(message);
            log.info("Deletion email sent successfully to {}", to);
        } catch (Exception e) {
            log.error("Failed to send deletion email to {}: {}", to, e.getMessage());
        }
    }

    @Override
    public void sendFacilityInterestEmail(String adminEmail, String username, com.example.documentmanagement.entity.User user, String facilityName) {
        log.info("Sending Facility Interest email to admin {}", adminEmail);
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(adminEmail);
        message.setSubject("New Facility Interest Expressed: " + facilityName);

        String userDetails = "Username: " + username + "\n";
        if (user != null) {
            log.info("Facility Interest User Address Details - Address: {}, Block: {}, Town: {}, State: {}, Village: {}, Landmark: {}, District: {}, Country: {}, PIN: {}", 
                     user.getAddress(), user.getBlock(), user.getTown(), user.getState(), user.getVillage(), user.getLandmark(), user.getDistrict(), user.getCountry(), user.getPinCode());
            if (user.getFullName() != null) userDetails += "Full Name: " + user.getFullName() + "\n";
            if (user.getEmail() != null) userDetails += "Email: " + user.getEmail() + "\n";
            if (user.getPhoneNumber() != null) userDetails += "Phone Number: " + user.getPhoneNumber() + "\n";
            if (user.getAddress() != null) userDetails += "Address: " + user.getAddress() + "\n";
            if (user.getVillage() != null) userDetails += "Village: " + user.getVillage() + "\n";
            if (user.getLandmark() != null) userDetails += "Landmark: " + user.getLandmark() + "\n";
            if (user.getDistrict() != null) userDetails += "District: " + user.getDistrict() + "\n";
            if (user.getBlock() != null) userDetails += "Block: " + user.getBlock() + "\n";
            if (user.getTown() != null) userDetails += "Town: " + user.getTown() + "\n";
            if (user.getState() != null) userDetails += "State: " + user.getState() + "\n";
            if (user.getCountry() != null) userDetails += "Country: " + user.getCountry() + "\n";
            if (user.getPinCode() != null) userDetails += "PIN Code: " + user.getPinCode() + "\n";
        }

        message.setText("Hello Admin,\n\nA user has expressed interest in a facility.\n\n"
                + "Facility Selected: " + facilityName + "\n\n"
                + "--- User Details ---\n"
                + userDetails
                + "--------------------\n\n"
                + "Please reach out to them and follow up.\n\nBazaar Janakalyan System");

        try {
            mailSender.send(message);
            log.info("Facility Interest email sent successfully to {}", adminEmail);
        } catch (Exception e) {
            log.error("Failed to send facility interest email to {}: {}", adminEmail, e.getMessage());
        }
    }
}
