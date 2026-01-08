package com.example.curd.controlles;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.curd.dtos.StudentDto;
import com.example.curd.entities.StudentEntity;
import com.example.curd.services.StudentService;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private ModelMapper modelMapper;

    @PostMapping
    public ResponseEntity<StudentDto> createStudent(@RequestBody StudentDto studentDto) {
        StudentEntity studentEntity = modelMapper.map(studentDto, StudentEntity.class);
        StudentEntity savedStudent = studentService.saveStudent(studentEntity);
        StudentDto responseDto = modelMapper.map(savedStudent, StudentDto.class);
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<StudentDto>> getAllStudents() {
        List<StudentEntity> students = studentService.getAllStudents();
        List<StudentDto> studentDTOs = students.stream()
                .map(student -> modelMapper.map(student, StudentDto.class))
                .collect(Collectors.toList());
        return new ResponseEntity<>(studentDTOs, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentDto> getStudentById(@PathVariable Long id) {
        StudentEntity student = studentService.getStudentById(id);
        StudentDto studentDTO = modelMapper.map(student, StudentDto.class);
        return new ResponseEntity<>(studentDTO, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentDto> updateStudent(@PathVariable Long id, @RequestBody StudentDto studentDto) {
        StudentEntity studentEntity = modelMapper.map(studentDto, StudentEntity.class);
        StudentEntity updatedStudent = studentService.updateStudent(id, studentEntity);
        StudentDto responseDto = modelMapper.map(updatedStudent, StudentDto.class);
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}