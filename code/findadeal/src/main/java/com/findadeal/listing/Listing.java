package com.findadeal.listing;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "listings")
public class Listing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 50)
    private String source;

    @Column(name = "external_id", length = 200)
    private String externalId;

    @Column(nullable = false, length = 300)
    private String title;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(length = 10)
    private String currency;

    @Column(length = 200)
    private String location;

    @Column(columnDefinition = "TEXT")
    private String url;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    @Column(name = "source_category", length = 100)
    private String sourceCategory;

    @Column(name = "source_city", length = 100)
    private String sourceCity;

    @Column(name = "scraped_at")
    private OffsetDateTime scrapedAt;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false,
            columnDefinition = "TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP")
    private OffsetDateTime firstSeen;

    @Column(name = "last_seen")
    private OffsetDateTime lastSeen;

    public Listing() {}

    public Long getId() { return id; }
    public String getSource() { return source; }
    public String getExternalId() { return externalId; }
    public String getTitle() { return title; }
    public BigDecimal getPrice() { return price; }
    public String getCurrency() { return currency; }
    public String getLocation() { return location; }
    public String getUrl() { return url; }
    public String getImageUrl() { return imageUrl; }
    public String getSourceCategory() { return sourceCategory; }
    public String getSourceCity() { return sourceCity; }
    public OffsetDateTime getScrapedAt() { return scrapedAt; }
    public OffsetDateTime getFirstSeen() { return firstSeen; }
    public OffsetDateTime getLastSeen() { return lastSeen; }

    public void setSource(String source) { this.source = source; }
    public void setExternalId(String externalId) { this.externalId = externalId; }
    public void setTitle(String title) { this.title = title; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public void setCurrency(String currency) { this.currency = currency; }
    public void setLocation(String location) { this.location = location; }
    public void setUrl(String url) { this.url = url; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public void setSourceCategory(String sourceCategory) { this.sourceCategory = sourceCategory; }
    public void setSourceCity(String sourceCity) { this.sourceCity = sourceCity; }
    public void setScrapedAt(OffsetDateTime scrapedAt) { this.scrapedAt = scrapedAt; }
    public void setLastSeen(OffsetDateTime lastSeen) { this.lastSeen = lastSeen; }
}
