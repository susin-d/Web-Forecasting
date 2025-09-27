package com.weatherforecasting.service;

import com.weatherforecasting.model.FavoriteLocation;
import com.weatherforecasting.model.User;
import com.weatherforecasting.repository.FavoriteLocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public class FavoriteLocationService {

    @Autowired
    private FavoriteLocationRepository favoriteLocationRepository;

    public FavoriteLocation saveFavoriteLocation(User user, String name, BigDecimal latitude, BigDecimal longitude) {
        // Basic validation
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Location name cannot be null or empty");
        }
        if (latitude == null || latitude.compareTo(BigDecimal.valueOf(-90)) < 0 || latitude.compareTo(BigDecimal.valueOf(90)) > 0) {
            throw new IllegalArgumentException("Latitude must be between -90 and 90");
        }
        if (longitude == null || longitude.compareTo(BigDecimal.valueOf(-180)) < 0 || longitude.compareTo(BigDecimal.valueOf(180)) > 0) {
            throw new IllegalArgumentException("Longitude must be between -180 and 180");
        }

        FavoriteLocation location = new FavoriteLocation();
        location.setUser(user);
        location.setName(name.trim());
        location.setLatitude(latitude);
        location.setLongitude(longitude);
        return favoriteLocationRepository.save(location);
    }

    public void deleteFavoriteLocation(Long id, User user) {
        Optional<FavoriteLocation> locationOpt = favoriteLocationRepository.findById(id);
        if (locationOpt.isEmpty()) {
            throw new FavoriteLocationNotFoundException("Favorite location not found with id: " + id);
        }
        FavoriteLocation location = locationOpt.get();
        if (!location.getUser().getId().equals(user.getId())) {
            throw new FavoriteLocationNotFoundException("Favorite location does not belong to the user");
        }
        favoriteLocationRepository.delete(location);
    }

    public List<FavoriteLocation> getFavoriteLocationsByUser(User user) {
        return favoriteLocationRepository.findByUser(user);
    }
}