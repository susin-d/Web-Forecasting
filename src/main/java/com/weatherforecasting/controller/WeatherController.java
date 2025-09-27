package com.weatherforecasting.controller;

import com.weatherforecasting.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    private final GeocodingService geocodingService;
    private final WeatherService weatherService;

    public WeatherController(GeocodingService geocodingService, WeatherService weatherService) {
        this.geocodingService = geocodingService;
        this.weatherService = weatherService;
    }

    @GetMapping
    public ResponseEntity<?> getWeather(@RequestParam String location) {
        try {
            // Geocode the location
            List<GeocodingResult> results = geocodingService.searchLocations(location);
            if (results.isEmpty()) {
                return ResponseEntity.badRequest().body("Location not found: " + location);
            }
            GeocodingResult geoResult = results.get(0);
            double lat = geoResult.latitude();
            double lon = geoResult.longitude();
            String locationName = geoResult.country() != null ?
                geoResult.name() + ", " + geoResult.country() : geoResult.name();

            // Get weather data
            WeatherData weatherData = weatherService.getWeatherData(lat, lon);

            // Convert to frontend format
            FrontendWeatherData frontendData = convertToFrontendFormat(weatherData, locationName, lat, lon);

            return ResponseEntity.ok(frontendData);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to fetch weather data: " + e.getMessage());
        }
    }

    private FrontendWeatherData convertToFrontendFormat(WeatherData data, String location, double lat, double lon) {
        // Convert current weather
        FrontendCurrentWeather current = new FrontendCurrentWeather(
            (int) Math.round(data.current().temperature()),
            (int) Math.round(data.current().temperature()), // approximate apparent temp
            50, // approximate humidity
            (int) Math.round(data.current().windspeed()),
            getWeatherDescription(data.current().weathercode()),
            mapWmoCodeToIcon(data.current().weathercode(), data.current().isDay())
        );

        // Convert hourly (take next 6 hours)
        List<FrontendHourlyForecastItem> hourly = data.hourly().stream()
            .limit(6)
            .map(h -> {
                LocalDateTime dateTime = LocalDateTime.parse(h.time(), DateTimeFormatter.ISO_LOCAL_DATE_TIME);
                String time = dateTime.format(DateTimeFormatter.ofPattern("h a"));
                return new FrontendHourlyForecastItem(
                    time,
                    (int) Math.round(h.temperature()),
                    mapWmoCodeToIcon(h.weathercode(), 1) // Assume day for simplicity
                );
            })
            .collect(Collectors.toList());

        // Convert daily
        List<FrontendDailyForecastItem> daily = data.daily().stream()
            .limit(7)
            .map(d -> {
                LocalDateTime dateTime = LocalDateTime.parse(d.date() + "T00:00:00", DateTimeFormatter.ISO_LOCAL_DATE_TIME);
                String day = dateTime.format(DateTimeFormatter.ofPattern("EEE"));
                return new FrontendDailyForecastItem(
                    day,
                    (int) Math.round(d.maxTemp()),
                    (int) Math.round(d.minTemp()),
                    0, // precipitation not available
                    mapWmoCodeToIcon(d.weathercode(), 1)
                );
            })
            .collect(Collectors.toList());

        // Convert alerts
        List<FrontendWeatherAlert> alerts = data.alerts().stream()
            .map(a -> new FrontendWeatherAlert("Weather Alert", "moderate", a))
            .collect(Collectors.toList());

        return new FrontendWeatherData(location, lat, lon, current, hourly, daily, alerts);
    }

    private String getWeatherDescription(int code) {
        switch (code) {
            case 0: return "Clear sky";
            case 1: return "Mainly clear";
            case 2: return "Partly cloudy";
            case 3: return "Overcast";
            case 45: case 48: return "Fog";
            case 51: case 53: case 55: return "Drizzle";
            case 61: case 63: case 65: return "Rain";
            case 71: case 73: case 75: return "Snow";
            case 80: case 81: case 82: return "Rain showers";
            case 85: case 86: return "Snow showers";
            case 95: case 96: case 99: return "Thunderstorm";
            default: return "Unknown";
        }
    }

    private String mapWmoCodeToIcon(int code, int isDay) {
        switch (code) {
            case 0: return isDay == 1 ? "fa-sun" : "fa-moon";
            case 1: return isDay == 1 ? "fa-cloud-sun" : "fa-cloud-moon";
            case 2: case 3: return "fa-cloud";
            case 45: case 48: return "fa-smog";
            case 51: case 53: case 55: case 61: case 63: case 65: case 80: case 81: case 82: return "fa-cloud-rain";
            case 71: case 73: case 75: case 85: case 86: return "fa-snowflake";
            case 95: case 96: case 99: return "fa-cloud-bolt";
            default: return "fa-question-circle";
        }
    }

    // Frontend-compatible record classes
    public record FrontendCurrentWeather(
        int temperature,
        int apparentTemperature,
        int humidity,
        int windSpeed,
        String description,
        String icon
    ) {}

    public record FrontendHourlyForecastItem(
        String time,
        int temp,
        String icon
    ) {}

    public record FrontendDailyForecastItem(
        String day,
        int tempMax,
        int tempMin,
        int precipitation,
        String icon
    ) {}

    public record FrontendWeatherAlert(
        String title,
        String severity,
        String description
    ) {}

    public record FrontendWeatherData(
        String location,
        double latitude,
        double longitude,
        FrontendCurrentWeather current,
        List<FrontendHourlyForecastItem> hourly,
        List<FrontendDailyForecastItem> daily,
        List<FrontendWeatherAlert> alerts
    ) {}
}