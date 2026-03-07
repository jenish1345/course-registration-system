package com.course.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "courses")
public class Course {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long courseId;
    
    @NotBlank(message = "Course name is required")
    @Column(nullable = false)
    private String courseName;
    
    @NotBlank(message = "Instructor name is required")
    @Column(nullable = false)
    private String instructorName;
    
    @NotNull(message = "Credits is required")
    @Min(value = 1, message = "Credits must be at least 1")
    @Column(nullable = false)
    private Integer credits;
    
    @NotNull(message = "Maximum capacity is required")
    @Min(value = 1, message = "Maximum capacity must be at least 1")
    @Column(nullable = false)
    private Integer maximumCapacity;
    
    @Column(nullable = false)
    private Integer enrolledCount = 0;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdDateTime;
    
    @PrePersist
    protected void onCreate() {
        createdDateTime = LocalDateTime.now();
    }
    
    // Constructors
    public Course() {}
    
    public Course(String courseName, String instructorName, Integer credits, Integer maximumCapacity) {
        this.courseName = courseName;
        this.instructorName = instructorName;
        this.credits = credits;
        this.maximumCapacity = maximumCapacity;
        this.enrolledCount = 0;
    }
    
    // Getters and Setters
    public Long getCourseId() {
        return courseId;
    }
    
    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }
    
    public String getCourseName() {
        return courseName;
    }
    
    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }
    
    public String getInstructorName() {
        return instructorName;
    }
    
    public void setInstructorName(String instructorName) {
        this.instructorName = instructorName;
    }
    
    public Integer getCredits() {
        return credits;
    }
    
    public void setCredits(Integer credits) {
        this.credits = credits;
    }
    
    public Integer getMaximumCapacity() {
        return maximumCapacity;
    }
    
    public void setMaximumCapacity(Integer maximumCapacity) {
        this.maximumCapacity = maximumCapacity;
    }
    
    public Integer getEnrolledCount() {
        return enrolledCount;
    }
    
    public void setEnrolledCount(Integer enrolledCount) {
        this.enrolledCount = enrolledCount;
    }
    
    public LocalDateTime getCreatedDateTime() {
        return createdDateTime;
    }
    
    public void setCreatedDateTime(LocalDateTime createdDateTime) {
        this.createdDateTime = createdDateTime;
    }
    
    public boolean isFull() {
        return enrolledCount >= maximumCapacity;
    }
}
