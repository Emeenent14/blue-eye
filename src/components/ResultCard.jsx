// src/components/ResultCard.jsx
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const ResultCard = ({ ocrText, aiSolution }) => {
  const [activeTab, setActiveTab] = useState('solution');
  const [copiedText, setCopiedText] = useState(null);
  
  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(type);
      setTimeout(() => setCopiedText(null), 2000);
    });
  };
  
  const downloadAsText = (text, filename) => {
    const element = document.createElement('a');
    const file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  return (
    <div className="card bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-3 px-4 text-center focus:outline-none ${
            activeTab === 'solution' 
              ? 'bg-white text-primary-600 border-b-2 border-primary-500 font-medium' 
              : 'bg-gray-50 text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('solution')}
        >
          Solution
        </button>
        <button
          className={`flex-1 py-3 px-4 text-center focus:outline-none ${
            activeTab === 'ocr' 
              ? 'bg-white text-primary-600 border-b-2 border-primary-500 font-medium' 
              : 'bg-gray-50 text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('ocr')}
        >
          OCR Text
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'solution' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">AI Solution</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => copyToClipboard(aiSolution, 'solution')}
                  className="btn btn-secondary text-sm py-1 px-3 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  {copiedText === 'solution' ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={() => downloadAsText(aiSolution, 'assignment-solution.txt')}
                  className="btn btn-secondary text-sm py-1 px-3 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
              </div>
            </div>
            <div className="prose max-w-none">
              {aiSolution ? (
                <ReactMarkdown>{aiSolution}</ReactMarkdown>
              ) : (
                <p className="text-gray-500 italic">No solution available yet.</p>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'ocr' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Extracted Text</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => copyToClipboard(ocrText, 'ocr')}
                  className="btn btn-secondary text-sm py-1 px-3 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  {copiedText === 'ocr' ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={() => downloadAsText(ocrText, 'extracted-text.txt')}
                  className="btn btn-secondary text-sm py-1 px-3 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <pre className="whitespace-pre-wrap text-sm text-gray-800">
                {ocrText || 'No extracted text available yet.'}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultCard;
