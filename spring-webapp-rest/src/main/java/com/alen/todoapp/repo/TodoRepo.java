package com.alen.todoapp.repo;

import com.alen.todoapp.model.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



@Repository
public interface TodoRepo extends JpaRepository<Todo, Integer> {

    // ArrayList to store Todo objects
//    List<Todo> todos = new ArrayList<>();
//
//    // Constructor: injecting sample Todo objects into the ArrayList
//    public TodoRepo() {
//        todos.add(new Todo(1, new Date(), "Learn Spring Boot", "Complete the Spring Boot tutorial", false));
//        todos.add(new Todo(2, new Date(), "Write REST API", "Develop REST endpoints for Todo app", false));
//        todos.add(new Todo(3, new Date(), "Test Application", "Write unit tests for the application", false));
//        todos.add(new Todo(4, new Date(), "Deploy App", "Deploy the application to production", false));
//    }
//
//    // Get all todos
//    public List<Todo> getAllTodos() {
//        return todos;
//    }
//
//    // Find a todo by ID
//    public Todo getTodoById(int id) {
//        return todos.stream().filter(t -> t.getTId() == id).findFirst().orElse(null);
//    }
//
//    // Add a new todo
//    public void addTodo(Todo todo) {
//        todos.add(todo);
//    }
//
//    // Update a todo by ID
//    public boolean updateTodo(int id, Todo updatedTodo) {
//        for (Todo t : todos) {
//            if (t.getTId() == id) {
//                int idx = todos.indexOf(t);
//                todos.set(idx, updatedTodo);
//                return true;
//            }
//        }
//        return false;
//    }
//
//    // Remove a todo by ID
//    public boolean removeTodoById(int id) {
//        return todos.removeIf(t -> t.getTId() == id);
//    }
}
