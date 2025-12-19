
import React, { useState } from 'react';
import { Upload, ArrowRight, X, AlignLeft, Info } from 'lucide-react';

interface UploadZoneProps {
    intent: 'create' | 'copy';
    modeLabel: string;
    onUploadComplete: (original: string, reference?: string, prompt?: string) => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({ intent, modeLabel, onUploadComplete }) => {
    const [original, setOriginal] = useState<string | null>(null);
    const [reference, setReference] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');

    const handleFile = (file: File, type: 'original' | 'reference') => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (type === 'original') setOriginal(e.target?.result as string);
            else setReference(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleStart = () => {
        if (original) {
            onUploadComplete(original, reference || undefined, prompt);
        }
    };

    const renderDropzone = (type: 'original' | 'reference', label: string) => {
        const hasImage = type === 'original' ? original : reference;
        
        return (
            <div className="relative group w-full">
                {hasImage ? (
                    <div className="relative w-full aspect-square rounded-3xl overflow-hidden border-2 border-gray-100 shadow-xl bg-white group-hover:border-blue-400 transition-all duration-300">
                        <img src={hasImage} className="w-full h-full object-contain p-4" alt={label} />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                        <button 
                            onClick={() => type === 'original' ? setOriginal(null) : setReference(null)}
                            className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur text-gray-900 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-all z-10"
                        >
                            <X size={18} />
                        </button>
                    </div>
                ) : (
                    <label className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-gray-200 rounded-3xl hover:bg-blue-50/50 hover:border-blue-300 transition-all cursor-pointer bg-white shadow-sm group">
                        <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-blue-500 group-hover:shadow-md transition-all">
                            <Upload size={28} strokeWidth={1.5} />
                        </div>
                        <span className="font-bold text-gray-900 text-lg">{label}</span>
                        <span className="text-sm text-gray-400 mt-2 font-medium">Click or Drag & Drop</span>
                        <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0], type)} 
                        />
                    </label>
                )}
            </div>
        );
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-start py-12 px-6 animate-fade-in bg-white min-h-full">
            <div className="max-w-4xl w-full flex flex-col">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                        {intent === 'copy' ? "Upload Subject & Reference Style" : `Upload your ${modeLabel}`}
                    </h2>
                    <p className="text-gray-500 mt-2 font-medium">Add your source image to begin the transformation.</p>
                </div>

                <div className={`grid gap-6 ${intent === 'copy' ? 'md:grid-cols-2' : 'max-w-md mx-auto'}`}>
                    {renderDropzone('original', `Your ${modeLabel}`)}
                    {intent === 'copy' && renderDropzone('reference', 'Style Reference Image')}
                </div>

                <div className="mt-10 max-w-2xl mx-auto w-full">
                    <div className="flex items-center justify-between mb-3 px-1">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-900">
                            <AlignLeft size={16} className="text-blue-600" />
                            Describe your vision
                        </label>
                        <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">Optional</span>
                    </div>
                    <textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="w-full h-24 p-4 border border-gray-200 rounded-2xl bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none resize-none transition-all shadow-sm text-sm font-medium"
                        placeholder={
                            intent === 'copy' 
                            ? "Any specific instructions? (e.g. 'Keep it bright', 'Focus on the textures')" 
                            : `Describe the ${modeLabel.toLowerCase()} style you want...`
                        }
                    />
                    
                    {intent === 'copy' && (
                        <div className="mt-4 flex items-start gap-3 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                            <Info size={16} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-indigo-700 leading-relaxed font-medium">
                                ReImagine will automatically analyze the reference style and apply its lighting, mood, and palette to your asset.
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex justify-center mt-12 pb-12">
                    <button
                        onClick={handleStart}
                        disabled={!original || (intent === 'copy' && !reference)}
                        className="bg-gray-900 text-white px-12 py-5 rounded-full font-bold text-lg hover:bg-blue-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-2xl flex items-center gap-3 hover:scale-105 active:scale-95 group"
                    >
                        {intent === 'copy' ? 'Transfer Style' : 'Enter Studio'} 
                        <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadZone;
