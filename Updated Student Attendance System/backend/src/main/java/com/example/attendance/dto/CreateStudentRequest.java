package com.example.attendance.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;

public record CreateStudentRequest(
    @NotBlank(message = "Name is required")
    String name,
    
    @NotBlank(message = "Roll number is required")
    @Pattern(regexp = "^\\d{8}$", message = "Roll number must be exactly 8 digits")
    String rollNumber,
    
    @Email(message = "Invalid email format")
    String email,
    
    @Pattern(regexp = "^\\d{10}$", message = "Phone number must be exactly 10 digits")
    String phone,
    
    String department,
    
    @Positive(message = "Year must be positive")
    Integer year
) {}