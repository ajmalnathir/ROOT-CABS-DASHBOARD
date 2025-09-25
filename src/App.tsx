import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import MetricCard from './components/MetricCard';
import RevenueChart from './components/RevenueChart';
import LiveRides from './components/LiveRides';
import DriverTable from './components/DriverTable';
import LocationHeatmap from './components/LocationHeatmap';
import TimeAnalytics from './components/TimeAnalytics';
import FleetOverview from './components/FleetOverview';
import EarningsOverview from './components/EarningsOverview';
import { 
  Car, 
  Users, 
  IndianRupee, 
  Clock,  
  Star,
  Activity
} from 'lucide-react';

function App() {

  const [metrics, setMetrics] = useState({

    totalRides: 247,

    activeDrivers: 149,

    totalRevenue: 4589,

    avgRating: 4.8,

    completionRate: 94.2,

    responseTime: 3.2

  });
 
  // Load metrics from backend and poll every 10 seconds
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await fetch('/api/metrics');
        if (!res.ok) throw new Error('Failed metrics fetch');
        const data = await res.json();
        if (!mounted) return;
        setMetrics({
          totalRides: Number(data.totalRides ?? metrics.totalRides),
          activeDrivers: Number(data.activeDrivers ?? metrics.activeDrivers),
          totalRevenue: Number(data.totalRevenue ?? metrics.totalRevenue),
          avgRating: Number(data.avgRating ?? metrics.avgRating),
          completionRate: Number(data.completionRate ?? metrics.completionRate),
          responseTime: Number(data.responseTime ?? metrics.responseTime)
        });
      } catch (e) {
        // Silent fallback to existing mock state
        console.debug('Using mock metrics (API unavailable)');
      }
    };

    load();
    const id = setInterval(load, 10000);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Metrics */}
        <div id="metrics" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <MetricCard
            title="Total Rides Today"
            value={ metrics.totalRides.toLocaleString()}
            change="+12.5%"
            changeType="positive"
            icon={Car}
            gradient="from-orange-500 to-red-600"
          />
          
          <MetricCard
            title="Active Drivers"
            value={ metrics.activeDrivers}
            change="+8.2%"
            changeType="positive"
            icon={Users}
            gradient="from-green-500 to-green-600"
          />
          
          <MetricCard
            title="Revenue Today"
            value={`₹${metrics.totalRevenue.toLocaleString()}`}
            change="+15.3%"
            changeType="positive"
            icon={IndianRupee}
            gradient="from-purple-500 to-purple-600"
          />
          
          <MetricCard
            title="Avg Rating"
            value={ metrics.avgRating.toFixed(1)}
            change="+2.1%"
            changeType="positive"
            icon={Star}
            gradient="from-yellow-500 to-orange-500"
          />
          
          <MetricCard
            title="Completion Rate"
            value={ `${metrics.completionRate.toFixed(1)}%`}
            change="+1.2%"
            changeType="positive"
            icon={Activity}
            gradient="from-teal-500 to-teal-600"
          />
          
          <MetricCard
            title="Avg Response"
            value={ `${metrics.responseTime.toFixed(1)} min`}
            change="-5.8%"
            changeType="positive"
            icon={Clock}
            gradient="from-indigo-500 to-indigo-600"
          />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div id="revenue" className="lg:col-span-2">
            <RevenueChart />
          </div>
          <div id="fleet">
            <FleetOverview />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div id="time-analytics">
            <TimeAnalytics />
          </div>
          <div id="earnings">
            <EarningsOverview />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div id="drivers" className="lg:col-span-2">
            <DriverTable />
          </div>
          <div className="space-y-6">
            <div id="locations">
              <LocationHeatmap />
            </div>
            <div id="live-rides">
              <LiveRides />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;