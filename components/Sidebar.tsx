import React, { useState, useEffect } from 'react';
import { Layout, Library as LibraryIcon, Plus, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { AppMode, AppView } from '../types';
import { firebaseSignOut, auth } from '../services/firebase';

interface SidebarProps {
  activeMode: AppMode;
  activeView: AppView;
  onModeChange: (mode: AppMode) => void;
  onViewChange: (view: AppView) => void;
  onReset: () => void;
  hasImage: boolean;
  userEmail?: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ activeMode, activeView, onModeChange, onViewChange, onReset, hasImage, userEmail }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
        const mobile = window.innerWidth < 1024;
        setIsMobile(mobile);
        // Automatically collapse on mobile, expand on desktop by default
        if (mobile) {
            setIsCollapsed(true);
        } else {
            setIsCollapsed(false);
        }
    };
    
    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobile && !isCollapsed && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCollapsed(true)}
          />
      )}

      {/* 
         Outer Container (Flex Item Placeholder) 
         On mobile, this stays w-20 to prevent layout shifts when the "Inner" sidebar expands as an overlay.
         On desktop, it grows to w-72 to push the content.
      */}
      <div className={`h-full flex-shrink-0 transition-all duration-300 ${isCollapsed ? 'w-20' : (isMobile ? 'w-20' : 'w-72')}`}>
        
        {/* Inner Container (Actual Sidebar) */}
        <div className={`
            bg-white border-r border-gray-200 flex flex-col h-full transition-all duration-300 z-40
            ${isMobile && !isCollapsed ? 'fixed inset-y-0 left-0 w-72 shadow-2xl' : 'w-full'}
        `}>
          
          {/* Toggle Button */}
          <button 
            onClick={toggleSidebar}
            className="absolute -right-3 top-8 bg-white border border-gray-200 rounded-full p-1.5 shadow-sm hover:shadow-md text-gray-400 hover:text-gray-600 flex z-50 transition-all"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>

          {/* Logo Area */}
          <div className={`h-20 flex items-center ${isCollapsed ? 'justify-center' : 'justify-center lg:justify-start pl-0 lg:pl-6'} border-b border-gray-100/50 relative overflow-hidden`}>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white shadow-sm flex-shrink-0 bg-gray-900 z-10`}>
              <span className="font-bold text-lg tracking-tighter">R</span>
            </div>
            <div className={`ml-3 transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                <h1 className="text-base font-bold text-gray-900 leading-none tracking-tight">ReImagine</h1>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">AI Design Studio</p>
            </div>
          </div>

          {/* Primary Action */}
          <div className={`px-4 py-6 transition-all duration-300 ${isCollapsed ? 'px-2' : ''}`}>
              <button
                onClick={() => {
                    if (isMobile && !isCollapsed) setIsCollapsed(true); // Close drawer on action
                    if (activeView === 'library') {
                        onViewChange('workspace');
                        onReset();
                    } else if (hasImage) {
                        if (window.confirm("Start a new project? Current work is saved.")) {
                            onReset();
                        }
                    }
                }}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-all shadow-sm border border-gray-200 relative overflow-hidden group ${
                    activeView === 'workspace' && !hasImage
                    ? 'bg-gray-900 text-white border-transparent hover:bg-gray-800'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                title="Start a new creative project"
              >
                <Plus size={18} strokeWidth={2.5} />
                <span className={`font-semibold text-sm whitespace-nowrap ${isCollapsed ? 'hidden' : 'block'}`}>New Project</span>
              </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 space-y-1">
            
            <button
                onClick={() => {
                    onViewChange('workspace');
                    if (isMobile && !isCollapsed) setIsCollapsed(true);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                    activeView === 'workspace'
                    ? 'bg-gray-100 text-gray-900 font-semibold' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title="Go to Workspace"
            >
                <Layout size={18} />
                <span className={`text-sm whitespace-nowrap ${isCollapsed ? 'hidden' : 'block'}`}>Canvas</span>
            </button>

            <button
                onClick={() => {
                    onViewChange('library');
                    if (isMobile && !isCollapsed) setIsCollapsed(true);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                    activeView === 'library'
                    ? 'bg-gray-100 text-gray-900 font-semibold' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title="View your saved projects library"
            >
                <LibraryIcon size={18} />
                <span className={`text-sm whitespace-nowrap ${isCollapsed ? 'hidden' : 'block'}`}>Library</span>
            </button>

          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            {userEmail && (
                <div className={`flex items-center gap-3 mb-3 ${isCollapsed ? 'justify-center' : ''}`} title={`Signed in as ${userEmail}`}>
                    <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-xs border border-gray-300 flex-shrink-0">
                        {userEmail.charAt(0).toUpperCase()}
                    </div>
                    <div className={`overflow-hidden ${isCollapsed ? 'hidden' : 'block'}`}>
                        <p className="text-xs font-semibold text-gray-900 truncate w-36">{userEmail}</p>
                        <p className="text-[10px] text-green-600 font-medium">Online</p>
                    </div>
                </div>
            )}

            <button
                onClick={handleSignOut}
                className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-all text-gray-400 hover:text-red-600 hover:bg-red-50 group ${isCollapsed ? 'justify-center' : ''}`}
                title="Sign Out of your account"
            >
                <LogOut size={16} />
                <span className={`text-xs font-medium whitespace-nowrap ${isCollapsed ? 'hidden' : 'block'}`}>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;