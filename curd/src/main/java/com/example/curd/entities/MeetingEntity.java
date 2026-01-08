package com.example.curd.entities;

import java.time.*;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Table(name = "meetings")
public class MeetingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime meetingTime;


    @Column(length = 200)
    private String meetingReason;


    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private StudentEntity student;


    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private TeacherEntity teacher;
    
    
}
