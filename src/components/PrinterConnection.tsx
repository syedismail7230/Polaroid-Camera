import React, { useState, useEffect } from 'react';
import { Plug, RefreshCw, WifiOff } from 'lucide-react';
import { PrinterDevice } from '../types';

interface PrinterConnectionProps {
  onConnect: (device: PrinterDevice) => void;
}

const PrinterConnection: React.FC<PrinterConnectionProps> = ({ onConnect }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<PrinterDevice[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [connectingDevice, setConnectingDevice] = useState<string | null>(null);

  // Auto-scan on mount
  useEffect(() => {
    scanForDevices();
  }, []);

  const scanForUSBPrinters = async () => {
    if (!('usb' in navigator)) {
      setError('USB support not available in this browser');
      return [];
    }

    try {
      const usb = (navigator as any).usb;
      const device = await usb.requestDevice({
        filters: [{ classCode: 7 }] // Printer class
      });

      if (device) {
        return [{
          id: device.deviceId?.toString() ?? `usb-${Date.now()}`,
          name: device.productName || 'USB Printer',
          type: 'usb',
          status: 'disconnected'
        }];
      }
      return [];
    } catch (error) {
      if ((error as Error).name === 'NotFoundError') {
        return [];
      }
      console.error('USB scan error:', error);
      return [];
    }
  };

  const scanForDevices = async () => {
    if (isScanning) return;
    
    setIsScanning(true);
    setError(null);

    try {
      // First try USB printers
      const usbPrinters = await scanForUSBPrinters();
      
      // If no USB printers found, add a demo printer
      const allPrinters = usbPrinters.length > 0 ? usbPrinters : [{
        id: 'demo-printer',
        name: 'Demo Printer',
        type: 'usb',
        status: 'disconnected'
      }];
      
      setDevices(allPrinters);
    } catch (error) {
      console.error('Scan error:', error);
      setError('Failed to scan for printers');
    } finally {
      setIsScanning(false);
    }
  };

  const connectToDevice = async (device: PrinterDevice) => {
    if (device.status === 'connected' || connectingDevice) return;

    try {
      setConnectingDevice(device.id);
      setDevices(prev => 
        prev.map(d => ({
          ...d,
          status: d.id === device.id ? 'connecting' : d.status
        }))
      );

      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const connectedDevice = { ...device, status: 'connected' };
      setDevices(prev => 
        prev.map(d => d.id === device.id ? connectedDevice : d)
      );
      
      // Notify parent of successful connection
      onConnect(connectedDevice);
    } catch (error) {
      console.error('Connection error:', error);
      setError('Failed to connect to printer');
      setDevices(prev => 
        prev.map(d => d.id === device.id ? { ...d, status: 'disconnected' } : d)
      );
    } finally {
      setConnectingDevice(null);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold">Connect Your Printer</h2>
          </div>
          <button 
            onClick={scanForDevices}
            disabled={isScanning}
            className="text-blue-500 hover:text-blue-700 flex items-center text-sm"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Scanning...' : 'Scan'}
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
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
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
                  disabled={device.status !== 'disconnected' || !!connectingDevice}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
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
                <p className="text-sm text-gray-400 mt-2">Connect a printer and click Scan</p>
                <button 
                  onClick={scanForDevices}
                  className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Scan for Printers
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