package com.findadeal.deal;

import com.findadeal.deal.dto.DealMatchesResponse;
import com.findadeal.listing.dto.ListingResponse;
import com.findadeal.common.exception.BadRequestException;
import com.findadeal.listing.ListingRepository;
import com.findadeal.listing.ListingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class DealMatchingService {

    private static final Logger log = LoggerFactory.getLogger(DealMatchingService.class);

    private final ListingRepository listingRepository;
    private final ListingService listingService;

    public DealMatchingService(ListingRepository listingRepository, ListingService listingService) {
        this.listingRepository = listingRepository;
        this.listingService = listingService;
    }

    @Transactional(readOnly = true)
    public DealMatchesResponse findMatches(
            Long userId,
            Long watchlistId,
            String keyword,
            int percentageThreshold,
            Pageable pageable
    ) {
        String key = normalise(keyword);

        if (key == null || key.isBlank()) {
            throw new BadRequestException("keyword must not be blank");
        }
        if (percentageThreshold < 1 || percentageThreshold > 90) {
            throw new BadRequestException("percentageThreshold must be between 1 and 90");
        }

        Double avgResult = listingService.getAveragePrice(key);

        if (avgResult == null || avgResult <= 0) {
            log.info("deals.match userId={} watchlistId={} keyword={} threshold={} noData",
                    userId, watchlistId, key, percentageThreshold);
            return emptyResponse(key, percentageThreshold, pageable);
        }

        double avg = avgResult;
        double cutoff = avg * (1 - (percentageThreshold / 100.0));

        Page<ListingResponse> matchPage =
                listingRepository.findByTitleContainingIgnoreCaseAndPriceLessThanEqual(
                        key, BigDecimal.valueOf(cutoff), pageable
                ).map(ListingResponse::from);

        log.info("deals.match userId={} watchlistId={} keyword={} threshold={} avg={} cutoff={} returned={} total={}",
                userId, watchlistId, key, percentageThreshold, avg, cutoff,
                matchPage.getNumberOfElements(), matchPage.getTotalElements());

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

    private DealMatchesResponse emptyResponse(String key, int threshold, Pageable pageable) {
        return new DealMatchesResponse(
                key, threshold, 0, 0, 0,
                pageable.getPageNumber(), pageable.getPageSize(), 0, List.of()
        );
    }

    private String normalise(String keyword) {
        if (keyword == null) return null;
        return keyword.trim().toLowerCase();
    }
}
