package com.example.documentmanagement.service;

import com.example.documentmanagement.dto.request.ReviewRequest;

public interface ReviewService {
    void assignReviewer(Long documentId, Long reviewerId);
    void reviewDocument(Long documentId, ReviewRequest request);
}
