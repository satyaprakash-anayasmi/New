package com.example.curd.services;

import java.util.List;
import com.example.curd.entities.TeacherDepartment;

public interface TeacherDepartmentService {
    TeacherDepartment saveTeacherDepartment(TeacherDepartment department);
    List<TeacherDepartment> getAllTeacherDepartments();
    TeacherDepartment getTeacherDepartmentById(Long id);
    TeacherDepartment updateTeacherDepartment(Long id, TeacherDepartment department);
    void deleteTeacherDepartment(Long id);
}