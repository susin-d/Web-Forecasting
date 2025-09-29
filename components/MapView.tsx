import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, LayersControl, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L, { LatLng } from 'leaflet';
import { WeatherData, TemperatureUnit, WindSpeedUnit } from '../types';
import { getWeatherByCoords } from '../services/weatherService';

// IMPORTANT: In a real application, this key should be stored in an environment variable
// and not be hardcoded in the source code. For example, using process.env.REACT_APP_OWM_API_KEY.
// For this demonstration, please replace 'YOUR_OPENWEATHERMAP_API_KEY' with your actual key.
const OPENWEATHERMAP_API_KEY = '2398d84d42e14683b5344623252809';

const isApiKeySet = OPENWEATHERMAP_API_KEY && OPENWEATHERMAP_API_KEY !== 'YOUR_OPENWEATHERMAP_API_KEY';

// FIX: Defined MapViewProps to fix 'Cannot find name' error.
interface MapViewProps {
  weatherData: WeatherData | null;
  loading: boolean;
  error: string | null;
  units: { temp: TemperatureUnit; wind: WindSpeedUnit };
}

interface ClickedPointData {
  coords: LatLng;
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
}

const RecenterAutomatically: React.FC<{lat: number, lon: number}> = ({lat, lon}) => {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lon], map.getZoom());
    }, [lat, lon, map]);
    return null;
}

const MapClickHandler: React.FC<{onClick: (latlng: LatLng) => void}> = ({ onClick }) => {
    useMapEvents({
      click(e) {
        onClick(e.latlng);
      },
    });
    return null;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-full w-full">
        <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-accent"></div>
    </div>
);

const ErrorDisplay: React.FC<{error: string}> = ({error}) => (
    <div className="flex flex-col items-center justify-center h-full text-center bg-red-900/30 backdrop-blur-md p-8 rounded-2xl border border-red-500/50">
        <i className="fas fa-exclamation-triangle text-5xl text-red-400 mb-4"></i>
        <h2 className="text-2xl font-bold text-red-200 mb-2">Map Error</h2>
        <p className="text-red-300">{error}</p>
    </div>
);

const ApiKeyErrorDisplay: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center bg-yellow-900/30 backdrop-blur-md p-8 rounded-2xl border border-yellow-500/50">
        <i className="fas fa-key text-5xl text-yellow-400 mb-4"></i>
        <h2 className="text-2xl font-bold text-yellow-200 mb-2">Configuration Needed</h2>
        <p className="text-yellow-300 mb-6">OpenWeatherMap API key is not set.</p>
        <div className="text-left text-sm space-y-2 max-w-md bg-black/20 p-4 rounded-lg">
          <p className="font-semibold text-yellow-200">To enable map layers:</p>
          <ol className="list-decimal list-inside space-y-1 text-yellow-300">
            <li>Open the file: <code className="bg-yellow-900/50 px-1 rounded">components/MapView.tsx</code></li>
            <li>Find the <code className="bg-yellow-900/50 px-1 rounded">OPENWEATHERMAP_API_KEY</code> constant.</li>
            <li>Replace <code className="bg-yellow-900/50 px-1 rounded">'YOUR_OPENWEATHERMAP_API_KEY'</code> with your actual key.</li>
          </ol>
           <p className="mt-4 text-xs text-yellow-400/80">In a production application, this key should be loaded securely from environment variables, not hardcoded.</p>
        </div>
    </div>
);

const baseLayers = [
  {
    name: "Street Map",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  {
    name: "Satellite",
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
  }
];

const weatherOverlays = [
    { name: "Temperature", layer: "temp_new", checked: true },
    { name: "Precipitation", layer: "precipitation_new" },
    { name: "Wind Speed", layer: "wind_new" },
];

const MapView: React.FC<MapViewProps> = ({ weatherData, loading, error, units }) => {
    const [clickedPoint, setClickedPoint] = useState<ClickedPointData | null>(null);
    const clickedMarkerRef = useRef<L.Marker>(null);

    useEffect(() => {
        if (clickedPoint && !clickedPoint.loading && clickedMarkerRef.current) {
            clickedMarkerRef.current.openPopup();
        }
    }, [clickedPoint]);

    const handleMapClick = async (latlng: LatLng) => {
        setClickedPoint({ coords: latlng, weather: null, loading: true, error: null });
        try {
            const data = await getWeatherByCoords(latlng.lat, latlng.lng, units);
            setClickedPoint({ coords: latlng, weather: data, loading: false, error: null });
        } catch (err) {
            console.error("Failed to fetch weather for clicked point:", err);
            let errorMessage = "We couldn't retrieve weather details for this exact point.";
            
            // Provide a more specific message if it seems to be an API-related fetch error.
            if (err instanceof Error && err.message.toLowerCase().includes('failed to fetch')) {
                 errorMessage = "Weather data seems to be unavailable for this specific region."
            }
            
            setClickedPoint({ coords: latlng, weather: null, loading: false, error: errorMessage });
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorDisplay error={error} />;
    if (!weatherData) return <div className="text-center text-text-secondary p-8">No location data to display map.</div>;
    if (!isApiKeySet) return <ApiKeyErrorDisplay />;

    const { latitude, longitude, location, current } = weatherData;
    const position: [number, number] = [latitude, longitude];

    return (
        <div className="h-full w-full bg-black/20 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
            <MapContainer center={position} zoom={10} scrollWheelZoom={true} style={{ height: '100%', width: '100%', backgroundColor: 'transparent' }}>
                <LayersControl position="topright">
                    {baseLayers.map((layer, index) => (
                        <LayersControl.BaseLayer key={layer.name} name={layer.name} checked={index === 0}>
                            <TileLayer url={layer.url} attribution={layer.attribution} />
                        </LayersControl.BaseLayer>
                    ))}
                    
                    {weatherOverlays.map(overlay => (
                        <LayersControl.Overlay key={overlay.name} name={overlay.name} checked={overlay.checked}>
                            <TileLayer
                                url={`https://tile.openweathermap.org/map/${overlay.layer}/{z}/{x}/{y}.png?appid=${OPENWEATHERMAP_API_KEY}`}
                                attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
                            />
                        </LayersControl.Overlay>
                    ))}
                </LayersControl>

                <Marker position={position}>
                    <Popup>
                        <div>
                            <h3 className="font-bold text-base text-text-primary">{location}</h3>
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-text-secondary">{current.temperature}° - {current.description}</p>
                                {current.windDirection != null && (
                                    <div className="flex items-center ml-3" title={`Wind: ${current.windSpeed} ${units.wind === 'kmh' ? 'km/h' : 'mph'}`}>
                                        <i 
                                            className="fas fa-location-arrow text-accent" 
                                            style={{ transform: `rotate(${current.windDirection - 45}deg)` }}
                                        ></i>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Popup>
                </Marker>

                {clickedPoint && (
                    <Marker position={clickedPoint.coords} ref={clickedMarkerRef}>
                        <Popup>
                            {clickedPoint.loading && (
                                <div className="flex flex-col items-center justify-center p-2 text-center min-w-[150px]">
                                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-accent mb-2"></div>
                                    <p className="text-sm text-text-secondary">Fetching weather...</p>
                                </div>
                            )}
                            {clickedPoint.error && (
                                <div className="text-center p-2 min-w-[180px]">
                                    <i className="fas fa-exclamation-triangle text-red-400 text-2xl mb-2"></i>
                                    <h4 className="font-bold text-base text-red-300">Data Unavailable</h4>
                                    <p className="text-sm text-text-secondary mt-1">{clickedPoint.error}</p>
                                    <p className="text-xs text-text-secondary/70 mt-2">Please try clicking a different spot.</p>
                                </div>
                            )}
                            {clickedPoint.weather && (
                                <div>
                                    <h3 className="font-bold text-base text-text-primary">{clickedPoint.weather.location}</h3>
                                     <div className="flex justify-between items-center">
                                        <p className="text-sm text-text-secondary">{clickedPoint.weather.current.temperature}° - {clickedPoint.weather.current.description}</p>
                                        {clickedPoint.weather.current.windDirection != null && (
                                            <div className="flex items-center ml-3" title={`Wind: ${clickedPoint.weather.current.windSpeed} ${units.wind === 'kmh' ? 'km/h' : 'mph'}`}>
                                                <i 
                                                    className="fas fa-location-arrow text-accent" 
                                                    style={{ transform: `rotate(${clickedPoint.weather.current.windDirection - 45}deg)` }}
                                                ></i>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </Popup>
                    </Marker>
                )}

                <MapClickHandler onClick={handleMapClick} />
                <RecenterAutomatically lat={latitude} lon={longitude} />
            </MapContainer>
        </div>
    );
}

export default MapView;