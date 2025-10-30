package com.example.attendance.dto;

import com.example.attendance.model.Attendance;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record MarkAttendanceRequest(
    @NotBlank(message = "Roll number is required")
    String rollNumber,
    
    @NotNull(message = "Status is required")
    Attendance.Status status,
    
    LocalDate date
) {}
