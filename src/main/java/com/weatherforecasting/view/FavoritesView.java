package com.weatherforecasting.view;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.dialog.Dialog;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.FlexLayout;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.router.Route;
import com.weatherforecasting.model.FavoriteLocation;
import com.weatherforecasting.model.User;
import com.weatherforecasting.service.FavoriteLocationService;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;
import java.util.List;

@Route("favorites")
public class FavoritesView extends FlexLayout {

    @Autowired
    private FavoriteLocationService favoriteLocationService;

    private H1 title;
    private Grid<FavoriteLocation> grid;
    private Button addButton;
    private Button deleteButton;

    public FavoritesView() {
        setFlexDirection(FlexLayout.FlexDirection.COLUMN);
        setFlexWrap(FlexLayout.FlexWrap.WRAP);
        setWidth("100%");
        getElement().setAttribute("role", "main");

        createComponents();
        layoutComponents();
        setupEventListeners();
        loadFavorites();
    }

    private void createComponents() {
        title = new H1("Favorite Locations");

        grid = new Grid<>(FavoriteLocation.class);
        grid.setColumns("name", "latitude", "longitude");
        grid.setWidth("100%");
        grid.getElement().setAttribute("aria-label", "Favorite locations");

        addButton = new Button("Add New");
        addButton.setAriaLabel("Add new favorite location");
        deleteButton = new Button("Delete Selected");
        deleteButton.setAriaLabel("Delete selected favorite location");
    }

    private void layoutComponents() {
        FlexLayout buttonLayout = new FlexLayout(addButton, deleteButton);
        buttonLayout.setFlexDirection(FlexLayout.FlexDirection.ROW);
        buttonLayout.setFlexWrap(FlexLayout.FlexWrap.WRAP);
        buttonLayout.setWidth("100%");
        add(title, grid, buttonLayout);
    }

    private void setupEventListeners() {
        addButton.addClickListener(event -> openAddDialog());
        deleteButton.addClickListener(event -> deleteSelected());
    }

    private void loadFavorites() {
        User user = null; // TODO
        if (user != null) {
            List<FavoriteLocation> favorites = favoriteLocationService.getFavoriteLocationsByUser(user);
            grid.setItems(favorites);
        }
    }

    private void openAddDialog() {
        Dialog dialog = new Dialog();
        TextField nameField = new TextField("Name");
        TextField latField = new TextField("Latitude");
        TextField lonField = new TextField("Longitude");
        Button saveButton = new Button("Save", event -> {
            try {
                User user = null; // TODO
                if (user != null) {
                    BigDecimal lat = new BigDecimal(latField.getValue());
                    BigDecimal lon = new BigDecimal(lonField.getValue());
                    favoriteLocationService.saveFavoriteLocation(user, nameField.getValue(), lat, lon);
                    loadFavorites();
                    dialog.close();
                }
            } catch (Exception e) {
                Notification.show("Error: " + e.getMessage());
            }
        });
        dialog.add(nameField, latField, lonField, saveButton);
        dialog.open();
    }

    private void deleteSelected() {
        FavoriteLocation selected = grid.asSingleSelect().getValue();
        if (selected != null) {
            try {
                User user = null; // TODO
                if (user != null) {
                    favoriteLocationService.deleteFavoriteLocation(selected.getId(), user);
                    loadFavorites();
                }
            } catch (Exception e) {
                Notification.show("Error: " + e.getMessage());
            }
        }
    }
}