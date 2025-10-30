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
        
        String studentName = "Unknown Student";
        String rollNumber = "N/A";
        
        if (student != null) {
            studentName = student.getName();
            rollNumber = student.getRollNumber();
        } else {
            // Try to get roll number from attendance if student is null
            // This is a fallback for cases where student no longer exists
            studentName = "Deleted Student";
        }
        
        return new AttendanceDTO(
            attendance.getId(),
            attendance.getStudentId(),
            studentName,
            rollNumber,
            attendance.getDate(),
            attendance.getStatus()
        );
    }
}