package com.weatherforecasting.service;

public record WeatherHour(
    String time,
    double temperature,
    double humidity,
    double windspeed,
    double precipitation
) {}