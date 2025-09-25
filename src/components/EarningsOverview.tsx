import React, { useEffect, useState } from 'react';
import { TrendingUp, IndianRupee, Calendar } from 'lucide-react';

type Earnings = {
  today: number;
  thisWeek: number;
  thisMonth: number;
  growth: number;
};

type DailyPeriod = {
  period: string;
  amount: number;
  percentage: number; // 0-100
};

const EarningsOverview: React.FC = () => {
  const [earnings, setEarnings] = useState<Earnings>({
    today: 478,
    thisWeek: 2694,
    thisMonth: 10000,
    growth: 18.5
  });

  const [dailyBreakdown] = useState<DailyPeriod[]>([
    { period: 'Morning (6-12)', amount: 345, percentage: 25.5 },
    { period: 'Afternoon (12-18)', amount: 457, percentage: 30.1 },
    { period: 'Evening (18-24)', amount: 876, percentage: 56.4 }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setEarnings(prev => ({
        ...prev,
        today: prev.today + Math.random() * 100,
        thisWeek: prev.thisWeek + Math.random() * 500,
        thisMonth: prev.thisMonth + Math.random() * 1000
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-dashboard-section rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Earnings Overview</h3>
          <p className="text-sm text-gray-600">Revenue breakdown by time period</p>
        </div>
        <div className="flex items-center space-x-2 text-green-600">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">+{earnings.growth.toFixed(1)}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <IndianRupee className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">Today</span>
          </div>
          <p className="text-2xl font-bold text-green-900">₹{earnings.today.toLocaleString()}</p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">This Week</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">₹{earnings.thisWeek.toLocaleString()}</p>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">This Month</span>
          </div>
          <p className="text-2xl font-bold text-purple-900">₹{earnings.thisMonth.toLocaleString()}</p>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Today's Breakdown</h4>
        <div className="space-y-3">
          {dailyBreakdown.map((period) => (
            <div key={period.period} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{period.period}</span>
              <div className="flex items-center space-x-3">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 bg-gradient-to-r from-orange-400 to-red-600 rounded-full transition-all duration-1000"
                    style={{ width: `${period.percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-20 text-right">
                  ₹{period.amount.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EarningsOverview;