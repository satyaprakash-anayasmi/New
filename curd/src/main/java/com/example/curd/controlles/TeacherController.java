package com.example.curd.controlles;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.curd.dtos.TeacherDTO;
import com.example.curd.entities.TeacherEntity;
import com.example.curd.services.TeacherService;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    @Autowired
    private TeacherService teacherService;

    @Autowired
    private ModelMapper modelMapper;

    @PostMapping
    public ResponseEntity<TeacherDTO> createTeacher(@RequestBody TeacherDTO teacherDTO) {
        TeacherEntity teacherEntity = modelMapper.map(teacherDTO, TeacherEntity.class);
        TeacherEntity savedTeacher = teacherService.saveTeacher(teacherEntity);
        TeacherDTO responseDTO = modelMapper.map(savedTeacher, TeacherDTO.class);
        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<TeacherDTO>> getAllTeachers() {
        List<TeacherEntity> teachers = teacherService.getAllTeachers();
        List<TeacherDTO> teacherDTOs = teachers.stream()
                .map(teacher -> modelMapper.map(teacher, TeacherDTO.class))
                .collect(Collectors.toList());
        return new ResponseEntity<>(teacherDTOs, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeacherDTO> getTeacherById(@PathVariable Long id) {
        TeacherEntity teacher = teacherService.getTeacherById(id);
        TeacherDTO teacherDTO = modelMapper.map(teacher, TeacherDTO.class);
        return new ResponseEntity<>(teacherDTO, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TeacherDTO> updateTeacher(@PathVariable Long id, @RequestBody TeacherDTO teacherDTO) {
        TeacherEntity teacherEntity = modelMapper.map(teacherDTO, TeacherEntity.class);
        TeacherEntity updatedTeacher = teacherService.updateTeacher(id, teacherEntity);
        TeacherDTO responseDTO = modelMapper.map(updatedTeacher, TeacherDTO.class);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeacher(@PathVariable Long id) {
        teacherService.deleteTeacher(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}