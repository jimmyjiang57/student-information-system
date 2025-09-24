package com.backend.controller;

import com.backend.model.Course;
import com.backend.model.Assignment;
import com.backend.service.CourseService;
import com.backend.repository.AssignmentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/courses")
@CrossOrigin(origins = "http://localhost:3000")
public class CourseController {

    private final CourseService courseService;
    private final AssignmentRepository assignmentRepository;

    public CourseController(CourseService courseService, AssignmentRepository assignmentRepository) {
        this.courseService = courseService;
        this.assignmentRepository = assignmentRepository;
    }

    @GetMapping
    public List<Course> all() { return courseService.getAll(); }

    @PostMapping("/add")
    public ResponseEntity<Course> create(@RequestBody Course body) {
        return courseService.create(body)
                .map(saved -> ResponseEntity.created(URI.create("/courses/" + saved.getId())).body(saved))
                .orElseGet(() -> ResponseEntity.badRequest().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> get(@PathVariable Long id) {
        return courseService.getById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boolean deleted = courseService.delete(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<Course> byCode(@PathVariable String code) {
        return courseService.getByCode(code)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{code}/assignments")
    public List<Assignment> assignmentsForCourse(@PathVariable String code) {
        return assignmentRepository.findByCourseCode(code);
    }
}
