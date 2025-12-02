
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Bot, ArrowRight, Image as ImageIcon, X } from 'lucide-react';
import { ChatMessage, AppMode, LoadingState } from '../types';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, mode: 'chat' | 'visualize') => void;
  isLoading: boolean;
  loadingState: LoadingState;
  mode: AppMode;
  currentImageThumbnail?: string | null;
  onClose?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
    messages, 
    onSendMessage, 
    isLoading, 
    loadingState, 
    mode,
    currentImageThumbnail,
    onClose
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendChat = (e?: React.FormEvent, textOverride?: string) => {
    e?.preventDefault();
    const textToSend = textOverride || input;
    if (!textToSend.trim() || isLoading) return;
    onSendMessage(textToSend, 'chat');
    if (!textOverride) setInput('');
  };

  const handleVisualize = (prompt: string) => {
    if (isLoading) return;
    onSendMessage(prompt, 'visualize');
  };

  // Helper to parse message content and render [VISUALIZE: ...] as buttons
  const renderMessageContent = (content: string) => {
    const parts = content.split(/(\[VISUALIZE:.*?\])/g);
    return parts.map((part, index) => {
        const match = part.match(/^\[VISUALIZE:(.*?)\]$/);
        if (match) {
            const style = match[1].trim();
            return (
                <button 
                    key={index}
                    onClick={() => handleVisualize(style)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 my-1 mx-1 rounded-full text-xs font-bold transition-all transform hover:scale-105 shadow-sm border ${
                        mode === 'interior'
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                        : 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100'
                    }`}
                    title={`Click to generate: ${style}`}
                >
                    <Sparkles size={12} />
                    {style}
                </button>
            );
        }
        return <span key={index}>{part}</span>;
    });
  };

  const STARTER_QUESTIONS = mode === 'interior' 
    ? ["Suggest a color palette", "Make the room brighter", "Analyze the furniture style", "Modernize this space"]
    : ["Suggest background ideas", "Analyze the lighting", "Create a dramatic mood", "Minimalist setting"];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${mode === 'interior' ? 'bg-indigo-50 text-indigo-600' : 'bg-pink-50 text-pink-600'}`}>
                <Bot size={20} />
            </div>
            <div>
                <h3 className="font-bold text-gray-900 text-sm leading-none">
                    AI Consultant
                </h3>
                <p className="text-[10px] text-gray-500 font-medium mt-1">
                    {mode === 'interior' ? 'Expert Interior Designer' : 'Product Photography Director'}
                </p>
            </div>
        </div>
        
        {/* Close Button (Mobile mainly) */}
        {onClose && (
            <button 
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
                title="Close Assistant"
            >
                <X size={18} />
            </button>
        )}
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide bg-gray-50">
        
        {messages.length <= 2 && (
             <div className="flex flex-col items-center justify-center mt-8 text-center opacity-60">
                <div className="p-3 bg-white rounded-full shadow-sm mb-3">
                     <Sparkles size={20} className="text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 font-medium mb-4">
                    Quick Actions
                </p>
                <div className="flex flex-wrap justify-center gap-2 px-4">
                    {STARTER_QUESTIONS.map((q, i) => (
                        <button 
                            key={i}
                            onClick={(e) => handleSendChat(e, q)}
                            className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-[10px] font-medium text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-all"
                        >
                            {q}
                        </button>
                    ))}
                </div>
             </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col w-full animate-fade-in-up ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div 
              className={`max-w-[90%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm border relative group ${
                msg.role === 'user' 
                  ? `text-white border-transparent rounded-br-sm ${mode === 'interior' ? 'bg-gray-900' : 'bg-gray-900'}`
                  : 'bg-white text-gray-800 border-gray-100 rounded-bl-sm'
              }`}
            >
              {msg.role === 'model' ? (
                  <div className="whitespace-pre-wrap">
                    {renderMessageContent(msg.content)}
                  </div>
              ) : (
                  msg.content
              )}
            </div>
            <span className="text-[10px] text-gray-400 mt-1 px-1 font-medium">
                {msg.role === 'user' ? 'You' : 'Assistant'}
            </span>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start w-full animate-pulse">
            <div className="bg-white border border-gray-100 text-gray-500 p-3 rounded-2xl rounded-bl-sm text-xs flex items-center gap-3 shadow-sm">
                {loadingState === 'generating_image' ? (
                    <>
                        <Sparkles size={14} className={`animate-spin ${mode === 'interior' ? 'text-indigo-500' : 'text-pink-500'}`} />
                        <span className="font-medium">Designing new look...</span>
                    </>
                ) : (
                    <div className="flex gap-1.5 py-1">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                )}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Context Indicator & Input Area */}
      <div className="border-t border-gray-200 bg-white p-3">
        
        {/* Image Context Pill */}
        {currentImageThumbnail && (
            <div className="flex items-center gap-2 mb-2 px-2 py-1.5 bg-gray-50 rounded-lg border border-gray-100 w-fit">
                <div className="w-6 h-6 rounded overflow-hidden border border-gray-200">
                    <img src={currentImageThumbnail} alt="Context" className="w-full h-full object-cover" />
                </div>
                <span className="text-[10px] font-medium text-gray-500 flex items-center gap-1">
                    <ImageIcon size={10} /> Analyzing this image
                </span>
            </div>
        )}

        <div className="relative flex items-end gap-2 bg-white rounded-2xl p-1.5 border border-gray-200 focus-within:ring-2 focus-within:ring-offset-1 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendChat();
                }
            }}
            placeholder={mode === 'interior' ? "e.g., What style is this? Make it brighter..." : "e.g., Suggest a better background..."}
            className="flex-1 bg-transparent text-gray-800 text-sm px-3 py-3 focus:outline-none resize-none max-h-32 min-h-[44px]"
            disabled={isLoading}
            rows={1}
          />
          <button 
            onClick={() => handleSendChat()}
            disabled={!input.trim() || isLoading}
            className={`p-2.5 rounded-xl text-white transition-all disabled:opacity-30 disabled:scale-100 hover:scale-105 active:scale-95 shadow-sm ${
                mode === 'interior' ? 'bg-gray-900 hover:bg-indigo-600' : 'bg-gray-900 hover:bg-pink-600'
            }`}
          >
             <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
