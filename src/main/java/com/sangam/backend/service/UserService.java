package com.sangam.backend.service;

import org.springframework.stereotype.Service;

import com.sangam.backend.model.User;
import com.sangam.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;

    public User login(String username,String password){

        return repository.findByUsername(username)
                .filter(user -> user.getPassword().equals(password))
                .orElse(null);

    }

}