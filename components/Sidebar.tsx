import React from 'react';
import { WeatherData, TemperatureUnit, WindSpeedUnit, View } from '../types';
import SettingsPanel from './ProfileView';

interface SidebarProps {
  weatherData: WeatherData | null;
  units: { temp: TemperatureUnit; wind: WindSpeedUnit };
  onUnitsChange: (newUnits: { temp: TemperatureUnit; wind: WindSpeedUnit }) => void;
  view: View;
  onNavigate: (view: View) => void;
}

const NavItem: React.FC<{icon: string, label: string, active: boolean, onClick: () => void}> = ({icon, label, active, onClick}) => (
    <button 
      onClick={onClick} 
      className={`w-full flex items-center py-3 px-2 rounded-lg text-left transition-colors text-sm ${
        active 
        ? 'bg-white/20 text-text-primary font-bold' 
        : 'text-text-secondary hover:bg-white/10 hover:text-text-primary font-medium'
      }`}
      aria-current={active ? 'page' : undefined}
    >
        <i className={`fas ${icon} w-6 text-center mr-3 text-base`}></i>
        <span>{label}</span>
    </button>
)

const Sidebar: React.FC<SidebarProps> = ({ weatherData, units, onUnitsChange, view, onNavigate }) => {
  return (
    <aside className="w-[300px] bg-black/20 p-8 flex-shrink-0 flex flex-col justify-between border-r border-white/10">
      <div>
        <div className="flex items-center mb-12">
          <h1 className="text-2xl font-bold text-text-primary">WeatherWise</h1>
        </div>
        
        <nav>
            <h2 className="text-xs font-bold uppercase text-text-secondary/60 tracking-wider px-2 mb-2">Menu</h2>
            <ul className="space-y-1">
                <li>
                    <NavItem icon="fa-tachometer-alt" label="Dashboard" active={view === 'dashboard'} onClick={() => onNavigate('dashboard')} />
                </li>
                <li>
                    <NavItem icon="fa-map-marked-alt" label="Weather Map" active={view === 'map'} onClick={() => onNavigate('map')} />
                </li>
                 <li>
                    <NavItem icon="fa-star" label="Favorites" active={view === 'favorites'} onClick={() => onNavigate('favorites')} />
                </li>
            </ul>
        </nav>
      </div>
      
      <SettingsPanel units={units} onUnitsChange={onUnitsChange} />
    </aside>
  );
};

export default Sidebar;