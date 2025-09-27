
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { HourlyForecastItem } from '../types';

interface HourlyForecastProps {
  data: HourlyForecastItem[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-tertiary p-2 rounded-lg border border-primary shadow-lg">
        <p className="label text-text-secondary">{`${label}`}</p>
        <p className="intro text-accent font-bold">{`Temp: ${payload[0].value}°C`}</p>
      </div>
    );
  }
  return null;
};

const HourlyForecast: React.FC<HourlyForecastProps> = ({ data }) => {
  return (
    <div className="bg-secondary p-6 rounded-2xl shadow-lg">
      <h3 className="text-xl font-bold mb-4">Hourly Forecast</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="temp" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4, fill: '#38bdf8' }} activeDot={{ r: 8 }}/>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HourlyForecast;
