package com.weatherforecasting.service;

import com.weatherforecasting.model.AlertPreference;
import com.weatherforecasting.model.User;
import com.weatherforecasting.repository.AlertPreferenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AlertService {

    public static class Alert {
        private String type;
        private String message;

        public Alert(String type, String message) {
            this.type = type;
            this.message = message;
        }

        public String type() { return type; }
        public String message() { return message; }
    }

    @Autowired
    private AlertPreferenceRepository alertPreferenceRepository;

    @Autowired
    private JavaMailSender mailSender;

    public List<Alert> checkAlertsForUser(User user, WeatherData weatherData) {
        List<AlertPreference> preferences = alertPreferenceRepository.findByUser(user);
        List<Alert> alerts = new ArrayList<>();

        for (AlertPreference pref : preferences) {
            if (Boolean.TRUE.equals(pref.getEnabled())) {
                String alertType = pref.getAlertType();
                CurrentWeather current = weatherData.current();

                switch (alertType) {
                    case "wind":
                        if (current.windspeed() > 20.0) {
                            alerts.add(new Alert("wind", "High wind speed detected: " + current.windspeed() + " km/h"));
                        }
                        break;
                    case "temperature":
                        if (current.temperature() > 35.0 || current.temperature() < 0.0) {
                            alerts.add(new Alert("temperature", "Extreme temperature detected: " + current.temperature() + " °C"));
                        }
                        break;
                    // Add more cases as needed
                }
            }
        }

        return alerts;
    }

    public void sendAlertEmail(User user, List<Alert> alerts) {
        if (alerts.isEmpty()) {
            return;
        }

        String subject = "Weather Alerts for " + user.getUsername();
        StringBuilder body = new StringBuilder();
        for (Alert alert : alerts) {
            body.append(alert.message()).append("\n");
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject(subject);
        message.setText(body.toString());

        try {
            mailSender.send(message);
        } catch (MailException e) {
            // Log the error or handle it appropriately
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }
}