package com.findadeal.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record WatchlistCreateRequest(
        @NotBlank(message = "keyword must not be blank")
        String keyword,

        @Min(value = 1, message = "percentageThreshold must be >= 1")
        @Max(value = 90, message = "percentageThreshold must be <= 90")
        int percentageThreshold
) { }
