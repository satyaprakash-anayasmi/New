package com.example.documentmanagement.controller;

import com.example.documentmanagement.dto.request.LoginRequest;
import com.example.documentmanagement.dto.response.TokenResponse;
import com.example.documentmanagement.service.AuthService;
import com.example.documentmanagement.util.MessageConstants;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.MessageSource;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = AuthController.class)
@AutoConfigureMockMvc(addFilters = false) // Disable security filters for simple controller test
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private MessageSource messageSource;

    @MockBean
    private com.example.documentmanagement.security.JwtUtil jwtUtil;

    @Test
    void loginSuccess() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setUsername("admin");
        request.setPassword("admin123");

        TokenResponse tokenResponse = TokenResponse.builder().accessToken("fake-jwt-token").username("admin").build();

        when(authService.authenticateAndGenerateToken(any(LoginRequest.class))).thenReturn(tokenResponse);
        when(messageSource.getMessage(eq(MessageConstants.LOGIN_SUCCESS), any(), anyString(), any()))
                .thenReturn("Login successful");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Login successful"))
                .andExpect(jsonPath("$.data.accessToken").value("fake-jwt-token"));
    }
}
