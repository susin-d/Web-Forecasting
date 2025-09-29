import React from 'react';
import ReactAnimatedWeather from 'react-animated-weather';
import { WeatherData, TemperatureUnit, WindSpeedUnit } from '../types';
import DailyForecast from './DailyForecast';
import HourlyForecast from './HourlyForecast';
import WeatherAlerts from './WeatherAlerts';
import { mapWmoCodeToIcon, getWeatherDescription } from '../services/weatherService';


interface WeatherDashboardProps {
  weatherData: WeatherData | null;
  loading: boolean;
  error: string | null;
  units: { temp: TemperatureUnit; wind: WindSpeedUnit };
}

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-full w-full">
        <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-accent"></div>
    </div>
);

interface RecentlySearchedCardProps {
  weatherCode: number;
  isDay: number;
  temp: string;
  city: string;
  country: string;
}

const RecentlySearchedCard: React.FC<RecentlySearchedCardProps> = ({ weatherCode, isDay, temp, city, country }) => {
  const icon = mapWmoCodeToIcon(weatherCode, isDay);
  const condition = getWeatherDescription(weatherCode);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center space-x-4 backdrop-blur-md hover:bg-white/10 transition-all duration-300">
      <div className="w-12 h-12 flex items-center justify-center">
        <ReactAnimatedWeather
          icon={icon}
          color={'#f8fafc'}
          size={48}
          animate={true}
        />
      </div>
      <div>
        <p className="text-4xl font-light text-text-primary">{temp}</p>
      </div>
      <div className="flex-1 border-l border-white/10 pl-4">
        <p className="font-bold text-text-primary">{city}, {country}</p>
        <p className="text-sm text-text-secondary">{condition}</p>
      </div>
    </div>
  );
};


const WeatherDashboard: React.FC<WeatherDashboardProps> = ({ weatherData, loading, error, units }) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center bg-red-900/30 backdrop-blur-md p-8 rounded-2xl border border-red-500/50">
            <i className="fas fa-exclamation-triangle text-5xl text-red-400 mb-4"></i>
            <h2 className="text-2xl font-bold text-red-200 mb-2">Oops! Weather Update Failed</h2>
            <p className="text-red-300 mb-6">{error}</p>
            <div className="text-left text-sm space-y-2 max-w-md">
                <p className="font-semibold text-red-200">What you can do:</p>
                <ul className="list-disc list-inside space-y-1 text-red-300">
                    <li>Double-check the spelling of the location you entered.</li>
                    <li>Verify that your device is connected to the internet.</li>
                    <li>The weather service may be temporarily unavailable. Please try again in a few moments.</li>
                </ul>
            </div>
        </div>
    );
  }

  if (!weatherData) {
    return <div className="text-center text-text-secondary p-8">No weather data available.</div>;
  }
  
  const { current, daily, hourly, alerts } = weatherData;
  const windUnit = units.wind === 'kmh' ? 'km/h' : 'mph';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-black/20 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
             <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-baseline space-x-4">
                        <h1 className="text-9xl font-thin text-text-primary tracking-tighter">{current.temperature}°</h1>
                        <p className="text-xl text-text-secondary">Feels like {current.apparentTemperature}°</p>
                    </div>
                    <p className="text-4xl text-text-secondary -mt-2">{current.description}</p>
                </div>
                <div className="relative w-32 h-32 flex items-center justify-center">
                    <ReactAnimatedWeather
                        icon={current.icon}
                        color={'#f8fafc'}
                        size={128}
                        animate={true}
                    />
                </div>
                <div className="mt-4 space-y-2 text-text-primary">
                    <div className="bg-white/10 px-3 py-1 rounded-md text-sm"><span className="font-bold text-text-secondary mr-2">H</span> {daily[0].tempMax}°</div>
                    <div className="bg-white/10 px-3 py-1 rounded-md text-sm"><span className="font-bold text-text-secondary mr-2">L</span> {daily[0].tempMin}°</div>
                </div>
            </div>
            <div className="flex items-center text-text-secondary mt-4 text-sm space-x-6">
                <div className="flex items-center"><i className="fa-solid fa-wind mr-2"></i> Wind: {current.windSpeed} {windUnit}</div>
                <div className="flex items-center"><i className="fa-solid fa-droplet mr-2"></i> Humidity: {current.humidity}%</div>
            </div>
          </div>
          
          <div>
            <p className="text-text-secondary text-sm mb-4">With real time data and advanced technology, we provide reliable forecasts for any location around the world.</p>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-text-secondary font-semibold text-sm">Recently Searched</h3>
              <a href="#" className="text-text-secondary text-xs hover:text-accent">See All &gt;</a>
            </div>
            <div className="space-y-3">
              <RecentlySearchedCard weatherCode={2} isDay={1} temp="16°" city="Liverpool" country="UK" />
              <RecentlySearchedCard weatherCode={95} isDay={1} temp="-2°" city="Palermo" country="Italy" />
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1 space-y-8">
          <HourlyForecast data={hourly} />
          <WeatherAlerts alerts={alerts} />
        </div>
        
      </div>
      
      <div className="bg-black/20 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
        <h3 className="text-text-secondary font-semibold text-sm mb-4">7-Day Forecast</h3>
        <DailyForecast data={daily} units={units} />
      </div>
    </div>
  );
};

export default WeatherDashboard;