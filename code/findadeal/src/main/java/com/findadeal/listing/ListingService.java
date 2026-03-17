package com.findadeal.listing;

import com.findadeal.listing.dto.ListingResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ListingService {

    private final ListingRepository listingRepository;

    public ListingService(ListingRepository listingRepository) {
        this.listingRepository = listingRepository;
    }

    @Transactional(readOnly = true)
    public Page<ListingResponse> getListings(String keyword, Pageable pageable) {
        if (keyword == null || keyword.isBlank()) {
            return listingRepository.findAll(pageable).map(ListingResponse::from);
        }
        return listingRepository.findByTitleContainingIgnoreCase(keyword.trim(), pageable)
                .map(ListingResponse::from);
    }
}
