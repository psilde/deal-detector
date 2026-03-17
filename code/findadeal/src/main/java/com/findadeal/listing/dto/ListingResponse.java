package com.findadeal.listing.dto;

import com.findadeal.listing.Listing;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record ListingResponse(
        Long id,
        String source,
        String title,
        BigDecimal price,
        String currency,
        String location,
        String url,
        String imageUrl,
        String sourceCategory,
        String sourceCity,
        OffsetDateTime scrapedAt,
        OffsetDateTime firstSeen,
        OffsetDateTime lastSeen
) {
    public static ListingResponse from(Listing l) {
        return new ListingResponse(
                l.getId(),
                l.getSource(),
                l.getTitle(),
                l.getPrice(),
                l.getCurrency(),
                l.getLocation(),
                l.getUrl(),
                l.getImageUrl(),
                l.getSourceCategory(),
                l.getSourceCity(),
                l.getScrapedAt(),
                l.getFirstSeen(),
                l.getLastSeen()
        );
    }
}
