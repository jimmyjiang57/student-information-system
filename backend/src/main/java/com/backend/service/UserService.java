package com.backend.service;

import com.backend.model.User;
import com.backend.repository.AssignmentRepository;
import com.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final AssignmentRepository assignmentRepository;

    public UserService(UserRepository userRepository, AssignmentRepository assignmentRepository) {
        this.userRepository = userRepository;
        this.assignmentRepository = assignmentRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByUsername(String username) {
        return Optional.ofNullable(userRepository.findByUsername(username));
    }

    public Optional<User> createUser(User user) {
        if (user.getUsername() == null || user.getUsername().trim().length() < 3) {
            return Optional.empty();
        }
        user.setId(null);
        return Optional.of(userRepository.save(user));
    }

    @Transactional
    public boolean deleteUserById(Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return false;
        }
        User user = userOpt.get();
        assignmentRepository.deleteByUsername(user.getUsername());
        userRepository.deleteById(id);
        return true;
    }
}
