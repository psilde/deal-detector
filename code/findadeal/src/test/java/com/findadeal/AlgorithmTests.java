package com.findadeal;

import com.findadeal.deal.dto.DealMatchesResponse;
import com.findadeal.common.exception.BadRequestException;
import com.findadeal.listing.Listing;
import com.findadeal.listing.ListingRepository;
import com.findadeal.deal.DealMatchingService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AlgorithmTests {

    @Mock
    private ListingRepository listingRepository;

    @InjectMocks
    private DealMatchingService dealMatchingService;

    @Test
    void sortedMatchesBelowCutoff() {
        Pageable pageable = PageRequest.of(0, 20);

        when(listingRepository.findAveragePriceByKeyword("rtx 4070"))
                .thenReturn(866.6666666666666);

        Listing listing = new Listing();
        listing.setTitle("RTX 4070 C");
        listing.setPrice(new BigDecimal("700.00"));
        listing.setUrl("https://example.com/c");

        when(listingRepository.findByTitleContainingIgnoreCaseAndPriceLessThanEqual(
                eq("rtx 4070"),
                eq(BigDecimal.valueOf(780.0)),
                eq(pageable)
        )).thenReturn(new PageImpl<>(List.of(listing), pageable, 1));

        DealMatchesResponse response =
                dealMatchingService.findMatches(1L, 2L, "  RTX 4070  ", 10, pageable);

        assertEquals("rtx 4070", response.keyword());
        assertEquals(10, response.percentageThreshold());
        assertEquals(866.6666666666666, response.averagePrice());
        assertEquals(780.0, response.cutoffPrice());
        assertEquals(1, response.totalMatchCount());
        assertEquals(0, response.page());
        assertEquals(20, response.size());
        assertEquals(1, response.totalPages());
        assertEquals("RTX 4070 C", response.matches().get(0).title());
    }

    @Test
    void emptyNoKeywordMatches() {
        Pageable pageable = PageRequest.of(0, 20);

        when(listingRepository.findAveragePriceByKeyword("rtx"))
                .thenReturn(null);

        DealMatchesResponse response =
                dealMatchingService.findMatches(1L, 2L, "rtx", 20, pageable);

        assertEquals("rtx", response.keyword());
        assertEquals(20, response.percentageThreshold());
        assertEquals(0L, response.totalMatchCount());
        assertEquals(0.0, response.averagePrice());
        assertEquals(0.0, response.cutoffPrice());
        assertEquals(0, response.page());
        assertEquals(20, response.size());
        assertEquals(0, response.totalPages());
        assertEquals(List.of(), response.matches());
    }

    @Test
    void keywordBlank() {
        Pageable pageable = PageRequest.of(0, 20);

        assertThrows(BadRequestException.class,
                () -> dealMatchingService.findMatches(1L, 2L, "   ", 10, pageable));
    }

    @Test
    void thresholdOutsideRange() {
        Pageable pageable = PageRequest.of(0, 20);

        assertThrows(BadRequestException.class,
                () -> dealMatchingService.findMatches(1L, 2L, "gpu", 0, pageable));

        assertThrows(BadRequestException.class,
                () -> dealMatchingService.findMatches(1L, 2L, "gpu", 91, pageable));
    }
}
