package com.findadeal.dto;

import java.math.BigDecimal;

public record ListingResponse(
        Long id,
        String title,
        BigDecimal price,
        String location,
        String url
) {}