package com.findadeal.deal;

import com.findadeal.deal.dto.DealMatchesResponse;
import com.findadeal.watchlist.Watchlist;
import com.findadeal.watchlist.WatchlistService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
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
    public DealMatchesResponse getMatches(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size)
    {
        Watchlist watchlist = watchlistService.getOwnedEntity(id);

        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "price"));

        return dealMatchingService.findMatches(
                watchlist.getUser().getId(),
                watchlist.getId(),
                watchlist.getKeyword(),
                watchlist.getPercentageThreshold(),
                pageable
        );
    }
}