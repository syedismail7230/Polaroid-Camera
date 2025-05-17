import React from 'react';
import { BarChart, AreaChart, TrendingUp, Printer, DollarSign } from 'lucide-react';
import { AnalyticsData } from '../types';

interface AnalyticsDashboardProps {
  data: AnalyticsData;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ data }) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-6">
          <BarChart className="h-5 w-5 mr-2 text-blue-500" />
          <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-blue-700 font-medium">Total Prints</p>
                <p className="text-3xl font-bold">{data.totalPrints}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <Printer className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-blue-100">
              <div className="flex items-center text-sm">
                <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                <span className="text-green-600 font-medium mr-1">+12%</span>
                <span className="text-blue-700">from last week</span>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-green-700 font-medium">Total Revenue</p>
                <p className="text-3xl font-bold">${data.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-green-100">
              <div className="flex items-center text-sm">
                <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                <span className="text-green-600 font-medium mr-1">+8%</span>
                <span className="text-green-700">from last week</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Prints by Day</h3>
            <div className="h-60 w-full bg-gray-50 p-4 rounded-lg">
              <div className="flex items-end h-40 w-full space-x-2">
                {data.printsByDay.map((day, index) => (
                  <div key={index} className="flex flex-col items-center flex-grow">
                    <div 
                      className="w-full bg-blue-400 rounded-t-sm hover:bg-blue-500 transition-all"
                      style={{ 
                        height: `${Math.max(5, (day.count / Math.max(...data.printsByDay.map(d => d.count))) * 100)}%` 
                      }}
                    ></div>
                    <p className="text-xs text-gray-600 mt-2">{day.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Revenue by Day</h3>
            <div className="h-60 w-full bg-gray-50 p-4 rounded-lg">
              <div className="flex items-end h-40 w-full space-x-2">
                {data.revenueByDay.map((day, index) => (
                  <div key={index} className="flex flex-col items-center flex-grow">
                    <div 
                      className="w-full bg-green-400 rounded-t-sm hover:bg-green-500 transition-all"
                      style={{ 
                        height: `${Math.max(5, (day.amount / Math.max(...data.revenueByDay.map(d => d.amount))) * 100)}%` 
                      }}
                    ></div>
                    <p className="text-xs text-gray-600 mt-2">{day.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;