import React, { useState, useEffect } from 'react';
import { Printer, Copy, Download } from 'lucide-react';
import { printImage } from '../utils/printer';
import { useAppContext } from '../context/AppContext';

interface PrintPreviewProps {
  photoSrc: string;
  filter: string;
  frame: string;
  caption: string;
  venueName: string;
  onPrint: () => void;
}

const PrintPreview: React.FC<PrintPreviewProps> = ({ 
  photoSrc, 
  filter, 
  frame, 
  caption, 
  venueName,
  onPrint 
}) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const [printStatus, setPrintStatus] = useState<'idle' | 'printing' | 'success' | 'error'>('idle');
  const { printer } = useAppContext();
  
  const getFilterClass = () => {
    switch (filter) {
      case 'sepia': return 'sepia';
      case 'grayscale': return 'grayscale';
      case 'vintage': return 'brightness-90 contrast-110 saturate-85';
      case 'fade': return 'brightness-110 contrast-90 saturate-75';
      default: return '';
    }
  };
  
  const getFrameClass = () => {
    switch (frame) {
      case 'classic': return 'border-[15px] border-white shadow-lg';
      case 'black': return 'border-[15px] border-black shadow-lg';
      case 'pink': return 'border-[15px] border-pink-300 shadow-lg';
      case 'blue': return 'border-[15px] border-blue-300 shadow-lg';
      default: return '';
    }
  };
  
  const handlePrint = async () => {
    if (!printer) return;
    
    setIsPrinting(true);
    setPrintStatus('printing');
    
    try {
      const success = await printImage(photoSrc, printer);
      setPrintStatus(success ? 'success' : 'error');
      
      if (success) {
        setTimeout(() => {
          onPrint();
        }, 1500);
      }
    } catch (error) {
      console.error('Print error:', error);
      setPrintStatus('error');
    } finally {
      setIsPrinting(false);
    }
  };
  
  // Auto-print when component mounts
  useEffect(() => {
    if (printer && printStatus === 'idle') {
      handlePrint();
    }
  }, [printer]);
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-6">Print Preview</h2>
        
        <div className="mb-6">
          <div className={`relative ${getFrameClass()} rounded-sm overflow-hidden mb-4`}>
            <img 
              src={photoSrc} 
              alt="Print preview" 
              className={`w-full h-auto ${getFilterClass()}`} 
            />
            
            {caption && (
              <div className="absolute bottom-0 w-full bg-black bg-opacity-50 p-2 text-white text-center">
                {caption}
              </div>
            )}
          </div>
          
          <div className="text-center text-sm text-gray-500">
            From {venueName}
          </div>
        </div>
        
        <div className="text-center">
          {printStatus === 'printing' && (
            <div className="flex items-center justify-center text-blue-600">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
              Printing...
            </div>
          )}
          
          {printStatus === 'success' && (
            <div className="text-green-600">
              Print sent successfully!
            </div>
          )}
          
          {printStatus === 'error' && (
            <div className="text-red-600 mb-4">
              Print failed. Please try again.
              <button
                onClick={handlePrint}
                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Retry Print
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrintPreview;