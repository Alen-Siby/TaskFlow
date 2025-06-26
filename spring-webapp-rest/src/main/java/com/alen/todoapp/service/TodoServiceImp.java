package com.alen.todoapp.service;

import com.alen.todoapp.dto.TodoDto;
import com.alen.todoapp.exception.AppException;
import com.alen.todoapp.model.Status;
import com.alen.todoapp.model.Todo;
import com.alen.todoapp.repo.TodoRepo;
import com.alen.todoapp.utils.mapper.TodoMapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class TodoServiceImp implements TodoService {
    private static final Logger logger = LogManager.getLogger(TodoServiceImp.class);
    private final TodoRepo repo;
    private final TodoMapper mapper;

    @Autowired
    public TodoServiceImp(TodoRepo repo, TodoMapper mapper) {
        this.repo = repo;
        this.mapper = mapper;
    }

    @Override
    public List<TodoDto> getAllTodos() {
        List<Todo> todos = repo.findAll();
        return todos.stream().map(mapper::toTodoDto).toList();
    }

    @Override
    public TodoDto getTodoById(int id) {
        if (id < 0) {
            throw new AppException("ID cannot be negative", HttpStatus.BAD_REQUEST);
        }
        Todo todo = repo.findById(id)
                .orElseThrow(() -> new AppException("Todo with id " + id + " not found", HttpStatus.NOT_FOUND));
        return mapper.toTodoDto(todo);
    }

    @Override
    public TodoDto addTodo(TodoDto todoDto) {
        if (todoDto.getTopic() != null && repo.findAll().stream()
                .filter(t -> t.getTopic() != null)
                .anyMatch(t -> t.getTopic().equalsIgnoreCase(todoDto.getTopic()))) {
            throw new AppException("Todo with title '" + todoDto.getTopic() + "' already exists", HttpStatus.CONFLICT);
        }
        if (todoDto.getStatus() == null) {
            todoDto.setStatus(Status.IN_PROGRESS);
        }
        if (todoDto.getPriority() == null) {
            todoDto.setPriority(com.alen.todoapp.model.Priority.LOW);
        }
        if (todoDto.getCategory() == null) {
            todoDto.setCategory(com.alen.todoapp.model.Category.PERSONAL);
        }
        Todo todo = mapper.toTodo(todoDto, true);
        Todo saved = repo.save(todo);
        logger.info("Added new Todo: " + saved);
        return mapper.toTodoDto(saved);
    }

    @Override
    public TodoDto updateTodo(int id, TodoDto todoDto) {
        if (id < 0) {
            throw new AppException("ID cannot be negative", HttpStatus.BAD_REQUEST);
        }
        if (!repo.existsById(id)) {
            throw new AppException("Todo with id " + id + " not found", HttpStatus.NOT_FOUND);
        }
        Todo todo = mapper.toTodo(todoDto);
        todo.setTId(id);
        Todo updated = repo.save(todo);
        logger.info("Updated Todo with id " + id + ": " + updated);
        return mapper.toTodoDto(updated);
    }

    @Override
    public boolean deleteTodo(int id) {
        if (id < 0) {
            throw new AppException("ID cannot be negative", HttpStatus.BAD_REQUEST);
        }
        if (!repo.existsById(id)) {
            throw new AppException("Todo with id " + id + " not found", HttpStatus.NOT_FOUND);
        }
        repo.deleteById(id);
        logger.info("Deleted Todo with id " + id);
        return true;
    }

    @Override
    public void load() {
        List<Todo> todos = new ArrayList<>();
        todos.add(createTodoWithDefaults("Learn Spring Boot", "Complete the Spring Boot tutorial", Status.IN_PROGRESS, new Date(125, 6, 30)));
        todos.add(createTodoWithDefaults("Write REST API", "Develop REST endpoints for Todo app", Status.IN_PROGRESS, new Date(125, 7, 15)));
        todos.add(createTodoWithDefaults("Test Application", "Write unit tests for the application", Status.IN_PROGRESS, new Date(125, 7, 25)));
        todos.add(createTodoWithDefaults("Deploy App", "Deploy the application to production", Status.IN_PROGRESS, new Date(125, 8, 5)));
        repo.saveAll(todos);
        logger.info("Loaded default Todos: " + todos.size());
    }

    private Todo createTodoWithDefaults(String topic, String description, Status status, Date dueDate) {
        Todo todo = new Todo(topic, description, status, dueDate);
        if (todo.getPriority() == null) {
            todo.setPriority(com.alen.todoapp.model.Priority.LOW);
        }
        if (todo.getCategory() == null) {
            todo.setCategory(com.alen.todoapp.model.Category.PERSONAL);
        }
        return todo;
    }
}
