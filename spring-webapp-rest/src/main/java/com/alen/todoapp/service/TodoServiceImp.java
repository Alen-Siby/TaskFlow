package com.alen.todoapp.service;

import com.alen.todoapp.dto.TodoDto;
import com.alen.todoapp.model.Status;
import com.alen.todoapp.model.Todo;
import com.alen.todoapp.repo.TodoRepo;
import com.alen.todoapp.utils.mapper.TodoMapper;
import com.alen.todoapp.exception.AppException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.logging.Logger;
import java.util.logging.FileHandler;
import java.util.logging.SimpleFormatter;
import java.io.IOException;

import java.util.ArrayList;
import java.util.List;

@Service
public class TodoServiceImp implements TodoService {
    private static final Logger logger = Logger.getLogger(TodoServiceImp.class.getName());
    private final TodoRepo repo;
    private final TodoMapper mapper;

    static {
        try {
            FileHandler fileHandler = new FileHandler("logs/todoapp-jul.log", true);
            fileHandler.setFormatter(new SimpleFormatter());
            logger.addHandler(fileHandler);
        } catch (IOException e) {
            System.err.println("Failed to set up file logging: " + e.getMessage());
        }
    }

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
            logger.severe("Failed to fetch todos: " + e.getMessage());
            throw new AppException("Failed to fetch todos", HttpStatus.NOT_FOUND);
        }
    }

    @Override
    public TodoDto getTodoById(int id) {
        if (id < 0) {
            logger.warning("Attempted to fetch todo with negative ID: " + id);
            throw new AppException("ID cannot be negative", HttpStatus.BAD_REQUEST);
        }
        try {
            Todo todo = repo.findById(id).orElseThrow(() -> {
                logger.warning("Todo with id " + id + " not found");
                return new AppException("Todo not found", HttpStatus.NOT_FOUND);
            });
            return mapper.toTodoDto(todo);
        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            logger.severe("Failed to fetch todo by id: " + e.getMessage());
            throw new AppException("Failed to fetch todo by id", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public TodoDto addTodo(TodoDto todoDto) {
        if (todoDto.getTopic() != null && repo.findAll().stream()
                .filter(t -> t.getTopic() != null)
                .anyMatch(t -> t.getTopic().equalsIgnoreCase(todoDto.getTopic()))) {
            logger.warning("Duplicate todo topic attempted: " + todoDto.getTopic());
            throw new AppException("Todo with title '" + todoDto.getTopic() + "' already exists", HttpStatus.BAD_REQUEST);
        }
        // Set status to IN_PROGRESS if not provided
        if (todoDto.getStatus() == null) {
            todoDto.setStatus(Status.IN_PROGRESS);
        }
        Todo todo = mapper.toTodo(todoDto, true);
        Todo saved = repo.save(todo);
        logger.info("Todo added successfully: " + saved.getTId());
        return mapper.toTodoDto(saved);
    }

    @Override
    public TodoDto updateTodo(int id, TodoDto todoDto) {
        if (id < 0) throw new AppException("ID cannot be negative", HttpStatus.BAD_REQUEST);
        return repo.findById(id)
                .map(existing -> {
                    Todo todo = mapper.toTodo(todoDto);
                    todo.setTId(id);
                    return mapper.toTodoDto(repo.save(todo));
                })
                .orElseThrow(() -> new AppException("Todo with id " + id + " not found", HttpStatus.NOT_FOUND));
    }

    @Override
    public boolean deleteTodo(int id) {
        if (id < 0) {
            logger.warning("Attempted to delete todo with negative ID: " + id);
            throw new AppException("ID cannot be negative", HttpStatus.BAD_REQUEST);
        }
        if (!repo.existsById(id)) {
            logger.warning("Todo with id " + id + " not found for deletion");
            throw new AppException("Todo with id " + id + " not found", HttpStatus.NOT_FOUND);
        }
        repo.deleteById(id);
        logger.info("Todo deleted successfully: " + id);
        return true;
    }


}
