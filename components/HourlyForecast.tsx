import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { HourlyForecastItem } from '../types';

interface HourlyForecastProps {
  data: HourlyForecastItem[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/80 p-2 rounded-lg border border-white/10 backdrop-blur-sm shadow-lg">
        <p className="label text-text-secondary text-sm">{`${label}`}</p>
        <p className="intro text-text-primary font-bold">{`Temp: ${payload[0].value}°`}</p>
      </div>
    );
  }
  return null;
};

const HourlyForecast: React.FC<HourlyForecastProps> = ({ data }) => {
  return (
    <div className="bg-black/20 border border-white/10 rounded-2xl p-6 h-full backdrop-blur-md">
      <h3 className="text-text-secondary font-semibold text-sm mb-4">Hourly Forecast</h3>
      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={'rgba(255, 255, 255, 0.1)'} />
            <XAxis dataKey="time" stroke={'#94a3b8'} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke={'#94a3b8'} fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
            <Line type="monotone" dataKey="temp" stroke="#22d3ee" strokeWidth={2} dot={{ r: 3, fill: '#22d3ee' }} activeDot={{ r: 6 }}/>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HourlyForecast;