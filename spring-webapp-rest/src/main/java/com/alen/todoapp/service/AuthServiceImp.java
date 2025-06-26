package com.alen.todoapp.service;

import com.alen.todoapp.exception.AuthException;
import com.alen.todoapp.model.Users;
import com.alen.todoapp.repo.UserRepo;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AuthServiceImp implements AuthService {
    private static final Logger logger = LogManager.getLogger(AuthServiceImp.class);
    private final UserRepo userRepo;

    @Autowired
    public AuthServiceImp(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public Users addUser(Users user) throws AuthException {
        if (userRepo.findByUsername(user.getUsername()).isPresent()) {
            throw new AuthException("Username already exists");
        }
        if (userRepo.findAll().stream().anyMatch(u -> u.getEmail().equalsIgnoreCase(user.getEmail()))) {
            throw new AuthException("Email already exists");
        }
        return userRepo.save(user);
    }

    @Override
    public Users login(String username, String password) throws AuthException {
        Users user = userRepo.findByUsername(username)
                .orElseThrow(() -> new AuthException("User not found"));
        // Password should be encoded before calling this method
        if (!user.getPassword().equals(password)) {
            throw new AuthException("Invalid password");
        }
        return user;
    }

    @Override
    public Users getUserByUsername(String username) throws AuthException {
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new AuthException("User not found"));
    }

    @Override
    public Users getUserById(Long id) throws AuthException {
        return userRepo.findById(id)
                .orElseThrow(() -> new AuthException("User not found"));
    }

    @Override
    public List<Users> getAllUsers() {
        return userRepo.findAll();
    }

    @Override
    public void deleteUserById(Long id) throws AuthException {
        if (!userRepo.existsById(id)) {
            throw new AuthException("User not found");
        }
        userRepo.deleteById(id);
    }

    @Override
    public Users getUserByEmail(String email) throws AuthException {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new AuthException("User not found"));
    }
}
