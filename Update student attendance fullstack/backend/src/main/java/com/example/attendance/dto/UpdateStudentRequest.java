package com.example.attendance.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;

public record UpdateStudentRequest(
    String name,
    
    @Email(message = "Invalid email format")
    String email,
    
    @Pattern(regexp = "^\\d{10}$", message = "Phone number must be exactly 10 digits")
    String phone,
    
    String department,
    
    @Positive(message = "Year must be positive")
    Integer year,
    
    Boolean active
) {}