import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Share, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import ShareOptions from '../components/ShareOptions';
import PrinterConnection from '../components/PrinterConnection';

const ShareScreen: React.FC = () => {
  const { activePhoto, printer, connectPrinter, venue } = useAppContext();
  const navigate = useNavigate();
  
  if (!activePhoto) {
    navigate('/');
    return null;
  }
  
  const handlePrinterConnect = () => {
    // After printer connection, we could automatically print in a real app
  };
  
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-md mx-auto mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </button>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold" style={{ color: venue.primaryColor }}>
            Share & Print
          </h1>
          <p className="text-gray-600 mt-2">
            Your photo is printing! While you wait, share it digitally.
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
          
          {!printer && (
            <PrinterConnection onConnect={connectPrinter} />
          )}
        </div>
        
        <div className="flex justify-center mt-8 space-x-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg"
          >
            <Home className="h-5 w-5 mr-2" />
            New Photo
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareScreen;