package com.example.documentmanagement.service.impl;

import com.example.documentmanagement.service.SmsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.example.documentmanagement.util.MessageConstants;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * Fast2SMS implementation of SmsService.
 * Docs: https://docs.fast2sms.com/#route-otp
 *
 * Free plan available at https://www.fast2sms.com/ — generate API key from dashboard.
 * Set app.sms.fast2sms.api-key in application.properties (or env var FAST2SMS_API_KEY).
 */
@Service
@Slf4j
public class Fast2SmsServiceImpl implements SmsService {

    private static final String FAST2SMS_URL = "https://www.fast2sms.com/dev/bulkV2";

    @Value("${app.sms.fast2sms.api-key:REPLACE_WITH_YOUR_FAST2SMS_API_KEY}")
    private String apiKey;

    @Value("${app.sms.enabled:true}")
    private boolean smsEnabled;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public void sendOtp(String phoneNumber, String otp) {
        // Normalize: strip country code (+91) if present, keep 10 digits
        String mobile = normalizePhone(phoneNumber);

        if (!smsEnabled || apiKey.startsWith("REPLACE_WITH")) {
            log.warn("[SMS-DISABLED] OTP for {} : {} (set app.sms.fast2sms.api-key to enable real SMS)", mobile, otp);
            return;
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("authorization", apiKey);
            headers.set("Content-Type", "application/json");

            String url = UriComponentsBuilder.fromHttpUrl(FAST2SMS_URL)
                    .queryParam("route", "otp")
                    .queryParam("variables_values", otp)
                    .queryParam("flash", "0")
                    .queryParam("numbers", mobile)
                    .toUriString();

            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("[SMS] OTP sent successfully to {}", mobile);
            } else {
                log.warn("[SMS] Fast2SMS returned status {} for {}", response.getStatusCode(), mobile);
            }
        } catch (Exception e) {
            log.error("[SMS] Failed to send OTP to {} : {}", mobile, e.getMessage());
            throw new RuntimeException(MessageConstants.Error.SMS_FAILED);
        }
    }

    /**
     * Normalize phone number to 10-digit Indian mobile (strip +91 / 91 prefix).
     */
    private String normalizePhone(String phone) {
        if (phone == null) return "";
        String cleaned = phone.replaceAll("[\\s\\-()]", "");
        if (cleaned.startsWith("+91")) cleaned = cleaned.substring(3);
        else if (cleaned.startsWith("91") && cleaned.length() == 12) cleaned = cleaned.substring(2);
        return cleaned;
    }
}
