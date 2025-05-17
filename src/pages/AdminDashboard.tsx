import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, BarChart, Camera, User, LogOut, Menu, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import VenueCustomization from '../components/VenueCustomization';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'settings'>('analytics');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { venue, updateVenue, analytics } = useAppContext();
  const navigate = useNavigate();
  
  // Update analytics in real-time (simulated)
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIncrease = Math.floor(Math.random() * 3);
      if (randomIncrease > 0) {
        const updatedAnalytics = {
          ...analytics,
          totalPrints: analytics.totalPrints + randomIncrease,
          totalRevenue: analytics.totalRevenue + (randomIncrease * 5),
          printsByDay: analytics.printsByDay.map((day, index) => 
            index === analytics.printsByDay.length - 1 
              ? { ...day, count: day.count + randomIncrease }
              : day
          ),
          revenueByDay: analytics.revenueByDay.map((day, index) =>
            index === analytics.revenueByDay.length - 1
              ? { ...day, amount: day.amount + (randomIncrease * 5) }
              : day
          )
        };
        updateVenue({ ...venue }); // Trigger re-render
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [analytics]);
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <img 
                src={venue.logo} 
                alt={venue.name} 
                className="h-8 w-auto mr-2"
              />
              <span className="font-semibold text-lg hidden sm:block">
                {venue.name} Admin
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded-lg flex items-center transition-all duration-300"
              >
                <Camera className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Kiosk Mode</span>
              </button>
              
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="sm:hidden text-gray-500 hover:text-gray-700"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
              
              <button className="text-gray-500 hover:text-gray-700 hidden sm:block">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white border-b">
          <div className="px-4 py-2 space-y-2">
            <button
              onClick={() => {
                setActiveTab('analytics');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left py-2 px-4 rounded-lg ${
                activeTab === 'analytics'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700'
              }`}
            >
              <div className="flex items-center">
                <BarChart className="h-5 w-5 mr-2" />
                Analytics
              </div>
            </button>
            
            <button
              onClick={() => {
                setActiveTab('settings');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left py-2 px-4 rounded-lg ${
                activeTab === 'settings'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700'
              }`}
            >
              <div className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Settings
              </div>
            </button>
          </div>
        </div>
      )}
      
      {/* Desktop Navigation */}
      <div className="hidden sm:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-4 px-6 ${
              activeTab === 'analytics'
                ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center">
              <BarChart className="h-5 w-5 mr-2" />
              Analytics
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-4 px-6 ${
              activeTab === 'settings'
                ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Settings
            </div>
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="animate-fadeIn">
          {activeTab === 'analytics' ? (
            <AnalyticsDashboard data={analytics} />
          ) : (
            <VenueCustomization 
              venue={venue}
              onSave={updateVenue}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;