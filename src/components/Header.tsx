import React from 'react';
import { Settings, User } from 'lucide-react';
import SearchBar from './SearchBar';
import NotificationBell from './NotificationBell';
import { useTheme } from '../theme/ThemeProvider';


const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                <a href="https://rootcabs.com/">RC</a>
              </span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">ROOT CABS ANALYTICS</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <SearchBar className="w-72" />
          
          <NotificationBell />
          
          <button
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            onClick={toggleTheme}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2 pl-4 border-l border-gray-200">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">Super Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;