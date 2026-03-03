package com.findadeal;

import com.findadeal.model.Listing;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class ListGenerator {

    public static void main(String[] args) throws Exception {

        Random random = new Random();

        List<String> baseTitles = List.of(
                "RTX 4090 24GB",
                "RTX 4080 SUPER 16GB",
                "RTX 4070 SUPER Dual OC 16GB",
                "Ryzen 7 7800X3D",
                "iPhone 15 Pro 256GB",
                "PlayStation 5",
                "iPhone 15 Pro Max 256GB",
                "Nissan GT-R 2022",
                "BMW M2 Competition"
        );

        int target = 10000;
        List<Listing> listings = new ArrayList<>(target);

        for (int i = 1; i <= target; i++) {

            String titleBase = baseTitles.get(random.nextInt(baseTitles.size()));

            double minPrice;
            double maxPrice;

            String t = titleBase.toLowerCase();

            if (t.contains("rtx")) {
                minPrice = 800;
                maxPrice = 4200;
            }
            else if (t.contains("ryzen")) {
                minPrice = 250;
                maxPrice = 1200;
            }
            else if (t.contains("iphone")) {
                minPrice = 700;
                maxPrice = 2500;
            }
            else if (t.contains("playstation 5") || t.contains("ps5")) {
                minPrice = 300;
                maxPrice = 700;
            }
            else {
                minPrice = 60000;
                maxPrice = 95000;
            }

            double basePrice = minPrice + (maxPrice - minPrice) * random.nextDouble();

            double variance = 0.90 + (0.20) * random.nextDouble();
            double finalPrice = Math.round(basePrice * variance * 100.0) / 100.0;

            Listing listing = new Listing();
            listing.setTitle(titleBase);
            listing.setPrice(finalPrice);
            listing.setUrl("https://example.com/listing/" + i);

            listings.add(listing);
        }

        ObjectMapper mapper = new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT);

        Path outputPath = Path.of("src/main/resources/listings.json");
        mapper.writeValue(outputPath.toFile(), listings);

        System.out.println("Generated " + target + " listings with category price ranges -> " + outputPath);
    }
}
