import React from 'react';
import { WeatherAlert } from '../types';

interface WeatherAlertsProps {
  alerts: WeatherAlert[];
}

const AlertCard: React.FC<{ alert: WeatherAlert }> = ({ alert }) => {
    const severityStyles = {
        low: 'border-sky-400 bg-sky-900/30',
        moderate: 'border-yellow-400 bg-yellow-900/30',
        high: 'border-red-500 bg-red-900/30',
    }
    const textStyles = {
        low: 'text-sky-200',
        moderate: 'text-yellow-200',
        high: 'text-red-200',
    }

    return (
        <div className={`p-4 rounded-xl border-l-4 ${severityStyles[alert.severity]}`}>
            <div className={`flex items-center ${textStyles[alert.severity]}`}>
                <i className="fas fa-exclamation-triangle mr-3"></i>
                <h4 className="font-bold">{alert.title}</h4>
            </div>
            <p className={`text-sm mt-2 ${textStyles[alert.severity]}`}>{alert.description}</p>
        </div>
    )
}

const WeatherAlerts: React.FC<WeatherAlertsProps> = ({ alerts }) => {
  return (
    <div className="bg-black/20 border border-white/10 rounded-2xl p-6 h-full backdrop-blur-md">
      <h3 className="text-text-secondary font-semibold text-sm mb-4">Active Alerts</h3>
      {alerts.length > 0 ? (
        <div className="space-y-4">
            {alerts.map((alert, index) => (
                <AlertCard key={index} alert={alert} />
            ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-text-secondary pt-8 pb-8">
            <i className="fas fa-check-circle text-4xl mb-3 text-green-500"></i>
            <p>No active alerts.</p>
        </div>
      )}
    </div>
  );
};

export default WeatherAlerts;