export async function printImage(imageData: string, printerService: any) {
  try {
    // Convert base64 image to printer-compatible format
    const rawData = await processImageForPrinter(imageData);
    
    // Send data to printer
    if ('printerService' in window) {
      // Bluetooth printer
      const characteristic = await printerService.getCharacteristic('2A57'); // Printer characteristic
      
      // Split data into chunks (MTU size)
      const chunkSize = 512;
      for (let i = 0; i < rawData.length; i += chunkSize) {
        const chunk = rawData.slice(i, i + chunkSize);
        await characteristic.writeValue(chunk);
      }
    } else if ('printerDevice' in window) {
      // USB printer
      const printerDevice = (window as any).printerDevice;
      await printerDevice.transferOut(1, rawData);
    }
    
    return true;
  } catch (error) {
    console.error('Error printing:', error);
    return false;
  }
}

async function processImageForPrinter(imageData: string): Promise<Uint8Array> {
  // Remove data URL prefix
  const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
  
  // Convert to binary
  const binaryData = atob(base64Data);
  
  // Create buffer
  const buffer = new Uint8Array(binaryData.length);
  for (let i = 0; i < binaryData.length; i++) {
    buffer[i] = binaryData.charCodeAt(i);
  }
  
  // Add printer commands (ESC/POS format)
  const commands = new Uint8Array([
    0x1B, 0x40,         // Initialize printer
    0x1B, 0x61, 0x01,   // Center alignment
    // Add more printer-specific commands as needed
  ]);
  
  // Combine commands and image data
  const finalData = new Uint8Array(commands.length + buffer.length);
  finalData.set(commands);
  finalData.set(buffer, commands.length);
  
  return finalData;
}