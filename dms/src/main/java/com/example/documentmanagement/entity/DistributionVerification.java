package com.example.documentmanagement.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "distribution_verifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DistributionVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "distribution_assignment_id", nullable = false)
    private DistributionAssignment assignment;

    @Column(name = "customer_name", length = 100)
    private String customerName;

    @Column(length = 500)
    private String details;

    @Column(name = "photo_proof_url", length = 500)
    private String photoProofUrl;

    @Column(name = "distribution_date")
    private LocalDateTime distributionDate;

    @Column(name = "verification_status", length = 50)
    @Builder.Default
    private String verificationStatus = "PENDING"; // PENDING, APPROVED, REJECTED

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean active = true;

    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private boolean deleted = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
