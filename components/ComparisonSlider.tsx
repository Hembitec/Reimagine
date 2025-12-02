import React, { useState, useRef, useEffect } from 'react';
import { MoveHorizontal } from 'lucide-react';

interface ComparisonSliderProps {
  originalImage: string;
  generatedImage: string;
  originalLabel?: string;
  generatedLabel?: string;
}

const ComparisonSlider: React.FC<ComparisonSliderProps> = ({ 
  originalImage, 
  generatedImage,
  originalLabel = "Original",
  generatedLabel = "Reimagined"
}) => {
  const [sliderPosition, setSliderPosition] = useState(50); // Percentage
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPosition(percentage);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleTouchStart = () => setIsDragging(true);

  const handleMouseUp = () => setIsDragging(false);
  const handleTouchEnd = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchend', handleTouchEnd);
    }
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full select-none cursor-col-resize group bg-gray-100 rounded-xl overflow-hidden"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* After Image (Base Layer) */}
      <div className="absolute inset-0 w-full h-full">
        <img 
            src={generatedImage} 
            alt="After" 
            className="w-full h-full object-contain"
            draggable={false}
        />
      </div>
      
      {/* Label After */}
      <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md pointer-events-none z-10">
        {generatedLabel}
      </div>

      {/* Before Image (Overlay Layer with Clip Path) */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none bg-gray-100"
        style={{ 
            clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`
        }}
      >
         <img 
            src={originalImage} 
            alt="Before" 
            className="w-full h-full object-contain"
            draggable={false}
        />
        {/* Label Before */}
        <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md">
            {originalLabel}
        </div>
      </div>

      {/* Slider Handle Line */}
      <div 
        className="absolute top-0 bottom-0 w-0.5 bg-white cursor-col-resize z-30 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
        style={{ left: `${sliderPosition}%` }}
      >
          {/* Handle Button */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:scale-110 transition-transform active:scale-95"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <MoveHorizontal size={18} />
          </div>
      </div>
    </div>
  );
};

export default ComparisonSlider;
