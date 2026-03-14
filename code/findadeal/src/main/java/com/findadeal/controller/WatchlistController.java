package com.findadeal.controller;

import com.findadeal.dto.WatchlistCreateRequest;
import com.findadeal.dto.WatchlistResponse;
import com.findadeal.dto.WatchlistUpdateRequest;
import com.findadeal.service.WatchlistService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/watchlists")
public class WatchlistController {

    private final WatchlistService watchlistService;

    public WatchlistController(WatchlistService watchlistService) {
        this.watchlistService = watchlistService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public WatchlistResponse create(@Valid @RequestBody WatchlistCreateRequest req) {
        return watchlistService.create(req);
    }

    @GetMapping
    public List<WatchlistResponse> getMine() {
        return watchlistService.getMine();
    }

    @PutMapping("/{id}")
    public WatchlistResponse update(
            @PathVariable Long id,
            @Valid @RequestBody WatchlistUpdateRequest req
    ) {
        return watchlistService.update(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        watchlistService.delete(id);
    }
}