// src/components/UploadForm.jsx
import { useState, useRef } from 'react';

const UploadForm = ({ onImageUpload, documentType }) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const file = files[0];
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/heic', 'image/heif'];
    
    if (validTypes.includes(file.type)) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageUpload({
          file: file,
          dataUrl: event.target.result
        });
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid image file (JPEG, PNG)');
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div 
        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg transition-all duration-300 ${
        dragActive 
          ? 'border-purple-500 bg-purple-50 shadow-lg transform scale-105' 
          : 'border-gray-300 bg-gradient-to-br from-blue-50 to-purple-50'
      } hover:bg-gradient-to-br hover:from-blue-100 hover:to-purple-100 cursor-pointer`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="mb-2 text-sm text-gray-500">
          <span className="font-semibold">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-500">
          {documentType === 'typed' 
            ? 'Upload an image of your typed assignment' 
            : 'Upload an image of your handwritten assignment'}
        </p>
      </div>
      <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
          // Remove this line: capture="environment"
        />

      <div className="flex justify-center mt-4">
        <button
          onClick={onButtonClick}
          type="button"
          className="btn btn-primary"
        >
          {documentType === 'typed' 
            ? 'Upload Typed Document' 
            : 'Upload Handwritten Document'}
        </button>
      </div>
    </div>
  );
};

export default UploadForm;
