package com.example.attendance.mapper;

import com.example.attendance.dto.AttendanceDTO;
import com.example.attendance.model.Attendance;
import com.example.attendance.model.Student;
import org.springframework.stereotype.Component;

@Component
public class AttendanceMapper {
    
    public AttendanceDTO toDTO(Attendance attendance, Student student) {
        if (attendance == null) {
            return null;
        }
        return new AttendanceDTO(
            attendance.getId(),
            attendance.getStudentId(),
            student != null ? student.getName() : "Unknown",
            student != null ? student.getRollNumber() : "N/A",
            attendance.getDate(),
            attendance.getStatus()
        );
    }
}
