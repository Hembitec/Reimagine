
import React, { useState, useEffect } from 'react';
import { Sparkles, Upload, Layout, Package, MessageSquare, ArrowRight, Check, Zap, Layers, Wand2, MoveHorizontal, Star, Users, Bot } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
  onSignup: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onSignup }) => {
  
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden selection:bg-cyan-100 selection:text-cyan-900">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 transition-all duration-300 supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-white shadow-md">
                <Layout size={18} strokeWidth={2.5} />
             </div>
             <span className="font-bold text-xl tracking-tight text-gray-900">ReImagine</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" onClick={(e) => handleScroll(e, 'features')} className="hover:text-blue-600 transition-colors cursor-pointer">Features</a>
            <a href="#modes" onClick={(e) => handleScroll(e, 'modes')} className="hover:text-blue-600 transition-colors cursor-pointer">Capabilities</a>
            <a href="#how-it-works" onClick={(e) => handleScroll(e, 'how-it-works')} className="hover:text-blue-600 transition-colors cursor-pointer">How it Works</a>
          </div>
          <div className="flex items-center gap-4">
             <button 
                onClick={onLogin}
                className="text-gray-600 hover:text-gray-900 font-semibold text-sm transition-colors"
             >
                Log In
             </button>
             <button 
                onClick={onSignup}
                className="bg-gray-900 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-600 transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-blue-500/20"
             >
                Sign Up
             </button>
          </div>
        </div>
      </nav>

      {/* SECTION 1: Architectural Hero */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        
        {/* Dynamic Perspective Grid Background */}
        <div className="absolute inset-0 -z-20 overflow-hidden bg-white">
            <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,white)]">
                 <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px] animate-grid-flow opacity-50"></div>
            </div>
        </div>
        
        {/* Floating Aurora Orbs (Blue/Cyan) */}
        <div className="absolute top-20 right-[10%] w-72 h-72 bg-blue-400/20 rounded-full blur-[80px] animate-float pointer-events-none mix-blend-multiply"></div>
        <div className="absolute bottom-20 left-[10%] w-96 h-96 bg-cyan-400/20 rounded-full blur-[80px] animate-float-delayed pointer-events-none mix-blend-multiply"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
            
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm text-gray-600 text-xs font-semibold mb-8 animate-fade-in hover:border-blue-200 transition-colors cursor-default">
              <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                     <div key={i} className="w-5 h-5 rounded-full bg-gray-200 border-2 border-white"></div>
                 ))}
              </div>
              <span className="pl-1">Loved by 10,000+ Designers</span>
            </div>

            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tighter text-gray-900 mb-6 leading-[0.95]">
              Design at the <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">speed of AI.</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0 font-light">
              The professional studio for Interior Design and Product Photography. Visualize concepts and chat with an AI Consultant in <span className="font-semibold text-gray-900">real-time</span>.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <button 
                onClick={onSignup}
                className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-full font-semibold text-lg hover:bg-blue-600 transition-all hover:scale-105 shadow-xl hover:shadow-blue-500/25 flex items-center justify-center gap-2 group"
              >
                Start Creating
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={onSignup} className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-full font-semibold text-lg hover:bg-gray-50 transition-all hover:border-gray-300 flex items-center justify-center gap-2">
                 View Gallery
              </button>
            </div>

            <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-500 font-medium">
                 <div className="flex items-center gap-2">
                    <Check size={16} className="text-blue-600" /> Free to start
                 </div>
                 <div className="flex items-center gap-2">
                    <Check size={16} className="text-blue-600" /> No credit card
                 </div>
                 <div className="flex items-center gap-2">
                    <Check size={16} className="text-blue-600" /> 8K Export
                 </div>
            </div>
          </div>

          {/* Animated UI Demo */}
          <div className="relative lg:h-[700px] flex items-center justify-center perspective-1000 group">
             <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl transform group-hover:scale-110 transition-transform duration-700"></div>
             <HeroAnimation />
          </div>
        </div>
      </section>

      {/* SECTION 2: Features Grid */}
      <section id="features" className="py-24 bg-gray-50/50 border-t border-gray-200 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Precision tools for creators.</h2>
            <p className="text-lg text-gray-500">Built for homeowners, interior designers, and marketers who need professional results fast.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="text-cyan-500" size={24} />,
                title: "Instant Rendering",
                desc: "Generate high-fidelity visualizations in seconds using the latest Gemini 2.5 Flash model."
              },
              {
                icon: <MessageSquare className="text-blue-500" size={24} />,
                title: "AI Design Consultant",
                desc: "Chat with our expert AI to refine details, get advice, and perfect your prompt."
              },
              {
                icon: <Layers className="text-gray-800" size={24} />,
                title: "Dual Modes",
                desc: "Switch seamlessly between Interior Design visualization and Professional Product Photography."
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white border border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group">
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-6 group-hover:bg-blue-50 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: Dual Modes */}
      <section id="modes" className="py-24 bg-gray-900 text-white overflow-hidden relative scroll-mt-20">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">One App. <br/>Two Powerful Modes.</h2>
                <p className="text-gray-400 text-lg max-w-xl">Whether you are renovating a home or launching a product, ReImagine adapts to your workflow.</p>
              </div>
              <div className="flex gap-1 bg-white/10 p-1 rounded-xl backdrop-blur-sm border border-white/10">
                 <div className="px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg">
                    <Layout size={16} /> Interiors
                 </div>
                 <div className="px-4 py-2 text-gray-300 hover:text-white transition-colors rounded-lg text-sm font-medium flex items-center gap-2">
                    <Package size={16} /> Products
                 </div>
              </div>
           </div>

           <div className="grid md:grid-cols-2 gap-8">
              {/* Interior Card */}
              <div className="relative group rounded-[2rem] overflow-hidden border border-gray-700 bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
                 <div className="h-72 bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-700 bg-[url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                    <div className="absolute bottom-8 left-8 right-8">
                        <div className="flex items-center gap-2 text-blue-400 font-bold uppercase tracking-wider text-xs mb-2">
                            <Sparkles size={12} />
                            <span>Room Redesign</span>
                        </div>
                        <h3 className="text-3xl font-bold text-white">Interior Designer</h3>
                    </div>
                 </div>
                 <div className="p-8">
                    <p className="text-gray-400 mb-6 text-lg">Upload any room photo and instantly visualize it in styles like Modern, Scandinavian, or Industrial. Keep the furniture or clear it out.</p>
                    <ul className="space-y-3">
                        {['Preserves room geometry', 'Realistic lighting', 'Furniture replacement'].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                                    <Check size={12} className="text-blue-400" /> 
                                </div>
                                {item}
                            </li>
                        ))}
                    </ul>
                 </div>
              </div>

              {/* Product Card */}
              <div className="relative group rounded-[2rem] overflow-hidden border border-gray-700 bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
                 <div className="h-72 bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-700 bg-[url('https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop')] bg-cover bg-center"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                    <div className="absolute bottom-8 left-8 right-8">
                        <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider text-xs mb-2">
                            <Sparkles size={12} />
                            <span>Marketing Assets</span>
                        </div>
                        <h3 className="text-3xl font-bold text-white">Product Studio</h3>
                    </div>
                 </div>
                 <div className="p-8">
                    <p className="text-gray-400 mb-6 text-lg">Turn amateur product photos into professional studio shots. Perfect for e-commerce, social media, and advertising campaigns.</p>
                    <ul className="space-y-3">
                        {['Preserves brand identity', 'Custom background generation', 'Studio lighting effects'].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                                <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                    <Check size={12} className="text-cyan-400" /> 
                                </div>
                                {item}
                            </li>
                        ))}
                    </ul>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* SECTION 4: How It Works */}
      <section id="how-it-works" className="py-24 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
               <h2 className="text-3xl font-bold text-gray-900 tracking-tight">From Photo to Masterpiece</h2>
           </div>

           <div className="relative grid md:grid-cols-3 gap-12">
               {/* Connecting Line */}
               <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gray-200 -z-10"></div>

               {[
                   { step: 1, title: "Upload", desc: "Take a photo of your room or product and upload it to the secure studio.", icon: <Upload size={20} /> },
                   { step: 2, title: "Customize", desc: "Choose a preset style or describe your vision to the AI consultant.", icon: <Wand2 size={20} /> },
                   { step: 3, title: "Generate", desc: "Watch as ReImagine transforms your image in seconds.", icon: <Sparkles size={20} /> }
               ].map((s, i) => (
                   <div key={i} className="flex flex-col items-center text-center group">
                       <div className="w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-8 border border-gray-100 relative z-10 group-hover:-translate-y-2 transition-transform duration-300">
                           <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center text-white">
                               {s.icon}
                           </div>
                           <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold border-2 border-white shadow-md">
                               {s.step}
                           </div>
                       </div>
                       <h3 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h3>
                       <p className="text-gray-500 max-w-xs leading-relaxed">{s.desc}</p>
                   </div>
               ))}
           </div>
        </div>
      </section>

      {/* SECTION 5: Smart Library */}
      <section className="py-24 bg-gray-50 border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2">
                  <div className="bg-white p-8 rounded-[2.5rem] relative overflow-hidden shadow-xl border border-gray-100">
                      <div className="absolute top-0 right-0 p-32 bg-blue-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative z-10">
                          <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                              <span className="font-bold text-gray-800 flex items-center gap-2"><Layout size={18} className="text-blue-600"/> Project Library</span>
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md font-medium flex items-center gap-1"><Check size={10}/> Auto-Saved</span>
                          </div>
                          <div className="space-y-4">
                              {[1,2,3].map((_, i) => (
                                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer group">
                                      <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden relative">
                                          <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
                                      </div>
                                      <div>
                                          <div className="h-4 w-32 bg-gray-200 rounded mb-2 animate-pulse"></div>
                                          <div className="h-3 w-20 bg-gray-100 rounded animate-pulse"></div>
                                      </div>
                                      <ArrowRight size={16} className="ml-auto text-gray-300 group-hover:text-gray-600" />
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>
              <div className="lg:w-1/2">
                  <h2 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight">Your Creative History, <br/> <span className="text-blue-600">Always Safe.</span></h2>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                      Forget about losing your best ideas. ReImagine automatically saves every generation, chat history, and prompt to your private local library using browser storage.
                  </p>
                  <ul className="space-y-4">
                      {[
                          "100% Private - Data stored on your device",
                          "Resume any conversation instantly",
                          "Organize projects by Interior or Product"
                      ].map((item, i) => (
                          <li key={i} className="flex items-center gap-3 font-medium text-gray-700">
                              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                                  <Check size={14} strokeWidth={3} />
                              </div>
                              {item}
                          </li>
                      ))}
                  </ul>
              </div>
          </div>
      </section>

      {/* SECTION 6: Footer CTA */}
      <section className="py-32 bg-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
          <div className="max-w-4xl mx-auto px-4 relative z-10">
              <h2 className="text-5xl md:text-6xl font-bold mb-8 text-gray-900 tracking-tighter">Ready to reimagine?</h2>
              <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto">Join thousands of designers and creators using AI to speed up their workflow.</p>
              <button 
                onClick={onSignup}
                className="bg-gray-900 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-blue-600 transition-all hover:scale-105 shadow-2xl shadow-gray-900/20 ring-4 ring-gray-100"
              >
                Get Started Now
              </button>
              <div className="mt-16 flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-100 text-sm text-gray-500">
                 <div className="flex items-center gap-2 font-bold text-gray-900">
                    <Layout size={16} /> ReImagine
                 </div>
                 <div className="flex gap-8 mt-4 md:mt-0">
                    <a href="#" className="hover:text-gray-900">Privacy</a>
                    <a href="#" className="hover:text-gray-900">Terms</a>
                    <a href="#" className="hover:text-gray-900">Twitter</a>
                 </div>
                 <p className="mt-4 md:mt-0">© 2024 ReImagine AI.</p>
              </div>
          </div>
      </section>
    </div>
  );
};

/**
 * A complex CSS-animated component to simulate the app interface
 */
const HeroAnimation = () => {
    const [step, setStep] = useState(0); 
    // 0: Upload
    // 1: Analysis (Scanning)
    // 2: AI Consultant (Chat)
    // 3: Generating
    // 4: Result

    useEffect(() => {
        const interval = setInterval(() => {
            setStep(s => (s + 1) % 5);
        }, 3500); 
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full max-w-md aspect-[3/4] md:aspect-square bg-white rounded-[2.5rem] shadow-2xl border-8 border-gray-900 overflow-hidden flex flex-col transform rotate-y-12 hover:rotate-y-0 transition-all duration-700 ease-out shadow-blue-500/20 ring-1 ring-gray-200">
            {/* Glare Effect */}
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-white/20 to-transparent pointer-events-none z-20"></div>
            
            {/* App Header Mockup */}
            <div className="h-14 border-b border-gray-100 flex items-center px-6 justify-between bg-white relative z-10">
                <div className="flex items-center gap-4 text-xs font-bold text-gray-900">
                    <Layout size={16} /> Studio
                </div>
                <div className="h-2 w-16 bg-gray-200 rounded-full"></div>
            </div>

            {/* App Body */}
            <div className="flex-1 relative bg-gray-50 p-4 flex items-center justify-center overflow-hidden">
                
                {/* STATE 0: UPLOAD */}
                <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${step === 0 ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center transform transition-transform hover:scale-105">
                        <div className="w-20 h-20 bg-gray-50 text-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-bounce border border-gray-200">
                            <Upload size={32} />
                        </div>
                        <div className="h-4 w-40 bg-gray-200 rounded-full mx-auto mb-3"></div>
                        <div className="h-3 w-24 bg-gray-100 rounded-full mx-auto"></div>
                    </div>
                </div>

                {/* STATE 1: SCANNING (Analysis) */}
                <div className={`absolute inset-0 p-4 transition-opacity duration-500 ${step === 1 ? 'opacity-100' : 'opacity-0'}`}>
                     <div className="w-full h-full bg-gray-200 rounded-2xl overflow-hidden relative border border-gray-300">
                         <div className="absolute inset-0 grid grid-cols-6 grid-rows-6">
                             {Array.from({length:36}).map((_,i) => (
                                 <div key={i} className="border border-white/20"></div>
                             ))}
                         </div>
                         <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600 shadow-[0_0_30px_rgba(37,99,235,1)] animate-scan z-10"></div>
                         <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-gray-900/90 text-white px-5 py-2 rounded-full text-xs font-bold backdrop-blur-md flex items-center gap-2 shadow-xl">
                             <Sparkles size={14} className="animate-spin text-blue-400" /> Scanning Room...
                         </div>
                     </div>
                </div>

                {/* STATE 2: AI CONSULTANT (Chat) */}
                 <div className={`absolute inset-0 p-4 transition-opacity duration-500 ${step === 2 ? 'opacity-100' : 'opacity-0'}`}>
                     <div className="w-full h-full bg-gray-200 rounded-2xl overflow-hidden relative border border-gray-300 flex flex-col items-center justify-center">
                         <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
                         
                         {/* Chat Mockup */}
                         <div className="bg-white rounded-2xl p-4 shadow-2xl max-w-[80%] relative animate-fade-in-up">
                             <div className="flex items-start gap-3">
                                 <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
                                     <Bot size={18} />
                                 </div>
                                 <div>
                                     <div className="h-2 w-12 bg-gray-200 rounded-full mb-2"></div>
                                     <p className="text-xs font-medium text-gray-700 leading-relaxed">
                                         Great space! How about a <span className="text-blue-600 font-bold">Modern Minimalist</span> style?
                                     </p>
                                 </div>
                             </div>
                             <div className="mt-3 flex gap-2">
                                 <div className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold border border-blue-100 shadow-sm">
                                     Visualise Modern
                                 </div>
                             </div>
                             
                             {/* Cursor Hand Mock */}
                             <div className="absolute bottom-2 right-4 translate-y-1/2 translate-x-1/2 w-8 h-8 text-gray-900 drop-shadow-lg">
                                 <svg viewBox="0 0 24 24" fill="currentColor" className="animate-pulse">
                                    <path d="M7 2l12 11.2-5.8.5 3.3 7.3-2.2.9-3.2-7.4-4.4 4.6z"/>
                                 </svg>
                             </div>
                         </div>
                     </div>
                </div>

                {/* STATE 3: GENERATING */}
                <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${step === 3 ? 'opacity-100' : 'opacity-0'}`}>
                     <div className="text-center">
                         <div className="relative w-24 h-24 mx-auto mb-6">
                            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                         </div>
                         <p className="text-gray-900 font-bold animate-pulse tracking-tight">Rendering High-Res...</p>
                     </div>
                </div>

                 {/* STATE 4: RESULT */}
                 <div className={`absolute inset-0 p-4 transition-opacity duration-500 ${step === 4 ? 'opacity-100' : 'opacity-0'}`}>
                     <div className="w-full h-full rounded-2xl overflow-hidden relative group shadow-inner">
                         {/* Split Screen Effect CSS */}
                         <div className="absolute inset-0 bg-blue-100 flex">
                             <div className="w-1/2 bg-gray-200 h-full border-r border-white"></div> {/* Left: Before */}
                             <div className="w-1/2 bg-gradient-to-br from-blue-500 to-cyan-500 h-full"></div> {/* Right: After */}
                         </div>
                         
                         {/* Mock Slider */}
                         <div className="absolute inset-y-0 left-1/2 w-1.5 bg-white cursor-ew-resize flex items-center justify-center shadow-2xl animate-slider-move z-20">
                             <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-900">
                                 <MoveHorizontal size={20} />
                             </div>
                         </div>

                         <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold shadow-sm border border-white/50 text-gray-900">
                             Modern Minimalist
                         </div>
                     </div>
                </div>

            </div>
            
            {/* App Footer Mockup */}
            <div className="h-20 border-t border-gray-100 bg-white flex items-center px-6 gap-4 relative z-10">
                <div className="flex-1 h-12 bg-gray-50 border border-gray-100 rounded-full flex items-center px-4">
                    <div className="h-2 w-32 bg-gray-300 rounded-full"></div>
                </div>
                <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform">
                    <ArrowRight size={20} />
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
