// src/utils/googleVisionOcr.js

/**
 * Performs OCR on handwritten text using Google Cloud Vision API
 * 
 * @param {Object} imageData - Object containing image data
 * @param {string} imageData.dataUrl - Base64 encoded image data URL
 * @returns {Promise<string>} - The extracted text
 */
export const performHandwrittenOcr = async (imageData) => {
  try {
    // Extract base64 data from data URL by removing the prefix
    const base64EncodedImage = imageData.dataUrl.split(',')[1];
    
    // Prepare request to Google Cloud Vision API
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error('Google Cloud Vision API key is missing. Please set VITE_GOOGLE_API_KEY in your environment.');
    }
    
    const apiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
    
    const requestBody = {
      requests: [
        {
          image: {
            content: base64EncodedImage
          },
          features: [
            {
              type: 'DOCUMENT_TEXT_DETECTION', // This is optimized for dense text like documents
              maxResults: 1
            }
          ],
          imageContext: {
            languageHints: ['en'] // Use English language hint
          }
        }
      ]
    };
    
    // Make API request
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    // Parse response
    const data = await response.json();
    
    // Check for errors in the response
    if (data.error) {
      throw new Error(`Google Vision API error: ${data.error.message}`);
    }
    
    // Extract full text from response
    const textAnnotation = data.responses[0].fullTextAnnotation;
    if (!textAnnotation) {
      return ''; // No text was found in the image
    }
    
    return textAnnotation.text;
  } catch (error) {
    console.error('Google Vision OCR error:', error);
    throw new Error('Failed to extract handwritten text. Please try a clearer image or check API credentials.');
  }
};

/**
 * Alternative approach using Google Cloud Vision API via a proxy server
 * This can be used if you want to avoid exposing your API key in frontend code
 * 
 * @param {Object} imageData - Object containing image data
 * @param {string} imageData.dataUrl - Base64 encoded image data URL
 * @returns {Promise<string>} - The extracted text
 */
export const performHandwrittenOcrViaProxy = async (imageData) => {
  try {
    // Extract base64 data from data URL
    const base64EncodedImage = imageData.dataUrl.split(',')[1];
    
    // If you have a backend proxy endpoint, use it here
    const proxyUrl = import.meta.env.VITE_OCR_PROXY_URL || '/api/ocr/handwritten';
    
    // Make API request to your proxy server
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ image: base64EncodedImage })
    });
    
    // Parse response
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error processing handwritten text');
    }
    
    return data.text;
  } catch (error) {
    console.error('Handwritten OCR proxy error:', error);
    throw new Error('Failed to extract handwritten text. Please check your network connection or try again later.');
  }
};
