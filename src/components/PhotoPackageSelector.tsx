import React from 'react';
import { Camera, Package } from 'lucide-react';

interface PhotoPackage {
  id: string;
  count: number;
  price: number;
  description: string;
}

interface PhotoPackageSelectorProps {
  onSelect: (pkg: PhotoPackage) => void;
}

const PhotoPackageSelector: React.FC<PhotoPackageSelectorProps> = ({ onSelect }) => {
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

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-6">Select Your Package</h2>
        
        <div className="space-y-4">
          {packages.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => onSelect(pkg)}
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
    </div>
  );
};

export default PhotoPackageSelector;