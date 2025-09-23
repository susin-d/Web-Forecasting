package com.weatherforecasting.service;

public record WeatherDay(
    String date,
    double maxTemp,
    double minTemp
) {}