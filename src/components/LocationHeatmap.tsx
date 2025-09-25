import React, { useEffect, useState } from 'react';
import { MapPin, TrendingUp } from 'lucide-react';

interface Location {
  name: string;
  rides: number;
  growth: number;
  color: string;
}

const LocationHeatmap: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch('/api/locations/popular');
        if (!res.ok) throw new Error('Failed to load locations');
        const data: Location[] = await res.json();
        if (!mounted) return;
        setLocations(data);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? 'Failed to load locations');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const maxRides = Math.max(1, ...locations.map(l => l.rides || 0));
  
  return (
    <div className="bg-dashboard-section rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Popular Locations</h3>
          <p className="text-sm text-gray-600">Ride Hotspots and demand</p>
        </div>
        <MapPin className="w-5 h-5 text-gray-400" />
      </div>
      {error && (
        <div className="mb-3 text-sm text-red-600">{error}</div>
      )}
      <div className="space-y-3">
        {loading && (
          <div className="text-sm text-gray-500">Loading popular locations...</div>
        )}
        {!loading && locations.map((location) => (
          <div key={location.name} className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 flex-1">
              <div className={`w-3 h-3 rounded-full ${location.color}`}></div>
              <span className="text-sm font-medium text-gray-900">{location.name}</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-gray-100 rounded-full h-2 w-20 overflow-hidden">
                <div 
                  className={`h-full ${location.color} rounded-full transition-all duration-1000`}
                  style={{ width: `${(location.rides / maxRides) * 100}%` }}
                ></div>
              </div>
              
              <div className="text-right min-w-0">
                <p className="text-sm font-medium text-gray-900">{location.rides}</p>
                <div className="flex items-center space-x-1">
                  {location.growth >= 0 ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <TrendingUp className="w-3 h-3 text-red-500 transform rotate-180" />
                  )}
                  <span className={`text-xs ${location.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(location.growth).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationHeatmap;