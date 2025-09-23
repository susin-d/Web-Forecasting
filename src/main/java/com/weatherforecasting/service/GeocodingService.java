package com.weatherforecasting.service;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
public class GeocodingService {

    private final WebClient webClient;

    public GeocodingService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://geocoding-api.open-meteo.com").build();
    }

    @Cacheable("geocoding")
    public List<GeocodingResult> searchLocations(String name) {
        String url = "/v1/search?name=" + name + "&count=10&language=en&format=json";
        try {
            GeocodingResponse response = webClient.get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(GeocodingResponse.class)
                    .block();
            return response.results();
        } catch (Exception e) {
            throw new GeocodingApiException("Failed to fetch geocoding data for name: " + name, e);
        }
    }
}