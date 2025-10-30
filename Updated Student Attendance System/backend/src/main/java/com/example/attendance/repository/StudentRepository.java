package com.example.attendance.repository;

import com.example.attendance.model.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends MongoRepository<Student, String> {
    Optional<Student> findByRollNumber(String rollNumber);
    
    boolean existsByRollNumber(String rollNumber);
    
    List<Student> findByActiveTrue();
    
    List<Student> findByDepartment(String department);
    
    Page<Student> findByActiveTrue(Pageable pageable);
    
    @Query("{'name': {$regex: ?0, $options: 'i'}}")
    List<Student> searchByName(String name);
    
    long countByActiveTrue();
}
