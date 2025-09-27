package com.weatherforecasting.service;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class WeatherService {

    private static final Logger logger = LoggerFactory.getLogger(WeatherService.class);

    private final WebClient webClient;

    public WeatherService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://api.open-meteo.com").build();
    }

    @Cacheable("weather")
    public WeatherData getWeatherData(double latitude, double longitude) {
        try {
            OpenMeteoResponse response = fetchFromApi(latitude, longitude);
            List<WeatherHour> hours = processHourly(response.hourly());
            List<WeatherDay> days = processDaily(response.daily());
            CurrentWeather current = new CurrentWeather(
                response.currentWeather().temperature(),
                response.currentWeather().windspeed(),
                response.currentWeather().winddirection(),
                response.currentWeather().weathercode(),
                response.currentWeather().time(),
                response.currentWeather().isDay()
            );
            List<String> alerts = checkAlerts(hours, current);
            return new WeatherData(current, hours, days, alerts);
        } catch (Exception e) {
            logger.warn("Failed to fetch weather data from API for lat={}, lon={}. Falling back to demo data. Error: {}", latitude, longitude, e.getMessage());
            return getDemoWeatherData(latitude, longitude);
        }
    }

    private OpenMeteoResponse fetchFromApi(double latitude, double longitude) {
        String url = "/v1/forecast?latitude=" + latitude + "&longitude=" + longitude +
                      "&hourly=temperature_2m,relativehumidity_2m,windspeed_10m,precipitation,weathercode" +
                      "&daily=temperature_2m_max,temperature_2m_min,weathercode&current_weather=true&timezone=auto";
        String fullUrl = "https://api.open-meteo.com" + url;
        logger.info("Fetching weather data from URL: {}", fullUrl);
        try {
            OpenMeteoResponse response = webClient.get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(OpenMeteoResponse.class)
                    .block();
            logger.info("Successfully fetched and parsed weather data for lat={}, lon={}. Response current_weather: {}", latitude, longitude, response.currentWeather());
            return response;
        } catch (Exception e) {
            logger.error("Failed to fetch weather data for lat={}, lon={}. Error type: {}, Message: {}", latitude, longitude, e.getClass().getSimpleName(), e.getMessage());
            if (e.getCause() != null) {
                logger.error("Cause: {}", e.getCause().getMessage());
            }
            throw new WeatherApiException("Failed to fetch weather data", e);
        }
    }

    private List<WeatherHour> processHourly(HourlyData hourly) {
        List<WeatherHour> list = new ArrayList<>();
        for (int i = 0; i < hourly.time().size(); i++) {
            list.add(new WeatherHour(
                hourly.time().get(i),
                hourly.temperature2m().get(i),
                hourly.relativehumidity2m().get(i),
                hourly.windspeed10m().get(i),
                hourly.precipitation().get(i),
                hourly.weathercode().get(i)
            ));
        }
        return list;
    }

    private List<WeatherDay> processDaily(DailyData daily) {
        List<WeatherDay> list = new ArrayList<>();
        for (int i = 0; i < daily.time().size(); i++) {
            list.add(new WeatherDay(
                daily.time().get(i),
                daily.temperature2mMax().get(i),
                daily.temperature2mMin().get(i),
                daily.weathercode().get(i)
            ));
        }
        return list;
    }

    private List<String> checkAlerts(List<WeatherHour> hours, CurrentWeather current) {
        List<String> alerts = new ArrayList<>();
        if (current.windspeed() > 20) {
            alerts.add("High wind speed: " + current.windspeed() + " m/s");
        }
        for (WeatherHour hour : hours) {
            if (hour.precipitation() > 10) {
                alerts.add("High precipitation at " + hour.time() + ": " + hour.precipitation() + " mm");
            }
            if (hour.windspeed() > 20) {
                alerts.add("High wind speed at " + hour.time() + ": " + hour.windspeed() + " m/s");
            }
        }
        return alerts;
    }

    private WeatherData getDemoWeatherData(double latitude, double longitude) {
        logger.info("Returning demo weather data for lat={}, lon={}", latitude, longitude);
        // Demo current weather
        CurrentWeather current = new CurrentWeather(22.0, 5.0, 180.0, 1, "2023-10-01T12:00", 1);

        // Demo hourly data (next 6 hours)
        List<WeatherHour> hours = new ArrayList<>();
        for (int i = 0; i < 6; i++) {
            hours.add(new WeatherHour(
                "2023-10-01T" + String.format("%02d", 12 + i) + ":00",
                22.0 + i * 0.5,
                60.0,
                5.0,
                0.0,
                1
            ));
        }

        // Demo daily data (next 7 days)
        List<WeatherDay> days = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            days.add(new WeatherDay(
                "2023-10-" + String.format("%02d", 1 + i),
                25.0,
                18.0,
                1
            ));
        }

        List<String> alerts = new ArrayList<>();
        alerts.add("Demo data: API unavailable");

        return new WeatherData(current, hours, days, alerts);
    }
}