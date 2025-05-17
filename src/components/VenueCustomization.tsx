import React, { useState } from 'react';
import { Settings, Save } from 'lucide-react';
import { Venue } from '../types';

interface VenueCustomizationProps {
  venue: Venue;
  onSave: (venue: Venue) => void;
}

const VenueCustomization: React.FC<VenueCustomizationProps> = ({ venue, onSave }) => {
  const [editedVenue, setEditedVenue] = useState<Venue>({ ...venue });
  const [isSaving, setIsSaving] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedVenue((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate API call delay
    setTimeout(() => {
      onSave(editedVenue);
      setIsSaving(false);
    }, 1000);
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-6">
          <Settings className="h-5 w-5 mr-2 text-blue-500" />
          <h2 className="text-xl font-semibold">Venue Customization</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Venue Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={editedVenue.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
              Logo URL
            </label>
            <input
              type="text"
              id="logo"
              name="logo"
              value={editedVenue.logo}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700 mb-1">
                Primary Color
              </label>
              <div className="flex">
                <input
                  type="color"
                  id="primaryColor"
                  name="primaryColor"
                  value={editedVenue.primaryColor}
                  onChange={handleChange}
                  className="h-10 w-10 border-0 p-0 mr-2"
                />
                <input
                  type="text"
                  value={editedVenue.primaryColor}
                  onChange={handleChange}
                  name="primaryColor"
                  className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700 mb-1">
                Secondary Color
              </label>
              <div className="flex">
                <input
                  type="color"
                  id="secondaryColor"
                  name="secondaryColor"
                  value={editedVenue.secondaryColor}
                  onChange={handleChange}
                  className="h-10 w-10 border-0 p-0 mr-2"
                />
                <input
                  type="text"
                  value={editedVenue.secondaryColor}
                  onChange={handleChange}
                  name="secondaryColor"
                  className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={editedVenue.contactEmail}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full flex items-center justify-center py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium mt-2"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VenueCustomization;