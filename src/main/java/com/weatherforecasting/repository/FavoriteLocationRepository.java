package com.weatherforecasting.repository;

import com.weatherforecasting.model.FavoriteLocation;
import com.weatherforecasting.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavoriteLocationRepository extends JpaRepository<FavoriteLocation, Long> {
    List<FavoriteLocation> findByUser(User user);
}