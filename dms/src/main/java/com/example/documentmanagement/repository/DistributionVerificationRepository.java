package com.example.documentmanagement.repository;

import com.example.documentmanagement.entity.DistributionVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface DistributionVerificationRepository extends JpaRepository<DistributionVerification, Long> {
    long countByAssignment_Dealer_User_Username(String username);
    long countByAssignment_Dealer_User_UsernameAndVerificationStatus(String username, String status);
}
