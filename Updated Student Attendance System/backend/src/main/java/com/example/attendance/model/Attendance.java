package com.example.attendance.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "attendance")
@CompoundIndex(name = "student_date_idx", def = "{'studentId': 1, 'date': 1}", unique = true)
public class Attendance {
    @Id
    private String id;
    
    @Indexed
    private String studentId;
    
    @Indexed
    private LocalDate date;
    
    private Status status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public enum Status { PRESENT, ABSENT }

    public Attendance() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Attendance(String studentId, LocalDate date, Status status) {
        this.studentId = studentId;
        this.date = date;
        this.status = status;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { 
        this.studentId = studentId;
        this.updatedAt = LocalDateTime.now();
    }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { 
        this.date = date;
        this.updatedAt = LocalDateTime.now();
    }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { 
        this.status = status;
        this.updatedAt = LocalDateTime.now();
    }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
