import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import AdminUploader from '../components/AdminUploader';
import StatsViewer from '../components/StatsViewer';
import UploadHistory from '../components/UploadHistory';
import { Upload, BarChart3, History } from 'lucide-react';

const AdminDashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.pathname === '/admin/stats' ? 'stats' :
    location.pathname === '/admin/history' ? 'history' :
    location.pathname === '/admin/upload' ? 'upload' : 'upload'
  );

  const tabs = [
    { id: 'upload', label: 'Upload Dictionary', icon: Upload },
    { id: 'stats', label: 'Analytics', icon: BarChart3 },
    { id: 'history', label: 'Upload History', icon: History }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'stats':
        return <StatsViewer />;
      case 'history':
        return <UploadHistory />;
      default:
        return <AdminUploader />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage dictionaries, monitor usage, and track system performance
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-lg">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center space-x-2 px-6 py-4 font-medium transition-all duration-200
                      ${activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;