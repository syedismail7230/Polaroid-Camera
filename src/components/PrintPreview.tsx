import React, { useState } from 'react';
import { Printer, Copy, Download } from 'lucide-react';

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
  
  const handlePrint = () => {
    setIsPrinting(true);
    
    // Simulate print delay
    setTimeout(() => {
      setIsPrinting(false);
      onPrint();
    }, 2000);
  };
  
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
        
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={handlePrint}
            disabled={isPrinting}
            className="flex flex-col items-center justify-center p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            {isPrinting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mb-1"></div>
            ) : (
              <Printer className="h-5 w-5 mb-1" />
            )}
            <span className="text-sm">{isPrinting ? 'Printing...' : 'Print'}</span>
          </button>
          
          <button
            className="flex flex-col items-center justify-center p-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg"
          >
            <Copy className="h-5 w-5 mb-1" />
            <span className="text-sm">Copy</span>
          </button>
          
          <button
            className="flex flex-col items-center justify-center p-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg"
          >
            <Download className="h-5 w-5 mb-1" />
            <span className="text-sm">Save</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintPreview;