package com.example.documentmanagement.service;

import com.example.documentmanagement.dto.response.UserResponse;
import java.util.List;

public interface UserService {
    List<UserResponse> getReviewers();
}
