import React, { useState, useEffect, useRef } from 'react';
import { Search, User, Car, MapPin } from 'lucide-react';

// Search result types
export interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  category: 'driver' | 'ride' | 'location';
  icon: React.ComponentType<any>;
  data: any;
  elementId?: string; // For scrolling to dashboard elements
}

interface SearchBarProps {
  onResultSelect?: (result: SearchResult) => void;
  placeholder?: string;
  className?: string;
}

// Mock data for search - sourced from current dashboard components
const mockDrivers = [
  { id: 'RC001', name: 'Rajesh', rating: 4.8, ridesCompleted: 256, earnings: 1400, status: 'online' },
  { id: 'RC002', name: 'Amit', rating: 4.6, ridesCompleted: 234, earnings: 800, status: 'busy' },
  { id: 'RC003', name: 'Suresh', rating: 4.9, ridesCompleted: 289, earnings: 500, status: 'online' },
  { id: 'RC004', name: 'Vikram', rating: 4.7, ridesCompleted: 198, earnings: 410, status: 'offline' },
  { id: 'RC005', name: 'Arjun', rating: 4.5, ridesCompleted: 167, earnings: 350, status: 'online' }
];

const mockRides = [
  { id: 'RC001', driver: 'Rajesh', passenger: 'Priya', pickup: 'Sathvacheri', destination: 'Kaspa', status: 'enroute', fare: 450 },
  { id: 'RC002', driver: 'Amit', passenger: 'Neha', pickup: 'Katpadi Railway Station', destination: 'VIT', status: 'pickup', fare: 280 },
  { id: 'RC003', driver: 'Suresh', passenger: 'Kavya', pickup: 'New Busstand', destination: 'Vellore Fort', status: 'arrived', fare: 180 }
];

const mockLocations = [
  { name: 'VIT UNIVERSITY', rides: 456, growth: 12.5 },
  { name: 'VELLORE Airport', rides: 342, growth: 8.2 },
  { name: 'CMC HOSPITAL', rides: 289, growth: -2.1 },
  { name: 'VELLORE FORT', rides: 234, growth: 15.8 },
  { name: 'PERIYAR PARK', rides: 187, growth: 6.4 },
  { name: 'KATPADI RAILWAY STATION', rides: 145, growth: 3.2 },
  { name: 'GOLDEN TEMPLE', rides: 98, growth: 4.7 },
  { name: 'NEW BUS STAND', rides: 76, growth: 22.1 }
];

const SearchBar: React.FC<SearchBarProps> = ({
  onResultSelect,
  placeholder = 'Search drivers, rides, locations...',
  className = ''
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Search function
  const performSearch = (searchQuery: string): SearchResult[] => {
    if (!searchQuery.trim()) return [];

    const q = searchQuery.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Search drivers
    mockDrivers.forEach((driver) => {
      if (driver.name.toLowerCase().includes(q) || driver.id.toLowerCase().includes(q)) {
        searchResults.push({
          id: `driver-${driver.id}`,
          title: driver.name,
          subtitle: `${driver.id} • ⭐ ${driver.rating} • ${driver.ridesCompleted} rides • ₹${driver.earnings.toLocaleString()}`,
          category: 'driver',
          icon: User,
          data: driver,
          elementId: 'drivers'
        });
      }
    });

    // Search rides
    mockRides.forEach((ride) => {
      const searchableText = `${ride.driver} ${ride.passenger} ${ride.pickup} ${ride.destination} ${ride.id}`.toLowerCase();
      if (searchableText.includes(q)) {
        searchResults.push({
          id: `ride-${ride.id}`,
          title: `${ride.pickup} → ${ride.destination}`,
          subtitle: `Driver: ${ride.driver} • Passenger: ${ride.passenger} • ₹${ride.fare} • ${ride.status}`,
          category: 'ride',
          icon: Car,
          data: ride,
          elementId: 'live-rides'
        });
      }
    });

    // Search locations
    mockLocations.forEach((location) => {
      if (location.name.toLowerCase().includes(q)) {
        searchResults.push({
          id: `location-${location.name}`,
          title: location.name,
          subtitle: `${location.rides} rides • ${location.growth >= 0 ? '+' : ''}${location.growth.toFixed(1)}% growth`,
          category: 'location',
          icon: MapPin,
          data: location,
          elementId: 'locations'
        });
      }
    });

    return searchResults.slice(0, 8);
  };

  useEffect(() => {
    const r = performSearch(query);
    setResults(r);
    setSelectedIndex(-1);
    setIsOpen(r.length > 0 && query.trim().length > 0);
  }, [query]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle result selection
  const handleResultSelect = (result: SearchResult) => {
    setQuery(result.title);
    setIsOpen(false);
    setSelectedIndex(-1);

    // Scroll to the dashboard element if elementId is provided
    if (result.elementId) {
      const element = document.getElementById(result.elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Add a highlight effect
        element.classList.add('ring-2', 'ring-orange-500', 'ring-opacity-50');
        setTimeout(() => {
          element.classList.remove('ring-2', 'ring-orange-500', 'ring-opacity-50');
        }, 2000);
      }
    }

    // Call the optional callback
    onResultSelect?.(result);
  };

  // Get category label
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'driver':
        return 'Driver';
      case 'ride':
        return 'Live Ride';
      case 'location':
        return 'Location';
      default:
        return 'Result';
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.trim() && results.length > 0) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full transition-all"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-gray-500 px-2 py-1 border-b border-gray-100 mb-2">
              {results.length} result{results.length !== 1 ? 's' : ''} found
            </div>
            {results.map((result, index) => {
              const IconComponent = result.icon;
              const isActive = index === selectedIndex;
              return (
                <div
                  key={result.id}
                  onClick={() => handleResultSelect(result)}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    isActive ? 'bg-orange-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center text-gray-600">
                    <IconComponent className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">{result.title}</p>
                      <span className="ml-3 text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        {getCategoryLabel(result.category)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{result.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
