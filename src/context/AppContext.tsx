import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase, savePhoto, updateAnalytics } from '../lib/supabase';
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

const PRINTER_STORAGE_KEY = 'polaroid_printer';
const DEFAULT_VENUE_ID = '123e4567-e89b-12d3-a456-426614174000';

const defaultVenue: Venue = {
  id: DEFAULT_VENUE_ID,
  name: 'Polaroid Booth',
  logo: 'https://cdn-icons-png.flaticon.com/512/3004/3004613.png',
  primaryColor: '#3498db',
  secondaryColor: '#e91e63',
  contactEmail: 'contact@polaroidbooth.com'
};

const defaultAnalytics: AnalyticsData = {
  totalPrints: 0,
  totalRevenue: 0,
  printsByDay: Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
    count: 0
  })),
  revenueByDay: Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
    amount: 0
  }))
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [activePhoto, setActivePhoto] = useState<Photo | null>(null);
  const [venue, setVenue] = useState<Venue>(defaultVenue);
  const [printer, setPrinter] = useState<PrinterDevice | null>(() => {
    const savedPrinter = localStorage.getItem(PRINTER_STORAGE_KEY);
    return savedPrinter ? JSON.parse(savedPrinter) : null;
  });
  const [analytics, setAnalytics] = useState<AnalyticsData>(defaultAnalytics);
  
  // Save printer to localStorage whenever it changes
  useEffect(() => {
    if (printer) {
      localStorage.setItem(PRINTER_STORAGE_KEY, JSON.stringify(printer));
    } else {
      localStorage.removeItem(PRINTER_STORAGE_KEY);
    }
  }, [printer]);

  // Load initial data from Supabase
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const { data: venueData } = await supabase
          .from('venues')
          .select('*')
          .eq('id', DEFAULT_VENUE_ID)
          .single();

        if (venueData) {
          setVenue(venueData);
        }

        const { data: photosData } = await supabase
          .from('photos')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        if (photosData) {
          setPhotos(photosData);
        }

        const { data: analyticsData } = await supabase
          .from('analytics')
          .select('*')
          .eq('venue_id', DEFAULT_VENUE_ID)
          .order('date', { ascending: false })
          .limit(7);

        if (analyticsData) {
          // Transform analytics data to match our format
          const transformed: AnalyticsData = {
            totalPrints: analyticsData.reduce((sum, day) => sum + day.total_prints, 0),
            totalRevenue: analyticsData.reduce((sum, day) => sum + Number(day.total_revenue), 0),
            printsByDay: analyticsData.map(day => ({
              date: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
              count: day.total_prints
            })),
            revenueByDay: analyticsData.map(day => ({
              date: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
              amount: Number(day.total_revenue)
            }))
          };
          setAnalytics(transformed);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    loadInitialData();
  }, []);

  const addPhoto = async (photo: Photo) => {
    try {
      // Save photo to Supabase
      const savedPhoto = await savePhoto({
        venue_id: venue.id,
        image_url: photo.src,
        filter: photo.filter,
        frame: photo.frame,
        caption: photo.caption
      });

      // Update local state
      setPhotos(prev => [savedPhoto, ...prev]);
      
      // Update analytics
      const today = new Date().toISOString().split('T')[0];
      await updateAnalytics(venue.id, today, {
        total_prints: analytics.totalPrints + 1,
        total_revenue: analytics.totalRevenue + 5.00
      });

      setAnalytics(prev => ({
        ...prev,
        totalPrints: prev.totalPrints + 1,
        totalRevenue: prev.totalRevenue + 5.00,
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
    } catch (error) {
      console.error('Error saving photo:', error);
    }
  };
  
  const deletePhoto = async (id: string) => {
    try {
      await supabase
        .from('photos')
        .delete()
        .eq('id', id);

      setPhotos(prev => prev.filter(photo => photo.id !== id));
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };
  
  const updateVenue = async (updatedVenue: Venue) => {
    try {
      const { data } = await supabase
        .from('venues')
        .update(updatedVenue)
        .eq('id', updatedVenue.id)
        .select()
        .single();

      if (data) {
        setVenue(data);
      }
    } catch (error) {
      console.error('Error updating venue:', error);
    }
  };
  
  const connectPrinter = (device: PrinterDevice) => {
    setPrinter(device);
  };
  
  const disconnectPrinter = () => {
    setPrinter(null);
  };
  
  const updateAnalyticsData = async (data: Partial<AnalyticsData>) => {
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
      updateAnalytics: updateAnalyticsData
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