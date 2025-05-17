import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Package } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import PaymentProcess from '../components/PaymentProcess';
import PrinterConnection from '../components/PrinterConnection';

interface PhotoPackage {
  id: string;
  count: number;
  price: number;
  description: string;
}

const packages: PhotoPackage[] = [
  {
    id: 'single',
    count: 1,
    price: 20,
    description: 'Single Photo Print'
  },
  {
    id: 'bundle',
    count: 5,
    price: 100,
    description: 'Photo Bundle (Save ₹20!)'
  }
];

const PaymentScreen: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<PhotoPackage | null>(null);
  const { venue, printer } = useAppContext();
  const navigate = useNavigate();
  
  const handlePaymentComplete = (success: boolean) => {
    if (success && selectedPackage) {
      navigate('/capture', { 
        state: { photoCount: selectedPackage.count } 
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-md mx-auto mb-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold" style={{ color: venue.primaryColor }}>
            {!printer ? 'Connect Printer' : selectedPackage ? 'Complete Payment' : 'Choose Your Package'}
          </h1>
        </div>
        
        {!printer ? (
          <PrinterConnection onConnect={() => setSelectedPackage(null)} />
        ) : selectedPackage ? (
          <PaymentProcess 
            price={selectedPackage.price}
            onComplete={handlePaymentComplete}
          />
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6">Select Your Package</h2>
            
            <div className="space-y-4">
              {packages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg)}
                  className="w-full p-4 border-2 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-200">
                        {pkg.count === 1 ? (
                          <Camera className="h-6 w-6 text-blue-600" />
                        ) : (
                          <Package className="h-6 w-6 text-blue-600" />
                        )}
                      </div>
                      <div className="ml-4 text-left">
                        <h3 className="font-medium">{pkg.description}</h3>
                        <p className="text-sm text-gray-500">{pkg.count} Photo{pkg.count > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-blue-600">
                      ₹{pkg.price}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentScreen;