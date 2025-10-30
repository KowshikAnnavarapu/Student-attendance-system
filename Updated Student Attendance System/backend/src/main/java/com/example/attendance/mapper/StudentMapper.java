package com.example.attendance.mapper;

import com.example.attendance.dto.CreateStudentRequest;
import com.example.attendance.dto.StudentDTO;
import com.example.attendance.dto.UpdateStudentRequest;
import com.example.attendance.model.Student;
import org.springframework.stereotype.Component;

@Component
public class StudentMapper {
    
    public StudentDTO toDTO(Student student) {
        if (student == null) {
            return null;
        }
        return new StudentDTO(
            student.getId(),
            student.getName(),
            student.getRollNumber(),
            student.getEmail(),
            student.getPhone(),
            student.getDepartment(),
            student.getYear(),
            student.isActive()
        );
    }
    
    public Student toEntity(CreateStudentRequest request) {
        if (request == null) {
            return null;
        }
        Student student = new Student();
        student.setName(request.name());
        student.setRollNumber(request.rollNumber().toUpperCase());
        student.setEmail(request.email());
        student.setPhone(request.phone());
        student.setDepartment(request.department());
        student.setYear(request.year());
        student.setActive(true);
        return student;
    }
    
    public void updateEntity(Student student, UpdateStudentRequest request) {
        if (request == null) {
            return;
        }
        if (request.name() != null) {
            student.setName(request.name());
        }
        if (request.email() != null) {
            student.setEmail(request.email());
        }
        if (request.phone() != null) {
            student.setPhone(request.phone());
        }
        if (request.department() != null) {
            student.setDepartment(request.department());
        }
        if (request.year() != null) {
            student.setYear(request.year());
        }
        if (request.active() != null) {
            student.setActive(request.active());
        }
    }
}
