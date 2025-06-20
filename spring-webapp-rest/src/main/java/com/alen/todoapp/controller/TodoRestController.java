package com.alen.todoapp.controller;

import com.alen.todoapp.dto.TodoDto;
import com.alen.todoapp.model.Todo;
import com.alen.todoapp.service.TodoService;
import com.alen.todoapp.utils.mapper.TodoMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RequestMapping("/todo")
@RestController
@CrossOrigin(origins="http://localhost:3000")
public class TodoRestController {

    private final TodoService service;
    private final TodoMapper mapper;



    public TodoRestController(TodoService service, TodoMapper mapper) {
        this.service = service;
        this.mapper = mapper;
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
    public ResponseEntity<?> addTodo(@RequestBody @Valid TodoDto todoDto) {
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

//    @GetMapping("load")
//    public String loadData() {
//        service.load();
//        return "success";
//    }
}
