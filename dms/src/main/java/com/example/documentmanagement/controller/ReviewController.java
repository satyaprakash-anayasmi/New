package com.example.documentmanagement.controller;

import com.example.documentmanagement.dto.request.ReviewRequest;
import com.example.documentmanagement.dto.response.ApiResponse;
import com.example.documentmanagement.service.ReviewService;
import com.example.documentmanagement.util.MessageConstants;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@Tag(name = "Review Management", description = "Endpoints for reviewing and approving documents")
@SecurityRequirement(name = "bearerAuth")
public class ReviewController {

    private final ReviewService reviewService;
    private final MessageSource messageSource;

    public ReviewController(ReviewService reviewService, MessageSource messageSource) {
        this.reviewService = reviewService;
        this.messageSource = messageSource;
    }

    @PostMapping("/{documentId}/assign/{reviewerId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Assign a document to a reviewer")
    public ResponseEntity<ApiResponse<Void>> assignReviewer(@PathVariable Long documentId, @PathVariable Long reviewerId) {
        reviewService.assignReviewer(documentId, reviewerId);
        String successMessage = messageSource.getMessage(MessageConstants.REVIEWER_ASSIGNED_SUCCESS, null, "Reviewer assigned successfully", LocaleContextHolder.getLocale());
        return ResponseEntity.ok(ApiResponse.success(successMessage, null));
    }

    @PostMapping("/{documentId}/review")
    @PreAuthorize("hasRole('REVIEWER')")
    @Operation(summary = "Approve or Reject a document")
    public ResponseEntity<ApiResponse<Void>> reviewDocument(@PathVariable Long documentId, @Valid @RequestBody ReviewRequest request) {
        reviewService.reviewDocument(documentId, request);
        String successMessage = messageSource.getMessage(MessageConstants.DOCUMENT_REVIEWED_SUCCESS, null, "Document reviewed successfully", LocaleContextHolder.getLocale());
        return ResponseEntity.ok(ApiResponse.success(successMessage, null));
    }
}
