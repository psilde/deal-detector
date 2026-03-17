package com.findadeal.ingestion;

import com.findadeal.ingestion.client.ScraperClient;
import com.findadeal.ingestion.client.dto.ScraperListingDto;
import com.findadeal.ingestion.dto.IngestResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

/*
 responsible for the full scraper -> deal detection service data flow
 pull-and-ingest cycle from scraper API
 */
@Service
public class ScraperIngestionService {

    private static final Logger log = LoggerFactory.getLogger(ScraperIngestionService.class);

    private final ScraperClient scraperClient;
    private final ListingUpsertService upsertService;

    public ScraperIngestionService(ScraperClient scraperClient, ListingUpsertService upsertService) {
        this.scraperClient = scraperClient;
        this.upsertService = upsertService;
    }

    // fetchest listings from scraper and upserts them
    // use keyword to fetch specific listings
    public IngestResult ingest(String keyword) {
        log.info("ingestion.start keyword={}", keyword);

        List<ScraperListingDto> listings = scraperClient.fetchAll(keyword);

        if (listings.isEmpty()) {
            log.info("ingestion.empty keyword={} - scraper returned no listings", keyword);
            return new IngestResult(0, 0);
        }

        IngestResult result = upsertService.upsert(listings);
        log.info("ingestion.complete keyword={} created={} updated={}", keyword, result.created(), result.updated());
        return result;
    }
}
