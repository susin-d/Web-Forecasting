import { WeatherData, TemperatureUnit, WindSpeedUnit } from '../types';

/**
 * Maps WMO weather codes to react-animated-weather icon component names.
 * @param code The WMO weather interpretation code.
 * @param isDay 1 for day, 0 for night.
 * @returns A string with the corresponding icon name.
 */
export const mapWmoCodeToIcon = (code: number, isDay: number = 1): string => {
  const mapping: { [key: number]: { day: string; night: string } } = {
    0: { day: 'CLEAR_DAY', night: 'CLEAR_NIGHT' },
    1: { day: 'PARTLY_CLOUDY_DAY', night: 'PARTLY_CLOUDY_NIGHT' },
    2: { day: 'PARTLY_CLOUDY_DAY', night: 'PARTLY_CLOUDY_NIGHT' },
    3: { day: 'CLOUDY', night: 'CLOUDY' },
    45: { day: 'FOG', night: 'FOG' },
    48: { day: 'FOG', night: 'FOG' },
    51: { day: 'RAIN', night: 'RAIN' },
    53: { day: 'RAIN', night: 'RAIN' },
    55: { day: 'RAIN', night: 'RAIN' },
    56: { day: 'SLEET', night: 'SLEET' },
    57: { day: 'SLEET', night: 'SLEET' },
    61: { day: 'RAIN', night: 'RAIN' },
    63: { day: 'RAIN', night: 'RAIN' },
    65: { day: 'RAIN', night: 'RAIN' },
    66: { day: 'SLEET', night: 'SLEET' },
    67: { day: 'SLEET', night: 'SLEET' },
    71: { day: 'SNOW', night: 'SNOW' },
    73: { day: 'SNOW', night: 'SNOW' },
    75: { day: 'SNOW', night: 'SNOW' },
    77: { day: 'SNOW', night: 'SNOW' },
    80: { day: 'RAIN', night: 'RAIN' },
    81: { day: 'RAIN', night: 'RAIN' },
    82: { day: 'RAIN', night: 'RAIN' },
    85: { day: 'SNOW', night: 'SNOW' },
    86: { day: 'SNOW', night: 'SNOW' },
    95: { day: 'RAIN', night: 'RAIN' }, // Fallback for Thunderstorm
    96: { day: 'RAIN', night: 'RAIN' }, // Fallback for Thunderstorm
    99: { day: 'RAIN', night: 'RAIN' }, // Fallback for Thunderstorm
  };

  const icons = mapping[code] || { day: 'CLEAR_DAY', night: 'CLEAR_NIGHT' };
  return isDay ? icons.day : icons.night;
};


/**
 * Maps WMO weather codes to a human-readable description.
 * @param code The WMO weather interpretation code.
 * @returns A string with the weather description.
 */
export const getWeatherDescription = (code: number): string => {
    const descriptions: { [key: number]: string } = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Fog',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        56: 'Light freezing drizzle',
        57: 'Dense freezing drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        66: 'Light freezing rain',
        67: 'Heavy freezing rain',
        71: 'Slight snow fall',
        73: 'Moderate snow fall',
        75: 'Heavy snow fall',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail',
    };
    return descriptions[code] || 'Unknown weather';
};

/**
 * Fetches and formats weather data from Open-Meteo API.
 * @private
 */
const fetchAndFormatWeather = async (latitude: number, longitude: number, locationName: string, units: { temp: TemperatureUnit, wind: WindSpeedUnit }): Promise<WeatherData> => {
  const weatherParams = {
      latitude: latitude,
      longitude: longitude,
      current: 'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day,wind_direction_10m',
      hourly: 'temperature_2m,weather_code,is_day',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
      wind_speed_unit: units.wind,
      temperature_unit: units.temp,
      timezone: 'auto'
  };
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?${new URLSearchParams(weatherParams as any).toString()}`;
  
  const weatherResponse = await fetch(weatherUrl);
  if (!weatherResponse.ok) {
      const errorData = await weatherResponse.json();
      throw new Error(`Failed to fetch weather data: ${errorData.reason || 'Unknown error'}`);
  }
  const data = await weatherResponse.json();

  const formattedData: WeatherData = {
    location: locationName,
    latitude: latitude,
    longitude: longitude,
    current: {
      temperature: Math.round(data.current.temperature_2m),
      apparentTemperature: Math.round(data.current.apparent_temperature),
      humidity: data.current.relative_humidity_2m,
      windSpeed: Math.round(data.current.wind_speed_10m),
      windDirection: data.current.wind_direction_10m,
      description: getWeatherDescription(data.current.weather_code),
      icon: mapWmoCodeToIcon(data.current.weather_code, data.current.is_day),
    },
    hourly: [],
    daily: data.daily.time.slice(0, 7).map((dateString: string, index: number) => ({
      day: new Date(dateString).toLocaleDateString([], { weekday: 'short' }),
      tempMax: Math.round(data.daily.temperature_2m_max[index]),
      tempMin: Math.round(data.daily.temperature_2m_min[index]),
      precipitation: data.daily.precipitation_probability_max[index],
      icon: mapWmoCodeToIcon(data.daily.weather_code[index], 1),
    })),
    alerts: [],
  };

  const now = new Date();
  const firstFutureHourIndex = data.hourly.time.findIndex((isoString: string) => new Date(isoString) >= now);
  const startIndex = firstFutureHourIndex !== -1 ? firstFutureHourIndex : 0;
  
  formattedData.hourly = data.hourly.time.slice(startIndex, startIndex + 6).map((isoString: string, i: number) => {
    const index = startIndex + i;
    return {
      time: new Date(isoString).toLocaleTimeString([], { hour: 'numeric', hour12: true }),
      temp: Math.round(data.hourly.temperature_2m[index]),
      icon: mapWmoCodeToIcon(data.hourly.weather_code[index], data.hourly.is_day[index]),
    };
  });

  return formattedData;
}

/**
 * Fetches weather data for given coordinates.
 * @param lat The latitude.
 * @param lon The longitude.
 * @returns A promise that resolves to the formatted WeatherData object.
 */
export const getWeatherByCoords = async (lat: number, lon: number, units: { temp: TemperatureUnit, wind: WindSpeedUnit }): Promise<WeatherData> => {
  const reverseGeoUrl = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&count=1&language=en&format=json`;
  const geoResponse = await fetch(reverseGeoUrl);
  if (!geoResponse.ok) {
    throw new Error(`Failed to fetch location data for coordinates: ${geoResponse.statusText}`);
  }
  const geoData = await geoResponse.json();
  const locationName = geoData.name ? (geoData.country ? `${geoData.name}, ${geoData.country}` : geoData.name) : `${lat.toFixed(2)}, ${lon.toFixed(2)}`;

  return fetchAndFormatWeather(lat, lon, locationName, units);
}

/**
 * Fetches weather data for a given location using Open-Meteo API.
 * @param location The city name to fetch weather for (e.g., "London").
 * @returns A promise that resolves to the formatted WeatherData object.
 */
export const getWeather = async (location: string, units: { temp: TemperatureUnit, wind: WindSpeedUnit }): Promise<WeatherData> => {
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`;
  const geoResponse = await fetch(geoUrl);
  if (!geoResponse.ok) {
    throw new Error(`Failed to fetch location data: ${geoResponse.statusText}`);
  }
  const geoData = await geoResponse.json();
  if (!geoData.results || geoData.results.length === 0) {
    throw new Error(`Could not find location: ${location}`);
  }
  const { latitude, longitude, name, country } = geoData.results[0];
  const locationName = country ? `${name}, ${country}` : name;

  return fetchAndFormatWeather(latitude, longitude, locationName, units);
};