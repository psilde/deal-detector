package com.findadeal.service;

import com.findadeal.dto.AuthResponse;
import com.findadeal.exception.BadRequestException;
import com.findadeal.exception.NotFoundException;
import com.findadeal.model.User;
import com.findadeal.repository.UserRepository;
import com.findadeal.security.JwtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    private String normalizeUsername(String username) {
        if (username == null) return null;
        return username.trim();
    }

    public AuthResponse register(String username, String password) {
        String u = normalizeUsername(username);
        if (u == null || u.isBlank()) {
            throw new BadRequestException("username must not be blank");
        }

        if (userRepository.existsByUsernameIgnoreCase(u)) {
            throw new BadRequestException("Username already taken");
        }

        String encoded = passwordEncoder.encode(password);

        User user = new User(u, encoded);
        User saved = userRepository.save(user);

        String token = jwtService.generateToken(saved.getUsername());

        log.info("auth.register success userId={} username={}", saved.getId(), saved.getUsername());

        return new AuthResponse(saved.getId(), token);
    }

    public AuthResponse login(String username, String password) {
        String u = normalizeUsername(username);
        if (u == null || u.isBlank()) {
            throw new BadRequestException("username must not be blank");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(u, password)
        );

        User user = userRepository.findByUsernameIgnoreCase(u)
                .orElseThrow(() -> new NotFoundException("User not found"));

        String token = jwtService.generateToken(user.getUsername());

        log.info("auth.login success userId={} username={}", user.getId(), user.getUsername());

        return new AuthResponse(user.getId(), token);
    }
}
