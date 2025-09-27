package com.weatherforecasting.service;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record HourlyData(
    @JsonProperty("time") List<String> time,
    @JsonProperty("temperature_2m") List<Double> temperature2m,
    @JsonProperty("relativehumidity_2m") List<Double> relativehumidity2m,
    @JsonProperty("windspeed_10m") List<Double> windspeed10m,
    @JsonProperty("precipitation") List<Double> precipitation,
    @JsonProperty("weathercode") List<Integer> weathercode
) {}