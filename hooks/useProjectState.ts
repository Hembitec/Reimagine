
import { useState, useCallback } from 'react';
import { Project, AppMode, GeneratedImage, ChatMessage, SuggestedStyle } from '../types';
import { saveProjectToCloud, deleteProjectFromCloud } from '../services/neon';

export const useProjectState = (user: any) => {
    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const initNewProject = useCallback((mode: AppMode) => {
        const newProject: Project = {
            id: `proj_${Date.now()}`,
            name: 'Untitled Project',
            createdAt: Date.now(),
            updatedAt: Date.now(),
            mode,
            originalImage: null,
            generatedImages: [],
            chatMessages: [],
            suggestedStyles: [],
            imageCount: 1
        };
        setProject(newProject);
    }, []);

    const updateProject = useCallback((updates: Partial<Project>) => {
        setProject(prev => prev ? { ...prev, ...updates, updatedAt: Date.now() } : null);
    }, []);

    const addGeneratedImages = useCallback((images: GeneratedImage[]) => {
        setProject(prev => {
            if (!prev) return null;
            return {
                ...prev,
                generatedImages: [...prev.generatedImages, ...images],
                updatedAt: Date.now()
            };
        });
    }, []);

    const saveProject = useCallback(async () => {
        if (!project || !user || !project.originalImage) return;
        setIsSaving(true);
        try {
            await saveProjectToCloud(project, user.uid, user.email || '');
        } catch (error) {
            console.error("Save failed", error);
        } finally {
            setIsSaving(false);
        }
    }, [project, user]);

    return {
        project,
        setProject,
        initNewProject,
        updateProject,
        addGeneratedImages,
        saveProject,
        isSaving,
        isLoading,
        setIsLoading
    };
};
