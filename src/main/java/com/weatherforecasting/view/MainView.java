package com.weatherforecasting.view;

import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.router.RouterLink;

@Route("")
public class MainView extends VerticalLayout {

    public MainView() {
        setSizeFull();
        setAlignItems(Alignment.CENTER);
        setJustifyContentMode(JustifyContentMode.CENTER);

        RouterLink weatherLink = new RouterLink("Go to Weather", WeatherView.class);
        RouterLink loginLink = new RouterLink("Login", LoginView.class);
        RouterLink registerLink = new RouterLink("Register", RegisterView.class);

        add(weatherLink, loginLink, registerLink);
    }
}