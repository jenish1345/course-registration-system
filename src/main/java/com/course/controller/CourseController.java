package com.course.controller;

import com.course.model.Course;
import com.course.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {
    
    @Autowired
    private CourseService courseService;
    
    @PostMapping
    public ResponseEntity<?> createCourse(@Valid @RequestBody Course course) {
        try {
            Course savedCourse = courseService.createCourse(course);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedCourse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(createErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getCourseById(@PathVariable Long id) {
        try {
            Course course = courseService.getCourseById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
            return ResponseEntity.ok(course);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(createErrorResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCourse(@PathVariable Long id, @Valid @RequestBody Course course) {
        try {
            Course updatedCourse = courseService.updateCourse(id, course);
            return ResponseEntity.ok(updatedCourse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(createErrorResponse(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        try {
            courseService.deleteCourse(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Course deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(createErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Course>> searchCourses(@RequestParam String name) {
        return ResponseEntity.ok(courseService.searchCourses(name));
    }
    
    @PostMapping("/{id}/register")
    public ResponseEntity<?> registerStudent(@PathVariable Long id) {
        try {
            Course course = courseService.registerStudent(id);
            return ResponseEntity.ok(course);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(createErrorResponse(e.getMessage()));
        }
    }
    
    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
}
