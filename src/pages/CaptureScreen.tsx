import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera } from 'lucide-react';
import PhotoCapture from '../components/PhotoCapture';
import PhotoEditor from '../components/PhotoEditor';
import { useAppContext } from '../context/AppContext';
import { v4 as uuidv4 } from 'uuid';

const CaptureScreen: React.FC = () => {
  const [step, setStep] = useState<'capture' | 'edit'>('capture');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const { addPhoto, setActivePhoto, venue, printer } = useAppContext();
  const navigate = useNavigate();
  
  // Redirect to payment if no printer is connected
  useEffect(() => {
    if (!printer) {
      navigate('/');
    }
  }, [printer, navigate]);
  
  const handlePhotoCapture = (photoData: string) => {
    setCapturedPhoto(photoData);
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
    navigate('/share'); // Go directly to share/print screen
  };
  
  const handleEditCancel = () => {
    setCapturedPhoto(null);
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
          {step === 'capture' ? 'Take Your Photo' : 'Edit Your Photo'}
        </h1>
      </div>
      
      <div className="max-w-md mx-auto mb-8">
        {step === 'capture' ? (
          <PhotoCapture onCapture={handlePhotoCapture} />
        ) : capturedPhoto && (
          <PhotoEditor 
            photoSrc={capturedPhoto}
            onSave={handleEditComplete}
            onCancel={handleEditCancel}
          />
        )}
      </div>
    </div>
  );
};

export default CaptureScreen;