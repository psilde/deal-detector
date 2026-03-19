CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- allows LOWER(username) = ? lookups to use an index
CREATE INDEX IF NOT EXISTS idx_users_username_lower
    ON users (LOWER(username));

CREATE INDEX IF NOT EXISTS idx_listings_title_trgm
    ON listings USING gin (title gin_trgm_ops);
