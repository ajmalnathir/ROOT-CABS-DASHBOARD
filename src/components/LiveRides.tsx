import React, { useEffect, useState } from 'react';
import { Car, Clock, MapPin, User } from 'lucide-react';

interface Ride {
  id: string;
  driver: string;
  passenger: string;
  pickup: string;
  destination: string;
  status: 'pickup' | 'enroute' | 'arrived';
  duration: string;
  fare: number;
}

const LiveRides: React.FC = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch('/api/rides/live');
        if (!res.ok) throw new Error('Failed to load live rides');
        const data: Ride[] = await res.json();
        if (!mounted) return;
        setRides(data);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? 'Failed to load live rides');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    const id = setInterval(load, 10000); // refresh every 10s
    return () => { mounted = false; clearInterval(id); };
  }, []);

  const getStatusColor = (status: Ride['status']) => {
    switch (status) {
      case 'pickup': return 'bg-yellow-100 text-yellow-800';
      case 'enroute': return 'bg-blue-100 text-blue-800';
      case 'arrived': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Ride['status']) => {
    switch (status) {
      case 'pickup': return <Clock className="w-3 h-3" />;
      case 'enroute': return <Car className="w-3 h-3" />;
      case 'arrived': return <MapPin className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <div className="bg-dashboard-section rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Live Rides</h3>
          <p className="text-sm text-gray-600">Currently active rides</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Live</span>
        </div>
      </div>
      {error && (
        <div className="mb-4 text-sm text-red-600">{error}</div>
      )}
      <div className="space-y-4">
        {loading && (
          <div className="text-sm text-gray-500">Loading live rides...</div>
        )}
        {!loading && rides.map((ride: Ride) => (
          <div key={ride.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">{ride.id.slice(-2)}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{ride.driver}</p>
                  <p className="text-xs text-gray-500">Driver</p>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(ride.status)}`}>
                {getStatusIcon(ride.status)}
                <span className="capitalize">{ride.status}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{ride.passenger}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{ride.duration}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 truncate">{ride.pickup}</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-gray-900">₹{ride.fare}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveRides;