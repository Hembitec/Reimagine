
import React, { useState, useEffect } from 'react';
import { Sliders, MessageSquare, Sparkles, Loader2, Info, LayoutTemplate } from 'lucide-react';
import { SuggestedStyle, GeneratedImage, AppMode } from '../../types';
import ChatInterface from '../ChatInterface';
import { analyzeImageAndSuggestStyles } from '../../services/gemini';

interface InspectorPanelProps {
    mode: AppMode;
    originalImage: string;
    generatedImages: GeneratedImage[];
    selectedImageIndex: number;
    onSelectImage: (index: number) => void;
    onGenerate: (prompt: string, label: string, count: number, aspectRatio: string) => void;
    isGenerating: boolean;
    initialPrompt?: string;
    chatProps: any;
}

const InspectorPanel: React.FC<InspectorPanelProps> = ({
    mode,
    originalImage,
    generatedImages,
    selectedImageIndex,
    onSelectImage,
    onGenerate,
    isGenerating,
    initialPrompt,
    chatProps
}) => {
    const [activeTab, setActiveTab] = useState<'design' | 'chat'>('design');
    const [suggestions, setSuggestions] = useState<SuggestedStyle[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [customPrompt, setCustomPrompt] = useState(initialPrompt || "");
    const [imageCount, setImageCount] = useState(1);
    const [aspectRatio, setAspectRatio] = useState("1:1");
    const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);

    // Auto-analyze on mount
    useEffect(() => {
        if (originalImage && suggestions.length === 0) {
            setIsAnalyzing(true);
            analyzeImageAndSuggestStyles(originalImage, mode)
                .then(setSuggestions)
                .finally(() => setIsAnalyzing(false));
        }
    }, [originalImage, mode]);

    const handleStyleSelect = (style: SuggestedStyle) => {
        setSelectedStyleId(style.id);
        // Sync the prompt to the text area
        setCustomPrompt(style.prompt);
    };

    const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCustomPrompt(e.target.value);
        // If user edits, deselect the style so it becomes "Custom"
        if (selectedStyleId) {
            setSelectedStyleId(null);
        }
    };

    const handleGenerateClick = () => {
        if (customPrompt) {
            // If a style is selected, use its label, otherwise "Custom"
            const activeStyle = suggestions.find(s => s.id === selectedStyleId);
            const label = activeStyle ? activeStyle.label : "Custom Design";
            onGenerate(customPrompt, label, imageCount, aspectRatio);
        }
    };

    const ratioOptions = [
        { label: 'Square', value: '1:1', width: 'w-6', height: 'h-6' },
        { label: 'Portrait', value: '9:16', width: 'w-4', height: 'h-6' },
        { label: 'Landscape', value: '16:9', width: 'w-8', height: 'h-5' }
    ];

    return (
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-full shadow-xl z-30">
            {/* Tabs */}
            <div className="flex border-b border-gray-100 flex-shrink-0">
                <button
                    onClick={() => setActiveTab('design')}
                    className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'design' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                    <Sliders size={16} /> Controls
                </button>
                <button
                    onClick={() => setActiveTab('chat')}
                    className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'chat' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                    <MessageSquare size={16} /> Assistant
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-gray-50/50">
                {activeTab === 'chat' ? (
                    <ChatInterface {...chatProps} />
                ) : (
                    <div className="p-6 space-y-8">
                        
                        {/* 1. Configuration (Moved up for better workflow) */}
                        <div>
                             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Vision</h3>
                             <div className="relative">
                                 <textarea 
                                    value={customPrompt}
                                    onChange={handlePromptChange}
                                    className="w-full h-32 p-3 text-sm border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none shadow-sm transition-all"
                                    placeholder={mode === 'interior' ? "Describe the style (e.g., 'Modern minimalist living room with beige sofa')..." : "Describe the scene..."}
                                 />
                                 {selectedStyleId === null && customPrompt.length > 0 && (
                                     <div className="absolute bottom-2 right-2 text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-500">
                                         Custom Mode
                                     </div>
                                 )}
                             </div>
                        </div>

                        {/* 2. AI Suggestions (Style Presets) */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">AI Suggestions</h3>
                                {isAnalyzing && <Loader2 size={12} className="animate-spin text-blue-500" />}
                            </div>
                            
                            {suggestions.length === 0 && !isAnalyzing ? (
                                <div className="text-center p-4 bg-gray-100 rounded-xl border border-dashed border-gray-300">
                                    <p className="text-xs text-gray-500">Analysis failed. Try manual prompt.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    {suggestions.map(style => (
                                        <button
                                            key={style.id}
                                            onClick={() => handleStyleSelect(style)}
                                            className={`relative group overflow-hidden rounded-xl border-2 transition-all duration-200 text-left h-24 ${
                                                selectedStyleId === style.id 
                                                ? 'border-gray-900 shadow-lg scale-[1.02]' 
                                                : 'border-transparent hover:border-gray-300 shadow-sm hover:shadow-md'
                                            }`}
                                        >
                                            {/* Preview Gradient Background */}
                                            <div className={`absolute inset-0 bg-gradient-to-br ${style.color} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                                            
                                            <div className="relative p-3 h-full flex flex-col justify-end">
                                                <div className="font-bold text-sm text-gray-900 leading-tight mb-1">{style.label}</div>
                                                <div className="text-[10px] text-gray-600 leading-tight line-clamp-2">{style.description}</div>
                                            </div>
                                            
                                            {/* Active Indicator */}
                                            {selectedStyleId === style.id && (
                                                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500"></div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 3. Settings */}
                        <div>
                             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Settings</h3>
                             <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-4">
                                
                                {/* Image Count */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm font-semibold text-gray-700">Variations</label>
                                        <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded">{imageCount}</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="1" 
                                        max="4" 
                                        value={imageCount}
                                        onChange={(e) => setImageCount(parseInt(e.target.value))}
                                        className="w-full accent-gray-900 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                                        <span>1 (Fast)</span><span>4 (Max)</span>
                                    </div>
                                </div>
                                
                                <div className="h-px bg-gray-100"></div>

                                {/* Aspect Ratio */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <LayoutTemplate size={14} className="text-gray-500"/>
                                        <label className="text-sm font-semibold text-gray-700">Output Size</label>
                                    </div>
                                    <div className="flex gap-2">
                                        {ratioOptions.map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() => setAspectRatio(opt.value)}
                                                className={`flex-1 flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                                                    aspectRatio === opt.value 
                                                    ? 'bg-gray-50 border-gray-900 text-gray-900' 
                                                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                                                }`}
                                            >
                                                <div className={`border-2 rounded-sm mb-1 ${aspectRatio === opt.value ? 'border-gray-900 bg-gray-900' : 'border-gray-300'} ${opt.width} ${opt.height}`}></div>
                                                <span className="text-[10px] font-medium">{opt.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                             </div>
                        </div>

                        {/* 4. History */}
                        {generatedImages.length > 0 && (
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Session History</h3>
                                <div className="grid grid-cols-4 gap-2">
                                    <button 
                                        onClick={() => onSelectImage(-1)}
                                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === -1 ? 'border-gray-900 ring-2 ring-gray-200' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                        title="Original"
                                    >
                                        <img src={originalImage} className="w-full h-full object-cover" />
                                    </button>
                                    {generatedImages.map((img, idx) => (
                                        <button
                                            key={img.id}
                                            onClick={() => onSelectImage(idx)}
                                            className={`aspect-square rounded-lg overflow-hidden border-2 relative transition-all ${selectedImageIndex === idx ? 'border-gray-900 ring-2 ring-gray-200' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                            title={img.styleName}
                                        >
                                            <img src={img.url} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            {/* Generate Button Footer */}
            {activeTab === 'design' && (
                <div className="p-4 border-t border-gray-200 bg-white z-20">
                    <button
                        onClick={handleGenerateClick}
                        disabled={isGenerating || (!customPrompt && !selectedStyleId)}
                        className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.98]"
                    >
                        {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                        {isGenerating ? "Rendering..." : "Generate Design"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default InspectorPanel;
