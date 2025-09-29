package com.weatherforecasting;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.URI;
import java.util.HashMap;
import java.util.Map;

public class WeatherServer {
    private final OpenWeatherService weatherService;
    private final ObjectMapper objectMapper;

    public WeatherServer() {
        this.weatherService = new OpenWeatherService();
        this.objectMapper = new ObjectMapper();
    }

    public void start() throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(8083), 0);
        server.createContext("/weather", new WeatherHandler());
        server.setExecutor(null); // creates a default executor
        server.start();
        System.out.println("Server started on port 8083");
    }

    private class WeatherHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("GET".equals(exchange.getRequestMethod())) {
                URI requestURI = exchange.getRequestURI();
                Map<String, String> params = parseQuery(requestURI.getQuery());

                String city = params.get("city");
                if (city == null || city.isEmpty()) {
                    sendResponse(exchange, 400, "{\"error\": \"City parameter is required\"}");
                    return;
                }

                try {
                    WeatherResponse weather = weatherService.getWeatherByCity(city);
                    String jsonResponse = objectMapper.writeValueAsString(weather);
                    sendResponse(exchange, 200, jsonResponse);
                } catch (IOException e) {
                    sendResponse(exchange, 500, "{\"error\": \"Failed to fetch weather data\"}");
                }
            } else {
                sendResponse(exchange, 405, "{\"error\": \"Method not allowed\"}");
            }
        }

        private void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(statusCode, response.getBytes().length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(response.getBytes());
            }
        }

        private Map<String, String> parseQuery(String query) {
            Map<String, String> params = new HashMap<>();
            if (query != null) {
                String[] pairs = query.split("&");
                for (String pair : pairs) {
                    String[] keyValue = pair.split("=");
                    if (keyValue.length == 2) {
                        params.put(keyValue[0], keyValue[1]);
                    }
                }
            }
            return params;
        }
    }

    public static void main(String[] args) throws IOException {
        WeatherServer server = new WeatherServer();
        server.start();
    }
}
