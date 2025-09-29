# Weather Forecasting App

A full-stack weather forecasting application with a React frontend and a simple Java backend.

## Features

- Current weather information
- Hourly and daily forecasts
- Location search and geocoding
- Dynamic background images based on weather conditions
- Responsive design

## Backend

The backend is a single Java file that proxies requests to Open-Meteo API.

### Running the Backend

1. Ensure Java 11+ is installed.
2. Navigate to the backend directory: `cd backend`
3. Run: `java WeatherApp.java`
4. The server starts on port 8080.

The backend provides two endpoints:
- `/weather`: Proxies weather data from Open-Meteo
- `/geocode`: Proxies geocoding data from Open-Meteo

## Frontend

The frontend is built with React, TypeScript, and Vite.

### Running the Frontend

1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Open http://localhost:5173 in your browser.

The frontend connects to the backend on port 8080.

## Project Structure

- `backend/WeatherApp.java`: Simple Java backend server
- `components/`: React components
- `services/`: API service functions
- `types.ts`: TypeScript type definitions
- `App.tsx`: Main React app component

## Technologies Used

- Backend: Java (built-in HttpServer)
- Frontend: React, TypeScript, Vite
- APIs: Open-Meteo (weather and geocoding)