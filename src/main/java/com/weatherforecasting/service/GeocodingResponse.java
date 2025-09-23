package com.weatherforecasting.service;

import java.util.List;

public record GeocodingResponse(
    List<GeocodingResult> results
) {}