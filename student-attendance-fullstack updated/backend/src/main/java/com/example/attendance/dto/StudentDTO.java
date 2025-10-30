package com.example.attendance.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;

public record StudentDTO(
    String id,
    
    @NotBlank(message = "Name is required")
    String name,
    
    @NotBlank(message = "Roll number is required")
    @Pattern(regexp = "^[A-Z0-9-]+$", message = "Roll number must contain only uppercase letters, numbers, and hyphens")
    String rollNumber,
    
    @Email(message = "Invalid email format")
    String email,
    
    String phone,
    
    String department,
    
    @Positive(message = "Year must be positive")
    Integer year,
    
    Boolean active
) {}
