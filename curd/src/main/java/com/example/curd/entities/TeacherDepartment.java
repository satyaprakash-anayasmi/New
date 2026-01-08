package com.example.curd.entities;

import java.util.*;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Table(name = "teacher_departments")
public class TeacherDepartment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String departmentName;

    @OneToOne
    @JoinColumn(name = "Hod_id")
    private TeacherEntity hOD;  


    @ManyToMany
    @JoinTable(
        name = "teacher_departments_teachers",
        joinColumns = @JoinColumn(name = "teacher_department_id"),
        inverseJoinColumns = @JoinColumn(name = "teacher_id")
    )   
    private Set<TeacherEntity> teachers = new HashSet<>();
    
}
