package com.alen.todoapp.controller;

import com.alen.todoapp.dto.TodoDto;
import com.alen.todoapp.service.TodoService;
import com.alen.todoapp.utils.mapper.TodoMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RequestMapping("/todo")
@RestController
@CrossOrigin(origins="http://localhost:5173/")
public class TodoController {

    private final TodoService todoservice;




    public TodoController(TodoService todoservice) {
        this.todoservice = todoservice;

    }

    @GetMapping()
    public ResponseEntity<?> getAllTodos() {
        return ResponseEntity.ok(todoservice.getAllTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTodo(@PathVariable int id) {
        TodoDto todoDto = todoservice.getTodoById(id);
        return new ResponseEntity<>(todoDto, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<?> addTodo(@RequestBody @Valid TodoDto todoDto) {

        TodoDto createdTodo = todoservice.addTodo(todoDto);
        return new ResponseEntity<>(createdTodo, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTodo(@PathVariable int id, @RequestBody @Valid TodoDto todoDto) {

        TodoDto updated = todoservice.updateTodo(id, todoDto);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTodo(@PathVariable int id) {
        todoservice.deleteTodo(id);
        return ResponseEntity.noContent().build();
    }

//    @PostMapping("/load")
//    public ResponseEntity<?> loadData() {
//        service.load();
//        return ResponseEntity.ok().build();
//    }
}
