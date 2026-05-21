package com.example.documentmanagement.service;

import com.example.documentmanagement.dto.request.LoginRequest;
import com.example.documentmanagement.dto.response.TokenResponse;

public interface AuthService {
    TokenResponse authenticateAndGenerateToken(LoginRequest loginRequest);
}
