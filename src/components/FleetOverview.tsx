import React, { useEffect, useState } from 'react';
import { Car, Users, Battery, Wrench } from 'lucide-react';

const FleetOverview: React.FC = () => {
  const [fleetStats, setFleetStats] = useState({
    totalVehicles: 245,
    activeVehicles: 198,
    inMaintenance: 12,
    availableDrivers: 187,
    utilization: 78.5
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setFleetStats(prev => ({
        ...prev,
        activeVehicles: Math.max(150, Math.min(240, prev.activeVehicles + Math.floor((Math.random() - 0.5) * 10))),
        availableDrivers: Math.max(120, Math.min(220, prev.availableDrivers + Math.floor((Math.random() - 0.5) * 8))),
        utilization: Math.max(60, Math.min(95, prev.utilization + (Math.random() - 0.5) * 5))
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const utilizationColor = fleetStats.utilization >= 80 ? 'text-green-600' : 
                           fleetStats.utilization >= 60 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="bg-dashboard-section rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Fleet Overview</h3>
          <p className="text-sm text-gray-600">Vehicle and driver status</p>
        </div>
        <Car className="w-5 h-5 text-gray-400" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Car className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-blue-900">{fleetStats.activeVehicles}</p>
              <p className="text-sm text-blue-600">Active Vehicles</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-green-900">{fleetStats.availableDrivers}</p>
              <p className="text-sm text-green-600">Available Drivers</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Battery className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Fleet Utilization</span>
          </div>
          <span className={`text-sm font-bold ${utilizationColor}`}>
            {fleetStats.utilization.toFixed(1)}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-1000 ${
              fleetStats.utilization >= 80 ? 'bg-gradient-to-r from-green-400 to-green-600' :
              fleetStats.utilization >= 60 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
              'bg-gradient-to-r from-red-400 to-red-600'
            }`}
            style={{ width: `${fleetStats.utilization}%` }}
          ></div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            <Wrench className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">In Maintenance</span>
          </div>
          <span className="text-sm font-medium text-gray-900">{fleetStats.inMaintenance} vehicles</span>
        </div>
      </div>
    </div>
  );
};

export default FleetOverview;