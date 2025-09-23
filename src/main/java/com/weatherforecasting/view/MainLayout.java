package com.weatherforecasting.view;

import com.vaadin.flow.component.applayout.AppLayout;
import com.vaadin.flow.component.applayout.DrawerToggle;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.orderedlayout.FlexComponent;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.HighlightConditions;
import com.vaadin.flow.router.RouterLink;

public class MainLayout extends AppLayout {

    public MainLayout() {
        createHeader();
        createDrawer();
    }

    private void createHeader() {
        H1 logo = new H1("Weather Forecasting");
        logo.addClassNames("text-l", "m-m");

        HorizontalLayout header = new HorizontalLayout(new DrawerToggle(), logo);
        header.setDefaultVerticalComponentAlignment(FlexComponent.Alignment.CENTER);
        header.setWidth("100%");
        header.addClassNames("py-0", "px-m");

        addToNavbar(header);
    }

    private void createDrawer() {
        RouterLink weatherLink = new RouterLink("Weather", WeatherView.class);
        weatherLink.setHighlightCondition(HighlightConditions.sameLocation());

        RouterLink favoritesLink = new RouterLink("Favorites", FavoritesView.class);
        favoritesLink.setHighlightCondition(HighlightConditions.sameLocation());

        RouterLink profileLink = new RouterLink("Profile", ProfileView.class);
        profileLink.setHighlightCondition(HighlightConditions.sameLocation());

        RouterLink logoutLink = new RouterLink("Logout", LoginView.class); // Navigate to login on logout

        addToDrawer(new VerticalLayout(weatherLink, favoritesLink, profileLink, logoutLink));
    }
}