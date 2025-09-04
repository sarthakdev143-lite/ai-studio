"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  Loader2
} from 'lucide-react';

// Import components (these would be separate files in a real project)
import UploadSection from '@/components/UploadSection';
import PromptSection from '@/components/PromptSection';
import StyleSection from '@/components/StyleSection';
import PreviewSection from '@/components/PreviewSection';
import GenerateSection from '@/components/GenerateSection';
import History from '@/components/History';

// Types
interface GenerationResult {
  id: string;
  imageUrl: string;
  originalImageUrl: string;
  prompt: string;
  style: string;
  createdAt: number;
}

interface GenerationState {
  isLoading: boolean;
  isAborted: boolean;
  retryCount: number;
  error: string | null;
}

const MOCK_IMAGES = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop'
];

// Animatio@ Components
const FadeInUp = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-700 ease-out ${isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
        } ${className}`}
    >
      {children}
    </div>
  );
};

const ScaleIn = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-500 ease-out ${isVisible
          ? 'opacity-100 scale-100'
          : 'opacity-0 scale-95'
        } ${className}`}
    >
      {children}
    </div>
  );
};

// Navigation Component
const Navigation = () => (
  <nav className="w-full px-6 py-4 flex items-center justify-between backdrop-blur-lg bg-black/20 border-b border-white/10">
    <FadeInUp>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="text-white text-xl font-bold">AI Studio</span>
      </div>
    </FadeInUp>

    <FadeInUp delay={100}>
      <div className="hidden md:flex items-center gap-8 text-white/80">
        <a href="#" className="hover:text-white transition-colors">Community</a>
        <a href="#" className="hover:text-white transition-colors">Pricing</a>
        <a href="#" className="hover:text-white transition-colors">Enterprise</a>
        <a href="#" className="hover:text-white transition-colors">Learn</a>
        <a href="#" className="hover:text-white transition-colors">Launched</a>
      </div>
    </FadeInUp>

    <FadeInUp delay={200}>
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center text-white text-sm font-bold">
            M
          </div>
        </button>
        <span className="text-white/80 hidden md:block">My Studio</span>
      </div>
    </FadeInUp>
  </nav>
);

// Chat Interface Component
const ChatInterface = ({ onPromptSubmit }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      onPromptSubmit(prompt.trim());
      setPrompt('');
    }
  };

  return (
    <ScaleIn delay={400}>
      <div className="w-full max-w-4xl mx-auto px-4">
        <form onSubmit={handleSubmit} className="relative">
          <div className="backdrop-blur-xl bg-black/30 border border-white/20 rounded-2xl p-4 shadow-2xl">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask AI Studio to create amazing image transformations..."
              className="w-full bg-transparent text-white placeholder-white/60 resize-none outline-none text-lg min-h-[60px] max-h-[200px]"
              rows={3}
              maxLength={500}
            />

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <span className="text-white/60 text-sm">
                  Ready to create something amazing?
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-white/60 text-sm">
                  {500 - prompt.length} left
                </span>
                <button
                  type="submit"
                  disabled={!prompt.trim()}
                  className="p-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </ScaleIn>
  );
};

// Workspace Section Component
const WorkspaceSection = ({ title, children }) => (
  <div className="mb-8">
    <FadeInUp>
      <div className="backdrop-blur-xl bg-black/20 border-b border-white/10 p-6 rounded-t-2xl">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>
    </FadeInUp>
    <div className="backdrop-blur-xl bg-black/10 border border-white/10 border-t-0 rounded-b-2xl p-6">
      {children}
    </div>
  </div>
);

// Custom hooks
const useLocalStorage = (key, initialValue, maxItems = 5) => {
  const [storedValue, setStoredValue] = useState(initialValue);

  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        const parsedItem = JSON.parse(item);
        setStoredValue(parsedItem.slice(0, maxItems));
      }
    } catch (error) {
      console.error(`Failed to load ${key} from localStorage:`, error);
    }
  }, [key, maxItems]);

  const setValue = (value) => {
    try {
      const valueToStore = typeof value === 'function' ? value(storedValue) : value;
      const limitedValue = Array.isArray(valueToStore)
        ? valueToStore.slice(0, maxItems)
        : valueToStore;

      setStoredValue(limitedValue);
      localStorage.setItem(key, JSON.stringify(limitedValue));
    } catch (error) {
      console.error(`Failed to save ${key} to localStorage:`, error);
    }
  };

  return [storedValue, setValue];
};

// Generation API
const mockGenerateAPI = async (imageUrl, prompt, style, retryCount = 0) => {
  return new Promise((resolve, reject) => {
    const delay = Math.min(1000 + (retryCount * 500), 3000);

    setTimeout(() => {
      const shouldFail = Math.random() < 0.2;

      if (shouldFail && retryCount < 3) {
        reject(new Error('Model overloaded'));
      } else if (shouldFail) {
        reject(new Error('Maximum retries exceeded'));
      } else {
        const randomImage = MOCK_IMAGES[Math.floor(Math.random() * MOCK_IMAGES.length)];
        resolve({
          id: Date.now().toString(),
          imageUrl: randomImage,
          originalImageUrl: imageUrl,
          prompt,
          style,
          createdAt: Date.now()
        });
      }
    }, delay);
  });
};

// Main App Component
const LovableAIStudio = () => {
  const [uploadedImage, setUploadedImage] = useState('');
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('editorial');
  const [generationState, setGenerationState] = useState({
    isLoading: false,
    isAborted: false,
    retryCount: 0,
    error: null
  });
  const [selectedResult, setSelectedResult] = useState(null);
  const [showWorkspace, setShowWorkspace] = useState(false);

  const abortControllerRef = useRef(null);
  const [history, setHistory] = useLocalStorage('ai-studio-history', [], 5);

  const handlePromptSubmit = async (promptText) => {
    setPrompt(promptText);
    setShowWorkspace(true);

    if (!uploadedImage) {
      // In a real app, you'd show an upload modal here
      setGenerationState({
        isLoading: false,
        isAborted: false,
        retryCount: 0,
        error: 'Please upload an image first'
      });
      return;
    }

    await handleGenerate(promptText);
  };

  const handleGenerate = async (promptText = prompt) => {
    if (!uploadedImage || !promptText.trim()) return;

    abortControllerRef.current = new AbortController();
    setGenerationState({
      isLoading: true,
      isAborted: false,
      retryCount: 0,
      error: null
    });

    let currentRetry = 0;
    const maxRetries = 3;

    const attemptGeneration = async () => {
      try {
        const result = await mockGenerateAPI(uploadedImage, promptText, selectedStyle, currentRetry);

        if (!abortControllerRef.current?.signal.aborted) {
          const newHistory = [result, ...history];
          setHistory(newHistory);
          setSelectedResult(result);
          setGenerationState({
            isLoading: false,
            isAborted: false,
            retryCount: 0,
            error: null
          });
        }
      } catch (error) {
        if (abortControllerRef.current?.signal.aborted) {
          setGenerationState(prev => ({ ...prev, isLoading: false, isAborted: true }));
          return;
        }

        if (error instanceof Error && error.message === 'Model overloaded' && currentRetry < maxRetries) {
          currentRetry++;
          setGenerationState(prev => ({
            ...prev,
            retryCount: currentRetry,
            error: `Model overloaded, retrying... (${currentRetry}/${maxRetries})`
          }));
          return attemptGeneration();
        }

        setGenerationState({
          isLoading: false,
          isAborted: false,
          retryCount: currentRetry,
          error: error instanceof Error ? error.message : 'Generation failed'
        });
      }
    };

    await attemptGeneration();
  };

  const handleAbort = () => {
    abortControllerRef.current?.abort();
    setGenerationState(prev => ({ ...prev, isLoading: false, isAborted: true }));
  };

  const loadHistoryItem = (item) => {
    setUploadedImage(item.originalImageUrl);
    setPrompt(item.prompt);
    setSelectedStyle(item.style);
    setSelectedResult(item);
  };

  const canGenerate = Boolean(uploadedImage) && Boolean(prompt.trim()) && !generationState.isLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/30 rounded-full filter blur-3xl opacity-70 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/30 rounded-full filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-conic from-orange-500/10 via-pink-500/10 to-purple-500/10 rounded-full filter blur-3xl opacity-50" />

      <div className="relative z-10">
        <Navigation />

        <main className="container mx-auto px-6 py-16">
          {!showWorkspace ? (
            // Landing Page
            <>
              <div className="text-center mb-16 max-w-4xl mx-auto">
                <FadeInUp>
                  <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
                    Build something{' '}
                    <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                      Amazing
                    </span>
                  </h1>
                </FadeInUp>

                <FadeInUp delay={200}>
                  <p className="text-xl md:text-2xl text-white/70 mb-12">
                    Create stunning AI-powered image transformations by chatting with our advanced AI
                  </p>
                </FadeInUp>
              </div>

              <ChatInterface onPromptSubmit={handlePromptSubmit} />

              {history.length > 0 && (
                <div className="mt-16">
                  <FadeInUp delay={600}>
                    <h2 className="text-2xl font-bold text-white mb-8 text-center">Recent Creations</h2>
                  </FadeInUp>
                  <History
                    history={history.slice(0, 6)}
                    selectedHistoryItem={selectedResult}
                    onLoadHistoryItem={(item) => {
                      setSelectedResult(item);
                      setShowWorkspace(true);
                    }}
                    isGridView={true}
                  />
                </div>
              )}
            </>
          ) : (
            // Workspace View
            <>
              <div className="flex items-center justify-between mb-8">
                <FadeInUp>
                  <button
                    onClick={() => setShowWorkspace(false)}
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                  >
                    ← Back to Studio
                  </button>
                </FadeInUp>

                {generationState.isLoading && (
                  <FadeInUp>
                    <button
                      onClick={handleAbort}
                      className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors flex items-center gap-2"
                    >
                      <X className="w-5 h-5" />
                      Cancel Generation
                    </button>
                  </FadeInUp>
                )}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                <div className="xl:col-span-3 space-y-8">
                  <UploadSection
                    uploadedImage={uploadedImage}
                    onImageUpload={setUploadedImage}
                  />

                  <PromptSection
                    prompt={prompt}
                    onPromptChange={setPrompt}
                  />

                  <StyleSection
                    selectedStyle={selectedStyle}
                    onStyleChange={setSelectedStyle}
                  />

                  <PreviewSection
                    uploadedImage={uploadedImage}
                    prompt={prompt}
                    selectedStyle={selectedStyle}
                    selectedHistoryItem={selectedResult}
                  />

                  <GenerateSection
                    canGenerate={canGenerate}
                    generationState={generationState}
                    onGenerate={() => handleGenerate()}
                    onAbort={handleAbort}
                  />
                </div>

                <History
                  history={history}
                  selectedHistoryItem={selectedResult}
                  onLoadHistoryItem={loadHistoryItem}
                  isGridView={false}
                />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default LovableAIStudio;