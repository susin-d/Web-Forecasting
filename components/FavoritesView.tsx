
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
    <div className="w-full h-full bg-black/20 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
      <h2 className="text-2xl font-bold mb-6 text-text-primary">Favorite Locations</h2>
      {favorites.length > 0 ? (
        <div className="overflow-auto h-[calc(100%-4rem)]">
          <table className="w-full text-left text-text-primary">
            <thead className="border-b border-white/10">
              <tr>
                <th className="p-3 text-text-secondary font-semibold">Location</th>
                <th className="p-3 text-text-secondary font-semibold">Latitude</th>
                <th className="p-3 text-text-secondary font-semibold">Longitude</th>
                <th className="p-3 text-right text-text-secondary font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {favorites.map((fav) => (
                <tr key={fav.id} className="border-b border-white/10 hover:bg-white/5 transition-colors duration-200">
                  <td className="p-3 font-semibold">{fav.name}</td>
                  <td className="p-3">{fav.latitude.toFixed(4)}</td>
                  <td className="p-3">{fav.longitude.toFixed(4)}</td>
                  <td className="p-3 text-right">
                      <button 
                          onClick={() => handleSelect(fav.name)}
                          className="bg-white/10 text-text-primary border border-white/10 font-semibold px-3 py-1 rounded-md mr-2 hover:bg-white/20 transition-colors duration-200"
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
         <div className="text-center py-10 text-text-secondary flex flex-col items-center justify-center h-full">
            <i className="fas fa-star text-4xl mb-3"></i>
            <p>You haven't added any favorite locations yet.</p>
            <p className="text-sm">Search for a location and click the star to add it.</p>
        </div>
      )}
    </div>
  );
};

export default FavoritesView;