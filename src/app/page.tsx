"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Upload, X, Wand2, Loader2, ChevronDown, ImageIcon } from 'lucide-react';
import { GenerationResult, GenerationState } from './types';

const MOCK_IMAGES = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop'
];

const STYLE_OPTIONS_MINI = [
  { value: 'editorial', label: 'Editorial', emoji: '📰' },
  { value: 'streetwear', label: 'Streetwear', emoji: '🎨' },
  { value: 'vintage', label: 'Vintage', emoji: '📸' },
  { value: 'minimalist', label: 'Minimalist', emoji: '✨' },
  { value: 'cyberpunk', label: 'Cyberpunk', emoji: '🌃' },
  { value: 'watercolor', label: 'Watercolor', emoji: '🖌️' }
];

// Animation Components
interface AnimationProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const FadeInUp: React.FC<AnimationProps> = ({ children, delay = 0, className = "" }) => {
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

const ScaleIn: React.FC<AnimationProps> = ({ children, delay = 0, className = "" }) => {
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
const Navigation: React.FC = () => (
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

// All-in-One Chat Interface Component
interface ChatInterfaceProps {
  onGenerate: (data: { prompt: string; image: string; style: string }) => void;
  isGenerating: boolean;
  generationState: GenerationState;
  onAbort: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onGenerate, isGenerating, generationState, onAbort }) => {
  const [prompt, setPrompt] = useState('');
  const [uploadedImage, setUploadedImage] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('editorial');
  const [showStyleSelector, setShowStyleSelector] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && uploadedImage) {
      onGenerate({
        prompt: prompt.trim(),
        image: uploadedImage,
        style: selectedStyle
      });
    }
  };

  const handleFileUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    if (imageFile) handleFileUpload(imageFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const canGenerate = prompt.trim() && uploadedImage && !isGenerating;

  return (
    <ScaleIn delay={400}>
      <div className="w-full max-w-5xl mx-auto px-4">
        <div
          className={`relative backdrop-blur-xl bg-black/30 border-2 rounded-3xl p-6 shadow-2xl transition-all duration-300 ${dragActive ? 'border-orange-500 bg-orange-500/10 scale-[1.02]' : 'border-white/20 hover:border-white/30'
            }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {/* Image Upload Section */}
          {uploadedImage && (
            <div className="mb-4 relative group">
              <img
                src={uploadedImage}
                alt="Uploaded preview"
                className="h-32 w-32 object-cover rounded-xl shadow-lg mx-auto"
              />
              <button
                onClick={() => setUploadedImage('')}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-xs transition-colors opacity-0 group-hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
            className="hidden"
          />

          {/* Main Textarea */}
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={uploadedImage
                ? "Describe how you want to transform your image..."
                : "Upload an image and describe your vision..."}
              className="w-full bg-transparent text-white placeholder-white/60 resize-none outline-none text-lg min-h-[80px] max-h-[200px]"
              rows={4}
              maxLength={500}
            />

            {/* Image Upload Button (when no image) */}
            {!uploadedImage && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute top-3 right-3 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors group"
                title="Upload Image"
              >
                <ImageIcon className="w-5 h-5 text-white/70 group-hover:text-white" />
              </button>
            )}
          </div>

          {/* Generation Status */}
          {generationState.isLoading && (
            <div className="mb-4 p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="animate-spin">
                  <Loader2 className="w-5 h-5 text-orange-400" />
                </div>
                <div className="flex-1">
                  <p className="text-orange-400 font-medium">Generating Your Masterpiece...</p>
                  {generationState.retryCount > 0 && (
                    <p className="text-orange-300 text-sm">Retrying... ({generationState.retryCount}/3)</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {generationState.error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-red-400 font-medium">Generation Failed</p>
              <p className="text-red-300 text-sm">{generationState.error}</p>
            </div>
          )}

          {/* Bottom Controls */}
          <div className="flex items-center justify-between">
            {/* Style Selector */}
            <div className="mt-4 mb-4">
              <button
                onClick={() => setShowStyleSelector(!showStyleSelector)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
              >
                <span className="text-lg">
                  {STYLE_OPTIONS_MINI.find(s => s.value === selectedStyle)?.emoji}
                </span>
                <span>{STYLE_OPTIONS_MINI.find(s => s.value === selectedStyle)?.label} Style</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showStyleSelector ? 'rotate-180' : ''}`} />
              </button>

              {showStyleSelector && (
                <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2 p-4 bg-black/20 rounded-xl border border-white/10">
                  {STYLE_OPTIONS_MINI.map((style) => (
                    <button
                      key={style.value}
                      onClick={() => {
                        setSelectedStyle(style.value);
                        setShowStyleSelector(false);
                      }}
                      className={`p-3 rounded-lg text-sm transition-all duration-200 ${selectedStyle === style.value
                        ? 'bg-orange-500 text-white scale-105'
                        : 'bg-white/10 hover:bg-white/20 text-white/80 hover:text-white'
                        }`}
                    >
                      <div className="text-lg mb-1">{style.emoji}</div>
                      {style.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-white/60 text-sm">
                {500 - prompt.length} left
              </span>

              {isGenerating ? (
                <button
                  onClick={onAbort}
                  className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!canGenerate}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-3 ${canGenerate
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white hover:scale-105 shadow-lg'
                    : 'bg-white/10 text-white/50 cursor-not-allowed'
                    }`}
                >
                  <Wand2 className="w-5 h-5" />
                  <span>Generate</span>
                </button>
              )}
            </div>
          </div>

          {/* Help Text */}
          {!canGenerate && !isGenerating && (
            <div className="mt-4 text-center text-white/50 text-sm">
              {!uploadedImage && !prompt.trim() && "Upload an image and describe your vision to get started"}
              {!uploadedImage && prompt.trim() && "Please upload an image to continue"}
              {uploadedImage && !prompt.trim() && "Describe how you want to transform your image"}
            </div>
          )}
        </div>
      </div>
    </ScaleIn>
  );
};

// Custom hooks - Remove localStorage and use in-memory storage
const useInMemoryHistory = (maxItems = 5) => {
  const [storedValue, setStoredValue] = useState<GenerationResult[]>([]);

  const setValue = (value: GenerationResult[] | ((prev: GenerationResult[]) => GenerationResult[])) => {
    const valueToStore = typeof value === 'function' ? value(storedValue) : value;
    const limitedValue = valueToStore.slice(0, maxItems);
    setStoredValue(limitedValue);
  };

  return [storedValue, setValue] as const;
};

// Generation API
const mockGenerateAPI = async (imageUrl: string, prompt: string, style: string, retryCount = 0): Promise<GenerationResult> => {
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
const LovableAIStudio: React.FC = () => {
  const [generationState, setGenerationState] = useState<GenerationState>({
    isLoading: false,
    isAborted: false,
    retryCount: 0,
    error: null
  });
  const [selectedResult, setSelectedResult] = useState<GenerationResult | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const [history, setHistory] = useInMemoryHistory(5);

  const handleGenerate = async (data: { prompt: string; image: string; style: string }) => {
    abortControllerRef.current = new AbortController();
    setGenerationState({
      isLoading: true,
      isAborted: false,
      retryCount: 0,
      error: null
    });

    let currentRetry = 0;
    const maxRetries = 3;

    const attemptGeneration = async (): Promise<void> => {
      try {
        const result = await mockGenerateAPI(data.image, data.prompt, data.style, currentRetry);

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
          {/* Landing Page with All-in-One Interface */}
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
                Upload an image, describe your vision, and watch AI transform it into something extraordinary
              </p>
            </FadeInUp>
          </div>

          <ChatInterface
            onGenerate={handleGenerate}
            isGenerating={generationState.isLoading}
            generationState={generationState}
            onAbort={handleAbort}
          />

          {/* Results Section */}
          {selectedResult && (
            <div className="mt-16 max-w-4xl mx-auto">
              <FadeInUp delay={300}>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">Your Creation</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-black/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Original</h3>
                      <img
                        src={selectedResult.originalImageUrl}
                        alt="Original"
                        className="w-full aspect-square object-cover rounded-xl shadow-lg"
                      />
                    </div>
                    <div className="bg-black/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Generated</h3>
                      <img
                        src={selectedResult.imageUrl}
                        alt="Generated"
                        className="w-full aspect-square object-cover rounded-xl shadow-lg"
                      />
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
                    <p className="text-white/80 italic">"{selectedResult.prompt}"</p>
                    <div className="flex items-center justify-center gap-4 mt-2">
                      <span className="text-purple-400 text-sm">Style: {selectedResult.style}</span>
                      <span className="text-white/60 text-sm">
                        {new Date(selectedResult.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              </FadeInUp>
            </div>
          )}

          {/* History Grid */}
          {history.length > 0 && (
            <div className="mt-16">
              <FadeInUp delay={600}>
                <h2 className="text-2xl font-bold text-white mb-8 text-center">Recent Creations</h2>
              </FadeInUp>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {history.slice(0, 6).map((item, index) => (
                  <FadeInUp key={item.id} delay={index * 100}>
                    <div
                      onClick={() => setSelectedResult(item)}
                      className={`group backdrop-blur-xl bg-black/20 border border-white/20 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:bg-black/30 hover:scale-105 hover:border-white/30 ${selectedResult?.id === item.id ? 'ring-2 ring-orange-500 bg-black/40' : ''
                        }`}
                    >
                      <div className="aspect-square bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl overflow-hidden mb-4 shadow-inner">
                        <img
                          src={item.imageUrl}
                          alt="Generated artwork"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <p className="text-white font-medium truncate">
                          {item.prompt.substring(0, 60)}{item.prompt.length > 60 ? '...' : ''}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-orange-400 text-sm font-medium capitalize">
                            {item.style}
                          </span>
                          <span className="text-white/60 text-sm">
                            {new Date(item.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </FadeInUp>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default LovableAIStudio;