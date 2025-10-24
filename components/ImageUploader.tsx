import React, { useCallback, useRef } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
        onImageUpload(file);
    }
  }, [onImageUpload]);

  const onAreaClick = () => {
    inputRef.current?.click();
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      inputRef.current?.click();
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div 
        onClick={onAreaClick}
        onKeyPress={handleKeyPress}
        onDragOver={onDragOver}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        aria-label="Zone pour téléverser une image"
        className="mt-8 p-10 md:p-16 bg-white/5 border-2 border-dashed border-white/20 rounded-2xl cursor-pointer hover:border-purple-400 hover:bg-white/10 transition-all duration-300 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <div className="flex flex-col items-center justify-center space-y-4 text-gray-400 pointer-events-none">
          <UploadIcon className="w-16 h-16 text-purple-400" />
          <h2 className="text-2xl font-semibold text-white">Glissez et déposez une image ici</h2>
          <p>ou</p>
          <button
            type="button"
            className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors pointer-events-auto"
            onClick={(e) => e.stopPropagation()} // Prevent parent click
          >
            Parcourir les fichiers
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
           <p className="text-xs pt-4">Supporte JPEG, PNG, WEBP, etc.</p>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;