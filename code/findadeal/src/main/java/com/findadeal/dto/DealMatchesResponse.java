package com.findadeal.dto;

import com.findadeal.model.Listing;

import java.util.List;

public record DealMatchesResponse(
        String keyword,
        int percentageThreshold,
        double averagePrice,
        double cutoffPrice,
        int matchCount,
        List<Listing> matches
) { }
