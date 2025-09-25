import React, { useEffect, useState } from 'react';
import { Star, TrendingUp, TrendingDown } from 'lucide-react';

interface Driver {
  id: string;
  name: string;
  rating: number;
  ridesCompleted: number;
  earnings: number;
  status: 'online' | 'offline' | 'busy';
  trend: 'up' | 'down' | 'stable';
}

const DriverTable: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch('/api/drivers');
        if (!res.ok) throw new Error('Failed to load drivers');
        const data: Driver[] = await res.json();
        if (!mounted) return;
        setDrivers(data);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? 'Failed to load drivers');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const getStatusColor = (status: Driver['status']) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: Driver['trend']) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <div className="w-4 h-4" />;
    }
  };

  // Removed local randomizer to rely on backend data

  return (
    <div className="bg-dashboard-section rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Top Drivers</h3>
          <p className="text-sm text-gray-600">Performance rankings</p>
        </div>
      </div>
      {error && (
        <div className="mb-4 text-sm text-red-600">{error}</div>
      )}
      {loading && (
        <div className="mb-4 text-sm text-gray-500">Loading drivers...</div>
      )}
      <div className="overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-gray-100">
              <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
              <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Rides</th>
              <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Earnings</th>
              <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-500 text-sm">Loading drivers...</td>
              </tr>
            )}
            {!loading && drivers.map((driver: Driver) => (
              <tr key={driver.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {driver.name.split(' ').map(n => n.charAt(0)).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{driver.name}</p>
                      <p className="text-xs text-gray-500">{driver.id}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-medium text-gray-900">{driver.rating}</span>
                  </div>
                </td>
                <td className="py-4 font-medium text-gray-900">{driver.ridesCompleted}</td>
                <td className="py-4 font-medium text-gray-900">₹{driver.earnings.toLocaleString()}</td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(driver.status)}`}>
                    {driver.status}
                  </span>
                </td>
                <td className="py-4">{getTrendIcon(driver.trend)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DriverTable;