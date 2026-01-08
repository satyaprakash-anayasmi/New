package com.example.curd.services;

import java.util.List;
import com.example.curd.entities.TeacherEntity;

public interface TeacherService {
    TeacherEntity saveTeacher(TeacherEntity teacher);
    List<TeacherEntity> getAllTeachers();
    TeacherEntity getTeacherById(Long id);
    TeacherEntity updateTeacher(Long id, TeacherEntity teacher);
    void deleteTeacher(Long id);
}