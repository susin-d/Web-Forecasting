package com.weatherforecasting.repository;

import com.weatherforecasting.model.AlertPreference;
import com.weatherforecasting.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AlertPreferenceRepository extends JpaRepository<AlertPreference, Long> {
    List<AlertPreference> findByUser(User user);
}