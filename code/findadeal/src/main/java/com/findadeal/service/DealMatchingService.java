package com.findadeal.service;

import com.findadeal.dto.DealMatchesResponse;
import com.findadeal.exception.BadRequestException;
import com.findadeal.model.Listing;
import com.findadeal.repository.ListingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class DealMatchingService {

    private static final Logger log = LoggerFactory.getLogger(DealMatchingService.class);

    private final ListingRepository listingRepository;

    public DealMatchingService(ListingRepository listingRepository) {
        this.listingRepository = listingRepository;
    }

    private String normaliseKeyword(String keyword) {
        if (keyword == null) return null;
        return keyword.trim().toLowerCase();
    }
    public DealMatchesResponse findMatches(
            Long userId,
            Long watchlistId,
            String keyword,
            int percentageThreshold
    ) {
        DealMatchesResponse response = findMatchesInternal(keyword, percentageThreshold);

        log.info(
                "deals.match userId={} watchlistId={} keyword={} threshold={} matchCount={}",
                userId,
                watchlistId,
                response.keyword(),
                response.percentageThreshold(),
                response.matchCount()
        );

        return response;
    }

    private DealMatchesResponse findMatchesInternal(String keyword, int percentageThreshold) {
        String key = normaliseKeyword(keyword);

        if (key == null || key.isBlank()) {
            throw new BadRequestException("keyword must not be blank");
        }
        if (percentageThreshold < 1 || percentageThreshold > 90) {
            throw new BadRequestException("percentageThreshold must be between 1 and 90");
        }

        List<Listing> listings = listingRepository.findAll();

        List<Listing> filtered = listings.stream()
                .filter(l -> l.getTitle() != null && l.getTitle().toLowerCase().contains(key))
                .toList();

        if (filtered.isEmpty()) {
            return new DealMatchesResponse(
                    key,
                    percentageThreshold,
                    0,
                    0,
                    0,
                    List.of()
            );
        }

        double avg = filtered.stream()
                .map(Listing::getPrice)
                .mapToDouble(java.math.BigDecimal::doubleValue)
                .average()
                .orElse(0);

        double cutoff = avg <= 0
                ? 0
                : avg * (1 - (percentageThreshold / 100.0));

        List<Listing> matches = filtered.stream()
                .filter(l -> l.getPrice().doubleValue() <= cutoff)
                .sorted(Comparator.comparing(Listing::getPrice))
                .toList();

        return new DealMatchesResponse(
                key,
                percentageThreshold,
                avg,
                cutoff,
                matches.size(),
                matches
        );
    }
}
