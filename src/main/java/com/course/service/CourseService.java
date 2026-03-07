package com.course.service;

import com.course.model.Course;
import com.course.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CourseService {
    
    @Autowired
    private CourseRepository courseRepository;
    
    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }
    
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }
    
    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }
    
    public Course updateCourse(Long id, Course courseDetails) {
        Course course = courseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        
        course.setCourseName(courseDetails.getCourseName());
        course.setInstructorName(courseDetails.getInstructorName());
        course.setCredits(courseDetails.getCredits());
        course.setMaximumCapacity(courseDetails.getMaximumCapacity());
        
        return courseRepository.save(course);
    }
    
    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        courseRepository.delete(course);
    }
    
    public List<Course> searchCourses(String name) {
        return courseRepository.findByCourseNameContainingIgnoreCase(name);
    }
    
    public Course registerStudent(Long id) {
        Course course = courseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        
        if (course.getEnrolledCount() >= course.getMaximumCapacity()) {
            throw new RuntimeException("Course is full. Cannot register more students.");
        }
        
        course.setEnrolledCount(course.getEnrolledCount() + 1);
        return courseRepository.save(course);
    }
}
