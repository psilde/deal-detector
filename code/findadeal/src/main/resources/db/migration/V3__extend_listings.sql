ALTER TABLE listings ALTER COLUMN title TYPE VARCHAR(300);
ALTER TABLE listings ALTER COLUMN location TYPE VARCHAR(200);

ALTER TABLE listings
    ADD COLUMN source          VARCHAR(50),
    ADD COLUMN external_id     VARCHAR(200),
    ADD COLUMN image_url       TEXT,
    ADD COLUMN currency        VARCHAR(10) NOT NULL DEFAULT 'AUD',
    ADD COLUMN source_category VARCHAR(100),
    ADD COLUMN source_city     VARCHAR(100),
    ADD COLUMN scraped_at      TIMESTAMPTZ,
    ADD COLUMN last_seen       TIMESTAMPTZ;

-- partial unique index: only enforce uniqueness when both columns are non-null
CREATE UNIQUE INDEX idx_listings_source_external_id
    ON listings (source, external_id)
    WHERE source IS NOT NULL AND external_id IS NOT NULL;

CREATE INDEX idx_listings_source ON listings (source);
CREATE INDEX idx_listings_last_seen ON listings (last_seen);
