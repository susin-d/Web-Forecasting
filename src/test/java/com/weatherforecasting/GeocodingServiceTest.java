package com.weatherforecasting;

import com.weatherforecasting.service.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class GeocodingServiceTest {

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

    private GeocodingService geocodingService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        when(webClientBuilder.baseUrl(anyString())).thenReturn(webClientBuilder);
        when(webClientBuilder.build()).thenReturn(webClient);
        geocodingService = new GeocodingService(webClientBuilder);
    }

    @Test
    void testSearchLocations_Success() {
        // Mock the API response
        GeocodingResult result1 = new GeocodingResult(1, "New York", 40.7128, -74.0060, 10.0, "PPL", "US", 1, 1, 1, 1, "America/New_York", 1000000, List.of(), 1, "United States", "New York", "", "", "");
        GeocodingResult result2 = new GeocodingResult(2, "Newark", 40.7357, -74.1724, 5.0, "PPL", "US", 1, 1, 1, 1, "America/New_York", 500000, List.of(), 1, "United States", "New Jersey", "", "", "");
        GeocodingResponse mockResponse = new GeocodingResponse(Arrays.asList(result1, result2));
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(anyString())).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(GeocodingResponse.class)).thenReturn(Mono.just(mockResponse));

        // Call the method
        List<GeocodingResult> results = geocodingService.searchLocations("New");

        // Assertions
        assertNotNull(results);
        assertEquals(2, results.size());
        assertEquals("New York", results.get(0).name());
        assertEquals("Newark", results.get(1).name());
    }

    @Test
    void testSearchLocations_ApiException() {
        // Mock exception
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(anyString())).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(GeocodingResponse.class)).thenReturn(Mono.error(new RuntimeException("API Error")));

        // Call the method and expect exception
        assertThrows(GeocodingApiException.class, () -> {
            geocodingService.searchLocations("New");
        });
    }
}