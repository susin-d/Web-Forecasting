package com.weatherforecasting.service;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record DailyData(
    @JsonProperty("time") List<String> time,
    @JsonProperty("temperature_2m_max") List<Double> temperature2mMax,
    @JsonProperty("temperature_2m_min") List<Double> temperature2mMin
) {}