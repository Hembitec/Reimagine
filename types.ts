
export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: number;
  type: 'text' | 'image_generation_result';
}

export interface GeneratedImage {
  id: string;
  url: string; // Base64 data URL
  prompt: string;
  styleName: string;
  timestamp: number;
}

export type AppMode = 'interior' | 'product' | 'asset';
export type AppView = 'workspace' | 'library';

export interface SuggestedStyle {
  id: string;
  label: string;
  description: string;
  prompt: string;
  color: string;
}

export interface Project {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  mode: AppMode;
  originalImage: string | null; // The user's product, room, or logo
  referenceImage?: string | null; // The competitor's "style" image (Optional)
  generatedImages: GeneratedImage[];
  chatMessages: ChatMessage[];
  suggestedStyles: SuggestedStyle[];
  imageCount: number;
  userPrompt?: string; // The initial user description/vision
}

export enum DesignStyle {
  Modern = 'Modern',
  Scandinavian = 'Scandinavian',
  Industrial = 'Industrial',
  Bohemian = 'Bohemian',
  MidCenturyModern = 'Mid-Century Modern',
  Minimalist = 'Minimalist',
  Farmhouse = 'Farmhouse',
  ArtDeco = 'Art Deco'
}

export type LoadingState = 'idle' | 'generating_image' | 'chatting' | 'analyzing';
