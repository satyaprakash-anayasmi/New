package com.example.documentmanagement.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "distribution_assignments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DistributionAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dealer_profile_id", nullable = false)
    private DealerProfile dealer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dealer_product_id", nullable = false)
    private DealerProduct product;

    @Column(nullable = false)
    private Integer targetQuantity;

    @Column(name = "attachment_url", length = 500)
    private String attachmentUrl; // For PDF/Excel upload

    @Column(length = 100)
    private String state;

    @Column(length = 100)
    private String district;

    @Column(length = 100)
    private String block;

    @Column(name = "pin_code", length = 20)
    private String pinCode;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "distribution_assignment_users",
        joinColumns = @JoinColumn(name = "assignment_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> assignedUsers;

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
