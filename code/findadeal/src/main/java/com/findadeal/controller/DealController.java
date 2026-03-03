package com.findadeal.controller;

import com.findadeal.dto.DealMatchesResponse;
import com.findadeal.model.Watchlist;
import com.findadeal.service.DealMatchingService;
import com.findadeal.service.WatchlistService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.web.bind.annotation.*;

@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/watchlists")
public class DealController {

    private final WatchlistService watchlistService;
    private final DealMatchingService dealMatchingService;

    public DealController(
            WatchlistService watchlistService,
            DealMatchingService dealMatchingService
    ) {
        this.watchlistService = watchlistService;
        this.dealMatchingService = dealMatchingService;
    }

    @GetMapping("/{id}/matches")
    public DealMatchesResponse getMatches(@PathVariable Long id) {
        Watchlist watchlist = watchlistService.getOwnedEntity(id);

        return dealMatchingService.findMatches(
                watchlist.getUser().getId(),
                watchlist.getId(),
                watchlist.getKeyword(),
                watchlist.getPercentageThreshold()
        );
    }
}
