package com.example.attendance.service;

import com.example.attendance.dto.CreateStudentRequest;
import com.example.attendance.dto.StudentDTO;
import com.example.attendance.dto.UpdateStudentRequest;
import com.example.attendance.exception.DuplicateResourceException;
import com.example.attendance.exception.ResourceNotFoundException;
import com.example.attendance.mapper.StudentMapper;
import com.example.attendance.model.Student;
import com.example.attendance.repository.StudentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class StudentService {
    
    private final StudentRepository studentRepository;
    private final StudentMapper studentMapper;
    
    public StudentService(StudentRepository studentRepository, StudentMapper studentMapper) {
        this.studentRepository = studentRepository;
        this.studentMapper = studentMapper;
    }
    
    public StudentDTO createStudent(CreateStudentRequest request) {
        // Check if roll number already exists
        if (studentRepository.existsByRollNumber(request.rollNumber().toUpperCase())) {
            throw new DuplicateResourceException("Student with roll number " + request.rollNumber() + " already exists");
        }
        
        Student student = studentMapper.toEntity(request);
        Student savedStudent = studentRepository.save(student);
        return studentMapper.toDTO(savedStudent);
    }
    
    public StudentDTO getStudentById(String id) {
        Student student = studentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));
        return studentMapper.toDTO(student);
    }
    
    public StudentDTO getStudentByRollNumber(String rollNumber) {
        Student student = studentRepository.findByRollNumber(rollNumber.toUpperCase())
            .orElseThrow(() -> new ResourceNotFoundException("Student", "rollNumber", rollNumber));
        return studentMapper.toDTO(student);
    }
    
    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll().stream()
            .map(studentMapper::toDTO)
            .collect(Collectors.toList());
    }
    
    public List<StudentDTO> getActiveStudents() {
        return studentRepository.findByActiveTrue().stream()
            .map(studentMapper::toDTO)
            .collect(Collectors.toList());
    }
    
    public Page<StudentDTO> getActiveStudents(Pageable pageable) {
        return studentRepository.findByActiveTrue(pageable)
            .map(studentMapper::toDTO);
    }
    
    public List<StudentDTO> searchStudentsByName(String name) {
        return studentRepository.searchByName(name).stream()
            .map(studentMapper::toDTO)
            .collect(Collectors.toList());
    }
    
    public List<StudentDTO> getStudentsByDepartment(String department) {
        return studentRepository.findByDepartment(department).stream()
            .map(studentMapper::toDTO)
            .collect(Collectors.toList());
    }
    
    public StudentDTO updateStudent(String id, UpdateStudentRequest request) {
        Student student = studentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));
        
        studentMapper.updateEntity(student, request);
        Student updatedStudent = studentRepository.save(student);
        return studentMapper.toDTO(updatedStudent);
    }
    
    public void deleteStudent(String id) {
        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Student", "id", id);
        }
        studentRepository.deleteById(id);
    }
    
    public void deactivateStudent(String id) {
        Student student = studentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));
        student.setActive(false);
        studentRepository.save(student);
    }
    
    public long getActiveStudentCount() {
        return studentRepository.countByActiveTrue();
    }
    
    // Internal method for service-to-service calls
    public Student getStudentEntityByRollNumber(String rollNumber) {
        return studentRepository.findByRollNumber(rollNumber.toUpperCase())
            .orElseThrow(() -> new ResourceNotFoundException("Student", "rollNumber", rollNumber));
    }
    
    public Student getStudentEntityById(String id) {
        return studentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));
    }
}
