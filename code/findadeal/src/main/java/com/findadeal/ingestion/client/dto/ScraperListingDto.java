package com.findadeal.ingestion.client.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

// copies the scrapers listing shape with only fields that the deal detection platform actually uses
// unknown fields are silently ignored.
public record ScraperListingDto(
        String marketplaceSource,
        String externalId,
        String title,
        BigDecimal price,
        String currency,
        String location,
        String listingUrl,
        String imageUrl,
        OffsetDateTime scrapedAt,
        String sourceCategory,
        String sourceCity
) {}
