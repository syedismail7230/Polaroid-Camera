import React, { useState, useRef, useEffect } from 'react';
import { Camera, Image, RefreshCw } from 'lucide-react';

interface PhotoCaptureProps {
  onCapture: (photoData: string) => void;
}

const PhotoCapture: React.FC<PhotoCaptureProps> = ({ onCapture }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      setError(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsCapturing(true);
          // Auto start countdown after camera is ready
          startCountdown();
        };
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please check permissions and try again.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCapturing(false);
  };

  const startCountdown = () => {
    setCountdown(3);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (countdown === null) return;

    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      capturePhoto();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    if (context) {
      context.scale(-1, 1);
      context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(imageData);
      stopCamera();
      setCountdown(null);
      
      // Pass the captured image to parent after a brief delay
      setTimeout(() => {
        onCapture(imageData);
      }, 1500);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result as string;
        setCapturedImage(imageData);
        onCapture(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  // Start camera automatically when component mounts
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full max-w-md aspect-[3/4] bg-gray-900 rounded-lg overflow-hidden mb-4">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-red-500 bg-opacity-90 p-4">
            <p className="text-center mb-4">{error}</p>
            <button 
              onClick={startCamera}
              className="bg-white text-red-500 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted
              className={`absolute inset-0 w-full h-full object-cover transform scale-x-[-1] ${
                isCapturing ? 'opacity-100' : 'opacity-0'
              }`}
            />
            
            {countdown !== null && countdown > 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <span className="text-9xl font-bold text-white animate-bounce">
                  {countdown}
                </span>
              </div>
            )}
            
            {capturedImage && (
              <img 
                src={capturedImage} 
                alt="Captured" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            
            {!isCapturing && !capturedImage && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <p className="text-lg mb-4">Starting camera...</p>
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-white"></div>
              </div>
            )}
          </>
        )}
        
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {isCapturing && !countdown && (
        <button 
          onClick={startCountdown}
          className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-8 rounded-full transition-all"
        >
          Take Photo
        </button>
      )}
    </div>
  );
};

export default PhotoCapture;