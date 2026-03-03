# FindADeal (Deal Matcher)

A deal-matcher project for tracking marketplace listings and finding percentage-based deals.

As of now the backend is the main implemented part of the project and lives in `code/findadeal` with a planned implementation for a front-end service.
This README is for the repository front page, while the backend-specific README resides in `code/findadeal/README.md`.

## Project Structure
- `code/findadeal` — Spring Boot backend (API, auth, watchlists, deal matching)

## Backend Tech Stack
- Java 21
- Spring Boot (profiles: `dev`, `prod`, `test`)
- Spring Security + JWT auth
- PostgreSQL (prod, via Docker Compose)
- Flyway migrations
- Spring Data JPA
- OpenAPI / Swagger
- Maven
