
import React, { useState } from 'react';
import { Layout, Library as LibraryIcon, Plus, LogOut, PanelLeftClose, PanelLeftOpen, User as UserIcon, Settings, Package, PenTool } from 'lucide-react';
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
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeMode, 
  activeView, 
  onModeChange, 
  onViewChange, 
  onReset, 
  hasImage, 
  userEmail,
  isMobileOpen,
  onMobileClose
}) => {
  // Desktop collapse state
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  const toggleDesktopSidebar = () => setIsDesktopCollapsed(!isDesktopCollapsed);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
            isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onMobileClose}
      />

      {/* 
         Sidebar Container
      */}
      <aside 
        className={`
            bg-white border-r border-gray-200 flex flex-col h-full z-50 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]
            fixed inset-y-0 left-0 lg:relative
            ${isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0 lg:shadow-none'}
            ${isDesktopCollapsed ? 'lg:w-20' : 'lg:w-72'}
            w-72
        `}
      >
          {/* Logo Area */}
          <div className={`h-16 flex items-center ${isDesktopCollapsed ? 'lg:justify-center' : 'px-6'} border-b border-gray-200 transition-all`}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-900 text-white shadow-sm flex-shrink-0">
              <span className="font-bold text-lg tracking-tighter">R</span>
            </div>
            <div className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-300 ${isDesktopCollapsed ? 'lg:w-0 lg:opacity-0' : 'w-auto opacity-100'}`}>
                <h1 className="text-base font-bold text-gray-900 leading-none tracking-tight">ReImagine</h1>
            </div>
          </div>

          {/* Primary Action (New Project) */}
          <div className={`p-4 transition-all duration-300 ${isDesktopCollapsed ? 'lg:px-3' : ''}`}>
              <button
                onClick={() => {
                    onMobileClose(); // Close drawer on action
                    if (activeView === 'library') {
                        onViewChange('workspace');
                        onReset();
                    } else if (hasImage) {
                        if (window.confirm("Start a new project? Current work is saved.")) {
                            onReset();
                        }
                    }
                }}
                className={`w-full flex items-center justify-center gap-3 py-3 rounded-xl transition-all shadow-sm border relative overflow-hidden group ${
                    activeView === 'workspace' && !hasImage
                    ? 'bg-gray-900 text-white border-transparent hover:bg-gray-800 shadow-gray-900/10'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
                title="Start a new creative project"
              >
                <Plus size={20} strokeWidth={2} />
                <span className={`font-semibold text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${isDesktopCollapsed ? 'lg:w-0 lg:opacity-0' : 'w-auto opacity-100'}`}>
                    New Project
                </span>
              </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 space-y-1 overflow-y-auto py-2">
            
            <button
                onClick={() => {
                    onViewChange('workspace');
                    onMobileClose();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                    activeView === 'workspace'
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                } ${isDesktopCollapsed ? 'lg:justify-center' : ''}`}
                title="Go to Workspace"
            >
                <Layout size={20} strokeWidth={1.5} className={activeView === 'workspace' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'} />
                <span className={`text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${isDesktopCollapsed ? 'lg:w-0 lg:opacity-0' : 'w-auto opacity-100'}`}>Canvas</span>
            </button>

            <button
                onClick={() => {
                    onViewChange('library');
                    onMobileClose();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                    activeView === 'library'
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                } ${isDesktopCollapsed ? 'lg:justify-center' : ''}`}
                title="View your saved projects library"
            >
                <LibraryIcon size={20} strokeWidth={1.5} className={activeView === 'library' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'} />
                <span className={`text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${isDesktopCollapsed ? 'lg:w-0 lg:opacity-0' : 'w-auto opacity-100'}`}>Library</span>
            </button>

          </nav>

          {/* Footer Area */}
          <div className="p-3 border-t border-gray-200 bg-white">
            
            {/* Desktop Collapse Toggle */}
            <button
                onClick={toggleDesktopSidebar}
                className={`w-full hidden lg:flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors mb-2 ${isDesktopCollapsed ? 'justify-center' : ''}`}
                title={isDesktopCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
                {isDesktopCollapsed ? <PanelLeftOpen size={18} strokeWidth={1.5} /> : <PanelLeftClose size={18} strokeWidth={1.5} />}
                <span className={`text-xs font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${isDesktopCollapsed ? 'lg:w-0 lg:opacity-0' : 'w-auto opacity-100'}`}>Collapse</span>
            </button>

            {/* User Profile */}
            {userEmail && (
                <div className={`flex items-center gap-3 px-2 py-2 mb-2 rounded-lg bg-gray-50/50 border border-transparent ${isDesktopCollapsed ? 'lg:justify-center' : ''}`} title={`Signed in as ${userEmail}`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 text-white flex items-center justify-center font-bold text-xs border border-gray-200 shadow-sm flex-shrink-0">
                        {userEmail.charAt(0).toUpperCase()}
                    </div>
                    <div className={`overflow-hidden transition-all duration-300 ${isDesktopCollapsed ? 'lg:w-0 lg:opacity-0 lg:hidden' : 'w-auto opacity-100 block'}`}>
                        <p className="text-xs font-semibold text-gray-900 truncate w-32">{userEmail.split('@')[0]}</p>
                        <p className="text-xs text-gray-400 truncate w-32">{userEmail}</p>
                    </div>
                </div>
            )}

            <button
                onClick={handleSignOut}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-gray-500 hover:text-red-600 hover:bg-red-50 group ${isDesktopCollapsed ? 'lg:justify-center' : ''}`}
                title="Sign Out of your account"
            >
                <LogOut size={18} strokeWidth={1.5} />
                <span className={`text-xs font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${isDesktopCollapsed ? 'lg:w-0 lg:opacity-0' : 'w-auto opacity-100'}`}>Sign Out</span>
            </button>
          </div>
      </aside>
    </>
  );
};

export default Sidebar;
