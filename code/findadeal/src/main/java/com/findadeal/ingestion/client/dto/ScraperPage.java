package com.findadeal.ingestion.client.dto;

import java.util.List;

// wrapper for spring's paginated API responses (Scraper)
// extra fields ignored
public record ScraperPage(
        List<ScraperListingDto> content,
        int totalPages,
        long totalElements,
        int number,
        int size
) {}
