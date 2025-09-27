
import React, { useState } from 'react';

const ProfileView: React.FC = () => {
    const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
    const [windAlerts, setWindAlerts] = useState(true);
    const [tempAlerts, setTempAlerts] = useState(false);

    const handleSave = () => {
        // In a real app, this would call an API
        alert('Settings saved!');
    }

  return (
    <div className="bg-secondary p-6 rounded-2xl shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Profile & Settings</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-text-secondary mb-2">Units</label>
          <select 
            value={units}
            onChange={(e) => setUnits(e.target.value as 'metric' | 'imperial')}
            className="w-full bg-tertiary p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="metric">Metric (°C, km/h)</option>
            <option value="imperial">Imperial (°F, mph)</option>
          </select>
        </div>

        <div>
            <h3 className="text-lg font-semibold mb-2">Alert Preferences</h3>
            <div className="flex items-center justify-between bg-tertiary p-3 rounded-md">
                <label htmlFor="windAlerts">Enable Wind Alerts</label>
                <input 
                    type="checkbox" 
                    id="windAlerts"
                    checked={windAlerts}
                    onChange={(e) => setWindAlerts(e.target.checked)}
                    className="form-checkbox h-5 w-5 text-accent bg-primary border-tertiary rounded focus:ring-accent"
                />
            </div>
             <div className="flex items-center justify-between bg-tertiary p-3 rounded-md mt-2">
                <label htmlFor="tempAlerts">Enable Temperature Alerts</label>
                <input 
                    type="checkbox" 
                    id="tempAlerts"
                    checked={tempAlerts}
                    onChange={(e) => setTempAlerts(e.target.checked)}
                    className="form-checkbox h-5 w-5 text-accent bg-primary border-tertiary rounded focus:ring-accent"
                />
            </div>
        </div>

        <button 
            onClick={handleSave}
            className="w-full bg-accent text-white font-bold py-3 rounded-md hover:bg-sky-500 transition-colors duration-300 shadow-lg"
        >
            Save Changes
        </button>
      </div>

    </div>
  );
};

export default ProfileView;
