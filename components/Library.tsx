
import React from 'react';
import { Trash2, Clock, Layout, Package, ArrowRight } from 'lucide-react';
import { Project } from '../types';

interface LibraryProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onDeleteProject: (id: string, e: React.MouseEvent) => void;
}

const Library: React.FC<LibraryProps> = ({ projects, onSelectProject, onDeleteProject }) => {
  
  if (projects.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Layout size={40} className="opacity-20" />
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Your Library is Empty</h3>
        <p className="max-w-md text-center">Projects you create will automatically appear here. Upload a photo to get started!</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Layout className="text-indigo-600" />
            Your Projects
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project) => {
            const thumbnail = project.generatedImages.length > 0 
                ? project.generatedImages[project.generatedImages.length - 1].url 
                : project.originalImage;
            
            const date = new Date(project.updatedAt).toLocaleDateString(undefined, {
                month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
            });

            return (
              <div 
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 cursor-pointer flex flex-col h-72 relative"
                title={`Open project: ${project.name}`}
              >
                {/* Image Area */}
                <div className="h-40 w-full bg-gray-100 relative overflow-hidden">
                    {thumbnail ? (
                         <img 
                            src={thumbnail} 
                            alt="Project thumbnail" 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                         />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Layout size={32} />
                        </div>
                    )}
                    
                    {/* Mode Badge */}
                    <div className={`absolute top-3 left-3 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md shadow-sm ${project.mode === 'interior' ? 'bg-indigo-600/90' : 'bg-pink-600/90'}`}>
                        {project.mode === 'interior' ? 'Interior' : 'Product'}
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                        <h3 className="font-semibold text-gray-900 truncate mb-1">
                            {project.name || 'Untitled Project'}
                        </h3>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                                <Clock size={12} /> {date}
                            </span>
                            <span className="flex items-center gap-1">
                                {project.generatedImages.length} versions
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                        <button 
                            className="text-indigo-600 text-xs font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Resume this project"
                        >
                            Resume <ArrowRight size={12} />
                        </button>
                        
                        <button
                            onClick={(e) => onDeleteProject(project.id, e)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete Project permanently"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Library;
