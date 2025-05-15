// src/components/ImagePreview.jsx
import { useState, useRef, useEffect } from 'react';

const ImagePreview = ({ image, onCrop }) => {
  const [crop, setCrop] = useState({ 
    startX: 0, 
    startY: 0, 
    endX: 0, 
    endY: 0,
    isSelecting: false
  });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  
  // Drawing functions
  const drawImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (imgRef.current && canvas) {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw image
      ctx.drawImage(imgRef.current, 0, 0, canvas.width, canvas.height);
      
      // Draw crop rectangle if selecting
      if (crop.isSelecting || (crop.endX - crop.startX > 0 && crop.endY - crop.startY > 0)) {
        ctx.strokeStyle = '#0ea5e9'; // Primary color
        ctx.lineWidth = 2;
        ctx.strokeRect(
          crop.startX, 
          crop.startY, 
          crop.endX - crop.startX, 
          crop.endY - crop.startY
        );
        
        // Semi-transparent overlay
        ctx.fillStyle = 'rgba(14, 165, 233, 0.2)'; // Primary color with transparency
        ctx.fillRect(
          crop.startX, 
          crop.startY, 
          crop.endX - crop.startX, 
          crop.endY - crop.startY
        );
      }
    }
  };
  
  // Load image when the component mounts or image changes
  useEffect(() => {
    if (image && image.dataUrl) {
      const img = new Image();
      img.onload = () => {
        imgRef.current = img;
        setImageSize({
          width: img.width,
          height: img.height
        });
        
        // Set canvas size based on image and container
        const canvas = canvasRef.current;
        if (canvas) {
          const maxWidth = 800; // Max width of the container
          
          canvas.width = img.width > maxWidth ? maxWidth : img.width;
          canvas.height = img.height * (canvas.width / img.width);
          
          drawImage();
        }
      };
      img.src = image.dataUrl;
    }
  }, [image]);
  
  // Redraw when crop changes
  useEffect(() => {
    drawImage();
  }, [crop]);
  
  // Handle mouse events for cropping
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCrop({
      startX: x,
      startY: y,
      endX: x,
      endY: y,
      isSelecting: true
    });
  };
  
  const handleMouseMove = (e) => {
    if (!crop.isSelecting) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCrop({
      ...crop,
      endX: x,
      endY: y
    });
  };
  
  const handleMouseUp = () => {
    if (!crop.isSelecting) return;
    
    const newCrop = {
      ...crop,
      isSelecting: false
    };
    setCrop(newCrop);
    
    // Only send crop data if it's a valid selection
    if (Math.abs(newCrop.endX - newCrop.startX) > 10 && Math.abs(newCrop.endY - newCrop.startY) > 10) {
      const canvas = canvasRef.current;
      const scaleX = imageSize.width / canvas.width;
      const scaleY = imageSize.height / canvas.height;
      
      // Normalize selection (ensure start < end)
      const normalizedCrop = {
        startX: Math.min(newCrop.startX, newCrop.endX) * scaleX,
        startY: Math.min(newCrop.startY, newCrop.endY) * scaleY,
        endX: Math.max(newCrop.startX, newCrop.endX) * scaleX,
        endY: Math.max(newCrop.startY, newCrop.endY) * scaleY
      };
      
      if (onCrop) {
        // Create a cropped image by drawing to a temporary canvas
        const tempCanvas = document.createElement('canvas');
        const cropWidth = normalizedCrop.endX - normalizedCrop.startX;
        const cropHeight = normalizedCrop.endY - normalizedCrop.startY;
        
        tempCanvas.width = cropWidth;
        tempCanvas.height = cropHeight;
        
        const ctx = tempCanvas.getContext('2d');
        ctx.drawImage(
          imgRef.current,
          normalizedCrop.startX,
          normalizedCrop.startY,
          cropWidth,
          cropHeight,
          0,
          0,
          cropWidth,
          cropHeight
        );
        
        // Convert to data URL and call onCrop
        const croppedDataUrl = tempCanvas.toDataURL('image/jpeg');
        onCrop({
          ...image,
          dataUrl: croppedDataUrl,
          crop: normalizedCrop
        });
      }
    }
  };
  
  const resetCrop = () => {
    setCrop({ startX: 0, startY: 0, endX: 0, endY: 0, isSelecting: false });
    if (onCrop) {
      onCrop(image); // Reset to original image
    }
  };
  
  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="mb-4 text-center">
        <h3 className="text-lg font-medium text-gray-700">Preview &amp; Crop</h3>
        <p className="text-sm text-gray-500">Drag to select a region, or use the full image</p>
      </div>
      
      <div className="relative border rounded-lg shadow-sm bg-white p-2">
        <canvas
          ref={canvasRef}
          className="max-w-full mx-auto cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>
      
      <div className="flex justify-center space-x-4 mt-4">
        <button 
          type="button" 
          onClick={resetCrop}
          className="btn btn-secondary"
        >
          Reset Crop
        </button>
      </div>
    </div>
  );
};

export default ImagePreview;
