package com.example.curd.entities;

import java.util.*;  
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Table(name = "teachers")
public class TeacherEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String email;



    @ManyToMany(mappedBy = "teachers")
    private Set<TeacherDepartment> teacherDepartments = new HashSet<>();



    

    

}
