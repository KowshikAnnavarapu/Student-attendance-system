package com.example.attendance.dto;

import java.util.List;

public record StudentAttendanceHistoryDTO(
    StudentDTO student,
    List<AttendanceDTO> attendanceRecords,
    AttendanceStatsDTO statistics
) {}
