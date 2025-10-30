package com.example.attendance.dto;

public record AttendanceStatsDTO(
    long totalDays,
    long presentDays,
    long absentDays,
    double attendancePercentage
) {}
