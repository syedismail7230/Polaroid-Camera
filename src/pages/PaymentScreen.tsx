import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import PaymentProcess from '../components/PaymentProcess';
import PhotoPackageSelector from '../components/PhotoPackageSelector';

const PaymentScreen: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const { venue } = useAppContext();
  const navigate = useNavigate();
  
  const handlePackageSelect = (pkg: any) => {
    setSelectedPackage(pkg);
  };
  
  const handlePaymentComplete = (success: boolean) => {
    if (success) {
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
            {selectedPackage ? 'Complete Payment' : 'Choose Your Package'}
          </h1>
        </div>
        
        {selectedPackage ? (
          <PaymentProcess 
            price={selectedPackage.price}
            onComplete={handlePaymentComplete}
          />
        ) : (
          <PhotoPackageSelector onSelect={handlePackageSelect} />
        )}
      </div>
    </div>
  );
};

export default PaymentScreen;