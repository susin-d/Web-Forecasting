package com.weatherforecasting.service;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;

@Service
public class WeatherService {

    private final WebClient webClient;

    public WeatherService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://api.open-meteo.com").build();
    }

    @Cacheable("weather")
    public WeatherData getWeatherData(double latitude, double longitude) {
        OpenMeteoResponse response = fetchFromApi(latitude, longitude);
        List<WeatherHour> hours = processHourly(response.hourly());
        List<WeatherDay> days = processDaily(response.daily());
        List<String> alerts = checkAlerts(hours, response.currentWeather());
        return new WeatherData(response.currentWeather(), hours, days, alerts);
    }

    private OpenMeteoResponse fetchFromApi(double latitude, double longitude) {
        String url = "/v1/forecast?latitude=" + latitude + "&longitude=" + longitude +
                     "&hourly=temperature_2m,relativehumidity_2m,windspeed_10m,precipitation" +
                     "&daily=temperature_2m_max,temperature_2m_min&current_weather=true&timezone=auto";
        try {
            return webClient.get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(OpenMeteoResponse.class)
                    .block();
        } catch (Exception e) {
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
                hourly.precipitation().get(i)
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
                daily.temperature2mMin().get(i)
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
}