// src/pages/Home.jsx
import React from 'react';

const Home = ({ onSelectDocumentType }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-12">
      <div className="max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Turn Your Assignments into Solutions
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Upload an image of your assignment, and we'll process it with OCR technology 
          and solve it using AI. Works with both typed and handwritten documents.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <div 
          onClick={() => onSelectDocumentType('typed')}
          className="card cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary-300 flex flex-col items-center p-8"
        >
          <div className="bg-primary-100 rounded-full p-4 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Typed Document</h3>
          <p className="text-gray-600 text-center">
            For printed text, textbook problems, typed assignments
          </p>
        </div>

        <div 
          onClick={() => onSelectDocumentType('handwritten')}
          className="card cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary-300 flex flex-col items-center p-8"
        >
          <div className="bg-primary-100 rounded-full p-4 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Handwritten Document</h3>
          <p className="text-gray-600 text-center">
            For handwritten notes, homework problems, equations
          </p>
        </div>
      </div>

      <div className="mt-8 text-gray-500 max-w-lg text-center">
        <p>
          <strong>How it works:</strong> We use OCR (Optical Character Recognition) 
          to extract text from your document, then leverage AI to solve the 
          problem and provide a detailed explanation.
        </p>
      </div>
    </div>
  );
};

export default Home;
