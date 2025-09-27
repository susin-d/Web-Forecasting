package com.weatherforecasting;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import com.weatherforecasting.model.AlertPreference;
import com.weatherforecasting.model.User;
import com.weatherforecasting.repository.AlertPreferenceRepository;
import com.weatherforecasting.service.AlertService;
import com.weatherforecasting.service.CurrentWeather;
import com.weatherforecasting.service.WeatherData;

class AlertServiceTest {

    @Mock
    private AlertPreferenceRepository alertPreferenceRepository;

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private AlertService alertService;

    private User user;
    private WeatherData weatherData;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new User();
        user.setEmail("test@example.com");
        user.setUsername("testuser");

        CurrentWeather current = new CurrentWeather(30.0, 25.0, 180.0, 1, "2023-10-01T12:00", 1, 50.0);
        weatherData = new WeatherData(current, Collections.emptyList(), Collections.emptyList(), Collections.emptyList());
    }

    @Test
    void testCheckAlertsForUser_WindAlert() {
        AlertPreference pref = new AlertPreference();
        pref.setAlertType("wind");
        pref.setEnabled(true);
        when(alertPreferenceRepository.findByUser(user)).thenReturn(Arrays.asList(pref));

        List<AlertService.Alert> alerts = alertService.checkAlertsForUser(user, weatherData);

        assertEquals(1, alerts.size());
        assertEquals("wind", alerts.get(0).type());
    }

    @Test
    void testCheckAlertsForUser_TemperatureAlert() {
        CurrentWeather current = new CurrentWeather(40.0, 5.0, 180.0, 1, "2023-10-01T12:00", 1, 50.0);
        weatherData = new WeatherData(current, Collections.emptyList(), Collections.emptyList(), Collections.emptyList());

        AlertPreference pref = new AlertPreference();
        pref.setAlertType("temperature");
        pref.setEnabled(true);
        when(alertPreferenceRepository.findByUser(user)).thenReturn(Arrays.asList(pref));

        List<AlertService.Alert> alerts = alertService.checkAlertsForUser(user, weatherData);

        assertEquals(1, alerts.size());
        assertEquals("temperature", alerts.get(0).type());
    }

    @Test
    void testCheckAlertsForUser_NoAlerts() {
        AlertPreference pref = new AlertPreference();
        pref.setAlertType("wind");
        pref.setEnabled(false);
        when(alertPreferenceRepository.findByUser(user)).thenReturn(Arrays.asList(pref));

        List<AlertService.Alert> alerts = alertService.checkAlertsForUser(user, weatherData);

        assertTrue(alerts.isEmpty());
    }

    @Test
    void testSendAlertEmail_WithAlerts() {
        List<AlertService.Alert> alerts = Arrays.asList(
            new AlertService.Alert("wind", "High wind"),
            new AlertService.Alert("temperature", "High temp")
        );

        alertService.sendAlertEmail(user, alerts);

        verify(mailSender).send(any(SimpleMailMessage.class));
    }

    @Test
    void testSendAlertEmail_NoAlerts() {
        alertService.sendAlertEmail(user, Collections.emptyList());

        verify(mailSender, never()).send(any(SimpleMailMessage.class));
    }
}