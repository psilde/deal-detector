package com.findadeal.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.findadeal.exception.BadRequestException;
import com.findadeal.model.Listing;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.Collections;
import java.util.List;

@Service
public class ListingDataService {
    private static final Logger log = LoggerFactory.getLogger(ListingDataService.class);
    private final ObjectMapper objectMapper;
    private List<Listing> cached = Collections.emptyList();

    public ListingDataService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.cached = loadFromJson(); // load once on startup
    }

    public List<Listing> getAllListings() {
        return cached;
    }

    private List<Listing> loadFromJson() {
        try (InputStream is = new ClassPathResource("listings.json").getInputStream()) {
            log.info("Read from listings.json");
            return objectMapper.readValue(is, new TypeReference<List<Listing>>() {});
        } catch (Exception e) {
            throw new BadRequestException("Failed to load listings.json");
        }
    }
}
