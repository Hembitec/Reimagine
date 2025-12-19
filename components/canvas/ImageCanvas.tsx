
import React, { useState } from 'react';
import { Maximize2, ZoomIn, ZoomOut, Layers, Eye, X, Download } from 'lucide-react';
import ComparisonSlider from '../ComparisonSlider';

interface ImageCanvasProps {
    originalImage: string;
    generatedImage?: string;
    generatedLabel?: string;
}

const ImageCanvas: React.FC<ImageCanvasProps> = ({ originalImage, generatedImage, generatedLabel }) => {
    const [viewMode, setViewMode] = useState<'single' | 'compare'>('single');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [zoom, setZoom] = useState(1);

    // If no generated image, force single view
    const activeViewMode = generatedImage ? viewMode : 'single';
    const activeImage = generatedImage || originalImage;

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
        setZoom(1);
    };

    const handleDownload = () => {
        if (!generatedImage) return;
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = `reimagine-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="relative flex-1 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-inner group">
            
            {/* Toolbar (Floating Top Right) */}
            {generatedImage && (
                <div className="absolute top-4 right-4 flex gap-2 z-20">
                    <div className="bg-white/90 backdrop-blur rounded-lg shadow-sm border border-gray-200 p-1 flex">
                        <button 
                            onClick={() => setViewMode('single')}
                            className={`p-2 rounded-md transition-colors ${activeViewMode === 'single' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
                            title="Single View"
                        >
                            <Eye size={16} />
                        </button>
                        <button 
                            onClick={() => setViewMode('compare')}
                            className={`p-2 rounded-md transition-colors ${activeViewMode === 'compare' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
                            title="Comparison Slider"
                        >
                            <Layers size={16} />
                        </button>
                        <div className="w-px bg-gray-200 mx-1"></div>
                        <button 
                            onClick={handleDownload}
                            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                            title="Download Image"
                        >
                            <Download size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Bottom Floating Bar */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-gray-200 flex items-center gap-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button onClick={toggleFullscreen} className="flex items-center gap-2 text-xs font-bold text-gray-700 hover:text-blue-600">
                    <Maximize2 size={14} /> Fullscreen
                </button>
                <div className="w-px h-4 bg-gray-300"></div>
                <span className="text-xs text-gray-400 font-mono">
                    {generatedImage ? "Result" : "Original"}
                </span>
            </div>

            {/* Content */}
            <div className="w-full h-full p-8 flex items-center justify-center">
                <div className="relative w-full h-full max-w-5xl max-h-full">
                    {activeViewMode === 'compare' && generatedImage ? (
                        <ComparisonSlider 
                            originalImage={originalImage} 
                            generatedImage={generatedImage} 
                            generatedLabel={generatedLabel}
                        />
                    ) : (
                        <img 
                            src={activeImage} 
                            className="w-full h-full object-contain drop-shadow-2xl" 
                            alt="Workspace Content"
                        />
                    )}
                </div>
            </div>

            {/* Fullscreen Modal */}
            {isFullscreen && (
                <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
                    <div className="h-16 flex items-center justify-between px-6 text-white">
                        <h3 className="font-bold">Image Inspector</h3>
                        <div className="flex items-center gap-4">
                            <button onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}><ZoomOut /></button>
                            <span className="text-xs font-mono w-12 text-center">{Math.round(zoom * 100)}%</span>
                            <button onClick={() => setZoom(Math.min(3, zoom + 0.25))}><ZoomIn /></button>
                            {generatedImage && (
                                <button onClick={handleDownload} className="bg-white/10 p-2 rounded-full hover:bg-white/20 ml-2" title="Download">
                                    <Download size={16} />
                                </button>
                            )}
                            <button onClick={toggleFullscreen} className="ml-4 bg-white/10 p-2 rounded-full hover:bg-red-500/80"><X /></button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto flex items-center justify-center p-8 cursor-move">
                         <img 
                            src={activeImage} 
                            className="transition-transform duration-200"
                            style={{ transform: `scale(${zoom})`, maxWidth: 'none', maxHeight: 'none' }} 
                         />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageCanvas;
