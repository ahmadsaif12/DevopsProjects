package com.example.backend.dto;

public record StudentResponse(
    Long id, String firstName, String lastName, String email, String course, Integer age) {}

