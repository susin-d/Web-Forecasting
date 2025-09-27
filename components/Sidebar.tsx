
import React from 'react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const NavItem: React.FC<{
  icon: string;
  label: string;
  view: View;
  currentView: View;
  onClick: (view: View) => void;
}> = ({ icon, label, view, currentView, onClick }) => {
  const isActive = currentView === view;
  return (
    <li
      className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-all duration-200 ${
        isActive
          ? 'bg-accent text-white shadow-lg'
          : 'text-text-secondary hover:bg-tertiary hover:text-text-primary'
      }`}
      onClick={() => onClick(view)}
    >
      <i className={`fas ${icon} w-6 text-center`}></i>
      <span className="ml-4 font-semibold">{label}</span>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  return (
    <aside className="w-64 bg-primary p-4 flex-shrink-0 flex flex-col justify-between">
      <div>
        <div className="flex items-center mb-10 p-2">
          <i className="fas fa-cloud-sun-rain text-3xl text-accent"></i>
          <h1 className="text-xl font-bold ml-3">WeatherApp</h1>
        </div>
        <nav>
          <ul>
            <NavItem
              icon="fa-tachometer-alt"
              label="Dashboard"
              view="dashboard"
              currentView={currentView}
              onClick={onNavigate}
            />
            <NavItem
              icon="fa-star"
              label="Favorites"
              view="favorites"
              currentView={currentView}
              onClick={onNavigate}
            />
            <NavItem
              icon="fa-user"
              label="Profile"
              view="profile"
              currentView={currentView}
              onClick={onNavigate}
            />
          </ul>
        </nav>
      </div>
      <div>
        <ul>
          <NavItem
            icon="fa-sign-out-alt"
            label="Logout"
            view="login"
            currentView={currentView}
            onClick={onNavigate}
          />
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
