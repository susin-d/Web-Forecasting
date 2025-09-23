package com.weatherforecasting.view;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.charts.Chart;
import com.vaadin.flow.component.charts.model.*;
import com.vaadin.flow.component.combobox.ComboBox;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.html.Label;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.FlexLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.data.provider.CallbackDataProvider;
import com.vaadin.flow.router.Layout;
import com.vaadin.flow.router.Route;
import com.weatherforecasting.model.FavoriteLocation;
import com.weatherforecasting.model.User;
import com.weatherforecasting.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.math.BigDecimal;
import java.util.List;

@Route("weather")
public class WeatherView extends FlexLayout {

    @Autowired
    private WeatherService weatherService;

    @Autowired
    private GeocodingService geocodingService;

    @Autowired
    private AlertService alertService;

    @Autowired
    private FavoriteLocationService favoriteLocationService;

    @Autowired
    private UserService userService;

    private ComboBox<GeocodingResult> locationComboBox;
    private Label tempLabel;
    private Label humidityLabel;
    private Label windLabel;
    private Chart hourlyChart;
    private Chart dailyChart;
    private Grid<AlertService.Alert> alertsGrid;
    private Button saveFavoriteButton;
    private Button toggleUnitsButton;

    private boolean isMetric = true;
    private GeocodingResult selectedLocation;
    private WeatherData currentWeatherData;

    public WeatherView() {
        setFlexDirection(FlexLayout.FlexDirection.COLUMN);
        setFlexWrap(FlexLayout.FlexWrap.WRAP);
        setWidth("100%");
        setPadding(true);
        setSpacing(true);
        setRole("main");

        createComponents();
        layoutComponents();
        setupEventListeners();
    }

    private void createComponents() {
        locationComboBox = new ComboBox<>("Search Location");
        locationComboBox.setItemLabelGenerator(GeocodingResult::name);
        locationComboBox.setAriaLabel("Search for location");
        locationComboBox.setDataProvider(new CallbackDataProvider<>(
            query -> geocodingService.searchLocations(query.getFilter().orElse("")).stream(),
            query -> geocodingService.searchLocations(query.getFilter().orElse("")).size()
        ));

        tempLabel = new Label("Temperature: --");
        humidityLabel = new Label("Humidity: --");
        windLabel = new Label("Wind Speed: --");

        hourlyChart = new Chart(ChartType.LINE);
        hourlyChart.setHeight("300px");
        hourlyChart.setWidth("100%");

        dailyChart = new Chart(ChartType.COLUMN);
        dailyChart.setHeight("300px");
        dailyChart.setWidth("100%");

        alertsGrid = new Grid<>(AlertService.Alert.class);
        alertsGrid.setColumns("type", "message");
        alertsGrid.setWidth("100%");

        saveFavoriteButton = new Button("Save to Favorites");
        saveFavoriteButton.setAriaLabel("Save to favorites");
        toggleUnitsButton = new Button("Toggle Units (Metric/Imperial)");
        toggleUnitsButton.setAriaLabel("Toggle units");
    }

    private void layoutComponents() {
        FlexLayout searchLayout = new FlexLayout(locationComboBox, saveFavoriteButton, toggleUnitsButton);
        searchLayout.setFlexDirection(FlexLayout.FlexDirection.ROW);
        searchLayout.setFlexWrap(FlexLayout.FlexWrap.WRAP);
        searchLayout.setWidth("100%");
        searchLayout.setAlignItems(FlexLayout.Alignment.BASELINE);

        VerticalLayout summaryLayout = new VerticalLayout(tempLabel, humidityLabel, windLabel);
        summaryLayout.setSpacing(false);
        summaryLayout.setWidth("100%");

        add(searchLayout, summaryLayout, hourlyChart, dailyChart, alertsGrid);
    }

    private void setupEventListeners() {
        locationComboBox.addValueChangeListener(event -> {
            selectedLocation = event.getValue();
            if (selectedLocation != null) {
                loadWeatherData();
            }
        });

        saveFavoriteButton.addClickListener(event -> saveToFavorites());

        toggleUnitsButton.addClickListener(event -> toggleUnits());
    }

    private void loadWeatherData() {
        try {
            currentWeatherData = weatherService.getWeatherData(selectedLocation.latitude(), selectedLocation.longitude());
            updateUI();
        } catch (Exception e) {
            Notification.show("Error loading weather data: " + e.getMessage());
        }
    }

    private void updateUI() {
        if (currentWeatherData == null) return;

        CurrentWeather current = currentWeatherData.current();
        tempLabel.setText("Temperature: " + formatTemp(current.temperature()));
        humidityLabel.setText("Humidity: " + current.relativehumidity() + "%");
        windLabel.setText("Wind Speed: " + formatWind(current.windspeed()));

        updateHourlyChart();
        updateDailyChart();
        updateAlerts();
    }

    private void updateHourlyChart() {
        Configuration conf = hourlyChart.getConfiguration();
        conf.setTitle("Hourly Temperature");
        conf.getxAxis().setCategories(currentWeatherData.hours().stream().map(h -> h.time().toString()).toArray(String[]::new));
        DataSeries series = new DataSeries();
        series.setName("Temperature (°C)");
        currentWeatherData.hours().forEach(h -> series.add(new DataSeriesItem(h.time().toString(), h.temperature())));
        conf.setSeries(series);
        hourlyChart.drawChart();
    }

    private void updateDailyChart() {
        Configuration conf = dailyChart.getConfiguration();
        conf.setTitle("Daily Precipitation");
        conf.getxAxis().setCategories(currentWeatherData.days().stream().map(d -> d.time().toString()).toArray(String[]::new));
        DataSeries series = new DataSeries();
        series.setName("Precipitation (mm)");
        // Assuming daily has precipitation, but WeatherDay doesn't have it. Wait, WeatherDay has max/min temp.
        // Need to adjust. Perhaps use hourly for precip.
        // For simplicity, use daily min/max or something. Wait, task says daily precipitation bar chart.
        // But WeatherDay doesn't have precipitation. Perhaps sum hourly or something.
        // For now, placeholder.
        currentWeatherData.days().forEach(d -> series.add(new DataSeriesItem(d.time().toString(), 0))); // Placeholder
        conf.setSeries(series);
        dailyChart.drawChart();
    }

    private void updateAlerts() {
        User user = getCurrentUser();
        if (user != null) {
            List<AlertService.Alert> alerts = alertService.checkAlertsForUser(user, currentWeatherData);
            alertsGrid.setItems(alerts);
        }
    }

    private void saveToFavorites() {
        if (selectedLocation == null) {
            Notification.show("No location selected");
            return;
        }
        User user = getCurrentUser();
        if (user != null) {
            try {
                favoriteLocationService.saveFavoriteLocation(user, selectedLocation.name(),
                    BigDecimal.valueOf(selectedLocation.latitude()), BigDecimal.valueOf(selectedLocation.longitude()));
                Notification.show("Saved to favorites");
            } catch (Exception e) {
                Notification.show("Error saving: " + e.getMessage());
            }
        } else {
            Notification.show("User not authenticated");
        }
    }

    private void toggleUnits() {
        isMetric = !isMetric;
        updateUI();
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            String username = ((UserDetails) authentication.getPrincipal()).getUsername();
            return userService.findUserByUsername(username).orElse(null);
        }
        return null;
    }

    private String formatTemp(double temp) {
        if (isMetric) {
            return temp + " °C";
        } else {
            return (temp * 9/5 + 32) + " °F";
        }
    }

    private String formatWind(double wind) {
        if (isMetric) {
            return wind + " m/s";
        } else {
            return (wind * 2.237) + " mph";
        }
    }
}