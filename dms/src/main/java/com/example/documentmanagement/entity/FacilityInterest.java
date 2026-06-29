package com.example.documentmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "facility_interests")
public class FacilityInterest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = true)
    private Long userId;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String facilityName;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
