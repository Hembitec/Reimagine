
import React, { useState, useEffect, useRef } from 'react';
import { Upload, Image as ImageIcon, Sparkles, Download, MessageSquare, X, Wand2, Info, Plus, Layout, Package, Check, Loader2 } from 'lucide-react';
import ComparisonSlider from './components/ComparisonSlider';
import ChatInterface from './components/ChatInterface';
import Sidebar from './components/Sidebar';
import Library from './components/Library';
import LandingPage from './components/LandingPage';
import AuthPage, { AuthMode } from './components/AuthPage';
import { chatWithExpert, generateDesign, analyzeProduct, analyzeRoom } from './services/gemini';
import { saveProject, getAllProjects, deleteProject } from './services/db';
import { onAuthStateChanged, auth, User } from './services/firebase';
import { ChatMessage, GeneratedImage, LoadingState, AppMode, SuggestedStyle, Project, AppView } from './types';

// Interior Design Styles
const INTERIOR_STYLES = [
  { id: 'modern', label: 'Modern', description: 'Clean & Minimal', color: 'from-blue-500 to-cyan-400', prompt: 'Modern interior design, clean lines, minimal furniture, neutral colors' },
  { id: 'scandi', label: 'Scandinavian', description: 'Warm & Cozy', color: 'from-teal-500 to-emerald-400', prompt: 'Scandinavian style, light wood, bright airy, cozy textiles' },
  { id: 'industrial', label: 'Industrial', description: 'Raw & Edgy', color: 'from-gray-600 to-gray-400', prompt: 'Industrial loft style, exposed brick, metal accents, concrete floors' },
  { id: 'boho', label: 'Bohemian', description: 'Eclectic & Green', color: 'from-orange-500 to-amber-400', prompt: 'Bohemian style, many plants, patterned rugs, rattan furniture, warm lighting' },
  { id: 'midcentury', label: 'Mid-Century', description: 'Retro Chic', color: 'from-yellow-500 to-orange-400', prompt: 'Mid-century modern style, teak furniture, organic curves, retro colors' },
  { id: 'japandi', label: 'Japandi', description: 'Zen Hybrid', color: 'from-stone-500 to-stone-400', prompt: 'Japandi style, blend of Japanese rustic minimalism and Scandinavian functionality, neutral tones, natural textures' },
  { id: 'coastal', label: 'Coastal', description: 'Breezy & Light', color: 'from-sky-400 to-blue-300', prompt: 'Coastal interior design, light and airy, white wood, linen textures, shades of blue and beige' },
  { id: 'farmhouse', label: 'Farmhouse', description: 'Rustic Charm', color: 'from-amber-700 to-orange-200', prompt: 'Modern farmhouse style, rustic wood beams, shiplap walls, comfortable furniture, neutral palette' },
  { id: 'artdeco', label: 'Art Deco', description: 'Glamour & Gold', color: 'from-yellow-600 to-yellow-400', prompt: 'Art Deco style, geometric patterns, gold accents, velvet textures, bold contrast' }
];

// Product Photography Styles
const PRODUCT_STYLES = [
  { id: 'studio_minimal', label: 'Studio Minimal', description: 'Clean, soft lighting', color: 'from-gray-200 to-gray-400', prompt: 'Professional studio photography, minimalist grey background, soft box lighting, high end commercial look' },
  { id: 'nature_stone', label: 'Nature Stone', description: 'Organic premium feel', color: 'from-stone-400 to-stone-600', prompt: 'Product placed on a natural stone podium, soft sunlight filtering through leaves, organic luxury feel, nature background' },
  { id: 'neon_cyber', label: 'Neon Cyber', description: 'High energy glow', color: 'from-pink-500 to-purple-600', prompt: 'Cyberpunk aesthetic, neon lighting, dark background, reflective surface, high contrast, futuristic' },
  { id: 'luxury_gold', label: 'Luxury Gold', description: 'Premium elegance', color: 'from-yellow-400 to-amber-500', prompt: 'Luxury product photography, black and gold theme, elegant lighting, silk texture background, premium' },
  { id: 'kitchen_counter', label: 'Modern Kitchen', description: 'Lifestyle context', color: 'from-slate-300 to-slate-400', prompt: 'Placed on a clean marble kitchen countertop, modern appliances in background, bright daylight, lifestyle shot' },
  { id: 'geometric', label: 'Geometric', description: 'Abstract shapes', color: 'from-indigo-400 to-purple-400', prompt: 'Abstract geometric background, 3D shapes, pastel colors, soft lighting, modern art direction' }
];

export default function App() {
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authView, setAuthView] = useState<AuthMode | null>(null); // 'signin' | 'signup' | 'forgot' | null

  // App State
  const [activeMode, setActiveMode] = useState<AppMode>('interior');
  const [activeView, setActiveView] = useState<AppView>('workspace');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false); // Controls chat visibility

  // Workspace State
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [imageCount, setImageCount] = useState<number>(1);
  const [suggestedStyles, setSuggestedStyles] = useState<SuggestedStyle[]>([]);
  
  // Current Project ID
  const [projectId, setProjectId] = useState<string>(`proj_${Date.now()}`);

  // Derived state for display
  const currentGeneratedImage = generatedImages.length > 0 ? generatedImages[selectedImageIndex] : null;

  // Set initial chat state based on screen size
  useEffect(() => {
    if (window.innerWidth >= 1024) {
        setIsChatOpen(true);
    }
  }, []);

  // Initialize Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
      if (currentUser) {
        setAuthView(null); // Close auth screen if open
        loadProjects(); // Load library
      }
    });
    return () => unsubscribe();
  }, []);

  // Load projects from DB
  const loadProjects = async () => {
    try {
      const allProjects = await getAllProjects();
      setProjects(allProjects);
    } catch (error) {
      console.error("Failed to load projects:", error);
    }
  };

  // Auto-save effect
  useEffect(() => {
    if (!user || !originalImage) return;

    const timeoutId = setTimeout(() => {
      const projectData: Project = {
        id: projectId,
        name: chatMessages.length > 0 ? `Project ${projectId.slice(-4)}` : 'Untitled Project',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        mode: activeMode,
        originalImage,
        generatedImages,
        chatMessages,
        suggestedStyles,
        imageCount
      };
      
      saveProject(projectData).then(() => {
        loadProjects(); // Refresh library list
      });
    }, 2000); // Debounce save

    return () => clearTimeout(timeoutId);
  }, [user, originalImage, generatedImages, chatMessages, projectId, activeMode, suggestedStyles, imageCount]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
        setGeneratedImages([]);
        setChatMessages([]);
        setSuggestedStyles([]);
        // Initial bot message with context
        const initialMsg = activeMode === 'interior' 
            ? "I see your room! I can analyze the style or help you redesign it. Try asking 'What style is this?' or click 'Suggest Styles'."
            : "Product uploaded! I can help you place this in a professional setting. Ask me for advice or click 'Analyze Product' for ideas.";
            
        setChatMessages([{ role: 'system', content: initialMsg, timestamp: Date.now(), type: 'text' }]);
        
        // Open chat automatically on upload to guide user
        if (window.innerWidth >= 1024) {
            setIsChatOpen(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLoadProject = (project: Project) => {
    setProjectId(project.id);
    setActiveMode(project.mode);
    setOriginalImage(project.originalImage);
    setGeneratedImages(project.generatedImages);
    setChatMessages(project.chatMessages);
    setSuggestedStyles(project.suggestedStyles || []);
    setImageCount(project.imageCount || 1);
    setActiveView('workspace');
    if (project.generatedImages.length > 0) {
        setSelectedImageIndex(project.generatedImages.length - 1);
    }
  };

  const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this project?")) {
        await deleteProject(id);
        loadProjects();
        if (projectId === id) {
            handleReset();
        }
    }
  };

  const handleAnalyze = async () => {
    if (!originalImage) return;
    setLoadingState('analyzing');
    setIsChatOpen(true); // Ensure chat is visible to see analysis progress
    
    // Add system message to chat
    setChatMessages(prev => [...prev, {
        role: 'system',
        content: activeMode === 'interior' ? "Analyzing room architecture and lighting..." : "Analyzing product materials and brand vibe...",
        timestamp: Date.now(),
        type: 'text'
    }]);

    try {
        let suggestions: SuggestedStyle[] = [];
        if (activeMode === 'product') {
            suggestions = await analyzeProduct(originalImage);
        } else {
            suggestions = await analyzeRoom(originalImage);
        }
        
        setSuggestedStyles(suggestions);
        
        setChatMessages(prev => [...prev, {
            role: 'system',
            content: `Analysis complete! I've found ${suggestions.length} distinct styles that would fit perfectly. Click one of the style cards above to visualize it.`,
            timestamp: Date.now(),
            type: 'text'
        }]);
    } catch (e) {
        console.error(e);
        setChatMessages(prev => [...prev, {
            role: 'system',
            content: "I had trouble analyzing the image. Please try again.",
            timestamp: Date.now(),
            type: 'text'
        }]);
    } finally {
        setLoadingState('idle');
    }
  };

  const handleGenerate = async (stylePrompt: string, styleLabel: string) => {
    if (!originalImage) return;

    setLoadingState('generating_image');
    
    // Loop for batch generation
    for (let i = 0; i < imageCount; i++) {
        try {
          const resultImage = await generateDesign(originalImage, stylePrompt, activeMode);
          
          const newImage: GeneratedImage = {
            id: Date.now().toString() + i,
            url: resultImage,
            prompt: stylePrompt,
            styleName: styleLabel,
            timestamp: Date.now(),
          };

          setGeneratedImages(prev => [...prev, newImage]);
          setSelectedImageIndex(prev => prev + 1); // Move to newest
          
          // Add success message only on first image of batch
          if (i === 0) {
              setChatMessages(prev => [...prev, {
                role: 'system',
                content: `Generating ${imageCount} version(s) of ${styleLabel}...`,
                timestamp: Date.now(),
                type: 'text'
              }]);
          }

        } catch (error) {
          console.error("Generation failed", error);
          setChatMessages(prev => [...prev, {
            role: 'system',
            content: "Sorry, I encountered an error while generating the design. Please try again.",
            timestamp: Date.now(),
            type: 'text'
          }]);
          break; // Stop batch on error
        }
    }
    setLoadingState('idle');
  };

  const handleSendMessage = async (text: string, type: 'chat' | 'visualize') => {
    // Optimistic update
    const newUserMsg: ChatMessage = { role: 'user', content: text, timestamp: Date.now(), type: 'text' };
    setChatMessages(prev => [...prev, newUserMsg]);

    if (type === 'visualize') {
        // Trigger generation directly
        handleGenerate(text, "Custom Request"); // We treat the text as the style prompt
        return;
    }

    setLoadingState('chatting');

    try {
      // Determine context image: Use generated image if available and selected, otherwise original
      const contextImage = currentGeneratedImage ? currentGeneratedImage.url : originalImage;

      const response = await chatWithExpert(chatMessages, text, activeMode, contextImage);
      
      setChatMessages(prev => [...prev, {
        role: 'model',
        content: response,
        timestamp: Date.now(),
        type: 'text'
      }]);
    } catch (error) {
      console.error("Chat error", error);
      setChatMessages(prev => [...prev, {
        role: 'system',
        content: "I'm having trouble connecting right now. Please try again.",
        timestamp: Date.now(),
        type: 'text'
      }]);
    } finally {
      setLoadingState('idle');
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setGeneratedImages([]);
    setChatMessages([]);
    setSuggestedStyles([]);
    setProjectId(`proj_${Date.now()}`);
  };

  // Auth & View Routing Logic
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-gray-900 animate-spin" />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    if (authView) {
      return (
        <AuthPage 
            initialMode={authView} 
            onSuccess={() => { /* Listener handles update */ }}
            onBack={() => setAuthView(null)} 
        />
      );
    }
    return (
        <LandingPage 
            onLogin={() => setAuthView('signin')} 
            onSignup={() => setAuthView('signup')} 
        />
    );
  }

  // Logged in logic
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-900 selection:bg-cyan-100 selection:text-cyan-900">
      <Sidebar 
        activeMode={activeMode} 
        activeView={activeView}
        onModeChange={setActiveMode} 
        onViewChange={setActiveView}
        onReset={handleReset}
        hasImage={!!originalImage}
        userEmail={user.email}
      />
      
      {activeView === 'library' ? (
          <Library 
            projects={projects} 
            onSelectProject={handleLoadProject}
            onDeleteProject={handleDeleteProject}
          />
      ) : (
          /* WORKSPACE VIEW */
          <main className="flex-1 flex flex-col relative overflow-hidden transition-all duration-500">
            
            {/* Header / Mode Switcher */}
            <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-white border-b border-gray-200 z-10 flex-shrink-0">
               <div className="flex items-center gap-4">
                  {/* Mode Toggle */}
                  <div className="bg-gray-100 p-1 rounded-lg flex items-center shadow-inner overflow-hidden">
                      <button
                          onClick={() => setActiveMode('interior')}
                          className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                              activeMode === 'interior' 
                              ? 'bg-white text-indigo-600 shadow-sm' 
                              : 'text-gray-500 hover:text-gray-900'
                          }`}
                      >
                          <Layout size={14} /> Interior
                      </button>
                      <button
                          onClick={() => setActiveMode('product')}
                          className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                              activeMode === 'product' 
                              ? 'bg-white text-pink-600 shadow-sm' 
                              : 'text-gray-500 hover:text-gray-900'
                          }`}
                      >
                          <Package size={14} /> Product
                      </button>
                  </div>
               </div>

               <div className="flex items-center gap-4">
                  <div className="hidden md:flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                       {loadingState === 'idle' ? (
                           <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500"></div> Ready</span>
                       ) : (
                           <span className="flex items-center gap-1.5"><Loader2 size={12} className="animate-spin text-indigo-500"/> Processing...</span>
                       )}
                  </div>
                  
                  {/* Toggle Chat Button */}
                  <button 
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className={`p-2 rounded-lg transition-colors relative ${isChatOpen ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
                    title={isChatOpen ? "Close Assistant" : "Open Assistant"}
                  >
                      <MessageSquare size={20} />
                      {/* Notification dot if chat closed but has messages */}
                      {!isChatOpen && chatMessages.length > 0 && (
                          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border border-white"></span>
                      )}
                  </button>
               </div>
            </header>

            <div className="flex-1 flex overflow-hidden relative">
                {/* Center Canvas */}
                <div className="flex-1 flex flex-col relative bg-gray-100/50 min-w-0">
                    
                    {/* Toolbar */}
                    {originalImage && (
                        <div className="p-4 bg-white border-b border-gray-200 overflow-x-auto scrollbar-hide flex-shrink-0">
                            <div className="flex items-center gap-4 min-w-max mx-auto max-w-5xl">
                                
                                {/* AI Analysis Button */}
                                <button
                                    onClick={handleAnalyze}
                                    disabled={loadingState !== 'idle'}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border shadow-sm ${
                                        loadingState === 'analyzing'
                                        ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                                        : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
                                    }`}
                                    title="AI Suggest Styles based on image"
                                >
                                    {loadingState === 'analyzing' ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                                    {activeMode === 'interior' ? 'Suggest Styles' : 'Analyze Product'}
                                </button>

                                <div className="w-px h-8 bg-gray-200 mx-2"></div>

                                {/* Suggested Styles (Dynamic) */}
                                {suggestedStyles.length > 0 && suggestedStyles.map((style) => (
                                    <button
                                        key={style.id}
                                        onClick={() => {
                                            setSelectedStyleId(style.id);
                                            handleGenerate(style.prompt, style.label);
                                        }}
                                        disabled={loadingState !== 'idle'}
                                        className={`group relative flex flex-col items-start p-3 rounded-xl border transition-all w-32 flex-shrink-0 ${
                                            selectedStyleId === style.id 
                                            ? `bg-gradient-to-br ${style.color} text-white border-transparent shadow-md transform scale-105` 
                                            : 'bg-white border-gray-200 hover:border-indigo-300 hover:shadow-md'
                                        }`}
                                        title={style.description}
                                    >
                                        <div className="flex items-center justify-between w-full mb-1">
                                            <span className="font-bold text-[10px] uppercase tracking-wide truncate w-full">{style.label}</span>
                                            {selectedStyleId === style.id && <Check size={10} />}
                                        </div>
                                        <div className={`text-[9px] leading-tight line-clamp-2 ${selectedStyleId === style.id ? 'text-white/90' : 'text-gray-500'}`}>
                                            {style.description}
                                        </div>
                                        <div className={`absolute -top-2 -right-2 bg-indigo-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-sm ${selectedStyleId === style.id ? 'opacity-0' : 'opacity-100 scale-0 group-hover:scale-100 transition-transform'}`}>
                                            AI
                                        </div>
                                    </button>
                                ))}
                                
                                {suggestedStyles.length > 0 && <div className="w-px h-8 bg-gray-200 mx-2"></div>}

                                {/* Default Styles */}
                                {(activeMode === 'interior' ? INTERIOR_STYLES : PRODUCT_STYLES).map((style) => (
                                    <button
                                        key={style.id}
                                        onClick={() => {
                                            setSelectedStyleId(style.id);
                                            handleGenerate(style.prompt, style.label);
                                        }}
                                        disabled={loadingState !== 'idle'}
                                        className={`relative flex flex-col items-start p-3 rounded-xl border transition-all w-28 flex-shrink-0 ${
                                            selectedStyleId === style.id 
                                            ? `bg-gradient-to-br ${style.color} text-white border-transparent shadow-md transform scale-105` 
                                            : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                        }`}
                                        title={style.description}
                                    >
                                        <div className="flex items-center justify-between w-full mb-1">
                                            <span className="font-bold text-[10px] uppercase tracking-wide truncate w-full">{style.label}</span>
                                            {selectedStyleId === style.id && <Check size={10} />}
                                        </div>
                                        <div className={`w-full h-1 rounded-full bg-white/30 ${selectedStyleId === style.id ? 'opacity-100' : 'opacity-0'}`}></div>
                                    </button>
                                ))}

                                <div className="w-px h-8 bg-gray-200 mx-2"></div>
                                
                                {/* Image Count Selector */}
                                <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1 border border-gray-200" title="Number of images to generate">
                                     {[1, 2, 3, 4].map(num => (
                                         <button
                                            key={num}
                                            onClick={() => setImageCount(num)}
                                            className={`w-6 h-6 flex items-center justify-center rounded-md text-xs font-bold transition-all ${
                                                imageCount === num 
                                                ? 'bg-white shadow-sm text-gray-900' 
                                                : 'text-gray-400 hover:text-gray-600'
                                            }`}
                                         >
                                             {num}
                                         </button>
                                     ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Canvas Area */}
                    <div className="flex-1 overflow-hidden relative p-4 flex items-center justify-center">
                        {!originalImage ? (
                            <div className="w-full max-w-xl mx-auto border-2 border-dashed border-gray-300 rounded-3xl p-8 sm:p-12 text-center bg-white hover:bg-gray-50 transition-colors group cursor-pointer relative">
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    title="Upload an image to start"
                                />
                                <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Upload size={32} />
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                                    {activeMode === 'interior' ? 'Upload Room Photo' : 'Upload Product Image'}
                                </h3>
                                <p className="text-gray-500 mb-8 max-w-sm mx-auto text-sm sm:text-base">
                                    Drag & drop or click to upload. We support JPG, PNG, and WebP.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    <span className="flex items-center gap-2"><Sparkles size={14}/> AI Powered</span>
                                    <span className="flex items-center gap-2"><Layout size={14}/> {activeMode === 'interior' ? 'Room Context' : 'Studio Light'}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-full max-w-5xl mx-auto flex flex-col">
                                <div className="flex-1 relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900 border border-gray-800">
                                    {currentGeneratedImage ? (
                                        <ComparisonSlider 
                                            originalImage={originalImage}
                                            generatedImage={currentGeneratedImage.url}
                                            originalLabel="Original"
                                            generatedLabel={currentGeneratedImage.styleName}
                                        />
                                    ) : (
                                        <div className="w-full h-full relative">
                                            <img 
                                                src={originalImage} 
                                                alt="Original" 
                                                className="w-full h-full object-contain"
                                            />
                                            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-bold">
                                                Original
                                            </div>
                                            
                                            {loadingState === 'generating_image' && (
                                                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white z-20">
                                                    <Loader2 size={40} className="animate-spin mb-4 text-indigo-400" />
                                                    <p className="font-bold text-lg animate-pulse">Designing your space...</p>
                                                    <p className="text-sm text-gray-300 mt-2">This usually takes 5-10 seconds</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Thumbnail History */}
                                {generatedImages.length > 0 && (
                                    <div className="h-24 mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
                                        <button 
                                            onClick={() => setSelectedImageIndex(-1)}
                                            className="w-20 h-20 flex-shrink-0 rounded-xl border-2 border-transparent overflow-hidden relative opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all"
                                            title="View Original"
                                        >
                                            <img src={originalImage} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-white font-bold text-[10px]">orig</div>
                                        </button>

                                        {generatedImages.map((img, idx) => (
                                            <button
                                                key={img.id}
                                                onClick={() => setSelectedImageIndex(idx)}
                                                className={`w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden relative snap-start transition-all ${
                                                    selectedImageIndex === idx 
                                                    ? 'ring-2 ring-indigo-500 ring-offset-2 scale-105 shadow-md' 
                                                    : 'opacity-70 hover:opacity-100'
                                                }`}
                                            >
                                                <img src={img.url} className="w-full h-full object-cover" />
                                                <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] p-1 truncate text-center">
                                                    {img.styleName}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar - Responsive Chat Container */}
                <div 
                    className={`
                        border-l border-gray-200 bg-white flex flex-col z-30 shadow-2xl transition-all duration-300 ease-in-out
                        fixed inset-y-0 right-0 h-full w-80 sm:w-96
                        lg:relative lg:h-auto lg:shadow-none lg:z-0
                        ${isChatOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
                        ${isChatOpen ? 'lg:w-96' : 'lg:w-0 lg:border-l-0 lg:overflow-hidden'}
                    `}
                >
                    <ChatInterface 
                        messages={chatMessages}
                        onSendMessage={handleSendMessage}
                        isLoading={loadingState !== 'idle'}
                        loadingState={loadingState}
                        mode={activeMode}
                        currentImageThumbnail={currentGeneratedImage?.url || originalImage}
                        onClose={() => setIsChatOpen(false)}
                    />
                </div>
                
                {/* Mobile Backdrop Overlay */}
                {isChatOpen && (
                    <div 
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden"
                        onClick={() => setIsChatOpen(false)}
                    />
                )}
            </div>
          </main>
      )}
    </div>
  );
}
