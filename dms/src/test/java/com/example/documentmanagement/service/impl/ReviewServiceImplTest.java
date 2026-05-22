package com.example.documentmanagement.service.impl;

import com.example.documentmanagement.dto.request.ReviewRequest;
import com.example.documentmanagement.entity.Document;
import com.example.documentmanagement.entity.DocumentStatus;
import com.example.documentmanagement.entity.User;
import com.example.documentmanagement.exception.InvalidDocumentStateException;
import com.example.documentmanagement.repository.DocumentRepository;
import com.example.documentmanagement.repository.ReviewRepository;
import com.example.documentmanagement.repository.UserRepository;
import com.example.documentmanagement.service.AuditService;
import com.example.documentmanagement.util.MessageConstants;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.MessageSource;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReviewServiceImplTest {

    private static final String REVIEWER_USER = "reviewer_user";

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private DocumentRepository documentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AuditService auditService;

    @Mock
    private MessageSource messageSource;

    @InjectMocks
    private ReviewServiceImpl reviewService;

    private Document document;
    private User reviewer;

    @BeforeEach
    void setUp() {
        document = new Document();
        document.setId(1L);
        document.setTitle("Test Doc");
        document.setStatus(DocumentStatus.UPLOADED);

        reviewer = new User();
        reviewer.setId(2L);
        reviewer.setUsername(REVIEWER_USER);

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(REVIEWER_USER)
                .password("password")
                .roles("REVIEWER")
                .build();
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities()));
    }

    @Test
    void assignReviewerSuccess() {
        when(documentRepository.findById(1L)).thenReturn(Optional.of(document));
        when(userRepository.findById(2L)).thenReturn(Optional.of(reviewer));

        reviewService.assignReviewer(1L, 2L);

        assertEquals(DocumentStatus.IN_REVIEW, document.getStatus());
        verify(documentRepository, times(1)).save(document);
        verify(reviewRepository, times(1)).save(any());
        verify(auditService, times(1)).logAction(eq("ASSIGN_REVIEWER"), eq("DOCUMENT"), eq(1L), anyString());
    }

    @Test
    void reviewDocumentApproveSuccess() {
        document.setStatus(DocumentStatus.IN_REVIEW);
        when(documentRepository.findById(1L)).thenReturn(Optional.of(document));
        when(userRepository.findByUsername(REVIEWER_USER)).thenReturn(Optional.of(reviewer));

        ReviewRequest request = new ReviewRequest();
        request.setAction("APPROVED");
        request.setComments("Looks good");

        reviewService.reviewDocument(1L, request);

        assertEquals(DocumentStatus.APPROVED, document.getStatus());
        verify(documentRepository, times(1)).save(document);
        verify(reviewRepository, times(1)).save(any());
        verify(auditService, times(1)).logAction("REVIEW_DOCUMENT", "DOCUMENT", 1L, "Action: APPROVED");
    }

    @Test
    void reviewDocumentNotInReviewThrowsException() {
        document.setStatus(DocumentStatus.APPROVED);
        when(documentRepository.findById(1L)).thenReturn(Optional.of(document));
        when(messageSource.getMessage(eq(MessageConstants.ERROR_NOT_IN_REVIEW), any(), anyString(), any()))
                .thenReturn("Not in review");

        ReviewRequest request = new ReviewRequest();
        request.setAction("APPROVED");

        InvalidDocumentStateException exception = assertThrows(InvalidDocumentStateException.class,
                () -> reviewService.reviewDocument(1L, request));

        assertEquals("Not in review", exception.getMessage());
        verify(documentRepository, never()).save(any());
    }
}
