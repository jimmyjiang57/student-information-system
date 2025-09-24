package com.backend.repository;

import com.backend.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {
    Course findByCode(String code);
    boolean existsByCode(String code);
}
