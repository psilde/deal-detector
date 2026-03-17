package com.findadeal.ingestion;

import com.findadeal.ingestion.client.dto.ScraperListingDto;
import com.findadeal.listing.Listing;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;

// All mapping between scraper DTOs and the Listing entity lives here.
// Nothing outside this class should translate scraper fields onto a Listing.
@Component
public class ListingMapper {

    public Listing toNewListing(ScraperListingDto dto) {
        Listing l = new Listing();
        l.setSource(dto.marketplaceSource());
        l.setExternalId(dto.externalId());
        applyMutableFields(l, dto);
        return l;
    }

    public void updateListing(Listing existing, ScraperListingDto dto) {
        applyMutableFields(existing, dto);
    }

    // Fields that are safe to overwrite on every ingest.
    // source and externalId are identity fields - never overwritten.
    // firstSeen is controlled by the DB default - never set here.
    private void applyMutableFields(Listing l, ScraperListingDto dto) {
        l.setTitle(dto.title());
        l.setPrice(dto.price());
        l.setCurrency(dto.currency() != null ? dto.currency() : "AUD");
        l.setLocation(dto.location());
        l.setUrl(dto.listingUrl());
        l.setImageUrl(dto.imageUrl());
        l.setSourceCategory(dto.sourceCategory());
        l.setSourceCity(dto.sourceCity());
        l.setScrapedAt(dto.scrapedAt());
        l.setLastSeen(OffsetDateTime.now());
    }
}
