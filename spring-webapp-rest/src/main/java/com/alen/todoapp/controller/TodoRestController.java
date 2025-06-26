package com.alen.todoapp.controller;

import com.alen.todoapp.dto.TodoDto;
import com.alen.todoapp.model.Todo;
import com.alen.todoapp.service.TodoService;
import com.alen.todoapp.utils.mapper.TodoMapper;
import com.alen.todoapp.repo.UserRepo;
import com.alen.todoapp.model.Users;
import com.alen.todoapp.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RequestMapping("/todo")
@RestController
@CrossOrigin(origins="http://localhost:5173/")
public class TodoRestController {

    private final TodoService service;
    private final TodoMapper mapper;
    private final UserRepo userRepo;
    private final JwtUtil jwtUtil;

    @Autowired
    public TodoRestController(TodoService service, TodoMapper mapper, UserRepo userRepo, JwtUtil jwtUtil) {
        this.service = service;
        this.mapper = mapper;
        this.userRepo = userRepo;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping()
    public ResponseEntity<?> getAllTodos() {
        return ResponseEntity.ok(service.getAllTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTodo(@PathVariable int id) {
        TodoDto todoDto = service.getTodoById(id);
        return new ResponseEntity<>(todoDto, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<?> addTodo(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader, @RequestBody @Valid TodoDto todoDto) {
        if (todoDto.getDueDate() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(java.util.Collections.singletonMap("error", "Due date is missing"));
        }
        // Extract username from JWT token
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(java.util.Collections.singletonMap("error", "Missing or invalid Authorization header"));
        }
        String token = authHeader.substring(7);
        String username = jwtUtil.extractUsername(token);
        Users user = userRepo.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(java.util.Collections.singletonMap("error", "User not found for token"));
        }
        todoDto.setUserId(user.getId());
        TodoDto createdTodo = service.addTodo(todoDto);
        return new ResponseEntity<>(createdTodo, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTodo(@PathVariable int id, @RequestBody @Valid TodoDto todoDto) {
        TodoDto updated = service.updateTodo(id, todoDto);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTodo(@PathVariable int id) {
        service.deleteTodo(id);
        return ResponseEntity.ok().body("Todo deleted successfully");
    }

    @PostMapping("/load")
    public ResponseEntity<Void> loadData() {
        service.load();
        return ResponseEntity.ok().build();
    }
}
