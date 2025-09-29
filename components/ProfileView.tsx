import React from 'react';
import { TemperatureUnit, WindSpeedUnit } from '../types';

interface SettingsPanelProps {
  units: { temp: TemperatureUnit; wind: WindSpeedUnit };
  onUnitsChange: (newUnits: { temp: TemperatureUnit; wind: WindSpeedUnit }) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ units, onUnitsChange }) => {
  
  const ToggleButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode; className?: string }> = ({ active, onClick, children, className }) => (
    <button
      onClick={onClick}
      className={`flex-1 py-1 rounded-full text-xs font-semibold transition-colors ${
        active ? 'bg-white/20 text-text-primary' : 'bg-transparent text-text-secondary hover:bg-white/10'
      } ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div>
       <h3 className="text-text-secondary font-semibold text-sm mb-2">Settings</h3>
       <div className="bg-black/30 border border-white/10 rounded-2xl p-3 space-y-3 backdrop-blur-md">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2 px-1">Temperature</label>
          <div className="flex items-center space-x-1 bg-black/20 border border-white/10 p-1 rounded-full">
             <ToggleButton active={units.temp === 'celsius'} onClick={() => onUnitsChange({ ...units, temp: 'celsius' })}>
                °C
             </ToggleButton>
             <ToggleButton active={units.temp === 'fahrenheit'} onClick={() => onUnitsChange({ ...units, temp: 'fahrenheit' })}>
                °F
             </ToggleButton>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2 px-1">Wind Speed</label>
           <div className="flex items-center space-x-1 bg-black/20 border border-white/10 p-1 rounded-full">
             <ToggleButton active={units.wind === 'kmh'} onClick={() => onUnitsChange({ ...units, wind: 'kmh' })}>
                km/h
             </ToggleButton>
             <ToggleButton active={units.wind === 'mph'} onClick={() => onUnitsChange({ ...units, wind: 'mph' })}>
                mph
             </ToggleButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;