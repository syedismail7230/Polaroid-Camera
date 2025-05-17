import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Printer, RefreshCw } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import ShareOptions from '../components/ShareOptions';
import { printImage } from '../utils/printer';

const ShareScreen: React.FC = () => {
  const { activePhoto, printer, venue } = useAppContext();
  const navigate = useNavigate();
  const [printStatus, setPrintStatus] = useState<'printing' | 'error' | 'success'>('printing');
  
  const handlePrint = async () => {
    if (!activePhoto || !printer) {
      navigate('/');
      return;
    }

    setPrintStatus('printing');
    try {
      const success = await printImage(activePhoto.src, printer);
      if (!success) {
        setPrintStatus('error');
      } else {
        setPrintStatus('success');
      }
    } catch (error) {
      console.error('Print error:', error);
      setPrintStatus('error');
    }
  };

  useEffect(() => {
    handlePrint();
  }, [activePhoto, printer]);
  
  if (!activePhoto || !printer) {
    navigate('/');
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-md mx-auto mb-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold" style={{ color: venue.primaryColor }}>
            {printStatus === 'printing' && 'Printing Your Photo...'}
            {printStatus === 'error' && 'Print Failed'}
            {printStatus === 'success' && 'Print Complete'}
          </h1>
          <p className="text-gray-600 mt-2 flex items-center justify-center">
            {printStatus === 'printing' && (
              <>
                <Printer className="h-5 w-5 mr-2 animate-pulse" />
                Please wait while your photo prints
              </>
            )}
            {printStatus === 'error' && (
              <>
                <span className="text-red-500">There was an error printing your photo.</span>
              </>
            )}
            {printStatus === 'success' && (
              <>
                <Printer className="h-5 w-5 mr-2" />
                Your photo has been printed successfully
              </>
            )}
          </p>
        </div>
        
        <div className="mb-8 bg-white p-4 rounded-lg shadow-md">
          <img 
            src={activePhoto.src}
            alt="Your photo"
            className="w-full h-auto rounded"
          />
        </div>
        
        {printStatus === 'error' && (
          <div className="text-center mb-6">
            <button
              onClick={handlePrint}
              className="flex items-center mx-auto bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Retry Printing
            </button>
          </div>
        )}
        
        <div className="space-y-6">
          <ShareOptions photoSrc={activePhoto.src} />
        </div>
        
        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate('/capture')}
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