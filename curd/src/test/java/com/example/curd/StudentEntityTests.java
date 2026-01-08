package com.example.curd;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.example.curd.entities.StudentEntity;
import com.example.curd.repositories.StudentRepository;
import com.example.curd.services.StudentService;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class StudentEntityTests {

	@Autowired
	private StudentRepository studentRepository;

	@Autowired
	private StudentService studentService;

	@Test
	public void testStudentService() {
		// Assuming data.sql has populated the DB with ID 1
		StudentEntity student = studentService.getStudentById(1L);
		assertNotNull(student);
		assertEquals("John", student.getFirstName());
		System.out.println("Student found: " + student.getFirstName() + " " + student.getLastName());
	}
}
