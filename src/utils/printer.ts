export async function printImage(imageData: string, printer: any): Promise<boolean> {
  try {
    // Get the stored printer device
    const printerDevice = (window as any).printerDevice;
    if (!printerDevice) {
      console.error('No printer device found');
      return false;
    }

    // Convert base64 image to binary data
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    const binaryData = atob(base64Data);
    
    // Create buffer with printer commands
    const buffer = new Uint8Array(binaryData.length + 12);
    
    // ESC/POS commands
    buffer[0] = 0x1B; // ESC
    buffer[1] = 0x40; // Initialize printer
    buffer[2] = 0x1B;
    buffer[3] = 0x61;
    buffer[4] = 0x01; // Center alignment
    
    // Set print quality to high
    buffer[5] = 0x1B;
    buffer[6] = 0x4B;
    buffer[7] = 0x02; // High quality
    
    // Add image data
    for (let i = 0; i < binaryData.length; i++) {
      buffer[i + 8] = binaryData.charCodeAt(i);
    }
    
    // Add feed and cut commands
    buffer[buffer.length - 4] = 0x1B;
    buffer[buffer.length - 3] = 0x64;
    buffer[buffer.length - 2] = 0x03; // Feed 3 lines
    buffer[buffer.length - 1] = 0x1D; // Cut paper
    
    // Send to printer in chunks with proper error handling
    const CHUNK_SIZE = 64;
    for (let i = 0; i < buffer.length; i += CHUNK_SIZE) {
      const chunk = buffer.slice(i, Math.min(i + CHUNK_SIZE, buffer.length));
      try {
        await printerDevice.transferOut(1, chunk);
        // Small delay between chunks to prevent buffer overflow
        await new Promise(resolve => setTimeout(resolve, 20));
      } catch (error) {
        console.error('Error sending chunk to printer:', error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Printing error:', error);
    return false;
  }
}