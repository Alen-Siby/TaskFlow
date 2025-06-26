package com.alen.todoapp.utils.mapper;

import com.alen.todoapp.dto.UserDto;
import com.alen.todoapp.model.Users;

public class UserMapper {
    public static UserDto toUserDto(Users user) {
        if (user == null) return null;
        return new UserDto(user.getId(), user.getUsername(), user.getEmail());
    }

    public static Users toUsers(UserDto dto, String password) {
        if (dto == null) return null;
        return new Users(dto.getUsername(), password, dto.getEmail());
    }
}

