import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Camera, Settings } from 'lucide-react';
import CaptureScreen from './pages/CaptureScreen';
import PaymentScreen from './pages/PaymentScreen';
import ShareScreen from './pages/ShareScreen';
import AdminDashboard from './pages/AdminDashboard';
import { AppProvider } from './context/AppContext';

function App() {
  const [isKioskMode, setIsKioskMode] = useState(true);
  
  return (
    <AppProvider>
      <BrowserRouter>
        {isKioskMode && (
          <div className="fixed bottom-4 right-4 z-50">
            <button
              onClick={() => setIsKioskMode(false)}
              className="bg-gray-800 bg-opacity-70 hover:bg-opacity-100 text-white p-3 rounded-full shadow-lg"
              title="Admin Panel"
            >
              <Settings className="h-6 w-6" />
            </button>
          </div>
        )}
        
        {!isKioskMode && (
          <div className="fixed bottom-4 right-4 z-50">
            <button
              onClick={() => setIsKioskMode(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg"
              title="Kiosk Mode"
            >
              <Camera className="h-6 w-6" />
            </button>
          </div>
        )}
        
        <Routes>
          {isKioskMode ? (
            <>
              <Route path="/" element={<PaymentScreen />} />
              <Route path="/capture" element={<CaptureScreen />} />
              <Route path="/share" element={<ShareScreen />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            <>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;