package com.weatherforecasting;

import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.anyString;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.web.reactive.function.client.WebClient;

import com.weatherforecasting.service.CurrentWeather;
import com.weatherforecasting.service.DailyData;
import com.weatherforecasting.service.HourlyData;
import com.weatherforecasting.service.OpenMeteoResponse;
import com.weatherforecasting.service.WeatherApiException;
import com.weatherforecasting.service.WeatherData;
import com.weatherforecasting.service.WeatherService;

import reactor.core.publisher.Mono;

class WeatherServiceTest {

    @Mock
    private WebClient.Builder webClientBuilder;

    @Mock
    private WebClient webClient;

    @Mock
    private WebClient.RequestHeadersUriSpec requestHeadersUriSpec;

    @Mock
    private WebClient.RequestHeadersSpec requestHeadersSpec;

    @Mock
    private WebClient.ResponseSpec responseSpec;

    private WeatherService weatherService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        when(webClientBuilder.baseUrl(anyString())).thenReturn(webClientBuilder);
        when(webClientBuilder.build()).thenReturn(webClient);
        weatherService = new WeatherService(webClientBuilder);
    }

    @Test
    void testGetWeatherData_Success() {
        // Mock the API response
        OpenMeteoResponse mockResponse = createMockResponse();
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(anyString())).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(OpenMeteoResponse.class)).thenReturn(Mono.just(mockResponse));

        // Call the method
        WeatherData result = weatherService.getWeatherData(40.7128, -74.0060);

        // Assertions
        assertNotNull(result);
        assertNotNull(result.current());
        assertEquals(25.0, result.current().temperature());
        assertEquals(2, result.hourly().size());
        assertEquals(2, result.daily().size());
        assertTrue(result.alerts().size() >= 0); // Depending on mock data
    }

    @Test
    void testGetWeatherData_ApiException() {
        // Mock exception
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(anyString())).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(OpenMeteoResponse.class)).thenReturn(Mono.error(new RuntimeException("API Error")));

        // Call the method and expect exception
        assertThrows(WeatherApiException.class, () -> {
            weatherService.getWeatherData(40.7128, -74.0060);
        });
    }

    private OpenMeteoResponse createMockResponse() {
        CurrentWeather current = new CurrentWeather(25.0, 5.0, 180.0, 1, "2023-10-01T12:00", 1, 60.0);
        HourlyData hourly = new HourlyData(
            Arrays.asList("2023-10-01T12:00", "2023-10-01T13:00"),
            Arrays.asList(25.0, 26.0),
            Arrays.asList(60.0, 65.0),
            Arrays.asList(5.0, 6.0),
            Arrays.asList(0.0, 0.0),
            Arrays.asList(1, 2)
        );
        DailyData daily = new DailyData(
            Arrays.asList("2023-10-01", "2023-10-02"),
            Arrays.asList(20.0, 22.0),
            Arrays.asList(15.0, 18.0),
            Arrays.asList(1, 2)
        );
        return new OpenMeteoResponse(current, hourly, daily);
    }
}