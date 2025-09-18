package com.backend.controller;

import com.backend.model.User;
import com.backend.model.Assignment;
import com.backend.repository.UserRepository;
import com.backend.repository.AssignmentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

	private final UserRepository userRepository;
	private final AssignmentRepository assignmentRepository;

	public UserController(UserRepository userRepository, AssignmentRepository assignmentRepository) {
		this.userRepository = userRepository;
		this.assignmentRepository = assignmentRepository;
	}

	// GET /api/users
	@GetMapping
	public List<User> getAll() {
		return userRepository.findAll();
	}

	// POST /api/users/add
	@PostMapping("/add")
	public ResponseEntity<User> addUser(@RequestBody User body) {
		if (body.getUsername() == null || body.getUsername().length() < 3) {
			return ResponseEntity.badRequest().body(null);
		}
		body.setId(null);
		User saved = userRepository.save(body);
	    return ResponseEntity.created(URI.create("/users/" + saved.getId())).body(saved);
	}

	// DELETE /api/users/{id}
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteUser(@PathVariable Long id) {
		return userRepository.findById(id)
				.map(user -> {
					// Delete all assignments with this username
					List<Assignment> assignments = assignmentRepository.findAll();
					assignments.stream()
						.filter(a -> a.getUsername().equals(user.getUsername()))
						.forEach(a -> assignmentRepository.deleteById(a.getId()));
					userRepository.deleteById(id);
					return ResponseEntity.ok("User and their assignments deleted.");
				})
				.orElse(ResponseEntity.status(404).body("User not found."));
	}
}
