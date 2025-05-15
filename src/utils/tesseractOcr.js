// src/utils/tesseractOcr.js
import { createWorker } from 'tesseract.js';

/**
 * Performs OCR on an image using Tesseract.js
 * This is optimized for typed text documents
 * 
 * @param {Object} imageData - Object containing image data
 * @param {string} imageData.dataUrl - Base64 encoded image data URL
 * @param {Function} progressCallback - Optional callback for progress updates
 * @returns {Promise<string>} - The extracted text
 */
export const performTypedOcr = async (imageData, progressCallback = () => {}) => {
  try {
    // Initialize worker with English language
    const worker = await createWorker('eng');
    
    // Set up progress monitoring
    if (progressCallback) {
      worker.setProgressHandler((progress) => {
        progressCallback(progress);
      });
    }
    
    // Recognize text
    const result = await worker.recognize(imageData.dataUrl);
    
    // Terminate worker to free memory
    await worker.terminate();
    
    // Extract text from result
    return result.data.text;
  } catch (error) {
    console.error('Tesseract OCR error:', error);
    throw new Error('Failed to extract text from the image. Please try a clearer image.');
  }
};

/**
 * Preprocesses a base64 image for better OCR results
 * This is useful for improving OCR quality by enhancing contrast, etc.
 * 
 * @param {string} imageDataUrl - Base64 encoded image data URL
 * @returns {Promise<string>} - Enhanced base64 image
 */
export const preprocessImage = async (imageDataUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        // Create canvas for image processing
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions to match image
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the image
        ctx.drawImage(img, 0, 0);
        
        // Get image data for processing
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Simple contrast enhancement
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          
          // Apply threshold for better text contrast
          const val = avg > 120 ? 255 : 0;
          
          data[i] = val;     // Red
          data[i + 1] = val; // Green
          data[i + 2] = val; // Blue
        }
        
        // Put the modified data back on the canvas
        ctx.putImageData(imageData, 0, 0);
        
        // Convert canvas to data URL
        resolve(canvas.toDataURL('image/png'));
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = reject;
    img.src = imageDataUrl;
  });
};
