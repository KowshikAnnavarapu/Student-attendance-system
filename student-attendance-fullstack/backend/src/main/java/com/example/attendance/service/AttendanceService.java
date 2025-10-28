package com.example.attendance.service;

import com.example.attendance.dto.*;
import com.example.attendance.exception.DuplicateResourceException;
import com.example.attendance.mapper.AttendanceMapper;
import com.example.attendance.mapper.StudentMapper;
import com.example.attendance.model.Attendance;
import com.example.attendance.model.Student;
import com.example.attendance.repository.AttendanceRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AttendanceService {
    
    private final AttendanceRepository attendanceRepository;
    private final StudentService studentService;
    private final AttendanceMapper attendanceMapper;
    private final StudentMapper studentMapper;
    
    public AttendanceService(AttendanceRepository attendanceRepository,
                           StudentService studentService,
                           AttendanceMapper attendanceMapper,
                           StudentMapper studentMapper) {
        this.attendanceRepository = attendanceRepository;
        this.studentService = studentService;
        this.attendanceMapper = attendanceMapper;
        this.studentMapper = studentMapper;
    }
    
    public AttendanceDTO markAttendance(MarkAttendanceRequest request) {
        Student student = studentService.getStudentEntityByRollNumber(request.rollNumber());
        LocalDate date = request.date() != null ? request.date() : LocalDate.now();
        
        // Check if attendance already exists for this student on this date
        if (attendanceRepository.existsByStudentIdAndDate(student.getId(), date)) {
            // Update existing attendance
            Attendance existing = attendanceRepository.findByStudentIdAndDate(student.getId(), date).get();
            existing.setStatus(request.status());
            Attendance saved = attendanceRepository.save(existing);
            return attendanceMapper.toDTO(saved, student);
        }
        
        // Create new attendance record
        Attendance attendance = new Attendance(student.getId(), date, request.status());
        Attendance savedAttendance = attendanceRepository.save(attendance);
        return attendanceMapper.toDTO(savedAttendance, student);
    }
    
    public List<AttendanceDTO> getAttendanceForDate(LocalDate date) {
        LocalDate targetDate = date != null ? date : LocalDate.now();
        return attendanceRepository.findByDate(targetDate).stream()
            .map(att -> {
                Student student = studentService.getStudentEntityById(att.getStudentId());
                return attendanceMapper.toDTO(att, student);
            })
            .collect(Collectors.toList());
    }
    
    public Page<AttendanceDTO> getAttendanceForDate(LocalDate date, Pageable pageable) {
        LocalDate targetDate = date != null ? date : LocalDate.now();
        return attendanceRepository.findByDate(targetDate, pageable)
            .map(att -> {
                Student student = studentService.getStudentEntityById(att.getStudentId());
                return attendanceMapper.toDTO(att, student);
            });
    }
    
    public List<AttendanceDTO> getAttendanceByDateRange(LocalDate startDate, LocalDate endDate) {
        return attendanceRepository.findByDateBetween(startDate, endDate).stream()
            .map(att -> {
                Student student = studentService.getStudentEntityById(att.getStudentId());
                return attendanceMapper.toDTO(att, student);
            })
            .collect(Collectors.toList());
    }
    
    public StudentAttendanceHistoryDTO getStudentAttendanceHistory(String rollNumber) {
        Student student = studentService.getStudentEntityByRollNumber(rollNumber);
        List<Attendance> attendanceRecords = attendanceRepository.findByStudentIdOrderByDateDesc(student.getId());
        
        List<AttendanceDTO> attendanceDTOs = attendanceRecords.stream()
            .map(att -> attendanceMapper.toDTO(att, student))
            .collect(Collectors.toList());
        
        AttendanceStatsDTO stats = calculateStatistics(student.getId(), null, null);
        
        return new StudentAttendanceHistoryDTO(
            studentMapper.toDTO(student),
            attendanceDTOs,
            stats
        );
    }
    
    public StudentAttendanceHistoryDTO getStudentAttendanceHistoryByDateRange(
        String rollNumber, LocalDate startDate, LocalDate endDate) {
        Student student = studentService.getStudentEntityByRollNumber(rollNumber);
        List<Attendance> attendanceRecords = attendanceRepository
            .findByStudentIdAndDateBetween(student.getId(), startDate, endDate);
        
        List<AttendanceDTO> attendanceDTOs = attendanceRecords.stream()
            .map(att -> attendanceMapper.toDTO(att, student))
            .collect(Collectors.toList());
        
        AttendanceStatsDTO stats = calculateStatistics(student.getId(), startDate, endDate);
        
        return new StudentAttendanceHistoryDTO(
            studentMapper.toDTO(student),
            attendanceDTOs,
            stats
        );
    }
    
    public AttendanceStatsDTO getStudentStatistics(String rollNumber) {
        Student student = studentService.getStudentEntityByRollNumber(rollNumber);
        return calculateStatistics(student.getId(), null, null);
    }
    
    public AttendanceStatsDTO getStudentStatisticsByDateRange(
        String rollNumber, LocalDate startDate, LocalDate endDate) {
        Student student = studentService.getStudentEntityByRollNumber(rollNumber);
        return calculateStatistics(student.getId(), startDate, endDate);
    }
    
    private AttendanceStatsDTO calculateStatistics(String studentId, LocalDate startDate, LocalDate endDate) {
        long totalDays;
        long presentDays;
        
        if (startDate != null && endDate != null) {
            totalDays = attendanceRepository.findByStudentIdAndDateBetween(studentId, startDate, endDate).size();
            presentDays = attendanceRepository.countByStudentIdAndDateBetweenAndStatus(
                studentId, startDate, endDate, Attendance.Status.PRESENT);
        } else {
            totalDays = attendanceRepository.findByStudentIdOrderByDateDesc(studentId).size();
            presentDays = attendanceRepository.countByStudentIdAndStatus(studentId, Attendance.Status.PRESENT);
        }
        
        long absentDays = totalDays - presentDays;
        double attendancePercentage = totalDays > 0 ? (presentDays * 100.0) / totalDays : 0.0;
        
        return new AttendanceStatsDTO(totalDays, presentDays, absentDays, 
            Math.round(attendancePercentage * 100.0) / 100.0);
    }
    
    public List<AttendanceDTO> getAttendanceByStatus(LocalDate startDate, LocalDate endDate, Attendance.Status status) {
        return attendanceRepository.findAttendanceByDateRangeAndStatus(startDate, endDate, status).stream()
            .map(att -> {
                Student student = studentService.getStudentEntityById(att.getStudentId());
                return attendanceMapper.toDTO(att, student);
            })
            .collect(Collectors.toList());
    }
}
