package com.example.attendance.repository;

import com.example.attendance.model.Attendance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends MongoRepository<Attendance, String> {
    Optional<Attendance> findByStudentIdAndDate(String studentId, LocalDate date);
    
    List<Attendance> findByDate(LocalDate date);
    
    List<Attendance> findByStudentIdOrderByDateDesc(String studentId);
    
    List<Attendance> findByStudentIdAndDateBetween(String studentId, LocalDate startDate, LocalDate endDate);
    
    List<Attendance> findByDateBetween(LocalDate startDate, LocalDate endDate);
    
    Page<Attendance> findByDate(LocalDate date, Pageable pageable);
    
    long countByStudentIdAndStatus(String studentId, Attendance.Status status);
    
    long countByStudentIdAndDateBetweenAndStatus(String studentId, LocalDate startDate, LocalDate endDate, Attendance.Status status);
    
    @Query("{'date': {$gte: ?0, $lte: ?1}, 'status': ?2}")
    List<Attendance> findAttendanceByDateRangeAndStatus(LocalDate startDate, LocalDate endDate, Attendance.Status status);
    
    boolean existsByStudentIdAndDate(String studentId, LocalDate date);
}
