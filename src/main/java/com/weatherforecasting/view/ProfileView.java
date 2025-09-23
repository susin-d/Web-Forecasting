package com.weatherforecasting.view;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.checkbox.Checkbox;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.FlexLayout;
import com.vaadin.flow.component.select.Select;
import com.vaadin.flow.router.Route;
import com.weatherforecasting.model.AlertPreference;
import com.weatherforecasting.model.User;
import com.weatherforecasting.service.AlertPreferenceService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Route("profile")
public class ProfileView extends FlexLayout {

    @Autowired
    private AlertPreferenceService alertPreferenceService;

    private H1 title;
    private Select<String> unitsSelect;
    private Checkbox windCheckbox;
    private Checkbox temperatureCheckbox;
    private Button saveButton;

    public ProfileView() {
        setFlexDirection(FlexLayout.FlexDirection.COLUMN);
        setFlexWrap(FlexLayout.FlexWrap.WRAP);
        setWidth("100%");
        getElement().setAttribute("role", "form");

        createComponents();
        layoutComponents();
        setupEventListeners();
        loadPreferences();
    }

    private void createComponents() {
        title = new H1("Profile Settings");

        unitsSelect = new Select<>();
        unitsSelect.setLabel("Units");
        unitsSelect.setAriaLabel("Units");
        unitsSelect.setItems("Metric", "Imperial");

        windCheckbox = new Checkbox("Wind Alerts");
        windCheckbox.setAriaLabel("Wind Alerts");
        temperatureCheckbox = new Checkbox("Temperature Alerts");
        temperatureCheckbox.setAriaLabel("Temperature Alerts");

        saveButton = new Button("Save");
        saveButton.setAriaLabel("Save");
    }

    private void layoutComponents() {
        add(title, unitsSelect, windCheckbox, temperatureCheckbox, saveButton);
    }

    private void setupEventListeners() {
        saveButton.addClickListener(event -> savePreferences());
    }

    private void loadPreferences() {
        // Assume user
        User user = null; // TODO
        if (user != null) {
            List<AlertPreference> prefs = alertPreferenceService.getAlertPreferencesForUser(user);
            for (AlertPreference pref : prefs) {
                if ("wind".equals(pref.getAlertType())) {
                    windCheckbox.setValue(pref.getEnabled());
                } else if ("temperature".equals(pref.getAlertType())) {
                    temperatureCheckbox.setValue(pref.getEnabled());
                }
            }
        }
    }

    private void savePreferences() {
        User user = null; // TODO
        if (user != null) {
            try {
                AlertPreference windPref = new AlertPreference();
                windPref.setUser(user);
                windPref.setAlertType("wind");
                windPref.setEnabled(windCheckbox.getValue());
                alertPreferenceService.saveAlertPreference(windPref);

                AlertPreference tempPref = new AlertPreference();
                tempPref.setUser(user);
                tempPref.setAlertType("temperature");
                tempPref.setEnabled(temperatureCheckbox.getValue());
                alertPreferenceService.saveAlertPreference(tempPref);

                Notification.show("Preferences saved");
            } catch (Exception e) {
                Notification.show("Error saving: " + e.getMessage());
            }
        }
    }
}