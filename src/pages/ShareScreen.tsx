import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Share, ArrowLeft, Printer } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import ShareOptions from '../components/ShareOptions';
import { printImage } from '../utils/printer';

const ShareScreen: React.FC = () => {
  const { activePhoto, printer, venue } = useAppContext();
  const [printStatus, setPrintStatus] = useState<'printing' | 'done' | 'error' | null>(null);
  const [printAttempts, setPrintAttempts] = useState(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    const printPhoto = async () => {
      if (!activePhoto || !printer || printStatus === 'done') return;
      
      setPrintStatus('printing');
      try {
        const success = await printImage(activePhoto.src, printer);
        if (success) {
          setPrintStatus('done');
        } else {
          // If print fails, retry up to 3 times
          if (printAttempts < 3) {
            setPrintAttempts(prev => prev + 1);
            setTimeout(printPhoto, 2000); // Retry after 2 seconds
          } else {
            setPrintStatus('error');
          }
        }
      } catch (error) {
        console.error('Print error:', error);
        setPrintStatus('error');
      }
    };

    // Start printing automatically when component mounts
    printPhoto();
  }, [activePhoto, printer, printAttempts]);
  
  if (!activePhoto) {
    navigate('/payment');
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-md mx-auto mb-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold" style={{ color: venue.primaryColor }}>
            {printStatus === 'printing' && 'Printing Your Photo...'}
            {printStatus === 'done' && 'Photo Printed Successfully!'}
            {printStatus === 'error' && 'Printing Error'}
          </h1>
          <p className="text-gray-600 mt-2">
            {printStatus === 'printing' && (
              <div className="flex items-center justify-center">
                <Printer className="h-5 w-5 mr-2 animate-pulse" />
                Sending to printer...
              </div>
            )}
            {printStatus === 'error' && 'There was an error printing. Please try again.'}
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
          {printStatus === 'error' && (
            <button
              onClick={() => {
                setPrintAttempts(0);
                setPrintStatus(null);
              }}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg"
            >
              Retry Print
            </button>
          )}
          
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