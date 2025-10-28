package com.example.attendance.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Positive;

public record UpdateStudentRequest(
    String name,
    
    @Email(message = "Invalid email format")
    String email,
    
    String phone,
    
    String department,
    
    @Positive(message = "Year must be positive")
    Integer year,
    
    Boolean active
) {}
