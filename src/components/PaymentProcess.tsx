import React, { useState, useEffect } from 'react';
import { CreditCard, Wallet, DollarSign, Printer, Check, X } from 'lucide-react';

interface PaymentProcessProps {
  price: number;
  onComplete: (success: boolean) => void;
}

const PaymentProcess: React.FC<PaymentProcessProps> = ({ price, onComplete }) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  
  const paymentMethods = [
    { id: 'card', name: 'Credit Card', icon: <CreditCard className="h-5 w-5" /> },
    { id: 'wallet', name: 'Mobile Wallet', icon: <Wallet className="h-5 w-5" /> },
    { id: 'cash', name: 'Cash', icon: <DollarSign className="h-5 w-5" /> },
  ];

  const simulatePayment = () => {
    setProcessing(true);
    setStatus('processing');
    
    // Simulate payment processing time (2 seconds)
    setTimeout(() => {
      // 90% success rate for simulation
      const success = Math.random() < 0.9;
      setStatus(success ? 'success' : 'failed');
      setProcessing(false);
      
      // If successful, wait 1.5 seconds then complete
      if (success) {
        setTimeout(() => {
          onComplete(true);
        }, 1500);
      }
    }, 2000);
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Payment</h2>
          <div className="text-2xl font-bold text-blue-600">${price.toFixed(2)}</div>
        </div>
        
        {status === 'idle' && (
          <>
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Select Payment Method</h3>
              <div className="grid grid-cols-3 gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                      selectedMethod === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="mb-2">
                      {method.icon}
                    </div>
                    <span className="text-sm">{method.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={simulatePayment}
              disabled={!selectedMethod}
              className={`w-full py-3 rounded-lg flex items-center justify-center font-medium ${
                selectedMethod
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              Pay Now
            </button>
          </>
        )}
        
        {status === 'processing' && (
          <div className="flex flex-col items-center py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Processing payment...</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="flex flex-col items-center py-8">
            <div className="bg-green-100 text-green-600 p-4 rounded-full mb-4">
              <Check className="h-10 w-10" />
            </div>
            <p className="text-xl font-medium text-green-600 mb-2">Payment Successful!</p>
            <p className="text-gray-600 mb-4">Preparing to print your photo...</p>
            <div className="flex items-center text-blue-500">
              <Printer className="h-5 w-5 mr-2 animate-pulse" />
              <span>Sending to printer</span>
            </div>
          </div>
        )}
        
        {status === 'failed' && (
          <div className="flex flex-col items-center py-8">
            <div className="bg-red-100 text-red-600 p-4 rounded-full mb-4">
              <X className="h-10 w-10" />
            </div>
            <p className="text-xl font-medium text-red-600 mb-2">Payment Failed</p>
            <p className="text-gray-600 mb-4">Please try again or use a different payment method.</p>
            <button
              onClick={() => setStatus('idle')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentProcess;