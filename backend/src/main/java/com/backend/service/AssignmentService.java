package com.backend.service;

import com.backend.model.Assignment;
import com.backend.repository.AssignmentRepository;
import com.backend.repository.CourseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final CourseRepository courseRepository;

    public AssignmentService(AssignmentRepository assignmentRepository, CourseRepository courseRepository) {
        this.assignmentRepository = assignmentRepository;
        this.courseRepository = courseRepository;
    }

    public List<Assignment> getAll() {
        return assignmentRepository.findAll();
    }

    public Optional<Assignment> getById(Long id) {
        return assignmentRepository.findById(id);
    }

    public Assignment create(Assignment assignment) {
        if (assignment.getCourseCode() != null && !assignment.getCourseCode().isBlank()) {
            if (!courseRepository.existsByCode(assignment.getCourseCode())) {
                assignment.setCourseCode(null); // invalid code removed
            }
        }
        return assignmentRepository.save(assignment);
    }

    public Optional<Assignment> update(Long id, Assignment details) {
        return assignmentRepository.findById(id).map(existing -> {
            existing.setUsername(details.getUsername());
            existing.setDescription(details.getDescription());
            existing.setScore(details.getScore());
            existing.setDate(details.getDate());
            if (details.getCourseCode() != null && !details.getCourseCode().isBlank()) {
                if (courseRepository.existsByCode(details.getCourseCode())) {
                    existing.setCourseCode(details.getCourseCode());
                }
            } else if (details.getCourseCode() == null) {
                existing.setCourseCode(null);
            }
            return assignmentRepository.save(existing);
        });
    }

    public boolean delete(Long id) {
        if (!assignmentRepository.existsById(id)) {
            return false;
        }
        assignmentRepository.deleteById(id);
        return true;
    }
}
