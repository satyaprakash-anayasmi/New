package com.example.documentmanagement.service;

import org.springframework.security.core.userdetails.UserDetailsService;

/**
 * Custom extension of Spring Security's {@link UserDetailsService}.
 * Defined in the project's service layer to follow the same
 * interface-driven architecture used by all other services.
 */
public interface CustomUserDetailsService extends UserDetailsService {
}
