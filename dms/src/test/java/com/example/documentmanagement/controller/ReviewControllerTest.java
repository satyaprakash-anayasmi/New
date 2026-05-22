package com.example.documentmanagement.controller;

import com.example.documentmanagement.dto.request.ReviewRequest;
import com.example.documentmanagement.service.ReviewService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.MessageSource;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ReviewController.class)
@AutoConfigureMockMvc(addFilters = false)
class ReviewControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ReviewService reviewService;

    @MockBean
    private MessageSource messageSource;

    @MockBean
    private com.example.documentmanagement.security.JwtUtil jwtUtil;

    @MockBean
    private com.example.documentmanagement.service.CustomUserDetailsService userDetailsService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(roles = "REVIEWER")
    void testReviewDocument() throws Exception {
        ReviewRequest request = new ReviewRequest();
        request.setAction("APPROVED");
        request.setComments("LGTM");

        doNothing().when(reviewService).reviewDocument(any(), any());
        when(messageSource.getMessage(any(), any(), any(), any())).thenReturn("Reviewed successfully");

        mockMvc.perform(post("/api/reviews/1/review")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Reviewed successfully"));
    }
}
