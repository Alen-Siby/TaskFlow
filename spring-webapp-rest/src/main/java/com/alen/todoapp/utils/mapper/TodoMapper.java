package com.alen.todoapp.utils.mapper;

import com.alen.todoapp.dto.TodoDto;
import com.alen.todoapp.model.Todo;
import org.springframework.stereotype.Component;

@Component
public class TodoMapper {


    public Todo toTodo(TodoDto todoDto, boolean ignoreId) {
        Todo todo = new Todo();
        if (!ignoreId) {
            todo.setTId(todoDto.getTId());
        }
        todo.setTopic(todoDto.getTopic());
        todo.setDiscription(todoDto.getDiscription());
        todo.setStatus(todoDto.getStatus());
        todo.setPriority(todoDto.getPriority());
        todo.setCategory(todoDto.getCategory());
        todo.setDueDate(todoDto.getDueDate());
        todo.setCreatedAt(todoDto.getCreatedAt());
        todo.setUpdatedAt(todoDto.getUpdatedAt());
        return todo;
    }

    public Todo toTodo(TodoDto todoDto) {
        return toTodo(todoDto, false);
    }

    public TodoDto toTodoDto(Todo todo) {
         TodoDto todoDto= new TodoDto();
        todoDto.setTId(todo.getTId());
        todoDto.setTopic(todo.getTopic());
        todoDto.setDiscription(todo.getDiscription());
        todoDto.setStatus(todo.getStatus());
        todoDto.setPriority(todo.getPriority());
        todoDto.setCategory(todo.getCategory());
        todoDto.setDueDate(todo.getDueDate());
        todoDto.setCreatedAt(todo.getCreatedAt());
        todoDto.setUpdatedAt(todo.getUpdatedAt());
        return todoDto;

    }


}
