package com.weatherforecasting;

import com.weatherforecasting.model.FavoriteLocation;
import com.weatherforecasting.model.User;
import com.weatherforecasting.repository.FavoriteLocationRepository;
import com.weatherforecasting.service.FavoriteLocationNotFoundException;
import com.weatherforecasting.service.FavoriteLocationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class FavoriteLocationServiceTest {

    @Mock
    private FavoriteLocationRepository favoriteLocationRepository;

    @InjectMocks
    private FavoriteLocationService favoriteLocationService;

    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new User();
        user.setId(1L);
    }

    @Test
    void testSaveFavoriteLocation_Success() {
        when(favoriteLocationRepository.save(any(FavoriteLocation.class))).thenReturn(new FavoriteLocation());

        FavoriteLocation result = favoriteLocationService.saveFavoriteLocation(user, "New York", BigDecimal.valueOf(40.7128), BigDecimal.valueOf(-74.0060));

        assertNotNull(result);
        verify(favoriteLocationRepository).save(any(FavoriteLocation.class));
    }

    @Test
    void testSaveFavoriteLocation_InvalidName() {
        assertThrows(IllegalArgumentException.class, () -> {
            favoriteLocationService.saveFavoriteLocation(user, "", BigDecimal.valueOf(40.7128), BigDecimal.valueOf(-74.0060));
        });
    }

    @Test
    void testSaveFavoriteLocation_InvalidLatitude() {
        assertThrows(IllegalArgumentException.class, () -> {
            favoriteLocationService.saveFavoriteLocation(user, "New York", BigDecimal.valueOf(100), BigDecimal.valueOf(-74.0060));
        });
    }

    @Test
    void testSaveFavoriteLocation_InvalidLongitude() {
        assertThrows(IllegalArgumentException.class, () -> {
            favoriteLocationService.saveFavoriteLocation(user, "New York", BigDecimal.valueOf(40.7128), BigDecimal.valueOf(200));
        });
    }

    @Test
    void testDeleteFavoriteLocation_Success() {
        FavoriteLocation location = new FavoriteLocation();
        location.setUser(user);
        when(favoriteLocationRepository.findById(1L)).thenReturn(Optional.of(location));

        favoriteLocationService.deleteFavoriteLocation(1L, user);

        verify(favoriteLocationRepository).delete(location);
    }

    @Test
    void testDeleteFavoriteLocation_NotFound() {
        when(favoriteLocationRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(FavoriteLocationNotFoundException.class, () -> {
            favoriteLocationService.deleteFavoriteLocation(1L, user);
        });
    }

    @Test
    void testDeleteFavoriteLocation_NotOwned() {
        User otherUser = new User();
        otherUser.setId(2L);
        FavoriteLocation location = new FavoriteLocation();
        location.setUser(otherUser);
        when(favoriteLocationRepository.findById(1L)).thenReturn(Optional.of(location));

        assertThrows(FavoriteLocationNotFoundException.class, () -> {
            favoriteLocationService.deleteFavoriteLocation(1L, user);
        });
    }

    @Test
    void testGetFavoriteLocationsByUser() {
        List<FavoriteLocation> locations = Arrays.asList(new FavoriteLocation(), new FavoriteLocation());
        when(favoriteLocationRepository.findByUser(user)).thenReturn(locations);

        List<FavoriteLocation> result = favoriteLocationService.getFavoriteLocationsByUser(user);

        assertEquals(2, result.size());
        verify(favoriteLocationRepository).findByUser(user);
    }
}