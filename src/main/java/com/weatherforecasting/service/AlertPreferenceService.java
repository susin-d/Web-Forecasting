package com.weatherforecasting.service;

import com.weatherforecasting.model.AlertPreference;
import com.weatherforecasting.model.User;
import com.weatherforecasting.repository.AlertPreferenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlertPreferenceService {

    @Autowired
    private AlertPreferenceRepository alertPreferenceRepository;

    public List<AlertPreference> getAlertPreferencesForUser(User user) {
        return alertPreferenceRepository.findByUser(user);
    }

    public AlertPreference saveAlertPreference(AlertPreference alertPreference) {
        return alertPreferenceRepository.save(alertPreference);
    }

    public void deleteAlertPreference(Long id) {
        alertPreferenceRepository.deleteById(id);
    }
}