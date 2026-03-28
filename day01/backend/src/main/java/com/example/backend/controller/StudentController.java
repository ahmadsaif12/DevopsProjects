package com.example.backend.controller;

import com.example.backend.dto.CreateStudentRequest;
import com.example.backend.dto.StudentResponse;
import com.example.backend.dto.UpdateStudentRequest;
import com.example.backend.service.StudentService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/students")
public class StudentController {
  private final StudentService studentService;

  public StudentController(StudentService studentService) {
    this.studentService = studentService;
  }

  @GetMapping
  public List<StudentResponse> list() {
    return studentService.list();
  }

  @GetMapping("/{id}")
  public StudentResponse get(@PathVariable Long id) {
    return studentService.get(id);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public StudentResponse create(@Valid @RequestBody CreateStudentRequest request) {
    return studentService.create(request);
  }

  @PutMapping("/{id}")
  public StudentResponse update(
      @PathVariable Long id, @Valid @RequestBody UpdateStudentRequest request) {
    return studentService.update(id, request);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    studentService.delete(id);
  }
}

