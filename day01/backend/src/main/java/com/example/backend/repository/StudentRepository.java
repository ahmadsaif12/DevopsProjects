package com.example.backend.repository;

import com.example.backend.model.Student;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {
  Optional<Student> findByEmailIgnoreCase(String email);
  boolean existsByEmailIgnoreCase(String email);
}

