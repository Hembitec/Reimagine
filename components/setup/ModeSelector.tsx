
import React from 'react';
import { AppMode } from '../../types';
import { Sparkles, Copy, Layout, PenTool, Package, Image as ImageIcon, ChevronLeft } from 'lucide-react';

interface ModeSelectorProps {
    mode: AppMode;
    onSelectIntent: (intent: 'create' | 'copy') => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, onSelectIntent }) => {
    
    const getOptions = () => {
        if (mode === 'product') {
            return [
                {
                    id: 'create',
                    icon: <Sparkles size={32} className="text-pink-500" />,
                    title: 'Scene Generation',
                    desc: 'Place your product in a new professional AI-generated background.',
                    color: 'hover:border-pink-500 hover:bg-pink-50'
                },
                {
                    id: 'copy',
                    icon: <Copy size={32} className="text-purple-500" />,
                    title: 'Style Transfer',
                    desc: 'Upload a reference image (e.g. a competitor ad) and match its style exactly.',
                    color: 'hover:border-purple-500 hover:bg-purple-50'
                }
            ];
        } else if (mode === 'asset') {
            return [
                {
                    id: 'create',
                    icon: <PenTool size={32} className="text-indigo-500" />,
                    title: 'Brand Mockups',
                    desc: 'Place your logo or artwork onto realistic surfaces (merch, signs, walls).',
                    color: 'hover:border-indigo-500 hover:bg-indigo-50'
                },
                {
                    id: 'copy',
                    icon: <ImageIcon size={32} className="text-blue-500" />,
                    title: 'Lifestyle Ads',
                    desc: 'Generate marketing assets by matching lifestyle aesthetics.',
                    color: 'hover:border-blue-500 hover:bg-blue-50'
                }
            ];
        } else {
            return [
                {
                    id: 'create',
                    icon: <Layout size={32} className="text-teal-500" />,
                    title: 'Room Redesign',
                    desc: 'Visualize new interior design styles while keeping structural elements.',
                    color: 'hover:border-teal-500 hover:bg-teal-50'
                },
                {
                    id: 'copy',
                    icon: <Copy size={32} className="text-indigo-500" />,
                    title: 'Aesthetic Copy',
                    desc: 'Upload a style photo you love and apply it directly to your room.',
                    color: 'hover:border-indigo-500 hover:bg-indigo-50'
                }
            ];
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-start py-20 px-8 bg-gray-50/30 min-h-full overflow-y-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Choose your workflow</h2>
                <p className="text-gray-500 font-medium">How would you like to build your project?</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl w-full">
                {getOptions().map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => onSelectIntent(opt.id as any)}
                        className={`bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-sm transition-all duration-300 transform hover:-translate-y-1 text-left group ${opt.color}`}
                    >
                        <div className="mb-6 p-4 bg-gray-50 rounded-2xl w-fit group-hover:scale-110 group-hover:bg-white transition-all shadow-sm">
                            {opt.icon}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{opt.title}</h3>
                        <p className="text-gray-500 leading-relaxed font-medium">{opt.desc}</p>
                    </button>
                ))}
            </div>

            <div className="mt-12 pb-12">
                 <button className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors">
                    <ChevronLeft size={16} /> Back to Studios
                 </button>
            </div>
        </div>
    );
};

export default ModeSelector;
