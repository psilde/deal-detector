package com.findadeal.controller;

import com.findadeal.dto.WatchlistCreateRequest;
import com.findadeal.dto.WatchlistResponse;
import com.findadeal.dto.WatchlistUpdateRequest;
import com.findadeal.service.WatchlistService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

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

    /**
     * example: /watchlists?page=0&size=10&sort=createdAt&dir=desc
     */
    @GetMapping
    public Page<WatchlistResponse> getMine(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String dir
    ) {
        Sort.Direction direction =
                "asc".equalsIgnoreCase(dir) ? Sort.Direction.ASC : Sort.Direction.DESC;

        PageRequest pageable = PageRequest.of(page, size, Sort.by(direction, sort));
        return watchlistService.getMine(pageable);
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
