package com.example.documentmanagement.controller;

import com.example.documentmanagement.dto.request.LoginRequest;
import com.example.documentmanagement.dto.request.RegisterRequest;
import com.example.documentmanagement.dto.response.ApiResponse;
import com.example.documentmanagement.dto.response.TokenResponse;
import com.example.documentmanagement.service.AuthService;
import com.example.documentmanagement.util.MessageConstants;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Endpoints for user authentication")
public class AuthController {

    private final AuthService authService;
    private final MessageSource messageSource;

    @org.springframework.beans.factory.annotation.Value("${app.otp.debug:false}")
    private boolean debugOtp;

    public AuthController(AuthService authService, MessageSource messageSource) {
        this.authService = authService;
        this.messageSource = messageSource;
    }

    @PostMapping("/login")
    @Operation(summary = "Login and get JWT Token")
    public ResponseEntity<ApiResponse<TokenResponse>> login(@Valid @RequestBody LoginRequest request) {
        TokenResponse tokenResponse = authService.authenticateAndGenerateToken(request);
        return ResponseEntity.ok(ApiResponse.success(MessageConstants.Success.LOGIN_SUCCESS, tokenResponse));
    }

    /**
     * Send OTP via email or phone number.
     * method = EMAIL (default) or PHONE
     */
    @PostMapping("/register/otp")
    @Operation(summary = "Send registration OTP via email or phone")
    public ResponseEntity<ApiResponse<Void>> sendRegisterOtp(
            @RequestParam String identifier,
            @RequestParam(defaultValue = "EMAIL") String method) {
        String code = authService.sendRegistrationOtp(identifier, method);
        String msg = "OTP sent to " + identifier;
        if (debugOtp) {
            msg += " [DEBUG OTP: " + code + "]";
        }
        return ResponseEntity.ok(ApiResponse.success(msg));
    }

    /**
     * Verify OTP received on email or phone.
     */
    @PostMapping("/register/verify")
    @Operation(summary = "Verify registration OTP")
    public ResponseEntity<ApiResponse<Void>> verifyRegisterOtp(
            @RequestParam String identifier,
            @RequestParam String otp,
            @RequestParam(defaultValue = "EMAIL") String method) {
        authService.verifyRegistrationOtp(identifier, otp, method);
        return ResponseEntity.ok(ApiResponse.success(MessageConstants.Success.OTP_VERIFIED));
    }

    /**
     * Complete registration — accepts multipart/form-data with optional photo.
     */
    @PostMapping(value = "/register", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE})
    @Operation(summary = "Register a new user")
    public ResponseEntity<ApiResponse<Void>> register(
            @RequestPart(value = "data") @Valid RegisterRequest request,
            @RequestPart(value = "photo", required = false) MultipartFile photo) {
        authService.register(request, photo);
        return ResponseEntity.ok(ApiResponse.success(MessageConstants.Success.REGISTRATION_SUCCESSFUL));
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Request password reset OTP")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(
            @Valid @RequestBody com.example.documentmanagement.dto.request.ForgotPasswordRequest request) {
        String code = authService.forgotPassword(request);
        String msg = "Password reset OTP sent to your email";
        if (debugOtp) {
            msg += " [DEBUG OTP: " + code + "]";
        }
        return ResponseEntity.ok(ApiResponse.success(msg));
    }

    @PostMapping("/forgot-password/verify")
    public ResponseEntity<ApiResponse<Void>> verifyForgotPasswordOtp(
            @RequestParam String identifier,
            @RequestParam String otp,
            @RequestParam(defaultValue = "EMAIL") String method) {
        authService.verifyForgotPasswordOtp(identifier, otp, method);
        return ResponseEntity.ok(ApiResponse.success(MessageConstants.Success.OTP_VERIFIED_RESET));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password using OTP")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @Valid @RequestBody com.example.documentmanagement.dto.request.ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.success(MessageConstants.Success.PASSWORD_RESET_SUCCESSFUL));
    }

    @GetMapping("/validate-promo")
    @Operation(summary = "Validate a referral/promo code")
    public ResponseEntity<ApiResponse<Void>> validatePromoCode(@RequestParam String code) {
        authService.validatePromoCode(code);
        return ResponseEntity.ok(ApiResponse.success("Valid referral code"));
    }
}
