import React, { useState, useEffect } from 'react';
import { Bluetooth, Plug, RefreshCw, Printer, WifiOff, Wifi } from 'lucide-react';
import { PrinterDevice } from '../types';

interface PrinterConnectionProps {
  onConnect: (device: PrinterDevice) => void;
  autoConnect?: boolean;
}

const PrinterConnection: React.FC<PrinterConnectionProps> = ({ onConnect, autoConnect = true }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<PrinterDevice[]>([]);
  const [lastScanTime, setLastScanTime] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const scanForUSBPrinters = async () => {
    if (!('usb' in navigator)) {
      setError('USB support not available in this browser');
      return [];
    }

    try {
      const usb = (navigator as any).usb;
      
      // Request access to USB devices with printer interface
      const device = await usb.requestDevice({
        filters: [
          { classCode: 7 }, // Printer class
          { classCode: 0xFF } // Vendor specific class (some printers use this)
        ]
      });

      // Only proceed if a device was selected
      if (device) {
        const printerDevice: PrinterDevice = {
          id: device.deviceId.toString(),
          name: device.productName || 'USB Printer',
          type: 'usb',
          status: 'disconnected'
        };
        
        return [printerDevice];
      }
      
      return [];
    } catch (error) {
      // Check if the error is due to user cancellation
      if ((error as Error).name === 'NotFoundError' || 
          (error as Error).message.includes('No device selected')) {
        // User cancelled the selection - return empty array without setting error
        return [];
      }
      
      console.error('Error scanning USB devices:', error);
      setError('Failed to access USB device. Please try again.');
      return [];
    }
  };

  const scanForDevices = async () => {
    if (isScanning) return;
    
    setIsScanning(true);
    setError(null);
    setDevices([]);

    try {
      // Scan for USB printers
      const usbPrinters = await scanForUSBPrinters();
      setDevices(prev => [...prev, ...usbPrinters]);
      
    } catch (error) {
      console.error('Error during device scan:', error);
      setError('Failed to scan for printers. Please try again.');
    } finally {
      setIsScanning(false);
      setLastScanTime(Date.now());
    }
  };

  const connectToDevice = async (device: PrinterDevice) => {
    try {
      setDevices(prev => 
        prev.map(d => ({
          ...d,
          status: d.id === device.id ? 'connecting' : d.status
        }))
      );

      if (device.type === 'usb') {
        const usb = (navigator as any).usb;
        const usbDevices = await usb.getDevices();
        const printerDevice = usbDevices.find(d => d.deviceId.toString() === device.id);

        if (printerDevice) {
          await printerDevice.open();
          await printerDevice.selectConfiguration(1);
          await printerDevice.claimInterface(0);

          // Store the USB device for later use
          (window as any).printerDevice = printerDevice;

          const connectedDevice = { ...device, status: 'connected' };
          setDevices(prev => 
            prev.map(d => d.id === device.id ? connectedDevice : d)
          );
          onConnect(connectedDevice);
        }
      }
    } catch (error) {
      console.error('Error connecting to printer:', error);
      setError('Failed to connect to printer. Please try again.');
      setDevices(prev => 
        prev.map(d => d.id === device.id ? { ...d, status: 'disconnected' } : d)
      );
    }
  };

  // Auto-scan on component mount if autoConnect is true
  useEffect(() => {
    if (autoConnect) {
      scanForDevices();
    }
  }, [autoConnect]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold">Available Printers</h2>
          </div>
          <button 
            onClick={scanForDevices}
            disabled={isScanning}
            className="text-blue-500 hover:text-blue-700 flex items-center text-sm"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Scanning...' : 'Scan for Printers'}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {devices.length > 0 ? (
          <div className="space-y-3">
            {devices.map((device) => (
              <div 
                key={device.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-all"
              >
                <div className="flex items-center">
                  <Plug className="h-5 w-5 text-gray-600 mr-3" />
                  <div>
                    <p className="font-medium">{device.name}</p>
                    <p className="text-xs text-gray-500">USB Printer</p>
                  </div>
                </div>
                
                <button
                  onClick={() => connectToDevice(device)}
                  disabled={device.status !== 'disconnected'}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    device.status === 'connected'
                      ? 'bg-green-100 text-green-700'
                      : device.status === 'connecting'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {device.status === 'connected' ? 'Connected' : 
                   device.status === 'connecting' ? 'Connecting...' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 flex flex-col items-center text-gray-500">
            {isScanning ? (
              <>
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
                <p>Scanning for printers...</p>
              </>
            ) : (
              <>
                <WifiOff className="h-10 w-10 mb-2" />
                <p>No printers found</p>
                <button 
                  onClick={scanForDevices}
                  className="mt-3 text-blue-500 hover:text-blue-700 text-sm"
                >
                  Try again
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrinterConnection;