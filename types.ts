export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  description: string;
  icon: string;
}

export interface HourlyForecastItem {
  time: string;
  temp: number;
  icon: string;
}

export interface DailyForecastItem {
  day: string;
  tempMax: number;
  tempMin: number;
  precipitation: number;
  icon: string;
}

export interface WeatherAlert {
  title: string;
  severity: 'low' | 'moderate' | 'high';
  description: string;
}

export interface FavoriteLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export interface WeatherData {
  location: string;
  latitude: number;
  longitude: number;
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  alerts: WeatherAlert[];
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindSpeedUnit = 'kmh' | 'mph';

export type View = 'dashboard' | 'map' | 'favorites';