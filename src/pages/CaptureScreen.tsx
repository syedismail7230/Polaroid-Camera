import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Camera } from 'lucide-react';
import PhotoCapture from '../components/PhotoCapture';
import PhotoEditor from '../components/PhotoEditor';
import { useAppContext } from '../context/AppContext';
import { v4 as uuidv4 } from 'uuid';

const CaptureScreen: React.FC = () => {
  const location = useLocation();
  const { photoCount = 1 } = location.state || {};
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [step, setStep] = useState<'capture' | 'edit'>('capture');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const { addPhoto, setActivePhoto, venue } = useAppContext();
  const navigate = useNavigate();
  
  const handlePhotoCapture = (photoData: string) => {
    setCapturedPhotos(prev => [...prev, photoData]);
    setStep('edit');
  };
  
  const handleEditComplete = (editedPhoto: { 
    src: string; 
    filter: string; 
    frame: string; 
    caption: string 
  }) => {
    const newPhoto = {
      id: uuidv4(),
      src: editedPhoto.src,
      filter: editedPhoto.filter,
      frame: editedPhoto.frame,
      caption: editedPhoto.caption,
      createdAt: new Date()
    };
    
    addPhoto(newPhoto);
    setActivePhoto(newPhoto);

    if (capturedPhotos.length < photoCount) {
      // More photos to capture
      setStep('capture');
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    } else {
      // All photos captured, proceed to share/print
      navigate('/share');
    }
  };
  
  const handleEditCancel = () => {
    setCapturedPhotos(prev => prev.slice(0, -1));
    setStep('capture');
  };
  
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="mb-8 text-center">
        {venue.logo && (
          <img 
            src={venue.logo} 
            alt={venue.name} 
            className="h-12 mx-auto mb-4"
          />
        )}
        <h1 className="text-2xl font-bold" style={{ color: venue.primaryColor }}>
          {step === 'capture' ? `Take Photo ${currentPhotoIndex + 1} of ${photoCount}` : 'Edit Your Photo'}
        </h1>
      </div>
      
      <div className="max-w-md mx-auto mb-8">
        {step === 'capture' ? (
          <PhotoCapture onCapture={handlePhotoCapture} />
        ) : capturedPhotos.length > 0 && (
          <PhotoEditor 
            photoSrc={capturedPhotos[capturedPhotos.length - 1]}
            onSave={handleEditComplete}
            onCancel={handleEditCancel}
          />
        )}
      </div>
      
      {step === 'capture' && (
        <div className="text-center text-sm text-gray-500 max-w-md mx-auto">
          <p>Take a photo or select from your gallery to create a custom polaroid print</p>
        </div>
      )}
    </div>
  );
};

export default CaptureScreen;