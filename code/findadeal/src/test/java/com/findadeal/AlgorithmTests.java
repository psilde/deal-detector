package com.findadeal;

import com.findadeal.dto.DealMatchesResponse;
import com.findadeal.exception.BadRequestException;
import com.findadeal.model.Listing;
import com.findadeal.repository.ListingRepository;
import com.findadeal.service.DealMatchingService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AlgorithmTests {

    @Mock
    private ListingRepository listingRepository;

    @InjectMocks
    private DealMatchingService dealMatchingService;

    @Test
    void sortedMatchesBelowCutoff() {
        when(listingRepository.findAll()).thenReturn(List.of(
                new Listing("RTX 4070", new BigDecimal("1000.00"), "https://example.com/a"),
                new Listing("RTX 4070", new BigDecimal("900.00"), "https://example.com/b"),
                new Listing("RTX 4070 C", new BigDecimal("700.00"), "https://example.com/c"),
                new Listing("Random Item", new BigDecimal("50.00"), "https://example.com/d")
        ));

        DealMatchesResponse response = dealMatchingService.findMatches(1L, 2L, "  RTX 4070  ", 10);

        assertEquals("rtx 4070", response.keyword());
        assertEquals(10, response.percentageThreshold());
        assertEquals(866.6666666666666, response.averagePrice());
        assertEquals(780.0, response.cutoffPrice());
        assertEquals(1, response.matchCount());
        assertEquals("RTX 4070 C", response.matches().getFirst().getTitle());
    }

    @Test
    void emptyNoKeywordMatches() {
        when(listingRepository.findAll()).thenReturn(List.of(
                new Listing("Ryzen 7 7800X3D", new BigDecimal("699.00"), "https://example.com/a")
        ));

        DealMatchesResponse response = dealMatchingService.findMatches(1L, 2L, "rtx", 20);

        assertEquals("rtx", response.keyword());
        assertEquals(20, response.percentageThreshold());
        assertEquals(0, response.matchCount());
        assertEquals(0.0, response.averagePrice());
        assertEquals(0.0, response.cutoffPrice());
        assertEquals(List.of(), response.matches());
    }

    @Test
    void keywordBlank() {
        assertThrows(BadRequestException.class,
                () -> dealMatchingService.findMatches(1L, 2L, "   ", 10));
    }

    @Test
    void thresholdOutsideRange() {
        assertThrows(BadRequestException.class,
                () -> dealMatchingService.findMatches(1L, 2L, "gpu", 0));

        assertThrows(BadRequestException.class,
                () -> dealMatchingService.findMatches(1L, 2L, "gpu", 101));
    }
}