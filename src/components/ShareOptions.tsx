import React, { useState } from 'react';
import { Mail, QrCode, Share2, Check } from 'lucide-react';

interface ShareOptionsProps {
  photoSrc: string;
}

const ShareOptions: React.FC<ShareOptionsProps> = ({ photoSrc }) => {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);
  
  const simulateSendEmail = () => {
    if (!email) return;
    
    setIsSending(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsSending(false);
      setShareSuccess('email');
      setEmail('');
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setShareSuccess(null);
      }, 3000);
    }, 1500);
  };
  
  const simulateWhatsAppShare = () => {
    setIsSending(true);
    
    // Simulate sharing delay
    setTimeout(() => {
      setIsSending(false);
      setShareSuccess('whatsapp');
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setShareSuccess(null);
      }, 3000);
    }, 1000);
  };
  
  const generateQRCode = () => {
    setIsSending(true);
    
    // Simulate QR code generation delay
    setTimeout(() => {
      setIsSending(false);
      setShareSuccess('qr');
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setShareSuccess(null);
      }, 3000);
    }, 1000);
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-6">Share Your Photo</h2>
        
        {shareSuccess && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center">
            <Check className="h-5 w-5 mr-2" />
            {shareSuccess === 'email' && 'Email sent successfully!'}
            {shareSuccess === 'whatsapp' && 'Shared to WhatsApp!'}
            {shareSuccess === 'qr' && 'QR code generated on your print!'}
          </div>
        )}
        
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="flex">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={simulateSendEmail}
              disabled={!email || isSending}
              className={`flex items-center px-4 rounded-r-lg ${
                !email || isSending
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              <Mail className="h-4 w-4 mr-1" />
              {isSending ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={simulateWhatsAppShare}
            disabled={isSending}
            className="flex items-center justify-center py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
          >
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png" 
              alt="WhatsApp" 
              className="h-5 w-5 mr-2" 
            />
            WhatsApp
          </button>
          
          <button
            onClick={generateQRCode}
            disabled={isSending}
            className="flex items-center justify-center py-3 px-4 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium"
          >
            <QrCode className="h-5 w-5 mr-2" />
            Add QR Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareOptions;