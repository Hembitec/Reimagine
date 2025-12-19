
import React from 'react';
import { Layout, Package, PenTool, ArrowRight, Sparkles } from 'lucide-react';
import { AppMode } from '../types';

interface StartScreenProps {
    onSelectMode: (mode: AppMode) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onSelectMode }) => {
    return (
        <div className="flex-1 h-full overflow-y-auto bg-gray-50 flex flex-col items-center justify-start py-12 md:py-20 px-6">
            <div className="max-w-5xl w-full">
                <div className="text-center mb-12 md:mb-16">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight leading-none">
                        What are you creating today?
                    </h1>
                    <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium">
                        Select a specialized studio to begin your AI-powered design workflow.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                    {/* Interior Mode */}
                    <button 
                        onClick={() => onSelectMode('interior')}
                        className="group relative bg-white rounded-3xl p-8 text-left border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-32 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-100 transition-colors"></div>
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-sm group-hover:bg-white">
                                <Layout size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Interior Design</h3>
                            <p className="text-gray-500 mb-8 leading-relaxed font-medium">
                                Redesign rooms, visualize furniture styles, and preserve architectural details.
                            </p>
                            <div className="mt-auto">
                                <span className="inline-flex items-center gap-2 text-indigo-600 font-bold group-hover:gap-4 transition-all">
                                    Enter Studio <ArrowRight size={18} />
                                </span>
                            </div>
                        </div>
                    </button>

                    {/* Product Mode */}
                    <button 
                        onClick={() => onSelectMode('product')}
                        className="group relative bg-white rounded-3xl p-8 text-left border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-32 bg-pink-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-pink-100 transition-colors"></div>
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-16 h-16 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-sm group-hover:bg-white">
                                <Package size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Product Studio</h3>
                            <p className="text-gray-500 mb-8 leading-relaxed font-medium">
                                Generate professional backgrounds and lifestyle scenes for your products.
                            </p>
                            <div className="mt-auto">
                                <span className="inline-flex items-center gap-2 text-pink-600 font-bold group-hover:gap-4 transition-all">
                                    Enter Studio <ArrowRight size={18} />
                                </span>
                            </div>
                        </div>
                    </button>

                    {/* Asset Mode */}
                    <button 
                        onClick={() => onSelectMode('asset')}
                        className="group relative bg-white rounded-3xl p-8 text-left border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-32 bg-purple-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-100 transition-colors"></div>
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-sm group-hover:bg-white">
                                <PenTool size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Brand Studio</h3>
                            <p className="text-gray-500 mb-8 leading-relaxed font-medium">
                                Place logos on merch, create billboards, and generate marketing assets.
                            </p>
                            <div className="mt-auto">
                                <span className="inline-flex items-center gap-2 text-purple-600 font-bold group-hover:gap-4 transition-all">
                                    Enter Studio <ArrowRight size={18} />
                                </span>
                            </div>
                        </div>
                    </button>
                </div>
                
                <div className="mt-16 md:mt-24 text-center pb-12">
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full border border-gray-200 shadow-sm text-sm text-gray-500 font-bold hover:border-gray-300 transition-colors">
                        <Sparkles size={16} className="text-blue-500" />
                        Next-Gen Gemini 2.5 Flash Rendering Engine
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StartScreen;
