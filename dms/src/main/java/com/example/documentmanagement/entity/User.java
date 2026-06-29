package com.example.documentmanagement.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(unique = true, length = 100)
    private String email;

    @Column(name = "phone_number", unique = true, length = 20)
    private String phoneNumber;

    @Column(name = "full_name", length = 100)
    private String fullName;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "gender", length = 20)
    private String gender;

    @Column(name = "address", length = 255)
    private String address;

    @Column(name = "block", length = 100)
    private String block;

    @Column(name = "town", length = 100)
    private String town;

    @Column(name = "state", length = 100)
    private String state;

    @Column(name = "village", length = 100)
    private String village;

    @Column(name = "landmark", length = 100)
    private String landmark;

    @Column(name = "district", length = 100)
    private String district;

    @Column(name = "country", length = 100)
    private String country;

    @Column(name = "pin_code", length = 20)
    private String pinCode;

    @Column(name = "profile_photo_path")
    private String profilePhotoPath;

    @Column(name = "registration_method", length = 10, columnDefinition = "varchar(10) default 'EMAIL'")
    @Builder.Default
    private String registrationMethod = "EMAIL"; // EMAIL or PHONE

    @Column(name = "payment_status", length = 20, columnDefinition = "varchar(20) default 'PENDING'")
    @Builder.Default
    private String paymentStatus = "PENDING"; // PENDING or COMPLETED

    @Column(name = "otp_verified", nullable = false, columnDefinition = "boolean not null default false")
    @Builder.Default
    private boolean otpVerified = false;

    @Column(name = "is_active", nullable = false, columnDefinition = "boolean not null default false")
    @Builder.Default
    private boolean isActive = false;

    @Column(name = "requested_role", length = 50)
    private String requestedRole;

    @Column(name = "registration_status", length = 20)
    @Builder.Default
    private String registrationStatus = "PENDING";

    @Column(name = "created_at", nullable = true, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "updated_by", length = 100)
    private String updatedBy;

    @Column(name = "zone", length = 100)
    private String zone;

    @Column(name = "referral_code", unique = true, length = 10)
    private String referralCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "referred_by_id")
    private User referredBy;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    @Builder.Default
    private Set<Role> roles = new HashSet<>();
}
