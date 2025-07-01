package com.alen.todoapp.service;

import java.util.List;

import com.alen.todoapp.dto.TodoDto;


public interface TodoService {
    //method to return all Todos
    List<TodoDto> getAllTodos();

    // method to get a Todo by ID
    TodoDto getTodoById(int id);

    // Add a new todo
    TodoDto addTodo(TodoDto todoDto);

    // Add a new todo for a user
    TodoDto addTodo(TodoDto todoDto, Long userId);

    // Update a todo by ID
    TodoDto updateTodo(int id, TodoDto todoDto);

    // Delete a todo by ID
    boolean deleteTodo(int id);

    // Load sample todos
    void load();

    // Fetch todos by user ID
    List<TodoDto> getTodosByUserId(Long userId);
}
