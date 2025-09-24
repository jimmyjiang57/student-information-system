package com.backend.service;

import com.backend.model.Assignment;
import com.backend.repository.AssignmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;

    public AssignmentService(AssignmentRepository assignmentRepository) {
        this.assignmentRepository = assignmentRepository;
    }

    public List<Assignment> getAll() {
        return assignmentRepository.findAll();
    }

    public Optional<Assignment> getById(Long id) {
        return assignmentRepository.findById(id);
    }

    public Assignment create(Assignment assignment) {
        return assignmentRepository.save(assignment);
    }

    public Optional<Assignment> update(Long id, Assignment details) {
        return assignmentRepository.findById(id).map(existing -> {
            existing.setUsername(details.getUsername());
            existing.setDescription(details.getDescription());
            existing.setScore(details.getScore());
            existing.setDate(details.getDate());
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
