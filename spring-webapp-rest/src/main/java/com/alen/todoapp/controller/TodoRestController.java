package com.alen.todoapp.controller;

import com.alen.todoapp.dto.TodoDto;
import com.alen.todoapp.model.Todo;
import com.alen.todoapp.service.TodoService;
import com.alen.todoapp.utils.mapper.TodoMapper;
import com.alen.todoapp.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

@RequestMapping("/todo")
@RestController
@CrossOrigin(origins="http://localhost:5173/")
public class TodoRestController {

    private final TodoService service;
    private final TodoMapper mapper;
    private final JwtUtil jwtUtil;

    @Autowired
    public TodoRestController(TodoService service, TodoMapper mapper, JwtUtil jwtUtil) {
        this.service = service;
        this.mapper = mapper;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping()
    public ResponseEntity<?> getAllTodos(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("success", false, "message", "Missing or invalid Authorization header"));
        }
        String token = authHeader.substring(7);
        Long userId;
        try {
            userId = jwtUtil.extractUserId(token);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("success", false, "message", "Invalid JWT token"));
        }
        return ResponseEntity.ok(service.getTodosByUserId(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTodo(@PathVariable int id) {
        TodoDto todoDto = service.getTodoById(id);
        return new ResponseEntity<>(todoDto, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<?> addTodo(@RequestBody @Valid TodoDto todoDto, HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("success", false, "message", "Missing or invalid Authorization header"));
        }
        String token = authHeader.substring(7);
        Long userId;
        try {
            userId = jwtUtil.extractUserId(token);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("success", false, "message", "Invalid JWT token"));
        }
        if (todoDto.getDueDate() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(java.util.Collections.singletonMap("error", "Due date is missing"));
        }
        TodoDto createdTodo = service.addTodo(todoDto, userId);
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
