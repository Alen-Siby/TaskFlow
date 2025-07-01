package com.alen.todoapp.controller;

import com.alen.todoapp.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.alen.todoapp.model.Users;
import com.alen.todoapp.dto.UserDto;
import com.alen.todoapp.utils.mapper.UserMapper;
import com.alen.todoapp.service.AuthService;
import com.alen.todoapp.exception.AuthException;

import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/auth")
public class AuthController {
    private final JwtUtil jwtUtil;
    private final AuthService authService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthController(JwtUtil jwtUtil, AuthService authService, PasswordEncoder passwordEncoder) {
        this.jwtUtil = jwtUtil;
        this.authService = authService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody UserDto userDto, BindingResult bindingResult) {
        String username = userDto.getUsername();
        String email = userDto.getEmail();
        String password = userDto.getPassword();
        StringBuilder errorMsg = new StringBuilder();
        if ((username == null || username.isBlank()) && (email == null || email.isBlank()))
            errorMsg.append("Either username or email is required. ");
        if (password == null || password.isBlank())
            errorMsg.append("Password is required. ");
        if (errorMsg.length() > 0)
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", errorMsg.toString().trim()));
        if (bindingResult.hasErrors()) {
            bindingResult.getFieldErrors().forEach(error ->
                errorMsg.append(error.getField()).append(": ").append(error.getDefaultMessage()).append("; "));
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", errorMsg.toString().trim()));
        }
        Users user = (email != null && !email.isBlank()) ?
            authService.getUserByEmail(email) : authService.getUserByUsername(username);
        if (user == null || !passwordEncoder.matches(password, user.getPassword()))
            throw new AuthException("Invalid username/email or password");
        String token = jwtUtil.generateToken(user.getUsername(), user.getId());
        return ResponseEntity.ok(Map.of(
            "success", true,
            "token", token,
            "userId", user.getId(),
            "username", user.getUsername(),
            "email", user.getEmail(),
            "message", "Login successful"
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserDto userDto, BindingResult bindingResult) {
        String username = userDto.getUsername();
        String email = userDto.getEmail();
        String password = userDto.getPassword();
        StringBuilder errorMsg = new StringBuilder();
        if (username == null || username.isBlank())
            errorMsg.append("Username is required. ");
        if (email == null || email.isBlank())
            errorMsg.append("Email is required. ");
        if (password == null || password.isBlank())
            errorMsg.append("Password is required. ");
        if (bindingResult.hasErrors()) {
            bindingResult.getFieldErrors().forEach(error ->
                errorMsg.append(error.getField()).append(": ").append(error.getDefaultMessage()).append("; "));
        }
        if (errorMsg.length() > 0)
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", errorMsg.toString().trim()));
        Users user = new Users(username, passwordEncoder.encode(password), email);
        Users saved = authService.addUser(user);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "userId", saved.getId(),
            "username", saved.getUsername(),
            "email", saved.getEmail(),
            "message", "Registration successful"
        ));
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UserDto> getUserByUsername(@PathVariable String username) {
        Users user = authService.getUserByUsername(username);
        return ResponseEntity.ok(UserMapper.toUserDto(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        Users user = authService.getUserById(id);
        return ResponseEntity.ok(UserMapper.toUserDto(user));
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = authService.getAllUsers().stream()
            .map(UserMapper::toUserDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUserById(@PathVariable Long id) {
        authService.deleteUserById(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "User deleted successfully"));
    }
}
