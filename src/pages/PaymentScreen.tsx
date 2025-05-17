import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Package } from 'lucide-react';
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
  const [step, setStep] = useState<'printer' | 'package' | 'payment'>('printer');
  const [selectedPackage, setSelectedPackage] = useState<PhotoPackage | null>(null);
  const { venue, printer, connectPrinter } = useAppContext();
  const navigate = useNavigate();

  const handlePrinterConnect = (device: any) => {
    connectPrinter(device);
    setStep('package');
  };
  
  const handlePackageSelect = (pkg: PhotoPackage) => {
    setSelectedPackage(pkg);
    setStep('payment');
  };
  
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
          {venue.logo && (
            <img 
              src={venue.logo} 
              alt={venue.name} 
              className="h-12 mx-auto mb-4"
            />
          )}
          <h1 className="text-2xl font-bold" style={{ color: venue.primaryColor }}>
            {step === 'printer' && 'Connect Printer'}
            {step === 'package' && 'Choose Your Package'}
            {step === 'payment' && 'Complete Payment'}
          </h1>
        </div>

        {step === 'printer' && (
          <PrinterConnection onConnect={handlePrinterConnect} />
        )}

        {step === 'package' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="space-y-4">
              {packages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => handlePackageSelect(pkg)}
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

        {step === 'payment' && selectedPackage && (
          <PaymentProcess 
            price={selectedPackage.price}
            onComplete={handlePaymentComplete}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentScreen;