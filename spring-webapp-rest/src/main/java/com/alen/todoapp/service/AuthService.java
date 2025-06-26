package com.alen.todoapp.service;

import com.alen.todoapp.exception.AuthException;
import com.alen.todoapp.model.Users;
import java.util.List;

public interface AuthService {
    Users addUser(Users user) throws AuthException;
    Users login(String username, String password) throws AuthException;
    Users getUserByUsername(String username) throws AuthException;
    Users getUserById(Long id) throws AuthException;
    List<Users> getAllUsers();
    void deleteUserById(Long id) throws AuthException;
    Users getUserByEmail(String email) throws AuthException;
}
