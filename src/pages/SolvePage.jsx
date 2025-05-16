// src/pages/SolvePage.jsx
import { useState } from 'react';
import UploadForm from '../components/UploadForm';
import ImagePreview from '../components/ImagePreview';
import ResultCard from '../components/ResultCard';

const SolvePage = ({
  documentType,
  selectedImage,
  ocrResult,
  aiSolution,
  isProcessing,
  error,
  onImageUpload,
  onProcessImage,
  onBack
}) => {
  const [processedImage, setProcessedImage] = useState(null);
  
  const handleCrop = (croppedImage) => {
    setProcessedImage(croppedImage);
  };
  
  const handleProcess = () => {
    // We'll use the cropped image if available, otherwise use the original image
    onProcessImage(processedImage || selectedImage);
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center">
        <button
          onClick={onBack}
          className="flex items-center text-primary-600 font-medium hover:text-primary-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h2 className="text-2xl font-bold text-gray-800 ml-4">
          {documentType === 'typed' ? 'Typed Document' : 'Handwritten Document'} Solver
        </h2>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      <div className="space-y-8">
          {!selectedImage ? (
          // Step 1: Upload Image
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Upload Your Assignment</h3>
            <UploadForm onImageUpload={onImageUpload} documentType={documentType} />
          </div>
        ) : (
          // Step 2: Preview & Process or Results
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Preview &amp; Adjust</h3>
              <ImagePreview image={selectedImage} onCrop={handleCrop} />
            </div>

            {/* Always show the Process button */}
            <div className="card">
              <div className="flex justify-center">
                <button
                  onClick={handleProcess}
                  disabled={isProcessing}
                  className={`btn btn-primary ${isProcessing ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isProcessing ? 'Processing...' : 'Process Image'}
                </button>
              </div>
            </div>

            {/* Show results only after processing */}
            {ocrResult && (
              <div className="card">
                <h3 className="text-xl font-semibold mb-4">Results</h3>
                <ResultCard ocrText={ocrResult} aiSolution={aiSolution} />
                <div className="mt-6 flex justify-center">
                  <button onClick={onBack} className="btn btn-primary">
                    Solve Another Assignment
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SolvePage;
