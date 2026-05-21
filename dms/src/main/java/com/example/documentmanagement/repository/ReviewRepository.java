package com.example.documentmanagement.repository;

import com.example.documentmanagement.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByDocumentId(Long documentId);
    List<Review> findByReviewerId(Long reviewerId);
}
