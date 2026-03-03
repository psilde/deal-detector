package com.findadeal.dto;

import java.time.Instant;

public record WatchlistResponse(
        Long id,
        String keyword,
        int percentageThreshold,
        Instant createdAt
) {}
