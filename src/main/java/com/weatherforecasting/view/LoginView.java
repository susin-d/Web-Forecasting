package com.weatherforecasting.view;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.FlexLayout;
import com.vaadin.flow.component.textfield.PasswordField;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.router.RouterLink;
import com.weatherforecasting.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;

@Route("login")
public class LoginView extends FlexLayout {

    @Autowired
    private UserService userService;

    private TextField usernameField;
    private PasswordField passwordField;
    private Button loginButton;

    public LoginView() {
        setFlexDirection(FlexLayout.FlexDirection.COLUMN);
        setFlexWrap(FlexLayout.FlexWrap.WRAP);
        setWidth("100%");
        setAlignItems(FlexLayout.Alignment.CENTER);
        setJustifyContentMode(FlexLayout.JustifyContentMode.CENTER);
        getElement().setAttribute("role", "form");

        createComponents();
        layoutComponents();
        setupEventListeners();
    }

    private void createComponents() {
        H1 title = new H1("Login");

        usernameField = new TextField("Username");
        usernameField.setAriaLabel("Username");
        passwordField = new PasswordField("Password");
        passwordField.setAriaLabel("Password");
        loginButton = new Button("Login");
        loginButton.setAriaLabel("Login");

        RouterLink registerLink = new RouterLink("Register", RegisterView.class);
    }

    private void layoutComponents() {
        add(title, usernameField, passwordField, loginButton, registerLink);
    }

    private void setupEventListeners() {
        loginButton.addClickListener(event -> login());
    }

    private void login() {
        String username = usernameField.getValue();
        String password = passwordField.getValue();

        try {
            userService.authenticateUser(username, password);
            // Since no security, just navigate
            getUI().ifPresent(ui -> ui.navigate(WeatherView.class));
        } catch (Exception e) {
            Notification.show("Login failed: " + e.getMessage());
        }
    }
}