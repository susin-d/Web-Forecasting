
import React, { useState } from 'react';

interface HeaderProps {
  location: string;
  onSearch: (location: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <header className="bg-secondary p-4 flex items-center justify-between border-b border-tertiary flex-shrink-0">
      <form onSubmit={handleSearch} className="relative w-full max-w-md">
        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"></i>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a city..."
          className="w-full bg-tertiary text-text-primary placeholder-text-secondary rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </form>
      <div className="flex items-center">
        <div className="w-10 h-10 bg-tertiary rounded-full flex items-center justify-center cursor-pointer">
          <img
            src="https://picsum.photos/100"
            alt="User Avatar"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
