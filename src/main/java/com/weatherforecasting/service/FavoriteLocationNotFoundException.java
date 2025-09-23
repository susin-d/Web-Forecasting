package com.weatherforecasting.service;

public class FavoriteLocationNotFoundException extends RuntimeException {
    public FavoriteLocationNotFoundException(String message) {
        super(message);
    }
}