-- V1__init.sql

CREATE TABLE IF NOT EXISTS users (
                                     id BIGSERIAL PRIMARY KEY,
                                     username VARCHAR(30) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL
    );

-- Unique creates an index automatically, but explicit is fine too
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

CREATE TABLE IF NOT EXISTS watchlists (
                                          id BIGSERIAL PRIMARY KEY,
                                          user_id BIGINT NOT NULL,
                                          keyword VARCHAR(100) NOT NULL,
    percentage_threshold INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_watchlists_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

    CONSTRAINT chk_watchlists_percentage_threshold
    CHECK (percentage_threshold >= 0 AND percentage_threshold <= 100)
    );

CREATE INDEX IF NOT EXISTS idx_watchlists_user_id ON watchlists(user_id);
