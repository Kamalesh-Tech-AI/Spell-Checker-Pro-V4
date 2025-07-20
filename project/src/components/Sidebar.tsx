import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Type, Upload, BarChart3, History, Zap, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navigationItems = [
    {
      path: user?.role === 'admin' ? '/admin' : '/dashboard',
      icon: Type,
      label: user?.role === 'admin' ? 'Admin Dashboard' : 'User Dashboard',
      description: 'Real-time autocomplete'
    },
    ...(user?.role === 'admin' ? [
    {
      path: '/admin/upload',
      icon: Upload,
      label: 'Upload Dictionary',
      description: 'Manage word databases'
    },
    {
      path: '/admin/stats',
      icon: BarChart3,
      label: 'View Analytics',
      description: 'Query insights & metrics'
    },
    {
      path: '/admin/history',
      icon: History,
      label: 'Upload History',
      description: 'File upload tracking'
    }
    ] : [])
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white shadow-xl z-10">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">AutoSpell Pro</h1>
            <p className="text-sm text-gray-400">Smart Text Assistant</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-600">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="h-5 w-5 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
              user?.role === 'admin' 
                ? 'bg-red-100 text-red-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {user?.role === 'admin' ? 'Admin' : 'User'}
            </span>
          </div>
        </div>
      </div>

      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                    hover:bg-gray-800 hover:transform hover:translate-x-1
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-gray-300 hover:text-white'
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium ${isActive ? 'text-white' : 'text-gray-200'}`}>
                      {item.label}
                    </div>
                    <div className={`text-xs ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                      {item.description}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-4 left-4 right-4 space-y-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-200 text-gray-300 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
        
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>System Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;