package com.weatherforecasting.service;

import com.fasterxml.jackson.annotation.JsonProperty;

public record CurrentWeather(
    @JsonProperty("temperature") double temperature,
    @JsonProperty("windspeed") double windspeed,
    @JsonProperty("winddirection") double winddirection,
    @JsonProperty("weathercode") int weathercode,
    @JsonProperty("time") String time,
    @JsonProperty("is_day") int isDay
) {}