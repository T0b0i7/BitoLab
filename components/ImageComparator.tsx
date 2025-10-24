import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ImageComparatorProps {
  original: string;
  edited: string | null;
}

const ImageComparator: React.FC<ImageComparatorProps> = ({ original, edited }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(parseFloat(e.target.value));
  };
  
  const handleMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleDrag = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const onMouseMove = (moveEvent: MouseEvent | TouchEvent) => handleMove(moveEvent as any);
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchmove', onMouseMove);
      document.removeEventListener('touchend', onMouseUp);
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchmove', onMouseMove);
    document.addEventListener('touchend', onMouseUp);
  };
  
  // Reset slider when image changes
  useEffect(() => {
    if(edited) {
        setSliderPosition(50);
    }
  }, [edited]);

  return (
    <div ref={containerRef} className="relative w-full aspect-video rounded-xl overflow-hidden select-none bg-black/30 border border-white/10 cursor-ew-resize" onMouseMove={handleMove} onTouchMove={handleMove}>
      <img src={original} alt="Originale" className="absolute top-0 left-0 w-full h-full object-contain" />
      
      {edited && (
        <>
          <motion.div
            className="absolute top-0 left-0 w-full h-full overflow-hidden"
            initial={{ clipPath: `inset(0 100% 0 0)` }}
            animate={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            transition={{ duration: 0.1, ease: "linear" }}
          >
            <img src={edited} alt="Éditée" className="absolute top-0 left-0 w-full h-full object-contain" />
          </motion.div>
          <motion.div
            className="absolute top-0 h-full w-1.5 bg-white/80"
            style={{ left: `${sliderPosition}%` }}
            onPan={(event, info) => {
              if (containerRef.current) {
                const newPos = (info.point.x / containerRef.current.clientWidth) * 100;
                setSliderPosition(Math.max(0, Math.min(100, newPos)));
              }
            }}
            onMouseDown={handleDrag}
            onTouchStart={handleDrag}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border-2 border-white flex items-center justify-center shadow-2xl">
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </div>
          </motion.div>
        </>
      )}

      <div className="absolute top-2 left-2 px-3 py-1 bg-black/50 rounded-full text-sm font-semibold pointer-events-none">
        Avant
      </div>
      {edited && (
        <div className="absolute top-2 right-2 px-3 py-1 bg-black/50 rounded-full text-sm font-semibold pointer-events-none">
          Après
        </div>
      )}
    </div>
  );
};

export default ImageComparator;