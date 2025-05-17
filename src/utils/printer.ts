import { PrinterDevice } from '../types';

export async function printImage(imageData: string, printer: PrinterDevice): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      // Convert base64 image data to blob
      const byteString = atob(imageData.split(',')[1]);
      const mimeString = imageData.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      
      const blob = new Blob([ab], { type: mimeString });
      
      // Create object URL for the blob
      const imageUrl = URL.createObjectURL(blob);
      
      // Create a hidden iframe for printing
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      iframe.onload = () => {
        try {
          // Get iframe's window object
          const win = iframe.contentWindow;
          if (!win) throw new Error('Could not access iframe window');
          
          // Create image element in iframe
          const img = win.document.createElement('img');
          img.style.width = '100%';
          img.style.height = 'auto';
          img.src = imageUrl;
          
          // Add image to iframe body
          win.document.body.appendChild(img);
          
          // Wait for image to load
          img.onload = () => {
            try {
              // Print the iframe
              win.print();
              
              // Cleanup
              URL.revokeObjectURL(imageUrl);
              setTimeout(() => {
                document.body.removeChild(iframe);
              }, 1000);
              
              console.log(`Print sent to ${printer.name}`);
              resolve(true);
            } catch (error) {
              console.error('Print error:', error);
              resolve(false);
            }
          };
          
          img.onerror = () => {
            console.error('Image load error');
            resolve(false);
          };
        } catch (error) {
          console.error('Iframe setup error:', error);
          resolve(false);
        }
      };
      
      iframe.onerror = () => {
        console.error('Iframe load error');
        resolve(false);
      };
    } catch (error) {
      console.error('Print preparation error:', error);
      resolve(false);
    }
  });
}