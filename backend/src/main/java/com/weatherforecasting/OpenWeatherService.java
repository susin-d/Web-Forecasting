package com.weatherforecasting;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import java.io.IOException;

public class OpenWeatherService {
    private static final String API_KEY = "2398d84d42e14683b5344623252809"; // OpenWeather API key
    private static final String BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

    private final CloseableHttpClient httpClient;
    private final ObjectMapper objectMapper;

    public OpenWeatherService() {
        this.httpClient = HttpClients.createDefault();
        this.objectMapper = new ObjectMapper();
    }

    public WeatherResponse getWeatherByCity(String city) throws IOException {
        String url = BASE_URL + "?q=" + city + "&appid=" + API_KEY + "&units=metric";
        HttpGet request = new HttpGet(url);

        try (CloseableHttpResponse response = httpClient.execute(request)) {
            int statusCode = response.getStatusLine().getStatusCode();
            if (statusCode != 200) {
                throw new IOException("Failed to fetch weather data: " + statusCode);
            }

            String json = EntityUtils.toString(response.getEntity());
            return objectMapper.readValue(json, WeatherResponse.class);
        }
    }

    public WeatherResponse getWeatherByCoordinates(double lat, double lon) throws IOException {
        String url = BASE_URL + "?lat=" + lat + "&lon=" + lon + "&appid=" + API_KEY + "&units=metric";
        HttpGet request = new HttpGet(url);

        try (CloseableHttpResponse response = httpClient.execute(request)) {
            int statusCode = response.getStatusLine().getStatusCode();
            if (statusCode != 200) {
                throw new IOException("Failed to fetch weather data: " + statusCode);
            }

            String json = EntityUtils.toString(response.getEntity());
            return objectMapper.readValue(json, WeatherResponse.class);
        }
    }

    public void close() throws IOException {
        httpClient.close();
    }
}