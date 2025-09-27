
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import WeatherDashboard from './components/WeatherDashboard';
import FavoritesView from './components/FavoritesView';
import ProfileView from './components/ProfileView';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import { View, FavoriteLocation } from './types';

const initialFavorites: FavoriteLocation[] = [
    { id: 'Tokyo, Japan', name: 'Tokyo, Japan', latitude: 35.6895, longitude: 139.6917 },
    { id: 'London, UK', name: 'London, UK', latitude: 51.5074, longitude: -0.1278 },
    { id: 'Sydney, Australia', name: 'Sydney, Australia', latitude: -33.8688, longitude: 151.2093 },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [currentLocation, setCurrentLocation] = useState<string>('New York, NY');
  const [favorites, setFavorites] = useState<FavoriteLocation[]>(initialFavorites);

  const handleAddFavorite = (location: FavoriteLocation) => {
    if (!favorites.some(fav => fav.id === location.id)) {
      setFavorites(prev => [...prev, location]);
    }
  };

  const handleRemoveFavorite = (locationId: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== locationId));
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <WeatherDashboard 
                  location={currentLocation} 
                  favorites={favorites}
                  onAddFavorite={handleAddFavorite}
                  onRemoveFavorite={handleRemoveFavorite}
               />;
      case 'favorites':
        return <FavoritesView 
                  favorites={favorites}
                  onSelectLocation={setCurrentLocation} 
                  onNavigate={setCurrentView}
                  onDelete={handleRemoveFavorite}
               />;
      case 'profile':
        return <ProfileView />;
      case 'login':
        return <LoginView onNavigate={setCurrentView} />;
      case 'register':
        return <RegisterView onNavigate={setCurrentView} />;
      default:
        return <WeatherDashboard 
                  location={currentLocation} 
                  favorites={favorites}
                  onAddFavorite={handleAddFavorite}
                  onRemoveFavorite={handleRemoveFavorite}
                />;
    }
  };
  
  // Login and Register views are standalone and don't need the main layout
  if (currentView === 'login' || currentView === 'register') {
      return (
        <div className="min-h-screen bg-primary flex items-center justify-center">
            {renderView()}
        </div>
      );
  }

  return (
    <div className="flex h-screen bg-primary text-text-primary overflow-hidden">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header location={currentLocation} onSearch={setCurrentLocation} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-secondary">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
