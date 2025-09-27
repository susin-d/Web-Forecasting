
import React, { useState, useEffect } from 'react';
import { getWeather } from '../services/weatherService';
import { WeatherData, FavoriteLocation } from '../types';
import CurrentWeather from './CurrentWeather';
import HourlyForecast from './HourlyForecast';
import DailyForecast from './DailyForecast';
import WeatherAlerts from './WeatherAlerts';

interface WeatherDashboardProps {
  location: string;
  favorites: FavoriteLocation[];
  onAddFavorite: (location: FavoriteLocation) => void;
  onRemoveFavorite: (locationId: string) => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-accent"></div>
    </div>
);


const WeatherDashboard: React.FC<WeatherDashboardProps> = ({ location, favorites, onAddFavorite, onRemoveFavorite }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getWeather(location);
        setWeatherData(data);
      } catch (err) {
        setError('Failed to fetch weather data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  if (loading) {
    return (
        <div className="w-full h-full flex items-center justify-center">
             <LoadingSpinner />
        </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-400">{error}</div>;
  }

  if (!weatherData) {
    return <div className="text-center">No weather data available.</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <CurrentWeather 
          data={weatherData.current} 
          locationData={weatherData}
          favorites={favorites}
          onAddFavorite={onAddFavorite}
          onRemoveFavorite={onRemoveFavorite}
        />
        <HourlyForecast data={weatherData.hourly} />
        <DailyForecast data={weatherData.daily} />
      </div>
      <div className="lg:col-span-1">
        <WeatherAlerts alerts={weatherData.alerts} />
      </div>
    </div>
  );
};

export default WeatherDashboard;
