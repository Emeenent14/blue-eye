// src/App.jsx
import { useState } from 'react';
import Home from './pages/Home';
import SolvePage from './pages/SolvePage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [documentType, setDocumentType] = useState(null); // 'typed' or 'handwritten'
  const [selectedImage, setSelectedImage] = useState(null);
  const [ocrResult, setOcrResult] = useState('');
  const [aiSolution, setAiSolution] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Navigation handlers
  const navigateToHome = () => {
    setCurrentPage('home');
    setDocumentType(null);
    setSelectedImage(null);
    setOcrResult('');
    setAiSolution('');
    setError(null);
  };

  const navigateToSolvePage = (type) => {
    setCurrentPage('solve');
    setDocumentType(type);
  };

  // Image handling
  const handleImageUpload = (image) => {
    setSelectedImage(image);
    setError(null);
  };

  // OCR and AI processing
  const handleProcessImage = async (imageToProcess) => {
    if (!imageToProcess) {
      setError('No image selected. Please upload an image first.');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    setOcrResult('');
    setAiSolution('');
    
    try {
      let extractedText = '';
      
      // Use appropriate OCR method based on document type
      if (documentType === 'typed') {
        // Import and use the typed OCR function
        const { performTypedOcr, preprocessImage } = await import('./utils/tesseractOcr');
        
        // Preprocess image for better OCR results
        const enhancedImage = { ...imageToProcess, dataUrl: await preprocessImage(imageToProcess.dataUrl) };
        
        // Extract text using Tesseract
        extractedText = await performTypedOcr(enhancedImage, (progress) => {
          // Optional: Update progress status
          if (progress.status === 'recognizing text') {
            const percentage = Math.round(progress.progress * 100);
            console.log(`OCR Progress: ${percentage}%`);
          }
        });
      } else {
        // Import and use the handwritten OCR function
        const { performHandwrittenOcr } = await import('./utils/googleVisionOcr');
        
        // Extract text using Google Vision API
        extractedText = await performHandwrittenOcr(imageToProcess);
      }
      
      // Update state with OCR result
      setOcrResult(extractedText);
      
      if (extractedText.trim()) {
        // If we have text, send it to AI solver
        const { solveAssignment } = await import('./utils/aiSolver');
        const solution = await solveAssignment(extractedText);
        setAiSolution(solution);
      } else {
        throw new Error('No text was detected in the image. Please try a clearer image.');
      }
    } catch (err) {
      console.error('Processing error:', err);
      setError(err.message || 'Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary-600 text-white shadow-md">
        <div className="container mx-auto py-4 px-6">
          <h1 
            className="text-2xl font-bold cursor-pointer" 
            onClick={navigateToHome}
          >
            Assignment Solver
          </h1>
          <p className="text-primary-100">Upload, process, and solve your assignments</p>
        </div>
      </header>

      <main className="container mx-auto py-8 px-6">
        {currentPage === 'home' ? (
          <Home onSelectDocumentType={navigateToSolvePage} />
        ) : (
          <SolvePage
            documentType={documentType}
            selectedImage={selectedImage}
            ocrResult={ocrResult}
            aiSolution={aiSolution}
            isProcessing={isProcessing}
            error={error}
            onImageUpload={handleImageUpload}
            onProcessImage={handleProcessImage}
            onBack={navigateToHome}
          />
        )}
      </main>

      <footer className="bg-gray-100 py-4 border-t border-gray-200">
        <div className="container mx-auto px-6 text-center text-gray-600">
          <p>Assignment OCR Solver - Powered by React, Tesseract.js, and AI</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
