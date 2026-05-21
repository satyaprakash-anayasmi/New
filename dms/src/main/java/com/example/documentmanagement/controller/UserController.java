package com.example.documentmanagement.controller;

import com.example.documentmanagement.dto.response.ApiResponse;
import com.example.documentmanagement.dto.response.UserResponse;
import com.example.documentmanagement.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User Management", description = "Endpoints for managing users")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/reviewers")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all users with REVIEWER role")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getReviewers() {
        List<UserResponse> reviewers = userService.getReviewers();
        return ResponseEntity.ok(ApiResponse.success("Reviewers retrieved successfully", reviewers));
    }
}
