# deal-detector

> Backend engine for identifying underpriced marketplace listings.

`deal-detector` is a Spring Boot backend that analyses large volumes of marketplace listings to
identify potential deals using pricing baselines, keyword normalisation, and database-level
filtering.

The system processes listing data collected by **deal-scraper**, applying structured queries and
filtering logic to surface listings that may be under market value via watchlists

---

## System Architecture

responsible for analysing listings to detect deals

raw listings -> deal-scraper (collects and normalises data) -> deal-detector (finds deals) -> found deals

---

## Core Features

- detecting underpriced listings against their market averages
- using queries to filter large datasets efficiently
- authenticated access to API endpoints
- support for user accounts and personal watchlists
- api responses structured using DTO models
- centralised exception handling for consistent API responses

---

## Tech Stack

- **Java**
- **Spring Boot**
- **Spring Security**
- **PostgreSQL**
- **Flyway**
- **Docker**
- **JWT Authentication**

---

## deal-scraper
Listing ingestion:
➡️ https://github.com/psilde/deal-scraper
