
import React from 'react';
import { DailyForecastItem } from '../types';

interface DailyForecastProps {
  data: DailyForecastItem[];
}

const DailyForecastCard: React.FC<{ item: DailyForecastItem }> = ({ item }) => (
    <div className="bg-tertiary p-4 rounded-xl flex flex-col items-center text-center transition-transform transform hover:scale-105 duration-300">
        <p className="font-bold text-lg">{item.day}</p>
        <i className={`fas ${item.icon} text-3xl my-3 text-accent`}></i>
        <div className="flex space-x-2">
            <span className="font-semibold">{item.tempMax}°</span>
            <span className="text-text-secondary">{item.tempMin}°</span>
        </div>
        <div className="flex items-center mt-2 text-sm text-text-secondary">
            <i className="fas fa-tint mr-1"></i>
            <span>{item.precipitation}%</span>
        </div>
    </div>
)

const DailyForecast: React.FC<DailyForecastProps> = ({ data }) => {
  return (
    <div className="bg-secondary p-6 rounded-2xl shadow-lg">
      <h3 className="text-xl font-bold mb-4">7-Day Forecast</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
        {data.map((item, index) => (
          <DailyForecastCard key={index} item={item} />
        ))}
      </div>
    </div>
  );
};

export default DailyForecast;
