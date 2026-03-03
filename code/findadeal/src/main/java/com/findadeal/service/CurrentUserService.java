package com.findadeal.service;

import com.findadeal.exception.ForbiddenException;
import com.findadeal.exception.NotFoundException;
import com.findadeal.model.User;
import com.findadeal.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {

    private final UserRepository userRepository;

    public CurrentUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || auth.getName() == null || auth.getName().equals("anonymousUser")) {
            throw new ForbiddenException("Not authenticated");
        }

        String username = auth.getName();

        return userRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new NotFoundException("Authenticated user not found"));
    }
}
