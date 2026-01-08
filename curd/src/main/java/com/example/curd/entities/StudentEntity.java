package com.example.curd.entities;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import com.example.curd.entities.enums.StudentBloodGroupType;
import com.example.curd.entities.enums.StudentDepartment;
import com.example.curd.entities.enums.StudentGender;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data

@Table(name = "students"
    , uniqueConstraints ={
        @UniqueConstraint(
            name = "unique_email_constraint",
            columnNames ={"email"}
        ),
        @UniqueConstraint(
            name = "unique_firstName_lastName_dateOfBirth_constraint",
            columnNames ={"first_name", "last_name", "date_of_birth"}
        )
    },
    indexes = {
        @Index(
            name="idx_students_dateOfBirth",
            columnList = "date_of_birth"
        )
    }
)
public class StudentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false )
    private String firstName;
    @Column(nullable = false)  
    private String lastName;
    @Enumerated(EnumType.STRING)
    private StudentDepartment department;
    @Enumerated(EnumType.STRING)
    private StudentGender gender;
    private String contactNumber;
    private String address;
    private LocalDateTime dateOfBirth;
    @Enumerated(EnumType.STRING)
    private StudentBloodGroupType bloodGroup;
    @Column(nullable = false, unique = true)
    private String email;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @OneToOne(cascade = {CascadeType.MERGE,CascadeType.PERSIST})//parent entity to child entity
    @JoinColumn(name = "student_booking_id")
    private BookingEntity booking;


    @OneToMany(mappedBy = "student", cascade = {CascadeType.REMOVE}, orphanRemoval = true)
    private List<MeetingEntity> meetings = new ArrayList<>();
    
}
