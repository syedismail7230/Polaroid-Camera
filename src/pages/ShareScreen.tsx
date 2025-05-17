import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Share, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import ShareOptions from '../components/ShareOptions';
import { printImage } from '../utils/printer';

const ShareScreen: React.FC = () => {
  const { activePhoto, printer, venue } = useAppContext();
  const [printStatus, setPrintStatus] = useState<'printing' | 'done' | 'error' | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const printPhoto = async () => {
      if (!activePhoto || !printer) return;
      
      setPrintStatus('printing');
      try {
        const success = await printImage(activePhoto.src, printer);
        setPrintStatus(success ? 'done' : 'error');
      } catch (error) {
        console.error('Print error:', error);
        setPrintStatus('error');
      }
    };

    // Start printing automatically when component mounts
    printPhoto();
  }, [activePhoto, printer]);
  
  if (!activePhoto) {
    navigate('/');
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-md mx-auto mb-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold" style={{ color: venue.primaryColor }}>
            Printing Your Photo
          </h1>
          <p className="text-gray-600 mt-2">
            {printStatus === 'printing' && 'Your photo is being printed...'}
            {printStatus === 'done' && 'Your photo has been printed!'}
            {printStatus === 'error' && 'There was an error printing your photo. Please try again.'}
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
        
        <div className="flex justify-center mt-8 space-x-4">
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