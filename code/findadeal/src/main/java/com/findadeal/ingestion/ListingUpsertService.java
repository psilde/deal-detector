package com.findadeal.ingestion;

import com.findadeal.ingestion.client.dto.ScraperListingDto;
import com.findadeal.ingestion.dto.IngestResult;
import com.findadeal.listing.Listing;
import com.findadeal.listing.ListingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

// Handles deduplication and persistence for incoming scraper listings.
// Uses (source, externalId) as the stable identity key.
// Listings without both fields are dropped - no identity means no safe upsert.
@Service
public class ListingUpsertService {

    private static final Logger log = LoggerFactory.getLogger(ListingUpsertService.class);

    private final ListingRepository listingRepository;
    private final ListingMapper mapper;

    public ListingUpsertService(ListingRepository listingRepository, ListingMapper mapper) {
        this.listingRepository = listingRepository;
        this.mapper = mapper;
    }

    @Transactional
    public IngestResult upsert(List<ScraperListingDto> incoming) {
        if (incoming == null || incoming.isEmpty()) {
            return new IngestResult(0, 0);
        }

        // drop anything we can't deduplicate
        List<ScraperListingDto> valid = incoming.stream()
                .filter(d -> d.marketplaceSource() != null && d.externalId() != null)
                .toList();

        Map<String, List<ScraperListingDto>> bySource = valid.stream()
                .collect(Collectors.groupingBy(ScraperListingDto::marketplaceSource));

        int created = 0;
        int updated = 0;

        for (Map.Entry<String, List<ScraperListingDto>> entry : bySource.entrySet()) {
            String source = entry.getKey();
            List<ScraperListingDto> group = entry.getValue();

            List<String> externalIds = group.stream()
                    .map(ScraperListingDto::externalId)
                    .toList();

            Map<String, Listing> existing = listingRepository
                    .findBySourceAndExternalIdIn(source, externalIds)
                    .stream()
                    .collect(Collectors.toMap(Listing::getExternalId, l -> l));

            List<Listing> toSave = new ArrayList<>(group.size());

            for (ScraperListingDto dto : group) {
                Listing listing = existing.get(dto.externalId());
                if (listing == null) {
                    toSave.add(mapper.toNewListing(dto));
                    created++;
                } else {
                    mapper.updateListing(listing, dto);
                    toSave.add(listing);
                    updated++;
                }
            }

            listingRepository.saveAll(toSave);
        }

        log.info("upsert.complete created={} updated={}", created, updated);
        return new IngestResult(created, updated);
    }
}
