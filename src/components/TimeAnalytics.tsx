import React, { useEffect, useState } from 'react';
import { Clock, Activity } from 'lucide-react';

const TimeAnalytics: React.FC = () => {
  const [hourlyData, setHourlyData] = useState<{ hour: string; rides: number; demand: string; }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const maxRides = Math.max(1, ...hourlyData.map(d => d.rides || 0));

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'low': return 'text-blue-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'peak': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getBarColor = (demand: string) => {
    switch (demand) {
      case 'low': return 'from-blue-400 to-blue-600';
      case 'medium': return 'from-yellow-400 to-yellow-600';
      case 'high': return 'from-orange-400 to-orange-600';
      case 'peak': return 'from-red-400 to-red-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch('/api/analytics/hourly');
        if (!res.ok) throw new Error('Failed to load hourly analytics');
        const rows: { hour: string; rides: number; demand: string; }[] = await res.json();
        if (!mounted) return;
        setHourlyData(rows);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? 'Failed to load hourly analytics');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    const id = setInterval(load, 15000); // refresh every 15s
    return () => { mounted = false; clearInterval(id); };
  }, []);

  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Peak Hours Analysis</h3>
          <p className="text-sm text-gray-600">Demand patterns throughout the day</p>
        </div>
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-gray-400" />
          <Clock className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      {error && (
        <div className="mb-4 text-sm text-red-600">{error}</div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading && (
          <div className="col-span-full text-sm text-gray-500">Loading hourly analytics...</div>
        )}
        {!loading && hourlyData.map((item) => (
          <div key={item.hour} className="text-center">
            <div className="mb-2">
              <div className="h-16 flex items-end justify-center">
                <div 
                  className={`w-8 bg-gradient-to-t ${getBarColor(item.demand)} rounded-t transition-all duration-1000`}
                  style={{ height: `${(item.rides / maxRides) * 100}%`, minHeight: '8px' }}
                ></div>
              </div>
            </div>
            <p className="text-xs font-medium text-gray-900 mb-1">{item.hour}</p>
            <p className="text-xs text-gray-600 mb-1">{item.rides} rides</p>
            <span className={`text-xs font-medium uppercase ${getDemandColor(item.demand)}`}>
              {item.demand}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-gray-600">Low</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span className="text-gray-600">Medium</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span className="text-gray-600">High</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-gray-600">Peak</span>
            </div>
          </div>
          <p className="text-gray-500">Demand Level</p>
        </div>
      </div>
    </div>
  );
};

export default TimeAnalytics;