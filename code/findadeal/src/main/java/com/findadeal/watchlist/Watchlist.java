package com.findadeal.watchlist;

import com.findadeal.user.User;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "watchlists")
public class Watchlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //watchlist owner
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 120)
    private String keyword;

    @Column(nullable = false)
    private int percentageThreshold;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    protected Watchlist() { }

    public Watchlist(User user, String keyword, int percentageThreshold) {
        if (percentageThreshold < 1 || percentageThreshold > 90) {
            throw new IllegalArgumentException("percentageThreshold out of range");
        }

        if (keyword == null || keyword.isBlank()) {
            throw new IllegalArgumentException("keyword must not be blank");
        }
        this.user = user;
        this.keyword = keyword;
        this.percentageThreshold = percentageThreshold;
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public String getKeyword() { return keyword; }
    public int getPercentageThreshold() { return percentageThreshold; }
    public Instant getCreatedAt() { return createdAt; }

    public void update(String keyword, int percentageThreshold) {
        if (keyword == null || keyword.isBlank()) {
            throw new IllegalArgumentException("keyword must not be blank");
        }
        this.keyword = keyword;
        this.percentageThreshold = percentageThreshold;
    }
}
