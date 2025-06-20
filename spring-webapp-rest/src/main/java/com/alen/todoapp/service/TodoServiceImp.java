package com.alen.todoapp.service;

import com.alen.todoapp.dto.TodoDto;
import com.alen.todoapp.model.Status;
import com.alen.todoapp.model.Todo;
import com.alen.todoapp.repo.TodoRepo;
import com.alen.todoapp.utils.mapper.TodoMapper;
//import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
//@RequiredArgsConstructorC
@Service
public class TodoServiceImp implements TodoService {
    private final TodoRepo repo;
    private final TodoMapper mapper;

    public TodoServiceImp(TodoRepo repo, TodoMapper mapper) {
        this.repo = repo;
        this.mapper = mapper;
    }

    @Override
    public List<TodoDto> getAllTodos() {
        try {
            List<Todo> todos = repo.findAll();
            return todos.stream().map(mapper::toTodoDto).toList();
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch todos", e);
        }
    }

    @Override
    public TodoDto getTodoById(int id) {
        if (id < 0) {
            throw new IllegalArgumentException("ID cannot be negative");
        }
        try {
            Todo todo = repo.findById(id).orElseThrow(() ->
                new RuntimeException("Todo with id " + id + " not found")
            );
            return mapper.toTodoDto(todo);
        } catch (Exception e) {
            throw new RuntimeException("Todo  not found", e);
        }
    }

    @Override
    public TodoDto addTodo(TodoDto todoDto) {
        // Check for duplicate topic and throw IllegalArgumentException with specific message
        if (todoDto.getTopic() != null && repo.findAll().stream()
                .filter(t -> t.getTopic() != null)
                .anyMatch(t -> t.getTopic().equalsIgnoreCase(todoDto.getTopic()))) {
            throw new IllegalArgumentException("Todo with title '" + todoDto.getTopic() + "' already exists");
        }
        try {
            // Set status to IN_PROGRESS if not provided
            if (todoDto.getStatus() == null) {
                todoDto.setStatus(Status.IN_PROGRESS);
            }
            // Set default priority if not provided
            if (todoDto.getPriority() == null) {
                todoDto.setPriority(com.alen.todoapp.model.Priority.LOW);
            }
            // Set default category if not provided
            if (todoDto.getCategory() == null) {
                todoDto.setCategory(com.alen.todoapp.model.Category.PERSONAL);
            }
            // Remove due date check from service (now handled in controller)
            Todo todo = mapper.toTodo(todoDto, true);
            Todo saved = repo.save(todo);
            return mapper.toTodoDto(saved);
        } catch (Exception e) {
            // For all other exceptions, throw a generic message
            throw new RuntimeException("Failed to add todo", e);
        }
    }

    @Override
    public TodoDto updateTodo(int id, TodoDto todoDto) {
        if (id < 0) {
            throw new IllegalArgumentException("ID cannot be negative");
        }
        try {
            if (!repo.existsById(id)) {
                throw new RuntimeException("Todo with id " + id + " not found");
            }
            Todo todo = mapper.toTodo(todoDto);
            todo.setTId(id);
            Todo updated = repo.save(todo);
            return mapper.toTodoDto(updated);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update todo", e);
        }
    }

    @Override
    public boolean deleteTodo(int id) {
        if (id < 0) {
            throw new IllegalArgumentException("ID cannot be negative");
        }
        try {
            if (!repo.existsById(id)) {
                throw new RuntimeException("Todo with id " + id + " not found");
            }
            repo.deleteById(id);
            return true;
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete todo", e);
        }
    }

//    @Override
//    public void load() {
//        List<Todo> todos = new ArrayList<>(List.of(
//                new Todo(1, new Date(), "Learn Spring Boot", "Complete the Spring Boot tutorial", true),
//                new Todo(2, new Date(), "Write REST API", "Develop REST endpoints for Todo app", false),
//                new Todo(3, new Date(), "Test Application", "Write unit tests for the application", false),
//                new Todo(4, new Date(), "Deploy App", "Deploy the application to production", false)
//        ));
//        repo.saveAll(todos);
//    }
}
