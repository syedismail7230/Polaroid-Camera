import React, { createContext, useState, useContext, ReactNode } from 'react';
import { 
  Photo, 
  Venue, 
  PrinterDevice,
  AnalyticsData
} from '../types';

interface AppContextType {
  photos: Photo[];
  addPhoto: (photo: Photo) => void;
  deletePhoto: (id: string) => void;
  activePhoto: Photo | null;
  setActivePhoto: (photo: Photo | null) => void;
  
  venue: Venue;
  updateVenue: (venue: Venue) => void;
  
  printer: PrinterDevice | null;
  connectPrinter: (device: PrinterDevice) => void;
  disconnectPrinter: () => void;
  
  analytics: AnalyticsData;
  updateAnalytics: (data: Partial<AnalyticsData>) => void;
}

const defaultVenue: Venue = {
  id: 'default',
  name: 'Polaroid Booth',
  logo: 'https://cdn-icons-png.flaticon.com/512/3004/3004613.png',
  primaryColor: '#3498db',
  secondaryColor: '#e91e63',
  contactEmail: 'contact@polaroidbooth.com'
};

const defaultAnalytics: AnalyticsData = {
  totalPrints: 127,
  totalRevenue: 635.00,
  printsByDay: [
    { date: 'Mon', count: 15 },
    { date: 'Tue', count: 22 },
    { date: 'Wed', count: 18 },
    { date: 'Thu', count: 25 },
    { date: 'Fri', count: 30 },
    { date: 'Sat', count: 42 },
    { date: 'Sun', count: 35 }
  ],
  revenueByDay: [
    { date: 'Mon', amount: 75.00 },
    { date: 'Tue', amount: 110.00 },
    { date: 'Wed', amount: 90.00 },
    { date: 'Thu', amount: 125.00 },
    { date: 'Fri', amount: 150.00 },
    { date: 'Sat', amount: 210.00 },
    { date: 'Sun', amount: 175.00 }
  ]
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [activePhoto, setActivePhoto] = useState<Photo | null>(null);
  const [venue, setVenue] = useState<Venue>(defaultVenue);
  const [printer, setPrinter] = useState<PrinterDevice | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData>(defaultAnalytics);
  
  const addPhoto = (photo: Photo) => {
    setPhotos(prev => [photo, ...prev]);
    
    // Update analytics when photo is added
    setAnalytics(prev => ({
      ...prev,
      totalPrints: prev.totalPrints + 1,
      totalRevenue: prev.totalRevenue + 5.00, // Assuming $5 per print
      printsByDay: prev.printsByDay.map((day, idx) => 
        idx === prev.printsByDay.length - 1 
          ? { ...day, count: day.count + 1 } 
          : day
      ),
      revenueByDay: prev.revenueByDay.map((day, idx) => 
        idx === prev.revenueByDay.length - 1 
          ? { ...day, amount: day.amount + 5.00 } 
          : day
      )
    }));
  };
  
  const deletePhoto = (id: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id));
  };
  
  const updateVenue = (updatedVenue: Venue) => {
    setVenue(updatedVenue);
  };
  
  const connectPrinter = (device: PrinterDevice) => {
    setPrinter(device);
  };
  
  const disconnectPrinter = () => {
    setPrinter(null);
  };
  
  const updateAnalytics = (data: Partial<AnalyticsData>) => {
    setAnalytics(prev => ({ ...prev, ...data }));
  };
  
  return (
    <AppContext.Provider value={{
      photos,
      addPhoto,
      deletePhoto,
      activePhoto,
      setActivePhoto,
      venue,
      updateVenue,
      printer,
      connectPrinter,
      disconnectPrinter,
      analytics,
      updateAnalytics
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};