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
  const handleProcessImage = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // This will be implemented in the specific OCR utilities
      // For now, we're just setting up the state handling
      setOcrResult('Processing...');
      setAiSolution('');
      
      // We'll replace this with actual implementation later
      setTimeout(() => {
        setIsProcessing(false);
      }, 2000);
    } catch (err) {
      setError('Failed to process image. Please try again.');
      setIsProcessing(false);
      console.error(err);
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
