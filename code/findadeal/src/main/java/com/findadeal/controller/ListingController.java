package com.findadeal.controller;

import com.findadeal.dto.ListingResponse;
import com.findadeal.model.Listing;
import com.findadeal.service.ListingService;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/listings")
public class ListingController {


    private final ListingService listingService;
    public ListingController(ListingService listingService){
        this.listingService = listingService;
    }
    @GetMapping
    public Page<ListingResponse> getListings(
            @ParameterObject
            @PageableDefault(size = 20) Pageable pageable
    ){

        return listingService.getListings(pageable);
    }

}
