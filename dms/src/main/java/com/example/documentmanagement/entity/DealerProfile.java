package com.example.documentmanagement.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "dealer_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DealerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // The user who is becoming a dealer

    @Column(name = "photo_url", length = 500)
    private String photoUrl;

    @Column(name = "aadhaar_number", length = 20)
    private String aadhaarNumber;
    
    @Column(name = "aadhaar_url", length = 500)
    private String aadhaarUrl;

    @Column(name = "pan_number", length = 20)
    private String panNumber;
    
    @Column(name = "pan_url", length = 500)
    private String panUrl;

    @Column(length = 100)
    private String area;

    @Column(length = 100)
    private String state;

    @Column(length = 100)
    private String district;

    @Column(name = "pin_code", length = 20)
    private String pinCode;

    @Column(length = 500)
    private String address;

    @Column(name = "is_verified", nullable = false)
    @Builder.Default
    private boolean verified = false;

    @Column(name = "verification_status", length = 50)
    @Builder.Default
    private String verificationStatus = "PENDING"; // PENDING, VERIFIED, REJECTED

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
