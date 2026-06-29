package com.example.documentmanagement.controller;

import com.example.documentmanagement.dto.response.ApiResponse;
import com.example.documentmanagement.entity.User;
import com.example.documentmanagement.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.example.documentmanagement.util.MessageConstants;

import java.util.List;
import com.example.documentmanagement.dto.response.UserResponse;

@RestController
@RequestMapping("/api/admin/registrations")
@Tag(name = "Admin Registration Management", description = "Endpoints for admin to manage user registration requests")
@PreAuthorize("hasRole('ADMIN')")
@org.springframework.transaction.annotation.Transactional(readOnly = true)
public class AdminRegistrationController {

    private final AuthService authService;

    public AdminRegistrationController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/pending")
    @Operation(summary = "Get all pending registration requests")
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<UserResponse>>> getPendingRegistrations(
            org.springframework.data.domain.Pageable pageable) {
        return ResponseEntity
                .ok(ApiResponse.success(MessageConstants.Success.REGISTRATIONS_PENDING,
                        authService.getPendingRegistrationRequests(pageable).map(this::mapToUserResponse)));
    }

    @GetMapping("/inactive")
    @Operation(summary = "Get all inactive (rejected/deleted) registration requests")
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<UserResponse>>> getInactiveRegistrations(
            org.springframework.data.domain.Pageable pageable) {
        return ResponseEntity.ok(
                ApiResponse.success(MessageConstants.Success.REGISTRATIONS_INACTIVE,
                        authService.getInactiveRegistrationRequests(pageable).map(this::mapToUserResponse)));
    }

    @GetMapping("/approved")
    @Operation(summary = "Get all approved users (filter by active status with optional ?active=true/false)")
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<UserResponse>>> getApprovedUsers(
            @RequestParam(required = false) Boolean active,
            org.springframework.data.domain.Pageable pageable) {
        return ResponseEntity.ok(
                ApiResponse.success(MessageConstants.Success.REGISTRATIONS_APPROVED,
                        authService.getApprovedUsers(active, pageable).map(this::mapToUserResponse)));
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .isActive(user.isActive())
                .registrationStatus(user.getRegistrationStatus())
                .requestedRole(user.getRoles() != null ? user.getRoles().stream().map(r -> r.getName()).findFirst().orElse("N/A") : "N/A")
                .roles(user.getRoles() != null ? user.getRoles().stream().map(r -> r.getName()).toList() : java.util.Collections.emptyList())
                .referralCode(user.getReferralCode())
                .createdAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : null)
                .build();
    }

    @PutMapping("/approve/{userId}")
    @Operation(summary = "Approve a user registration and assign a role")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<ApiResponse<Void>> approveRegistration(@PathVariable Long userId, @RequestParam String role) {
        authService.approveRegistration(userId, role);
        return ResponseEntity.ok(ApiResponse.success(MessageConstants.Success.USER_APPROVED));
    }

    @PutMapping("/reject/{userId}")
    @Operation(summary = "Reject a user registration")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<ApiResponse<Void>> rejectRegistration(@PathVariable Long userId) {
        authService.rejectRegistration(userId);
        return ResponseEntity.ok(ApiResponse.success(MessageConstants.Success.USER_REJECTED));
    }

    @PutMapping("/soft-delete/{userId}")
    @Operation(summary = "Soft delete (archive) a registration request")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<ApiResponse<Void>> softDeleteRegistration(@PathVariable Long userId) {
        authService.softDeleteRegistration(userId);
        return ResponseEntity.ok(ApiResponse.success(MessageConstants.Success.REQUEST_ARCHIVED));
    }

    @PutMapping("/restore/{userId}")
    @Operation(summary = "Restore a registration request to pending")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<ApiResponse<Void>> restoreRegistration(@PathVariable Long userId) {
        authService.restoreRegistration(userId);
        return ResponseEntity.ok(ApiResponse.success(MessageConstants.Success.REQUEST_RESTORED));
    }
}
