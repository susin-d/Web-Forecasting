package com.weatherforecasting;

import com.vaadin.testbench.TestBenchTestCase;
import com.vaadin.testbench.elements.ButtonElement;
import com.vaadin.testbench.elements.ComboBoxElement;
import com.vaadin.testbench.elements.LabelElement;
import org.junit.Assert;
import org.junit.Test;
import org.openqa.selenium.By;

public class WeatherViewTest extends TestBenchTestCase {

    @Test
    public void testSearchFunctionality() {
        // Assuming the app is running on localhost:8080
        getDriver().get("http://localhost:8080/weather");

        // Find the location combo box
        ComboBoxElement locationComboBox = $(ComboBoxElement.class).first();
        locationComboBox.setFilter("New York");

        // Wait for results and select
        // Assuming it auto-selects or we can select
        // For simplicity, assume selection happens

        // Check if temperature label is updated
        LabelElement tempLabel = $(LabelElement.class).caption("Temperature:").first();
        Assert.assertNotNull(tempLabel.getText());
        Assert.assertTrue(tempLabel.getText().contains("°C") || tempLabel.getText().contains("°F"));
    }

    @Test
    public void testWeatherDisplay() {
        getDriver().get("http://localhost:8080/weather");

        // Select location
        ComboBoxElement locationComboBox = $(ComboBoxElement.class).first();
        locationComboBox.setFilter("London");

        // Verify humidity and wind labels
        LabelElement humidityLabel = $(LabelElement.class).caption("Humidity:").first();
        LabelElement windLabel = $(LabelElement.class).caption("Wind Speed:").first();

        Assert.assertNotNull(humidityLabel.getText());
        Assert.assertNotNull(windLabel.getText());
        Assert.assertTrue(humidityLabel.getText().contains("%"));
        Assert.assertTrue(windLabel.getText().contains("m/s") || windLabel.getText().contains("mph"));
    }
}