package com.findadeal.listing;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.List;

public interface ListingRepository extends JpaRepository<Listing, Long> {

    Page<Listing> findByTitleContainingIgnoreCase(String keyword, Pageable pageable);

    Page<Listing> findByTitleContainingIgnoreCaseAndPriceLessThanEqual(
            String keyword,
            BigDecimal cutoff,
            Pageable pageable
    );

    List<Listing> findBySourceAndExternalIdIn(String source, Collection<String> externalIds);

    @Query("""
           select avg(l.price)
           from Listing l
           where lower(l.title) like lower(concat('%', :keyword, '%'))
           """)
    Double findAveragePriceByKeyword(String keyword);
}
