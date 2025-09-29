# Weather Forecasting Backend

This is the backend component of the Weather Forecasting Application, built with Spring Boot.

## Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- H2 Database (embedded, no additional setup required)

## Installation

1. Navigate to the project root directory.
2. Run `mvn clean install` to build the project and install dependencies.

## Running the Application

1. Run `mvn spring-boot:run` to start the Spring Boot application.
2. The backend will be available at `http://localhost:8081`.

## API Endpoints

- Authentication: `/api/auth/login`, `/api/auth/register`
- Weather: `/api/weather/current`, `/api/weather/forecast`
- Favorites: `/api/favorites`

## Configuration

Configuration files are located in `src/main/resources/application.properties`.

## Testing

Run tests with `mvn test`.