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
  const [autoScanEnabled, setAutoScanEnabled] = useState(true);
  
  const scanForDevices = async () => {
    if (isScanning) return;
    
    setIsScanning(true);
    setDevices([]);
    
    try {
      // Try to discover Bluetooth printers
      if ('bluetooth' in navigator) {
        const bluetooth = (navigator as any).bluetooth;
        const device = await bluetooth.requestDevice({
          filters: [
            { services: ['00001812-0000-1000-8000-00805f9b34fb'] }, // Printer service UUID
            { services: ['0000180f-0000-1000-8000-00805f9b34fb'] }  // Battery service UUID
          ]
        });
        
        if (device) {
          const newDevice: PrinterDevice = {
            id: device.id,
            name: device.name || 'Bluetooth Printer',
            type: 'bluetooth',
            status: 'disconnected'
          };
          setDevices(prev => [...prev, newDevice]);
        }
      }
      
      // Try to discover USB printers
      if ('usb' in navigator) {
        const usb = (navigator as any).usb;
        const devices = await usb.getDevices();
        
        const printerDevices = devices
          .filter((d: any) => d.deviceClass === 7) // Printer class
          .map((d: any) => ({
            id: d.deviceId,
            name: d.productName || 'USB Printer',
            type: 'usb',
            status: 'disconnected'
          }));
        
        setDevices(prev => [...prev, ...printerDevices]);
      }
    } catch (error) {
      console.error('Error scanning for printers:', error);
    } finally {
      setIsScanning(false);
      setLastScanTime(Date.now());
    }
  };
  
  const connectToDevice = async (device: PrinterDevice) => {
    const updatedDevices = devices.map(d => ({
      ...d,
      status: d.id === device.id ? 'connecting' : d.status
    }));
    
    setDevices(updatedDevices);
    
    try {
      if (device.type === 'bluetooth') {
        const bluetooth = (navigator as any).bluetooth;
        const bluetoothDevice = await bluetooth.requestDevice({
          filters: [{ services: ['00001812-0000-1000-8000-00805f9b34fb'] }] // Printer service UUID
        });
        
        const server = await bluetoothDevice.gatt.connect();
        const service = await server.getPrimaryService('00001812-0000-1000-8000-00805f9b34fb');
        
        // Store the printer service for later use
        (window as any).printerService = service;
      } else if (device.type === 'usb') {
        const usb = (navigator as any).usb;
        const usbDevice = await usb.requestDevice({
          filters: [{ classCode: 7 }] // Printer class
        });
        
        await usbDevice.open();
        await usbDevice.selectConfiguration(1);
        await usbDevice.claimInterface(0);
        
        // Store the USB device for later use
        (window as any).printerDevice = usbDevice;
      }
      
      const connectedDevice = { ...device, status: 'connected' };
      setDevices(devices.map(d => 
        d.id === device.id ? connectedDevice : d
      ));
      
      onConnect(connectedDevice);
    } catch (error) {
      console.error('Error connecting to printer:', error);
      setDevices(devices.map(d => 
        d.id === device.id ? { ...d, status: 'disconnected' } : d
      ));
    }
  };
  
  // Auto-scan for USB printers only (no Bluetooth auto-scan)
  useEffect(() => {
    if (!autoScanEnabled) return;
    
    const scanInterval = setInterval(async () => {
      if (Date.now() - lastScanTime > 10000 && 'usb' in navigator) { // Scan every 10 seconds
        try {
          const usb = (navigator as any).usb;
          const devices = await usb.getDevices();
          
          const printerDevices = devices
            .filter((d: any) => d.deviceClass === 7)
            .map((d: any) => ({
              id: d.deviceId,
              name: d.productName || 'USB Printer',
              type: 'usb',
              status: 'disconnected'
            }));
          
          setDevices(printerDevices);
          setLastScanTime(Date.now());
        } catch (error) {
          console.error('Error scanning for USB printers:', error);
        }
      }
    }, 10000);
    
    return () => clearInterval(scanInterval);
  }, [lastScanTime, autoScanEnabled]);
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold">Available Printers</h2>
            {autoScanEnabled && (
              <div className="ml-2 text-sm text-green-600 flex items-center">
                <Wifi className="h-4 w-4 mr-1 animate-pulse" />
                Auto-scanning USB
              </div>
            )}
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
        
        {devices.length > 0 ? (
          <div className="space-y-3">
            {devices.map((device) => (
              <div 
                key={device.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-all"
              >
                <div className="flex items-center">
                  {device.type === 'bluetooth' ? (
                    <Bluetooth className="h-5 w-5 text-blue-500 mr-3" />
                  ) : (
                    <Plug className="h-5 w-5 text-gray-600 mr-3" />
                  )}
                  <div>
                    <p className="font-medium">{device.name}</p>
                    <p className="text-xs text-gray-500">
                      {device.type === 'bluetooth' ? 'Bluetooth' : 'USB'}
                    </p>
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