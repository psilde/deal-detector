package com.findadeal.repository;

import com.findadeal.model.Listing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface ListingRepository extends JpaRepository<Listing, Long> {

    List<Listing> findByTitleContainingIgnoreCase(String keyword);

    List<Listing> findByTitleContainingIgnoreCaseAndPriceLessThanEqualOrderByPriceAsc(
            String keyword,
            BigDecimal cutoff
    );

    @Query("""
           select avg(l.price)
           from Listing l
           where lower(l.title) like lower(concat('%', :keyword, '%'))
           """)
    Double findAveragePriceByKeyword(String keyword);
}
