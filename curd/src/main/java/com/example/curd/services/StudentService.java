package com.example.curd.services;

import java.util.List;
import com.example.curd.entities.StudentEntity;

public interface StudentService {
    StudentEntity saveStudent(StudentEntity student);
    List<StudentEntity> getAllStudents();
    StudentEntity getStudentById(Long id);
    StudentEntity updateStudent(Long id, StudentEntity student);
    void deleteStudent(Long id);
}
