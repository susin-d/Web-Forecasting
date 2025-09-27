package com.weatherforecasting.service;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public record DailyData(
    @JsonProperty("time") List<String> time,
    @JsonProperty("temperature_2m_max") List<Double> temperature2mMax,
    @JsonProperty("temperature_2m_min") List<Double> temperature2mMin,
    @JsonProperty("weathercode") List<Integer> weathercode
) {}