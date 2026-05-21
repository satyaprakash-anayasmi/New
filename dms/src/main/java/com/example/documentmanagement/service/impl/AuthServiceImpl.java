package com.example.documentmanagement.service.impl;

import com.example.documentmanagement.dto.request.LoginRequest;
import com.example.documentmanagement.dto.response.TokenResponse;
import com.example.documentmanagement.security.JwtUtil;
import com.example.documentmanagement.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Override
    public TokenResponse authenticateAndGenerateToken(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtUtil.generateToken(userDetails);

        return TokenResponse.builder()
                .accessToken(token)
                .username(userDetails.getUsername())
                .build();
    }
}
