
// src/utils/aiSolver.js

/**
 * Sends the OCR text to an AI service (e.g., OpenAI) and gets a solution
 * 
 * @param {string} ocrText - The text extracted via OCR
 * @returns {Promise<string>} - The AI-generated solution in markdown format
 */
export const solveAssignment = async (ocrText) => {
  try {
    // Get API key from environment variables
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key is missing. Please set VITE_OPENAI_API_KEY in your environment.');
    }
    
    // Prepare request to OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4', // You can replace with a different model if needed
        messages: [
          {
            role: 'system',
            content: 'You are a helpful academic assistant that solves problems and assignments. ' +
                     'Provide detailed, step-by-step solutions with explanations. Format your response ' +
                     'using markdown, including math notation where appropriate.'
          },
          {
            role: 'user',
            content: `Correct the OCR text if needed and solve the assignment questions it contains. Return the solution with clear, step-by-step markdown formatting.\n\nOCR Text: ${ocrText}`
          }
        ],
        temperature: 0.5 // Lower temperature for more deterministic responses
      })
    });
    
    // Parse response
    const data = await response.json();
    
    // Check for errors
    if (data.error) {
      throw new Error(`OpenAI API error: ${data.error.message}`);
    }
    
    // Extract the solution text from the response
    return data.choices[0].message.content;
  } catch (error) {
    console.error('AI solver error:', error);
    throw new Error('Failed to generate a solution. Please check your API credentials or try again.');
  }
};

/**
 * Alternative implementation using a proxy server approach
 * This can be used to hide your API keys on a backend service
 * 
 * @param {string} ocrText - The text extracted via OCR
 * @returns {Promise<string>} - The AI-generated solution
 */
export const solveAssignmentViaProxy = async (ocrText) => {
  try {
    // Proxy server URL (either from env var or hardcoded backend endpoint)
    const proxyUrl = import.meta.env.VITE_AI_PROXY_URL || '/api/solve';
    
    // Make API request to your proxy server
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: ocrText })
    });
    
    // Parse response
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error generating solution');
    }
    
    return data.solution;
  } catch (error) {
    console.error('AI solver proxy error:', error);
    throw new Error('Failed to generate a solution. Please check your network connection or try again later.');
  }
};
