import { WeatherData } from '../types';

/**
 * Maps WMO weather codes to Font Awesome icon class names.
 * @param code The WMO weather interpretation code.
 * @param isDay 1 for day, 0 for night.
 * @returns A string with the corresponding Font Awesome class name.
 */
const mapWmoCodeToIcon = (code: number, isDay: number = 1): string => {
  const mapping: { [key: number]: { day: string; night: string } } = {
    0: { day: 'fa-sun', night: 'fa-moon' }, // Clear sky
    1: { day: 'fa-cloud-sun', night: 'fa-cloud-moon' }, // Mainly clear
    2: { day: 'fa-cloud', night: 'fa-cloud' }, // Partly cloudy
    3: { day: 'fa-cloud', night: 'fa-cloud' }, // Overcast
    45: { day: 'fa-smog', night: 'fa-smog' }, // Fog
    48: { day: 'fa-smog', night: 'fa-smog' }, // Depositing rime fog
    51: { day: 'fa-cloud-rain', night: 'fa-cloud-rain' }, // Drizzle: Light
    53: { day: 'fa-cloud-rain', night: 'fa-cloud-rain' }, // Drizzle: Moderate
    55: { day: 'fa-cloud-rain', night: 'fa-cloud-rain' }, // Drizzle: Dense
    56: { day: 'fa-snowflake', night: 'fa-snowflake' }, // Freezing Drizzle: Light
    57: { day: 'fa-snowflake', night: 'fa-snowflake' }, // Freezing Drizzle: Dense
    61: { day: 'fa-cloud-showers-heavy', night: 'fa-cloud-moon-rain' }, // Rain: Slight
    63: { day: 'fa-cloud-showers-heavy', night: 'fa-cloud-moon-rain' }, // Rain: Moderate
    65: { day: 'fa-cloud-showers-heavy', night: 'fa-cloud-moon-rain' }, // Rain: Heavy
    66: { day: 'fa-snowflake', night: 'fa-snowflake' }, // Freezing Rain: Light
    67: { day: 'fa-snowflake', night: 'fa-snowflake' }, // Freezing Rain: Heavy
    71: { day: 'fa-snowflake', night: 'fa-snowflake' }, // Snow fall: Slight
    73: { day: 'fa-snowflake', night: 'fa-snowflake' }, // Snow fall: Moderate
    75: { day: 'fa-snowflake', night: 'fa-snowflake' }, // Snow fall: Heavy
    77: { day: 'fa-snowflake', night: 'fa-snowflake' }, // Snow grains
    80: { day: 'fa-cloud-showers-heavy', night: 'fa-cloud-moon-rain' }, // Rain showers: Slight
    81: { day: 'fa-cloud-showers-heavy', night: 'fa-cloud-moon-rain' }, // Rain showers: Moderate
    82: { day: 'fa-cloud-showers-heavy', night: 'fa-cloud-moon-rain' }, // Rain showers: Violent
    85: { day: 'fa-snowflake', night: 'fa-snowflake' }, // Snow showers slight
    86: { day: 'fa-snowflake', night: 'fa-snowflake' }, // Snow showers heavy
    95: { day: 'fa-cloud-bolt', night: 'fa-cloud-bolt' }, // Thunderstorm: Slight or moderate
    96: { day: 'fa-cloud-bolt', night: 'fa-cloud-bolt' }, // Thunderstorm with slight hail
    99: { day: 'fa-cloud-bolt', night: 'fa-cloud-bolt' }, // Thunderstorm with heavy hail
  };

  const icons = mapping[code] || { day: 'fa-question-circle', night: 'fa-question-circle' };
  return isDay ? icons.day : icons.night;
};


/**
 * Maps WMO weather codes to a human-readable description.
 * @param code The WMO weather interpretation code.
 * @returns A string with the weather description.
 */
const getWeatherDescription = (code: number): string => {
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
 * Fetches weather data for a given location using the backend API.
 * @param location The city name to fetch weather for (e.g., "London").
 * @returns A promise that resolves to the formatted WeatherData object.
 */
export const getWeather = async (location: string): Promise<WeatherData> => {
  const backendUrl = `http://localhost:8080/api/weather?location=${encodeURIComponent(location)}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(backendUrl, { headers });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch weather data: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();

  // The backend already returns data in the correct format
  return data;
};