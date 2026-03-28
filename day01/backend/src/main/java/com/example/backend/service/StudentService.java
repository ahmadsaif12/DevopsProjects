package com.example.backend.service;

import com.example.backend.dto.CreateStudentRequest;
import com.example.backend.dto.StudentResponse;
import com.example.backend.dto.UpdateStudentRequest;
import com.example.backend.model.Student;
import com.example.backend.repository.StudentRepository;
import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StudentService {
  private final StudentRepository studentRepository;

  public StudentService(StudentRepository studentRepository) {
    this.studentRepository = studentRepository;
  }

  public List<StudentResponse> list() {
    return studentRepository.findAll(Sort.by("id").descending()).stream().map(this::toResponse).toList();
  }

  public StudentResponse get(Long id) {
    Student student = studentRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Student not found: " + id));
    return toResponse(student);
  }

  @Transactional
  public StudentResponse create(CreateStudentRequest request) {
    if (studentRepository.existsByEmailIgnoreCase(request.email())) {
      throw new IllegalArgumentException("Email already exists: " + request.email());
    }
    Student student = new Student();
    student.setFirstName(request.firstName());
    student.setLastName(request.lastName());
    student.setEmail(request.email());
    student.setCourse(request.course());
    student.setAge(request.age());
    return toResponse(studentRepository.save(student));
  }

  @Transactional
  public StudentResponse update(Long id, UpdateStudentRequest request) {
    Student student = studentRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Student not found: " + id));

    studentRepository
        .findByEmailIgnoreCase(request.email())
        .filter(other -> !other.getId().equals(id))
        .ifPresent(
            other -> {
              throw new IllegalArgumentException("Email already exists: " + request.email());
            });

    student.setFirstName(request.firstName());
    student.setLastName(request.lastName());
    student.setEmail(request.email());
    student.setCourse(request.course());
    student.setAge(request.age());

    return toResponse(studentRepository.save(student));
  }

  @Transactional
  public void delete(Long id) {
    if (!studentRepository.existsById(id)) {
      throw new NoSuchElementException("Student not found: " + id);
    }
    studentRepository.deleteById(id);
  }

  private StudentResponse toResponse(Student student) {
    return new StudentResponse(
        student.getId(),
        student.getFirstName(),
        student.getLastName(),
        student.getEmail(),
        student.getCourse(),
        student.getAge());
  }
}

