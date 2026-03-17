package com.findadeal.ingestion.client;

import com.findadeal.ingestion.client.dto.ScraperListingDto;
import com.findadeal.ingestion.client.dto.ScraperPage;
import com.findadeal.common.exception.ScraperUnavailableException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.util.ArrayList;
import java.util.List;

@Component
public class ScraperClient {

    private static final Logger log = LoggerFactory.getLogger(ScraperClient.class);

    private final RestClient restClient;
    private final ScraperClientProperties props;

    public ScraperClient(ScraperClientProperties props) {
        this.props = props;
        this.restClient = RestClient.builder()
                .baseUrl(props.getBaseUrl())
                .build();
    }

    // fetch all pages from listings endpoint @ in the scraper API
    // keyword can be used to narrow results
    public List<ScraperListingDto> fetchAll(String keyword) {
        List<ScraperListingDto> all = new ArrayList<>();
        int page = 0;
        int totalPages;

        do {
            ScraperPage response = fetchPage(page, keyword);
            all.addAll(response.content());
            totalPages = response.totalPages();
            log.debug("scraper.fetch page={} of={} fetched={}", page, totalPages, response.content().size());
            page++;
        } while (page < totalPages);

        log.info("scraper.fetch.complete keyword={} total={}", keyword, all.size());
        return all;
    }

    private ScraperPage fetchPage(int page, String keyword) {
        try {
            return restClient.get()
                    .uri(uriBuilder -> {
                        uriBuilder.path("/marketplace/listings")
                                .queryParam("page", page)
                                .queryParam("size", props.getPageSize());
                        if (keyword != null && !keyword.isBlank()) {
                            uriBuilder.queryParam("keyword", keyword.trim());
                        }
                        return uriBuilder.build();
                    })
                    .retrieve()
                    .body(ScraperPage.class);
        } catch (ResourceAccessException ex) {
            throw new ScraperUnavailableException("Cannot reach scraper at " + props.getBaseUrl() + ": " + ex.getMessage());
        } catch (RestClientResponseException ex) {
            throw new ScraperUnavailableException("Scraper returned error " + ex.getStatusCode() + ": " + ex.getMessage());
        }
    }
}
