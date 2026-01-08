package com.example.curd.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.curd.entities.TeacherDepartment;

@Repository
public interface TeacherDepartmentRepository extends JpaRepository<TeacherDepartment, Long> {

}