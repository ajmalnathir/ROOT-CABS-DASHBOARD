import React, { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';

type RevenueRow = { day: string; revenue: number };

const RevenueChart: React.FC = () => {
  const [data, setData] = useState<RevenueRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const maxRevenue = Math.max(1, ...data.map(d => d.revenue || 0));

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch('/api/revenue/weekly');
        if (!res.ok) throw new Error('Failed to load weekly revenue');
        const rows: RevenueRow[] = await res.json();
        if (!mounted) return;
        setData(rows);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? 'Failed to load weekly revenue');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="bg-dashboard-section rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Revenue Analytics</h3>
          <p className="text-sm text-gray-600">Weekly revenue breakdown</p>
        </div>
        <div className="flex items-center space-x-2 text-green-600">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">+12.5%</span>
        </div>
      </div>
      {error && (
        <div className="mb-4 text-sm text-red-600">{error}</div>
      )}
      <div className="space-y-4">
        {loading && (
          <div className="text-sm text-gray-500">Loading weekly revenue...</div>
        )}
        {!loading && data.map((item) => (
          <div key={item.day} className="flex items-center space-x-4">
            <div className="w-10 text-sm font-medium text-gray-600">{item.day}</div>
            <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
              ></div>
            </div>
            <div className="text-sm font-medium text-gray-900 w-16 text-right">
              ₹{item.revenue.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevenueChart;
