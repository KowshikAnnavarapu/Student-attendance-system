package com.example.attendance.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "students")
public class Student {
    @Id
    private String id;
    
    private String name;
    
    @Indexed(unique = true)
    private String rollNumber;
    
    private String email;
    private String phone;
    private String department;
    private Integer year;
    private boolean active = true;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Student() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { 
        this.name = name;
        this.updatedAt = LocalDateTime.now();
    }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { 
        this.rollNumber = rollNumber;
        this.updatedAt = LocalDateTime.now();
    }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { 
        this.email = email;
        this.updatedAt = LocalDateTime.now();
    }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { 
        this.phone = phone;
        this.updatedAt = LocalDateTime.now();
    }
    
    public String getDepartment() { return department; }
    public void setDepartment(String department) { 
        this.department = department;
        this.updatedAt = LocalDateTime.now();
    }
    
    public Integer getYear() { return year; }
    public void setYear(Integer year) { 
        this.year = year;
        this.updatedAt = LocalDateTime.now();
    }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { 
        this.active = active;
        this.updatedAt = LocalDateTime.now();
    }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
