package com.backend.controller;

import com.backend.model.User;
import com.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping
	public List<User> getAll() {
		return userService.getAllUsers();
	}

	@PostMapping("/add")
	public ResponseEntity<User> addUser(@RequestBody User body) {
		Optional<User> created = userService.createUser(body);
		if (created.isEmpty()) {
			return ResponseEntity.badRequest().build();
		}
		User saved = created.get();
		return ResponseEntity.created(URI.create("/users/" + saved.getId())).body(saved);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteUser(@PathVariable Long id) {
		boolean deleted = userService.deleteUserById(id);
		if (!deleted) {
			return ResponseEntity.status(404).body("User not found.");
		}
		return ResponseEntity.ok("User and their assignments deleted.");
	}
}
