package com.findadeal.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.findadeal.dto.ListingItemShape;
import com.findadeal.model.Listing;
import com.findadeal.repository.ListingRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.List;

@Component
public class ListingDataSeeder implements CommandLineRunner {

    private final ListingRepository listingRepository;
    private final ObjectMapper objectMapper;

    public ListingDataSeeder(ListingRepository listingRepository, ObjectMapper objectMapper) {
        this.listingRepository = listingRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public void run(String... args) throws Exception {
        if (listingRepository.count() != 0) return;

        try (InputStream is = new ClassPathResource("listings.json").getInputStream()) {
            List<ListingItemShape> items = objectMapper.readValue(is, new TypeReference<>() {});
            listingRepository.saveAll(
                    items.stream().map(i -> new Listing(i.getTitle(), i.getPrice(), i.getUrl())).toList()
            );
        }
    }
}