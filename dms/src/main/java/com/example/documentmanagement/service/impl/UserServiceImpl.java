package com.example.documentmanagement.service.impl;

import com.example.documentmanagement.dto.response.UserResponse;
import com.example.documentmanagement.entity.User;
import com.example.documentmanagement.repository.UserRepository;
import com.example.documentmanagement.service.UserService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public List<UserResponse> getReviewers() {
        List<User> reviewers = userRepository.findByRoles_Name("ROLE_REVIEWER");
        return reviewers.stream()
                .map(user -> UserResponse.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .build())
                .toList();
    }
}
