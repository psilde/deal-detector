CREATE TABLE IF NOT EXISTS listings (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    location VARCHAR(100),
    url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT non_negative_prices
    CHECK (price >= 0)
    );

CREATE INDEX IF NOT EXISTS idx_listings_price
    ON listings(price);

CREATE INDEX IF NOT EXISTS idx_listings_title
    ON listings(title);