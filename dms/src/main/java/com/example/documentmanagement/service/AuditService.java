package com.example.documentmanagement.service;

public interface AuditService {
    void logAction(String action, String entityType, Long entityId, String details);
}
