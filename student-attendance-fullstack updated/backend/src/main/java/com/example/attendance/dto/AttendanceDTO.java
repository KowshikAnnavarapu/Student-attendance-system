package com.example.attendance.dto;

import com.example.attendance.model.Attendance;

import java.time.LocalDate;

public record AttendanceDTO(
    String id,
    String studentId,
    String studentName,
    String rollNumber,
    LocalDate date,
    Attendance.Status status
) {}
