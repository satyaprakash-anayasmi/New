package com.example.documentmanagement.repository;

import com.example.documentmanagement.entity.DealerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import com.example.documentmanagement.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface DealerProfileRepository extends JpaRepository<DealerProfile, Long> {
    Optional<DealerProfile> findByUser(User user);

    @Query("SELECT d FROM DealerProfile d WHERE " +
           "(:status = 'ALL' OR d.verificationStatus = :status) AND " +
           "(:searchTerm = '' OR LOWER(d.user.username) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.user.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.area) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<DealerProfile> searchProfiles(@Param("status") String status, @Param("searchTerm") String searchTerm, Pageable pageable);
}
