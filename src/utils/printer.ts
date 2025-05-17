import { PrinterDevice } from '../types';

export async function printImage(imageData: string, printer: PrinterDevice): Promise<boolean> {
  return new Promise(async (resolve) => {
    try {
      // Check if document exists and has a body
      if (typeof document === 'undefined' || !document.body) {
        console.error('Document or document.body not available');
        resolve(false);
        return;
      }

      // Create a hidden iframe for printing
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      // Wait for next tick to ensure iframe is attached
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Double check iframe attachment and document.body availability
      if (typeof document === 'undefined' || !document.body || !document.body.contains(iframe)) {
        console.error('Failed to attach iframe to document');
        resolve(false);
        return;
      }
      
      // Safe cleanup function to remove iframe
      const cleanupIframe = () => {
        try {
          if (typeof document !== 'undefined' && document.body && iframe && document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        } catch (error) {
          console.error('Cleanup error:', error);
        }
      };
      
      // Wait for iframe to be ready
      setTimeout(() => {
        try {
          const contentWindow = iframe.contentWindow;
          if (!contentWindow) {
            throw new Error('Could not access iframe window');
          }
          
          const doc = contentWindow.document;
          if (!doc) {
            throw new Error('Could not access iframe document');
          }
          
          // Add print-specific styles
          doc.open();
          doc.write(`
            <style>
              @page {
                size: 4in 6in;
                margin: 0;
              }
              body {
                margin: 0;
                padding: 0;
              }
              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
            </style>
          `);
          
          // Add the image
          const img = doc.createElement('img');
          img.src = imageData;
          doc.body.appendChild(img);
          
          // Wait for image to load then print
          img.onload = () => {
            try {
              contentWindow.print();
              setTimeout(() => {
                cleanupIframe();
                resolve(true);
              }, 1000);
            } catch (error) {
              console.error('Print error:', error);
              cleanupIframe();
              resolve(false);
            }
          };
          
          img.onerror = () => {
            console.error('Image load error');
            cleanupIframe();
            resolve(false);
          };
          
          doc.close();
        } catch (error) {
          console.error('Print preparation error:', error);
          cleanupIframe();
          resolve(false);
        }
      }, 100);
      
    } catch (error) {
      console.error('Print preparation error:', error);
      resolve(false);
    }
  });
}