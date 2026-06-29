package com.example.documentmanagement.service;

import com.example.documentmanagement.dto.FacilityInterestRequest;
import com.example.documentmanagement.entity.FacilityInterest;
import com.example.documentmanagement.repository.FacilityInterestRepository;
import com.example.documentmanagement.repository.UserRepository;
import com.example.documentmanagement.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class FacilityService {

    private final FacilityInterestRepository facilityInterestRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Value("${admin.email:satyaprakashparida39@gmail.com}")
    private String adminEmail;

    public void processFacilityInterest(FacilityInterestRequest request) {
        String username = request.getUserDetails().getSub(); // JWT sub holds the username
        log.info("Processing facility interest for user: {} on facility: {}", 
                username, request.getFacilityName());

        Optional<User> userOpt = userRepository.findByUsername(username);
        Long userId = userOpt.map(User::getId).orElse(0L); // fallback to 0L if not found

        // 1. Save to Database
        FacilityInterest interest = new FacilityInterest();
        interest.setUsername(username);
        interest.setUserId(userId);
        interest.setFacilityName(request.getFacilityName());
        
        facilityInterestRepository.save(interest);
        log.info("Saved FacilityInterest to database with ID: {}", interest.getId());

        // 2. Send email notification to admin with full user details
        emailService.sendFacilityInterestEmail(adminEmail, username, userOpt.orElse(null), request.getFacilityName());
    }
}
