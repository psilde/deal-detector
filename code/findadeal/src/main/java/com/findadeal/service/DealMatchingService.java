package com.findadeal.service;

import com.findadeal.dto.DealMatchesResponse;
import com.findadeal.exception.BadRequestException;
import com.findadeal.model.Listing;
import com.findadeal.repository.ListingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
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
            int percentageThreshold,
            Pageable pageable
    ) {
        DealMatchesResponse response = findMatchesInternal(keyword, percentageThreshold, pageable);

        log.info(
                "deals.match userId={} watchlistId={} keyword={} threshold={} page={} size={} returned={} totalMatchCount={}",
                userId,
                watchlistId,
                response.keyword(),
                response.percentageThreshold(),
                response.page(),
                response.size(),
                response.matches().size(),
                response.totalMatchCount()
        );

        return response;
    }

    private DealMatchesResponse findMatchesInternal(String keyword, int percentageThreshold, Pageable pageable) {
        String key = normaliseKeyword(keyword);

        if (key == null || key.isBlank()) {
            throw new BadRequestException("keyword must not be blank");
        }
        if (percentageThreshold < 1 || percentageThreshold > 90) {
            throw new BadRequestException("percentageThreshold must be between 1 and 90");
        }

        Double avgResult = listingRepository.findAveragePriceByKeyword(key);

        if (avgResult == null || avgResult <= 0) {
            return new DealMatchesResponse(
                    key,
                    percentageThreshold,
                    0,
                    0,
                    0,
                    pageable.getPageNumber(),
                    pageable.getPageSize(),
                    0,
                    List.of()
            );
        }

        double avg = avgResult;
        double cutoff = avg * (1 - (percentageThreshold / 100.0));

        Page<Listing> matchPage =
                listingRepository.findByTitleContainingIgnoreCaseAndPriceLessThanEqual(
                        key,
                        BigDecimal.valueOf(cutoff),
                        pageable
                );

        return new DealMatchesResponse(
                key,
                percentageThreshold,
                avg,
                cutoff,
                matchPage.getTotalElements(),
                matchPage.getNumber(),
                matchPage.getSize(),
                matchPage.getTotalPages(),
                matchPage.getContent()
        );
    }
}