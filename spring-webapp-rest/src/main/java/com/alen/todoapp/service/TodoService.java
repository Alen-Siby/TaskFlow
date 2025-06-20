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

    // Update a todo by ID
    TodoDto updateTodo(int id, TodoDto todoDto);

    // Delete a todo by ID
    boolean deleteTodo(int id);

//    void load();
}
