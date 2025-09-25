import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  gradient: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ ...props }) => {
  const { title, value, change, changeType, icon: Icon, gradient } = props;

  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-dashboard-section rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
        <div className="flex items-center space-x-1">
          <span className={`text-sm font-medium ${getChangeColor()}`}>
            {change}
          </span>
          <span className="text-xs text-gray-500">from last week</span>
        </div>
      </div>
      <div className={`p-3 rounded-lg bg-gradient-to-r ${gradient}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  );
};

export default MetricCard;