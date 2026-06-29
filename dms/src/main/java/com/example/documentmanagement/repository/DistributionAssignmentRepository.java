package com.example.documentmanagement.repository;

import com.example.documentmanagement.entity.DistributionAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DistributionAssignmentRepository extends JpaRepository<DistributionAssignment, Long> {
    long countByDealer_User_Username(String username);

    @org.springframework.data.jpa.repository.Query("SELECT da FROM DistributionAssignment da " +
            "JOIN da.dealer dp " +
            "JOIN dp.user u " +
            "JOIN da.product p " +
            "WHERE (:searchTerm = '' OR " +
            "LOWER(u.username) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(u.referralCode) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "CAST(u.id AS string) LIKE CONCAT('%', :searchTerm, '%')) AND " +
            "(:dealerName = '' OR LOWER(u.username) LIKE LOWER(CONCAT('%', :dealerName, '%'))) AND " +
            "(:area = '' OR LOWER(dp.area) LIKE LOWER(CONCAT('%', :area, '%'))) AND " +
            "(:productName = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :productName, '%'))) AND " +
            "(:status = '' OR (:status = 'ACTIVE' AND da.active = true) OR (:status = 'INACTIVE' AND da.active = false))")
    org.springframework.data.domain.Page<DistributionAssignment> searchAssignments(
            @org.springframework.data.repository.query.Param("searchTerm") String searchTerm,
            @org.springframework.data.repository.query.Param("dealerName") String dealerName,
            @org.springframework.data.repository.query.Param("area") String area,
            @org.springframework.data.repository.query.Param("productName") String productName,
            @org.springframework.data.repository.query.Param("status") String status,
            org.springframework.data.domain.Pageable pageable);
    @org.springframework.data.jpa.repository.Query("SELECT da FROM DistributionAssignment da " +
            "JOIN da.dealer dp " +
            "JOIN dp.user u " +
            "JOIN da.product p " +
            "WHERE da.deleted = false AND da.active = true AND " + // STRICT EXPORT FILTERS
            "(:searchTerm = '' OR " +
            "LOWER(u.username) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(u.referralCode) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "CAST(u.id AS string) LIKE CONCAT('%', :searchTerm, '%')) AND " +
            "(:dealerName = '' OR LOWER(u.username) LIKE LOWER(CONCAT('%', :dealerName, '%'))) AND " +
            "(:area = '' OR LOWER(dp.area) LIKE LOWER(CONCAT('%', :area, '%'))) AND " +
            "(:productName = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :productName, '%')))")
    java.util.List<DistributionAssignment> exportAssignments(
            @org.springframework.data.repository.query.Param("searchTerm") String searchTerm,
            @org.springframework.data.repository.query.Param("dealerName") String dealerName,
            @org.springframework.data.repository.query.Param("area") String area,
            @org.springframework.data.repository.query.Param("productName") String productName);
}
