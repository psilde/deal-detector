package com.findadeal.ingestion;

import com.findadeal.ingestion.client.dto.ScraperListingDto;
import com.findadeal.ingestion.dto.IngestResult;
import com.findadeal.common.exception.ForbiddenException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final ListingUpsertService upsertService;
    private final ScraperIngestionService scraperIngestionService;

    @Value("${app.admin.secret}")
    private String adminSecret;

    public AdminController(ListingUpsertService upsertService, ScraperIngestionService scraperIngestionService) {
        this.upsertService = upsertService;
        this.scraperIngestionService = scraperIngestionService;
    }

    // Direct push: accepts a pre-built list of listings (e.g., from manual export or testing).
    @PostMapping("/sync")
    public IngestResult sync(
            @RequestHeader("X-Admin-Secret") String secret,
            @RequestBody List<ScraperListingDto> listings
    ) {
        requireSecret(secret);
        return upsertService.upsert(listings);
    }

    // Pull-and-ingest: FindADeal calls the scraper API and ingests whatever it finds.
    // keyword is optional - omit to fetch all listings, provide to narrow by search term.
    @PostMapping("/ingest")
    public IngestResult ingest(
            @RequestHeader("X-Admin-Secret") String secret,
            @RequestParam(required = false) String keyword
    ) {
        requireSecret(secret);
        return scraperIngestionService.ingest(keyword);
    }

    private void requireSecret(String provided) {
        if (!adminSecret.equals(provided)) {
            throw new ForbiddenException("Forbidden");
        }
    }
}
