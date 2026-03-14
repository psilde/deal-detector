package com.findadeal.dto;

import com.findadeal.model.Listing;

import java.util.List;

public record DealMatchesResponse(
        String keyword,
        int percentageThreshold,
        double averagePrice,
        double cutoffPrice,
        long totalMatchCount,
        int page,
        int size,
        int totalPages,
        List<Listing> matches
) { }