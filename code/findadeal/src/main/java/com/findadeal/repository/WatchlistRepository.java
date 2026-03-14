package com.findadeal.repository;

import com.findadeal.model.Watchlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WatchlistRepository extends JpaRepository<Watchlist, Long> {

    List<Watchlist> findAllByUserId(Long userId);
    Optional<Watchlist> findByIdAndUserId(Long id, Long userId);
}