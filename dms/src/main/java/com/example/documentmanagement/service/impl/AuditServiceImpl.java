package com.example.documentmanagement.service.impl;

import com.example.documentmanagement.entity.AuditLog;
import com.example.documentmanagement.entity.User;
import com.example.documentmanagement.repository.AuditRepository;
import com.example.documentmanagement.repository.UserRepository;
import com.example.documentmanagement.service.AuditService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditServiceImpl implements AuditService {

    private final AuditRepository auditRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public void logAction(String action, String entityType, Long entityId, String details) {
        User currentUser = getCurrentUser();

        String maskedDetails = maskSensitiveData(details);

        log.info("AUDIT LOG -> Action: {}, Entity: {}-{}, User: {}, Details: {}",
                action, entityType, entityId, (currentUser != null ? currentUser.getUsername() : "SYSTEM"),
                maskedDetails);

        AuditLog auditLog = AuditLog.builder()
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .user(currentUser)
                .details(maskedDetails)
                .build();

        auditRepository.save(auditLog);
    }

    private String maskSensitiveData(String data) {
        if (data == null)
            return null;
        return data.replaceAll("(?i)(password|token|secret)[=:]\\s*([^\\s,.}]+)", "$1=******");
    }

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails userDetails) {
            String username = userDetails.getUsername();
            return userRepository.findByUsername(username).orElse(null);
        }
        return null;
    }
}
