import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, ReferenceDot } from 'recharts';
import { DailyForecastItem, TemperatureUnit, WindSpeedUnit } from '../types';

interface DailyForecastProps {
  data: DailyForecastItem[];
  units: { temp: TemperatureUnit; wind: WindSpeedUnit };
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/80 p-3 rounded-lg border border-white/10 backdrop-blur-sm shadow-lg text-center">
        <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">{label}</p>
        <p className="text-text-primary font-bold text-lg">{`${payload[0].value}°`}</p>
      </div>
    );
  }
  return null;
};

const Today = new Date().toLocaleDateString([], { weekday: 'short' });

const DailyForecast: React.FC<DailyForecastProps> = ({ data, units }) => {
  const chartData = data.map(item => ({ name: item.day, temp: item.tempMax }));
  const todayIndex = data.findIndex(item => item.day === Today);

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 text-center mb-2">
        {data.map((item, index) => (
          <div key={index} className={`font-semibold text-sm ${item.day === Today ? 'text-text-primary' : 'text-text-secondary'}`}>
            {item.day}
          </div>
        ))}
      </div>
      <div style={{ width: '100%', height: 100 }}>
        <ResponsiveContainer>
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ stroke: 'rgba(255, 255, 255, 0.2)', strokeWidth: 1, strokeDasharray: '3 3' }} 
            />
            <Area 
                type="monotone" 
                dataKey="temp" 
                stroke="#22d3ee" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorTemp)" 
                activeDot={{ r: 6, stroke: '#22d3ee', strokeWidth: 2, fill: '#1e293b' }}
            />
            {todayIndex !== -1 && (
              // FIX: Removed unsupported 'isFront' prop from ReferenceDot.
               <ReferenceDot 
                x={chartData[todayIndex].name} 
                y={chartData[todayIndex].temp} 
                r={8} 
                fill="#22d3ee" 
                stroke="rgba(34, 211, 238, 0.3)"
                strokeWidth={12} 
                ifOverflow="extendDomain"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-7 text-center mt-2">
         {data.map((item, index) => (
          <div key={index} className="font-bold text-xl text-text-primary">
            {item.tempMax}°
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyForecast;