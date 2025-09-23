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

@Route("register")
public class RegisterView extends FlexLayout {

    @Autowired
    private UserService userService;

    private TextField usernameField;
    private TextField emailField;
    private PasswordField passwordField;
    private Button registerButton;
    private RouterLink loginLink;

    public RegisterView() {
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
        usernameField = new TextField("Username");
        usernameField.setAriaLabel("Username");
        emailField = new TextField("Email");
        emailField.setAriaLabel("Email");
        passwordField = new PasswordField("Password");
        passwordField.setAriaLabel("Password");
        registerButton = new Button("Register");
        registerButton.setAriaLabel("Register");

        loginLink = new RouterLink("Login", LoginView.class);
    }

    private void layoutComponents() {
        H1 title = new H1("Register");
        add(title, usernameField, emailField, passwordField, registerButton, loginLink);
    }

    private void setupEventListeners() {
        registerButton.addClickListener(event -> register());
    }

    private void register() {
        String username = usernameField.getValue();
        String email = emailField.getValue();
        String password = passwordField.getValue();

        try {
            userService.registerUser(username, email, password);
            Notification.show("Registration successful");
            getUI().ifPresent(ui -> ui.navigate(LoginView.class));
        } catch (Exception e) {
            Notification.show("Registration failed: " + e.getMessage());
        }
    }
}