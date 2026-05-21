package com.example.documentmanagement.controller;

import com.example.documentmanagement.dto.request.LoginRequest;
import com.example.documentmanagement.dto.response.ApiResponse;
import com.example.documentmanagement.dto.response.TokenResponse;
import com.example.documentmanagement.service.AuthService;
import com.example.documentmanagement.util.MessageConstants;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Endpoints for user authentication")
public class AuthController {

    private final AuthService authService;
    private final MessageSource messageSource;

    public AuthController(AuthService authService, MessageSource messageSource) {
        this.authService = authService;
        this.messageSource = messageSource;
    }

    @PostMapping("/login")
    @Operation(summary = "Login and get JWT Token")
    public ResponseEntity<ApiResponse<TokenResponse>> login(@Valid @RequestBody LoginRequest request) {
        TokenResponse tokenResponse = authService.authenticateAndGenerateToken(request);
        String successMessage = messageSource.getMessage(MessageConstants.LOGIN_SUCCESS, null, "Login successful", LocaleContextHolder.getLocale());
        return ResponseEntity.ok(ApiResponse.success(successMessage, tokenResponse));
    }
}
