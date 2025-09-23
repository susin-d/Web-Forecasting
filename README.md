# Web Forecasting - Thaarini

A weather forecasting web application built with Spring Boot and Vaadin.

## Features

- User authentication and registration
- Weather data retrieval from Open-Meteo API
- Geocoding services for location search
- Favorite locations management
- Weather alerts and preferences
- Responsive web interface with Vaadin

## Technologies Used

- **Backend**: Spring Boot, Spring Security, Spring Data JPA
- **Frontend**: Vaadin Flow
- **Database**: H2 (for development), configurable for production
- **API**: Open-Meteo Weather API, Geocoding API
- **Build Tool**: Maven
- **Containerization**: Docker

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- Docker (optional, for containerized deployment)

## Setup and Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd "Web forecasting - Thaarini"
   ```

2. **Build the project:**
   ```bash
   mvn clean install
   ```

3. **Run the application:**
   ```bash
   mvn spring-boot:run
   ```

   The application will start on `http://localhost:8080`

## Docker Deployment

1. **Build the Docker image:**
   ```bash
   docker build -t weather-forecasting .
   ```

2. **Run with Docker Compose:**
   ```bash
   docker-compose up
   ```

## Configuration

Application properties can be configured in `src/main/resources/application.properties`:

- Database configuration
- API keys (if required)
- Server port
- Security settings

For production, use `application-prod.properties`.

## API Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/weather/current?location={location}` - Current weather
- `GET /api/weather/forecast?location={location}` - Weather forecast
- `GET /api/geocode?query={query}` - Location search

## Testing

Run tests with:
```bash
mvn test
```

## Project Structure

```
src/
├── main/
│   ├── java/com/weatherforecasting/
│   │   ├── config/          # Configuration classes
│   │   ├── controller/      # REST controllers
│   │   ├── model/           # JPA entities
│   │   ├── repository/      # Data repositories
│   │   ├── security/        # Security configuration
│   │   ├── service/         # Business logic
│   │   └── view/            # Vaadin views
│   ├── resources/           # Application properties
│   └── frontend/            # Vaadin frontend resources
└── test/                    # Unit and integration tests
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.