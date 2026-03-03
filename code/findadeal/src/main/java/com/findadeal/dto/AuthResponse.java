package com.findadeal.dto;

public class AuthResponse {
    private long userId;
    private String token;

    public AuthResponse(long userId, String token) {
        this.userId = userId;
        this.token = token;
    }

    public long getUserId() { return userId; }
    public String getToken() { return token; }
}
