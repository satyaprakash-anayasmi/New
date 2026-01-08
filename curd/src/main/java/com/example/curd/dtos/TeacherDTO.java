package com.example.curd.dtos;

import lombok.Data;

@Data
public class TeacherDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
}