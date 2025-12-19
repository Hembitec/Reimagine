
import React, { useState, useEffect } from 'react';
import { Loader2, Save } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Library from './components/Library';
import LandingPage from './components/LandingPage';
import AuthPage, { AuthMode } from './components/AuthPage';
import ModeSelector from './components/setup/ModeSelector';
import UploadZone from './components/setup/UploadZone';
import ImageCanvas from './components/canvas/ImageCanvas';
import InspectorPanel from './components/controls/InspectorPanel';
import StartScreen from './components/StartScreen';

import { useProjectState } from './hooks/useProjectState';
import { generateDesign, analyzeStyleReference, chatWithExpert } from './services/gemini';
import { getUserProjects, deleteProjectFromCloud } from './services/neon';
import { onAuthStateChanged, auth, User } from './services/firebase';
import { AppMode, AppView, Project, GeneratedImage } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authView, setAuthView] = useState<AuthMode | null>(null);
  const [activeView, setActiveView] = useState<AppView>('workspace');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { 
    project, 
    setProject, 
    initNewProject, 
    updateProject, 
    addGeneratedImages, 
    saveProject, 
    isSaving 
  } = useProjectState(user);

  const [intent, setIntent] = useState<'create' | 'copy' | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(-1);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
      if (currentUser) {
        setAuthView(null);
        refreshLibrary(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const refreshLibrary = async (uid: string) => {
    const data = await getUserProjects(uid);
    setProjects(data);
  };

  const handleModeChange = (mode: AppMode) => {
      initNewProject(mode);
      setIntent(null);
      setSelectedImageIndex(-1);
  };

  const handleIntentSelect = (selectedIntent: 'create' | 'copy') => {
      setIntent(selectedIntent);
  };

  const handleUploadComplete = async (original: string, reference?: string, prompt?: string) => {
      if (!project) return;
      
      let refDesc = null;
      if (reference) {
         try {
             refDesc = await analyzeStyleReference(reference);
         } catch (e) {
             console.warn("Reference analysis skipped", e);
         }
      }

      const finalPrompt = prompt || refDesc || "";
      updateProject({
          originalImage: original,
          referenceImage: reference,
          userPrompt: finalPrompt
      });
  };

  const handleGenerate = async (prompt: string, label: string, count: number, aspectRatio: string) => {
      if (!project || !project.originalImage) return;
      setIsGenerating(true);

      for (let i = 0; i < count; i++) {
          try {
              const url = await generateDesign(project.originalImage, prompt, project.mode, project.referenceImage, aspectRatio);
              const newImg: GeneratedImage = {
                  id: Date.now().toString() + i,
                  url,
                  prompt,
                  styleName: label,
                  timestamp: Date.now()
              };
              addGeneratedImages([newImg]);
              setSelectedImageIndex(prev => prev === -1 ? 0 : prev + 1);
          } catch (e) {
              console.error(e);
          }
      }
      setIsGenerating(false);
  };

  const handleChat = async (text: string, type: 'chat' | 'visualize') => {
      if (!project) return;
      const newMsg = { role: 'user' as const, content: text, timestamp: Date.now(), type: 'text' as const };
      const updatedMessages = [...project.chatMessages, newMsg];
      updateProject({ chatMessages: updatedMessages });
      if (type === 'visualize') {
          handleGenerate(text, "Chat Request", 1, "1:1");
          return;
      }
      const currentImg = selectedImageIndex >= 0 ? project.generatedImages[selectedImageIndex].url : project.originalImage;
      const response = await chatWithExpert(updatedMessages, text, project.mode, currentImg);
      updateProject({ 
          chatMessages: [...updatedMessages, { role: 'model', content: response, timestamp: Date.now(), type: 'text' }]
      });
  };

  if (isAuthLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!user) {
    if (authView) return <AuthPage initialMode={authView} onSuccess={() => {}} onBack={() => setAuthView(null)} />;
    return <LandingPage onLogin={() => setAuthView('signin')} onSignup={() => setAuthView('signup')} />;
  }

  const renderWorkspaceContent = () => {
      if (!project) return <StartScreen onSelectMode={handleModeChange} />;
      if (!intent) return <ModeSelector mode={project.mode} onSelectIntent={handleIntentSelect} />;
      if (!project.originalImage) {
          return (
            <UploadZone 
                intent={intent} 
                modeLabel={project.mode === 'interior' ? 'Room' : project.mode === 'product' ? 'Product' : 'Asset'} 
                onUploadComplete={handleUploadComplete} 
            />
          );
      }

      const currentImage = selectedImageIndex >= 0 ? project.generatedImages[selectedImageIndex].url : undefined;
      const currentLabel = selectedImageIndex >= 0 ? project.generatedImages[selectedImageIndex].styleName : undefined;

      return (
          <div className="flex h-full min-h-0 overflow-hidden">
             <div className="flex-1 p-4 lg:p-6 flex flex-col min-w-0">
                <header className="flex items-center justify-between mb-4 flex-shrink-0">
                    <div>
                        <h2 className="font-bold text-xl text-gray-900">{project.name}</h2>
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{project.mode} Studio • {project.generatedImages.length} versions</p>
                    </div>
                    <button 
                        onClick={saveProject} 
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50 shadow-sm"
                    >
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Save
                    </button>
                </header>
                <div className="flex-1 min-h-0">
                    <ImageCanvas 
                        originalImage={project.originalImage} 
                        generatedImage={currentImage} 
                        generatedLabel={currentLabel} 
                    />
                </div>
             </div>
             <InspectorPanel 
                mode={project.mode}
                originalImage={project.originalImage}
                generatedImages={project.generatedImages}
                selectedImageIndex={selectedImageIndex}
                onSelectImage={setSelectedImageIndex}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                initialPrompt={project.userPrompt}
                chatProps={{
                    messages: project.chatMessages,
                    onSendMessage: handleChat,
                    isLoading: false,
                    loadingState: 'idle',
                    mode: project.mode,
                    currentImageThumbnail: currentImage || project.originalImage
                }}
             />
          </div>
      );
  };

  const isSetupPhase = !project || !intent || !project.originalImage;

  return (
    <div className="flex h-screen bg-white font-sans text-gray-900 overflow-hidden">
        <Sidebar 
            activeMode={project?.mode || 'interior'} 
            activeView={activeView}
            onModeChange={handleModeChange} 
            onViewChange={setActiveView}
            onReset={() => { setProject(null); setIntent(null); }}
            hasImage={!!project?.originalImage}
            userEmail={user.email}
            isMobileOpen={isMobileMenuOpen}
            onMobileClose={() => setIsMobileMenuOpen(false)}
        />
        
        <main className={`flex-1 flex flex-col min-w-0 bg-white relative ${isSetupPhase ? 'overflow-y-auto' : 'overflow-hidden'}`}>
            <div className="lg:hidden p-4 border-b flex justify-between items-center flex-shrink-0">
                 <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-gray-500"><Loader2 size={20}/></button>
                 <span className="font-bold tracking-tighter">REIMAGINE</span>
            </div>

            {activeView === 'library' ? (
                <div className="flex-1 overflow-y-auto">
                    <Library 
                        projects={projects} 
                        onSelectProject={(p) => {
                            setProject(p);
                            setIntent('create');
                            setActiveView('workspace');
                            if (p.generatedImages.length > 0) setSelectedImageIndex(p.generatedImages.length - 1);
                        }} 
                        onDeleteProject={async (id, e) => {
                            e.stopPropagation();
                            await deleteProjectFromCloud(id);
                            refreshLibrary(user.uid);
                        }} 
                    />
                </div>
            ) : (
                <div className="flex-1 flex flex-col min-h-0">
                    {renderWorkspaceContent()}
                </div>
            )}
        </main>
    </div>
  );
}
