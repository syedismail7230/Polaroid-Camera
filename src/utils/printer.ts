import { PrinterDevice } from '../types';

export async function printImage(imageData: string, printer: PrinterDevice): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      // Create a hidden iframe for printing
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      // Ensure iframe is properly attached to DOM
      if (!document.body.contains(iframe)) {
        throw new Error('Failed to attach iframe to document');
      }
      
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
                document.body.removeChild(iframe);
                resolve(true);
              }, 1000);
            } catch (error) {
              console.error('Print error:', error);
              resolve(false);
            }
          };
          
          img.onerror = () => {
            console.error('Image load error');
            document.body.removeChild(iframe);
            resolve(false);
          };
          
          doc.close();
        } catch (error) {
          console.error('Print preparation error:', error);
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
          resolve(false);
        }
      }, 100); // Give iframe time to initialize
      
    } catch (error) {
      console.error('Print preparation error:', error);
      resolve(false);
    }
  });
}