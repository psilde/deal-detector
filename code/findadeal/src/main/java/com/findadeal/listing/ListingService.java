package com.findadeal.listing;

import com.findadeal.listing.dto.ListingResponse;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ListingService {

    private final ListingRepository listingRepository;

    public ListingService(ListingRepository listingRepository) {
        this.listingRepository = listingRepository;
    }

    @Transactional(readOnly = true)
    public Page<ListingResponse> getListings(String keyword, Pageable pageable) {
        if (keyword == null || keyword.isBlank()) {
            return listingRepository.findAll(pageable).map(ListingResponse::from);
        }
        return listingRepository.findByTitleContainingIgnoreCase(keyword.trim(), pageable)
                .map(ListingResponse::from);
    }

    /**
     * Returns the average price for listings matching the given keyword.
     * Result is cached by keyword and evicted whenever listings are synced,
     * eliminating the full-table AVG scan on repeated deal-match requests.
     */
    @Cacheable(value = "avgPriceByKeyword", key = "#keyword")
    @Transactional(readOnly = true)
    public Double getAveragePrice(String keyword) {
        return listingRepository.findAveragePriceByKeyword(keyword);
    }

    /**
     * Evicts all cached average prices. Called after every scraper sync
     * so stale averages are never served after new listings arrive.
     */
    @CacheEvict(value = "avgPriceByKeyword", allEntries = true)
    public void evictAveragePriceCache() {}
}
