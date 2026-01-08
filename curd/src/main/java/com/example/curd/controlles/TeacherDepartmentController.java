package com.example.curd.controlles;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.curd.dtos.TeacherDepartmentDTO;
import com.example.curd.entities.TeacherDepartment;
import com.example.curd.services.TeacherDepartmentService;

@RestController
@RequestMapping("/api/teacher-departments")
public class TeacherDepartmentController {

    @Autowired
    private TeacherDepartmentService teacherDepartmentService;

    @Autowired
    private ModelMapper modelMapper;

    @PostMapping
    public ResponseEntity<TeacherDepartmentDTO> createTeacherDepartment(@RequestBody TeacherDepartmentDTO dto) {
        TeacherDepartment entity = modelMapper.map(dto, TeacherDepartment.class);
        TeacherDepartment savedEntity = teacherDepartmentService.saveTeacherDepartment(entity);
        TeacherDepartmentDTO responseDTO = modelMapper.map(savedEntity, TeacherDepartmentDTO.class);
        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<TeacherDepartmentDTO>> getAllTeacherDepartments() {
        List<TeacherDepartment> departments = teacherDepartmentService.getAllTeacherDepartments();
        List<TeacherDepartmentDTO> dtos = departments.stream()
                .map(dept -> modelMapper.map(dept, TeacherDepartmentDTO.class))
                .collect(Collectors.toList());
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeacherDepartmentDTO> getTeacherDepartmentById(@PathVariable Long id) {
        TeacherDepartment dept = teacherDepartmentService.getTeacherDepartmentById(id);
        TeacherDepartmentDTO dto = modelMapper.map(dept, TeacherDepartmentDTO.class);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TeacherDepartmentDTO> updateTeacherDepartment(@PathVariable Long id, @RequestBody TeacherDepartmentDTO dto) {
        TeacherDepartment entity = modelMapper.map(dto, TeacherDepartment.class);
        TeacherDepartment updatedEntity = teacherDepartmentService.updateTeacherDepartment(id, entity);
        TeacherDepartmentDTO responseDTO = modelMapper.map(updatedEntity, TeacherDepartmentDTO.class);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeacherDepartment(@PathVariable Long id) {
        teacherDepartmentService.deleteTeacherDepartment(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}