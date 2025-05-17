import { PrinterDevice } from '../types';

export async function printImage(imageData: string, printer: PrinterDevice): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      // Create a hidden iframe for printing
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      // Set up the iframe content
      const doc = iframe.contentWindow?.document;
      if (!doc) throw new Error('Could not access iframe document');
      
      // Add print-specific styles
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
          iframe.contentWindow?.print();
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
        resolve(false);
      };
      
      doc.close();
    } catch (error) {
      console.error('Print preparation error:', error);
      resolve(false);
    }
  });
}