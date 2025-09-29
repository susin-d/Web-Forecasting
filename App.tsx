
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import WeatherDashboard from './components/WeatherDashboard';
import MapView from './components/MapView';
import FavoritesView from './components/FavoritesView';
import { getWeather, getWeatherByCoords } from './services/weatherService';
import { WeatherData, TemperatureUnit, WindSpeedUnit, View, FavoriteLocation } from './types';

const backgroundImages: { [key: string]: string } = {
  'CLEAR_DAY': 'https://images.unsplash.com/photo-1590077428892-13418e293f7c?q=80&w=1932&auto=format&fit=crop',
  'CLEAR_NIGHT': 'https://images.unsplash.com/photo-1488866022504-f2584929ca5f?q=80&w=1770&auto=format&fit=crop',
  'PARTLY_CLOUDY_DAY': 'https://images.unsplash.com/photo-1517685352821-92cf884ee6a5?q=80&w=1770&auto=format&fit=crop',
  'PARTLY_CLOUDY_NIGHT': 'https://images.unsplash.com/photo-1502472213590-348e5a72a2de?q=80&w=1770&auto=format&fit=crop',
  'CLOUDY': 'https://images.unsplash.com/photo-1499956827185-0d63ee78a910?q=80&w=1770&auto=format&fit=crop',
  'RAIN': 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=1935&auto=format&fit=crop',
  'SLEET': 'https://images.unsplash.com/photo-1581583921389-9831967a57a1?q=80&w=1771&auto=format&fit=crop',
  'SNOW': 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?q=80&w=1808&auto=format&fit=crop',
  'FOG': 'https://images.unsplash.com/photo-1487621167305-5d248087c824?q=80&w=1770&auto=format&fit=crop',
  'DEFAULT': 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=1935&auto=format&fit=crop',
};

const App: React.FC = () => {
  const [location, setLocation] = useState('chennai');
  const [units, setUnits] = useState<{ temp: TemperatureUnit, wind: WindSpeedUnit }>(() => {
    try {
      const savedUnits = localStorage.getItem('weather-units');
      return savedUnits ? JSON.parse(savedUnits) : { temp: 'celsius', wind: 'kmh' };
    } catch (error) {
      console.error('Error reading units from localStorage', error);
      return { temp: 'celsius', wind: 'kmh' };
    }
  });
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>('dashboard');
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([
      { id: 'london', name: 'London, United Kingdom', latitude: 51.5072, longitude: -0.1276 },
      { id: 'tokyo', name: 'Tokyo, Japan', latitude: 35.6895, longitude: 139.6917 },
  ]);

  const handleUnitsChange = (newUnits: { temp: TemperatureUnit, wind: WindSpeedUnit }) => {
    setUnits(newUnits);
    try {
      localStorage.setItem('weather-units', JSON.stringify(newUnits));
    } catch (error) {
      console.error('Error saving units to localStorage', error);
    }
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const data = await getWeatherByCoords(latitude, longitude, units);
          setWeatherData(data);
          setLocation(data.location);
        } catch (err) {
          setError('Failed to fetch weather for your location.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      },
      (geoError) => {
        setLoading(false);
        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            setError("Location access denied. Please enable it in your browser settings.");
            break;
          case geoError.POSITION_UNAVAILABLE:
            setError("Location information is unavailable.");
            break;
          case geoError.TIMEOUT:
            setError("The request to get user location timed out.");
            break;
          default:
            setError("An unknown error occurred while getting your location.");
            break;
        }
        console.error("Geolocation error:", geoError);
      }
    );
  };

  const handleSetLocationFromFavorite = (locationName: string) => {
    setLocation(locationName);
    setView('dashboard');
  }

  const handleDeleteFavorite = (locationId: string) => {
      setFavorites(prev => prev.filter(fav => fav.id !== locationId));
  }

  useEffect(() => {
    const fetchWeather = async () => {
      if (!location) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getWeather(location, units);
        setWeatherData(data);
      } catch (err) {
        setError('Failed to fetch weather data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (view === 'dashboard' || view === 'map') {
        fetchWeather();
    } else {
        setLoading(false);
    }
  }, [location, units, view]);

  useEffect(() => {
    const defaultBg = backgroundImages['DEFAULT'];
    if (weatherData && weatherData.current && weatherData.current.icon) {
      const icon = weatherData.current.icon;
      const imageUrl = backgroundImages[icon] || defaultBg;
      document.body.style.backgroundImage = `url('${imageUrl}')`;
    } else {
      document.body.style.backgroundImage = `url('${defaultBg}')`;
    }
  }, [weatherData]);

  const renderContent = () => {
    switch(view) {
      case 'dashboard':
        return <WeatherDashboard weatherData={weatherData} loading={loading} error={error} units={units} />;
      case 'map':
        return <MapView weatherData={weatherData} loading={loading} error={error} units={units} />;
      case 'favorites':
        return <FavoritesView favorites={favorites} onSelectLocation={handleSetLocationFromFavorite} onNavigate={setView} onDelete={handleDeleteFavorite} />;
      default:
        return null;
    }
  }

  return (
    <div className="w-[95vw] max-w-[1280px] aspect-[16/9] max-h-[95vh] bg-black/30 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex font-sans">
      <Sidebar 
        weatherData={weatherData} 
        units={units}
        onUnitsChange={handleUnitsChange}
        view={view}
        onNavigate={setView}
      />
      <div className="flex-1 flex flex-col">
        <Header location={location} onSearch={setLocation} onGeolocate={handleGeolocate} />
        <main className={`flex-1 overflow-hidden p-8 ${view === 'dashboard' ? 'overflow-y-auto' : ''}`}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;