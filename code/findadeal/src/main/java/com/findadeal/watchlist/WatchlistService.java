package com.findadeal.watchlist;

import com.findadeal.watchlist.dto.WatchlistCreateRequest;
import com.findadeal.watchlist.dto.WatchlistResponse;
import com.findadeal.watchlist.dto.WatchlistUpdateRequest;
import com.findadeal.common.exception.NotFoundException;
import com.findadeal.user.CurrentUserService;
import com.findadeal.user.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class WatchlistService {

    private static final Logger log = LoggerFactory.getLogger(WatchlistService.class);

    private final WatchlistRepository watchlistRepository;
    private final CurrentUserService currentUserService;

    public WatchlistService(WatchlistRepository watchlistRepository, CurrentUserService currentUserService) {
        this.watchlistRepository = watchlistRepository;
        this.currentUserService = currentUserService;
    }

    private String normaliseKeyword(String keyword) {
        if (keyword == null) return null;
        return keyword.trim().toLowerCase();
    }

    @Transactional
    public WatchlistResponse create(WatchlistCreateRequest req) {
        User user = currentUserService.getCurrentUser();

        String keyword = normaliseKeyword(req.keyword());
        Watchlist w = new Watchlist(user, keyword, req.percentageThreshold());
        Watchlist saved = watchlistRepository.save(w);

        log.info("watchlist.create userId={} watchlistId={} keyword={} threshold={}",
                user.getId(), saved.getId(), saved.getKeyword(), saved.getPercentageThreshold());

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public Page<WatchlistResponse> getMine(Pageable pageable) {
        User user = currentUserService.getCurrentUser();

        Page<WatchlistResponse> watchlists = watchlistRepository
                .findAllByUserId(user.getId(), pageable)
                .map(this::toResponse);

        log.info("watchlist.list userId={} page={} size={} returned={}",
                user.getId(), pageable.getPageNumber(), pageable.getPageSize(),
                watchlists.getNumberOfElements());

        return watchlists;
    }

    @Transactional
    public WatchlistResponse update(Long id, WatchlistUpdateRequest req) {
        User user = currentUserService.getCurrentUser();

        Watchlist w = getOwnedEntity(id);

        String keyword = normaliseKeyword(req.keyword());
        w.update(keyword, req.percentageThreshold());

        log.info("watchlist.update userId={} watchlistId={} keyword={} threshold={}",
                user.getId(), w.getId(), w.getKeyword(), w.getPercentageThreshold());

        return toResponse(w);
    }

    @Transactional
    public void delete(Long id) {
        User user = currentUserService.getCurrentUser();

        Watchlist w = getOwnedEntity(id);
        watchlistRepository.delete(w);

        log.info("watchlist.delete userId={} watchlistId={}", user.getId(), id);
    }

    @Transactional(readOnly = true)
    public Watchlist getOwnedEntity(Long id) {
        Long userId = currentUserService.getCurrentUser().getId();

        return watchlistRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new NotFoundException("Watchlist not found"));
    }

    private WatchlistResponse toResponse(Watchlist w) {
        return new WatchlistResponse(w.getId(), w.getKeyword(), w.getPercentageThreshold(), w.getCreatedAt());
    }
}