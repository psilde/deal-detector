package com.findadeal.repository;

import com.findadeal.model.Watchlist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WatchlistRepository extends JpaRepository<Watchlist, Long> {

    Page<Watchlist> findAllByUserId(Long userId, Pageable pageable);
    Optional<Watchlist> findByIdAndUserId(Long id, Long userId);
}
