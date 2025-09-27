
import React from 'react';
import { FavoriteLocation, View } from '../types';

interface FavoritesViewProps {
    favorites: FavoriteLocation[];
    onSelectLocation: (location: string) => void;
    onNavigate: (view: View) => void;
    onDelete: (locationId: string) => void;
}

const FavoritesView: React.FC<FavoritesViewProps> = ({ favorites, onSelectLocation, onNavigate, onDelete }) => {

  const handleSelect = (name: string) => {
    onSelectLocation(name);
    onNavigate('dashboard');
  };
  
  const handleDelete = (id: string) => {
      onDelete(id);
  }

  return (
    <div className="bg-secondary p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Favorite Locations</h2>
      {favorites.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-tertiary">
              <tr>
                <th className="p-3">Location</th>
                <th className="p-3">Latitude</th>
                <th className="p-3">Longitude</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {favorites.map((fav) => (
                <tr key={fav.id} className="border-b border-tertiary hover:bg-tertiary transition-colors duration-200">
                  <td className="p-3 font-semibold">{fav.name}</td>
                  <td className="p-3">{fav.latitude.toFixed(4)}</td>
                  <td className="p-3">{fav.longitude.toFixed(4)}</td>
                  <td className="p-3 text-right">
                      <button 
                          onClick={() => handleSelect(fav.name)}
                          className="bg-accent text-white px-3 py-1 rounded-md mr-2 hover:bg-sky-500 transition-colors duration-200"
                      >
                          View
                      </button>
                      <button 
                          onClick={() => handleDelete(fav.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors duration-200"
                      >
                          Delete
                      </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
         <div className="text-center py-10 text-text-secondary">
            <i className="fas fa-star text-4xl mb-3"></i>
            <p>You haven't added any favorite locations yet.</p>
            <p className="text-sm">Search for a location and click the star to add it.</p>
        </div>
      )}
    </div>
  );
};

export default FavoritesView;
