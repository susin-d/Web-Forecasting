
import React, { useState, useEffect } from 'react';

interface HeaderProps {
  location: string;
  onSearch: (location: string) => void;
  onGeolocate: () => void;
}

const Header: React.FC<HeaderProps> = ({ location, onSearch, onGeolocate }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const formattedDate = `(${currentTime.toLocaleDateString('en-US', { weekday: 'long' })}, ${currentTime.toLocaleDateString('en-US', { month: 'long' })} ${currentTime.getDate()})`;
  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
      setIsSearching(false);
    }
  };

  return (
    <header className="p-8 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center text-text-secondary">
        <i className="fa-solid fa-location-dot mr-3"></i>
        <p className="font-semibold text-text-primary">{location}</p>
        <div className="ml-2 text-sm hidden md:flex items-baseline space-x-2">
          <span>{formattedDate}</span>
          <span className="font-mono text-xs bg-black/20 px-1.5 py-0.5 rounded">{formattedTime}</span>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={onGeolocate}
          className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-text-secondary hover:bg-white/10 hover:text-text-primary transition-colors"
          aria-label="Use current location"
        >
          <i className="fas fa-location-crosshairs"></i>
        </button>
        <div className="flex items-center">
          {isSearching ? (
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search location..."
                className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-full py-2 px-4 w-48 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-accent transition-all duration-300"
                autoFocus
                onBlur={() => {
                  if (!query) setIsSearching(false);
                }}
              />
               <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary">
                <i className="fas fa-search"></i>
              </button>
            </form>
          ) : (
            <button
              onClick={() => setIsSearching(true)}
              className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-text-secondary hover:bg-white/10 hover:text-text-primary transition-colors"
              aria-label="Search location"
            >
              <i className="fas fa-search"></i>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;