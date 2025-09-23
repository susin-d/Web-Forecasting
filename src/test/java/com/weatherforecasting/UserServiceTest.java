package com.weatherforecasting;

import com.weatherforecasting.model.User;
import com.weatherforecasting.repository.UserRepository;
import com.weatherforecasting.service.InvalidCredentialsException;
import com.weatherforecasting.service.UserAlreadyExistsException;
import com.weatherforecasting.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegisterUser_Success() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(new User());

        User result = userService.registerUser("testuser", "test@example.com", "password123");

        assertNotNull(result);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void testRegisterUser_UsernameExists() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(new User()));

        assertThrows(UserAlreadyExistsException.class, () -> {
            userService.registerUser("testuser", "test@example.com", "password123");
        });
    }

    @Test
    void testRegisterUser_EmailExists() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(new User()));

        assertThrows(UserAlreadyExistsException.class, () -> {
            userService.registerUser("testuser", "test@example.com", "password123");
        });
    }

    @Test
    void testRegisterUser_InvalidPassword() {
        assertThrows(IllegalArgumentException.class, () -> {
            userService.registerUser("testuser", "test@example.com", "123");
        });
    }

    @Test
    void testRegisterUser_InvalidUsername() {
        assertThrows(IllegalArgumentException.class, () -> {
            userService.registerUser("", "test@example.com", "password123");
        });
    }

    @Test
    void testAuthenticateUser_Success() {
        User user = new User();
        user.setPassword(new BCryptPasswordEncoder().encode("password123"));
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        User result = userService.authenticateUser("testuser", "password123");

        assertNotNull(result);
    }

    @Test
    void testAuthenticateUser_InvalidUsername() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.empty());

        assertThrows(InvalidCredentialsException.class, () -> {
            userService.authenticateUser("testuser", "password123");
        });
    }

    @Test
    void testAuthenticateUser_InvalidPassword() {
        User user = new User();
        user.setPassword(new BCryptPasswordEncoder().encode("password123"));
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        assertThrows(InvalidCredentialsException.class, () -> {
            userService.authenticateUser("testuser", "wrongpassword");
        });
    }

    @Test
    void testFindUserByUsername_Success() {
        User user = new User();
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        Optional<User> result = userService.findUserByUsername("testuser");

        assertTrue(result.isPresent());
    }

    @Test
    void testFindUserByUsername_NotFound() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.empty());

        Optional<User> result = userService.findUserByUsername("testuser");

        assertFalse(result.isPresent());
    }
}