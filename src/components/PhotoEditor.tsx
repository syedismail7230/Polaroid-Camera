import React, { useState } from 'react';
import { Save, Type, X } from 'lucide-react';

interface PhotoEditorProps {
  photoSrc: string;
  onSave: (editedPhoto: { src: string; filter: string; frame: string; caption: string }) => void;
  onCancel: () => void;
}

const PhotoEditor: React.FC<PhotoEditorProps> = ({ photoSrc, onSave, onCancel }) => {
  const [selectedFilter, setSelectedFilter] = useState('original');
  const [selectedFrame, setSelectedFrame] = useState('classic');
  const [caption, setCaption] = useState('');
  const [showCaptionInput, setShowCaptionInput] = useState(false);

  const filters = [
    { id: 'original', name: 'Original', class: '' },
    { id: 'sepia', name: 'Sepia', class: 'sepia' },
    { id: 'grayscale', name: 'B&W', class: 'grayscale' },
    { id: 'vintage', name: 'Vintage', class: 'brightness-90 contrast-110 saturate-85' },
    { id: 'fade', name: 'Fade', class: 'brightness-110 contrast-90 saturate-75' },
  ];

  const frames = [
    { id: 'classic', name: 'Classic', class: 'border-[15px] border-white shadow-lg' },
    { id: 'black', name: 'Black', class: 'border-[15px] border-black shadow-lg' },
    { id: 'pink', name: 'Pink', class: 'border-[15px] border-pink-300 shadow-lg' },
    { id: 'blue', name: 'Blue', class: 'border-[15px] border-blue-300 shadow-lg' },
    { id: 'none', name: 'None', class: '' },
  ];

  const getFilterClass = () => {
    return filters.find(f => f.id === selectedFilter)?.class || '';
  };

  const getFrameClass = () => {
    return frames.find(f => f.id === selectedFrame)?.class || '';
  };

  const handleSave = () => {
    onSave({
      src: photoSrc,
      filter: selectedFilter,
      frame: selectedFrame,
      caption: caption,
    });
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative max-w-md mb-8">
        <div className={`relative ${getFrameClass()} rounded-sm overflow-hidden`}>
          <img 
            src={photoSrc} 
            alt="Edit preview" 
            className={`w-full h-auto ${getFilterClass()}`} 
          />
          
          {caption && (
            <div className="absolute bottom-0 w-full bg-black bg-opacity-50 p-2 text-white text-center">
              {caption}
            </div>
          )}
        </div>
      </div>

      {showCaptionInput ? (
        <div className="w-full max-w-md mb-6 flex">
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Enter caption..."
            className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={50}
          />
          <button 
            onClick={() => setShowCaptionInput(false)}
            className="bg-gray-500 text-white p-2 rounded-r-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <button 
          onClick={() => setShowCaptionInput(true)}
          className="mb-6 flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg"
        >
          <Type className="h-4 w-4 mr-2" />
          Add Caption
        </button>
      )}

      <div className="w-full max-w-md mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Filters</h3>
        <div className="grid grid-cols-5 gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`p-2 rounded text-xs ${
                selectedFilter === filter.id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {filter.name}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-md mb-8">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Frames</h3>
        <div className="grid grid-cols-5 gap-2">
          {frames.map((frame) => (
            <button
              key={frame.id}
              onClick={() => setSelectedFrame(frame.id)}
              className={`p-2 rounded text-xs ${
                selectedFrame === frame.id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {frame.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex space-x-4">
        <button 
          onClick={onCancel}
          className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg"
        >
          Cancel
        </button>
        
        <button 
          onClick={handleSave}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg flex items-center"
        >
          <Save className="mr-2 h-5 w-5" />
          Save
        </button>
      </div>
    </div>
  );
};

export default PhotoEditor;