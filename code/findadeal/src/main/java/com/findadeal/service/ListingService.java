package com.findadeal.service;

import com.findadeal.dto.ListingResponse;
import com.findadeal.model.Listing;
import com.findadeal.repository.ListingRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ListingService {
    private final ListingRepository listingRepository;

    public ListingService(ListingRepository listingRepository){
        this.listingRepository = listingRepository;
    }

    public Page<ListingResponse> getListings(String keyword, Pageable pageable) {
        Page<Listing> page;
        if (keyword == null || keyword.isBlank()){
            page = listingRepository.findAll(pageable);
        } else {
            page = listingRepository.findByTitleContainingIgnoreCase(keyword, pageable);
        }


        return page.map(this::toResponse);
    }

    private ListingResponse toResponse(Listing listing){
        return new ListingResponse(
                listing.getId(),
                listing.getTitle(),
                listing.getPrice(),
                listing.getLocation(),
                listing.getUrl()
        );
    }
}
