package com.example.documentmanagement.repository;

import com.example.documentmanagement.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Page<Payment> findByStatus(String status, Pageable pageable);

    Page<Payment> findByStatusIn(List<String> statuses, Pageable pageable);

    Optional<Payment> findTopByUserIdOrderBySubmittedAtDesc(Long userId);

    boolean existsByUserIdAndStatus(Long userId, String status);

    Page<Payment> findByUserId(Long userId, Pageable pageable);
}
