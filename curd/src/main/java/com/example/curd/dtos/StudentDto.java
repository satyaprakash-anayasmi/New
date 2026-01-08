package com.example.curd.dtos;

import java.time.LocalDateTime;
import com.example.curd.entities.enums.StudentBloodGroupType;
import com.example.curd.entities.enums.StudentDepartment;
import com.example.curd.entities.enums.StudentGender;
import lombok.Data;

@Data
public class StudentDto {
    private Long id;
    private String firstName;
    private String lastName;
    private StudentDepartment department;
    private StudentGender gender;
    private String contactNumber;
    private String address;
    private LocalDateTime dateOfBirth;
    private StudentBloodGroupType bloodGroup;
    private String email;
}