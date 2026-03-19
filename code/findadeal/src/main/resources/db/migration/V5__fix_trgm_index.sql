-- index must match the LOWER(title) expression used in queries
DROP INDEX IF EXISTS idx_listings_title_trgm;

CREATE INDEX idx_listings_title_lower_trgm
    ON listings USING gin (LOWER(title) gin_trgm_ops);
