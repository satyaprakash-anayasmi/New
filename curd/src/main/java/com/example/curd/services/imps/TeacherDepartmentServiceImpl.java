package com.example.curd.services.imps;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.curd.entities.TeacherDepartment;
import com.example.curd.repositories.TeacherDepartmentRepository;
import com.example.curd.services.TeacherDepartmentService;

@Service
public class TeacherDepartmentServiceImpl implements TeacherDepartmentService {

    @Autowired
    private TeacherDepartmentRepository teacherDepartmentRepository;

    @Override
    public TeacherDepartment saveTeacherDepartment(TeacherDepartment department) {
        return teacherDepartmentRepository.save(department);
    }

    @Override
    public List<TeacherDepartment> getAllTeacherDepartments() {
        return teacherDepartmentRepository.findAll();
    }

    @Override
    public TeacherDepartment getTeacherDepartmentById(Long id) {
        return teacherDepartmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Teacher Department not found with id: " + id));
    }

    @Override
    public TeacherDepartment updateTeacherDepartment(Long id, TeacherDepartment department) {
        if (!teacherDepartmentRepository.existsById(id)) {
            throw new RuntimeException("Teacher Department not found with id: " + id);
        }
        department.setId(id);
        return teacherDepartmentRepository.save(department);
    }

    @Override
    public void deleteTeacherDepartment(Long id) {
        teacherDepartmentRepository.deleteById(id);
    }
}