package com.weatherforecasting.service;

import com.fasterxml.jackson.annotation.JsonProperty;

public record OpenMeteoResponse(
    @JsonProperty("current_weather") CurrentWeather currentWeather,
    @JsonProperty("hourly") HourlyData hourly,
    @JsonProperty("daily") DailyData daily
) {}