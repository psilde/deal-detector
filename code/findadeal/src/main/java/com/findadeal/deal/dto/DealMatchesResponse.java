package com.findadeal.deal.dto;

import com.findadeal.listing.dto.ListingResponse;

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
        List<ListingResponse> matches
) {}
