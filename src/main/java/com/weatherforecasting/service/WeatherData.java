package com.weatherforecasting.service;

import java.util.List;

public record WeatherData(
    CurrentWeather current,
    List<WeatherHour> hourly,
    List<WeatherDay> daily,
    List<String> alerts
) {}