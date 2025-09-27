
import React from 'react';
import { WeatherAlert } from '../types';

interface WeatherAlertsProps {
  alerts: WeatherAlert[];
}

const AlertCard: React.FC<{ alert: WeatherAlert }> = ({ alert }) => {
    const severityColors = {
        low: 'bg-blue-900 border-blue-400',
        moderate: 'bg-yellow-900 border-yellow-400',
        high: 'bg-red-900 border-red-400',
    }

    return (
        <div className={`p-4 rounded-xl border-l-4 ${severityColors[alert.severity]}`}>
            <div className="flex items-center">
                <i className="fas fa-exclamation-triangle mr-3"></i>
                <h4 className="font-bold">{alert.title}</h4>
            </div>
            <p className="text-sm text-text-secondary mt-2">{alert.description}</p>
        </div>
    )
}

const WeatherAlerts: React.FC<WeatherAlertsProps> = ({ alerts }) => {
  return (
    <div className="bg-secondary p-6 rounded-2xl shadow-lg h-full">
      <h3 className="text-xl font-bold mb-4">Active Alerts</h3>
      {alerts.length > 0 ? (
        <div className="space-y-4">
            {alerts.map((alert, index) => (
                <AlertCard key={index} alert={alert} />
            ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-text-secondary">
            <i className="fas fa-check-circle text-4xl mb-2"></i>
            <p>No active alerts.</p>
        </div>
      )}
    </div>
  );
};

export default WeatherAlerts;
