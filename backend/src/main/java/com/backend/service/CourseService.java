package com.backend.service;

import com.backend.model.Course;
import com.backend.repository.CourseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public List<Course> getAll() { return courseRepository.findAll(); }

    public Optional<Course> getById(Long id) { return courseRepository.findById(id); }

    public Optional<Course> getByCode(String code) { return Optional.ofNullable(courseRepository.findByCode(code)); }

    public Optional<Course> create(Course course) {
        if (course.getCode() == null || course.getCode().trim().isEmpty()) return Optional.empty();
        if (courseRepository.existsByCode(course.getCode())) return Optional.empty();
        course.setId(null);
        return Optional.of(courseRepository.save(course));
    }

    public boolean delete(Long id) {
        if (!courseRepository.existsById(id)) return false;
        courseRepository.deleteById(id);
        return true;
    }
}
