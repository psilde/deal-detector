# Backend

Spring Boot backend for a deal matcher app that interacts with marketplaces to find percentage-based deals.
Supports JWT authentication, watchlist items, deal matching, pagination and uses Swagger/OpenAPI to allow for easy tests

## Tech Stack
- Java 21
- Spring Boot (3 different environment profiles: 'dev', 'prod', 'test')
- Spring Security + JWT Auth
- PostgreSQL (used in prod profile) (Docker Compose)
- Flyway Migration
- Spring Data JPA
- OpenAPI
- Maven

## API Documentation
- Swagger: 'http://localhost:8080/swagger-ui/index.html'
- OpenAPI: 'http://localhost:8080/v3/api-docs"

Authentication Guide:
1. Register or Login to obtain a JWT (token)
2. Click Authorise in Swagger
3. Paste the token you got from logging in to authorise and use protected endpoints

## Local Development
### Prerequisites
- Java 21
- Maven

### How to run the dev environment 
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

The dev profile uses defaults, and uses H2 database locally; you can access the console at
http://localhost:8080/h2-console

## Local Production
### Prerequisites
- Java 21
- Docker/Docker Compose

1) Starting Postgres 
```bash
(docker compose up -d)
```
2) Set local.properties variables - create a local.properties file in the project root
3) Build App
```bash
./mvnw clean package
```
4) Run the app using: 
```
java -jar target/findadeal-*.jar
```
5) Verify successful boot

### Example (local.properties)
spring.profiles.active=prod

spring.datasource.url=jdbc:postgresql://localhost:5438/findadeal_v2
spring.datasource.username=findadeal_user
spring.datasource.password=findadeal_pass

app.jwt.secret=secret
app.jwt.expiration-minutes=60


## Migrations
- Migrations are in src/main/resources/db/migration
- On startup (prod). Flyway automatically applies and validates migrations.
- JPA configured to ensure schema matches entities

## Common Endpoints
- POST /auth/register
- POST /auth/login
- GET/POST/PUT/DELETE /watchlists
- GET /watchlists/{id}/matches (runs algorithm to check watchlist listings)

## Quick Start (Prod)
```bash
docker compose up -d
./mvnw clean package
java -jar target/findadeal-*.jar
```