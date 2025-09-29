
import React from 'react';
import { CurrentWeather as CurrentWeatherType, FavoriteLocation, WeatherData } from '../types';

interface CurrentWeatherProps {
  data: CurrentWeatherType;
  locationData: Pick<WeatherData, 'location' | 'latitude' | 'longitude'>;
  favorites: FavoriteLocation[];
  onAddFavorite: (location: FavoriteLocation) => void;
  onRemoveFavorite: (locationId: string) => void;
}

const WeatherDetail: React.FC<{ icon: string; label: string; value: string | number }> = ({ icon, label, value }) => (
  <div className="flex items-center">
    <i className={`fas ${icon} text-accent text-lg`}></i>
    <div className="ml-3">
      <p className="text-sm text-text-secondary">{label}</p>
      <p className="font-bold text-text-primary">{value}</p>
    </div>
  </div>
);


const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, locationData, favorites, onAddFavorite, onRemoveFavorite }) => {
  const isFavorite = favorites.some(fav => fav.name === locationData.location);

  const handleFavoriteClick = () => {
    if (isFavorite) {
      onRemoveFavorite(locationData.location);
    } else {
      onAddFavorite({
        id: locationData.location,
        name: locationData.location,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
      });
    }
  };
  
  return (
    <div className="bg-secondary rounded-2xl p-6 shadow-md transition-transform transform hover:scale-105 duration-300 border border-tertiary">
      <div className="flex justify-between items-start">
        <div>
           <div className="flex items-center">
            <h2 className="text-2xl font-bold text-text-primary">{locationData.location}</h2>
            <button 
              onClick={handleFavoriteClick} 
              className="ml-4 text-2xl transition-transform transform hover:scale-125 duration-200 focus:outline-none"
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <i className={`fa-star ${isFavorite ? 'fas text-yellow-400' : 'far text-text-secondary'}`}></i>
            </button>
          </div>
          <p className="text-text-secondary">{data.description}</p>
        </div>
        <i className={`fas ${data.icon} text-5xl text-accent`}></i>
      </div>
      <div className="flex items-end mt-4">
        <h1 className="text-7xl font-extrabold text-text-primary">{data.temperature}°</h1>
        <p className="ml-4 mb-2 text-lg text-text-secondary">Feels like {data.apparentTemperature}°</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-tertiary">
        <WeatherDetail icon="fa-tint" label="Humidity" value={`${data.humidity}%`} />
        <WeatherDetail icon="fa-wind" label="Wind Speed" value={`${data.windSpeed} km/h`} />
      </div>
    </div>
  );
};

export default CurrentWeather;