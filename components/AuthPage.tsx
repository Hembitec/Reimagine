
import React, { useState, useEffect } from 'react';
import { signInWithPopup, googleProvider, auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from '../services/firebase';
import { Layout, ArrowRight, Mail, Lock, Loader2, AlertCircle, CheckCircle2, ChevronLeft, Star, Quote } from 'lucide-react';

export type AuthMode = 'signin' | 'signup' | 'forgot';

interface AuthPageProps {
  initialMode?: AuthMode;
  onSuccess: () => void;
  onBack: () => void;
}

const TESTIMONIALS = [
    {
        image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2874&auto=format&fit=crop",
        quote: "ReImagine completely transformed how I present concepts to clients. The AI suggestions are incredibly accurate and the rendering speed is unmatched.",
        author: "Sarah Jenkins",
        role: "Interior Architect, NY",
        color: "from-blue-400 to-cyan-300"
    },
    {
        image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2700&auto=format&fit=crop",
        quote: "I use the product photography mode daily. It saves me thousands on studio rentals and the lighting matches my brand perfectly every time.",
        author: "Marcus Chen",
        role: "E-commerce Director",
        color: "from-pink-400 to-rose-300"
    },
    {
        image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2700&auto=format&fit=crop",
        quote: "The ability to visualize different styles in seconds has helped me close 3x more renovation deals this quarter.",
        author: "Elena Rodriguez",
        role: "Real Estate Developer",
        color: "from-amber-400 to-orange-300"
    }
];

const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'signin', onSuccess, onBack }) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // Carousel State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
      const interval = setInterval(() => {
          setIsAnimating(true);
          setTimeout(() => {
              setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
              setIsAnimating(false);
          }, 500); // Wait for fade out
      }, 5000); // Change every 5s

      return () => clearInterval(interval);
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      // Listener in App.tsx will handle the state change
    } catch (err: any) {
      console.error(err);
      setError("Could not sign in with Google. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (mode === 'signin') {
        await signInWithEmailAndPassword(auth, email, password);
        // Listener in App.tsx handles redirection
      } else if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password);
        // Listener in App.tsx handles redirection
      } else if (mode === 'forgot') {
        await sendPasswordResetEmail(auth, email);
        setSuccessMsg("Password reset email sent! Check your inbox.");
        setMode('signin'); // Switch back to signin so they can login after checking email
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError("Invalid email or password.");
      } else if (err.code === 'auth/email-already-in-use') {
        setError("An account with this email already exists.");
      } else if (err.code === 'auth/weak-password') {
        setError("Password should be at least 6 characters.");
      } else {
        setError(err.message || "An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const currentTestimonial = TESTIMONIALS[currentIndex];

  return (
    <div className="min-h-screen flex bg-white font-sans selection:bg-cyan-100 selection:text-cyan-900">
      
      {/* LEFT SIDE - FORM */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 xl:p-24 relative animate-fade-in">
        
        {/* Back Button */}
        <button 
            onClick={onBack}
            className="absolute top-8 left-8 sm:left-12 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-2 group"
            title="Back to Home"
        >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back</span>
        </button>

        <div className="max-w-md w-full mx-auto">
            {/* Logo */}
            <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center text-white mb-8 shadow-lg shadow-indigo-500/20">
                <Layout size={24} strokeWidth={2.5} />
            </div>

            {/* Header */}
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-3">
                {mode === 'signin' ? 'Welcome back' : mode === 'signup' ? 'Create account' : 'Reset password'}
            </h1>
            <p className="text-gray-500 mb-8 text-lg">
                {mode === 'signin' ? 'Please enter your details to sign in.' : 
                 mode === 'signup' ? 'Start your creative journey today.' : 
                 'We will send you a link to reset it.'}
            </p>

            {/* Google Button */}
            {mode !== 'forgot' && (
                <>
                <button 
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full bg-white border border-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md active:scale-[0.99]"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                </button>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white text-gray-400 font-medium">Or</span>
                    </div>
                </div>
                </>
            )}

            {/* Messages */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm animate-shake">
                    <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                    <span className="font-medium">{error}</span>
                </div>
            )}
            
            {successMsg && (
                <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl flex items-start gap-3 text-green-700 text-sm animate-fade-in">
                    <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0" />
                    <span className="font-medium">{successMsg}</span>
                </div>
            )}

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                            <Mail size={18} />
                        </div>
                        <input 
                            type="email" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all font-medium"
                            placeholder="name@company.com"
                        />
                    </div>
                </div>

                {mode !== 'forgot' && (
                    <div>
                        <div className="flex items-center justify-between mb-2">
                             <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Password</label>
                             {mode === 'signin' && (
                                <button 
                                    type="button"
                                    onClick={() => setMode('forgot')}
                                    className="text-xs text-indigo-600 font-bold hover:text-indigo-800 transition-colors"
                                >
                                    Forgot password?
                                </button>
                            )}
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                <Lock size={18} />
                            </div>
                            <input 
                                type="password" 
                                required 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all font-medium"
                                placeholder="Min. 6 characters"
                            />
                        </div>
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition-all shadow-xl shadow-gray-900/10 hover:shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group mt-4 active:scale-[0.98]"
                >
                    {isLoading ? <Loader2 size={22} className="animate-spin" /> : (
                    <>
                        {mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Link'}
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                    )}
                </button>
            </form>

            <div className="mt-8 text-center text-sm">
                <span className="text-gray-500">
                    {mode === 'signin' ? "Don't have an account?" : mode === 'signup' ? "Already have an account?" : "Remember your password?"}
                </span>
                <button 
                    onClick={() => {
                        setError(null);
                        setMode(mode === 'signin' ? 'signup' : 'signin');
                    }}
                    className="font-bold text-gray-900 hover:text-blue-600 ml-1.5 transition-colors underline decoration-transparent hover:decoration-blue-600 underline-offset-2"
                >
                    {mode === 'signin' ? 'Sign up' : 'Sign in'}
                </button>
            </div>
        </div>
      </div>

      {/* RIGHT SIDE - VISUAL SHOWCASE */}
      <div className="hidden lg:block lg:w-1/2 bg-gray-900 relative overflow-hidden transition-all duration-1000">
         {/* Background Images */}
         {TESTIMONIALS.map((item, index) => (
             <div 
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentIndex ? 'opacity-100' : 'opacity-0'
                }`}
             >
                 <img 
                    src={item.image}
                    alt="Interior" 
                    className={`w-full h-full object-cover opacity-60 transition-transform duration-[10000ms] ease-linear ${index === currentIndex ? 'scale-110' : 'scale-100'}`}
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
             </div>
         ))}

         {/* Content */}
         <div className="absolute inset-0 flex flex-col justify-end p-16 z-10">
             
             <div 
                className={`bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-3xl max-w-md shadow-2xl transition-all duration-500 transform ${
                    isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                }`}
             >
                 <div className="flex gap-1 mb-4">
                     {[1,2,3,4,5].map(i => <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />)}
                 </div>
                 <Quote className="text-white/50 mb-4" size={32} />
                 <p className="text-xl text-white font-medium leading-relaxed mb-6">
                     "{currentTestimonial.quote}"
                 </p>
                 <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${currentTestimonial.color}`}></div>
                     <div>
                         <p className="text-white font-bold">{currentTestimonial.author}</p>
                         <p className="text-blue-200 text-sm">{currentTestimonial.role}</p>
                     </div>
                 </div>
             </div>
             
             {/* Progress Indicators */}
             <div className="flex items-center gap-2 mt-8">
                 {TESTIMONIALS.map((_, idx) => (
                     <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-1 rounded-full transition-all duration-300 ${
                            idx === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'
                        }`}
                     />
                 ))}
                 <div className="ml-4 flex items-center gap-2 opacity-60">
                    <p className="text-white text-xs font-medium tracking-widest uppercase">AI Powered Design Studio</p>
                 </div>
             </div>
         </div>
      </div>

    </div>
  );
};

export default AuthPage;
