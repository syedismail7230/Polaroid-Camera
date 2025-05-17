import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Share, ArrowLeft, Printer } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import ShareOptions from '../components/ShareOptions';
import { printImage } from '../utils/printer';

const ShareScreen: React.FC = () => {
  const { activePhoto, printer, venue } = useAppContext();
  const navigate = useNavigate();
  
  useEffect(() => {
    const startPrinting = async () => {
      if (!activePhoto || !printer) {
        navigate('/payment');
        return;
      }

      try {
        const success = await printImage(activePhoto.src, printer);
        if (success) {
          // After successful print, navigate back to payment for next photo
          setTimeout(() => {
            navigate('/payment');
          }, 2000);
        }
      } catch (error) {
        console.error('Print error:', error);
      }
    };

    // Start printing immediately when component mounts
    startPrinting();
  }, [activePhoto, printer]);
  
  if (!activePhoto || !printer) {
    navigate('/payment');
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-md mx-auto mb-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold" style={{ color: venue.primaryColor }}>
            Printing Your Photo...
          </h1>
          <p className="text-gray-600 mt-2 flex items-center justify-center">
            <Printer className="h-5 w-5 mr-2 animate-pulse" />
            Please wait while your photo prints
          </p>
        </div>
        
        <div className="mb-8 bg-white p-4 rounded-lg shadow-md">
          <img 
            src={activePhoto.src}
            alt="Your photo"
            className="w-full h-auto rounded"
          />
        </div>
        
        <div className="space-y-6">
          <ShareOptions photoSrc={activePhoto.src} />
        </div>
        
        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate('/payment')}
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg"
          >
            <Home className="h-5 w-5 mr-2" />
            Take More Photos
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareScreen;