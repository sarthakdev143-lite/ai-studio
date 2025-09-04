"use client";

import React, { useState, useRef, useCallback } from 'react';
import { Upload, Wand2, X, Clock, ImageIcon, Loader2 } from 'lucide-react';

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

const STYLE_OPTIONS = [
  { value: 'editorial', label: 'Editorial' },
  { value: 'streetwear', label: 'Streetwear' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'cyberpunk', label: 'Cyberpunk' },
  { value: 'watercolor', label: 'Watercolor' }
];

const MOCK_IMAGES = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop'
];

const AIDesignTool: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>('editorial');
  const [generationState, setGenerationState] = useState<GenerationState>({
    isLoading: false,
    isAborted: false,
    retryCount: 0,
    error: null
  });
  const [history, setHistory] = useState<GenerationResult[]>([]);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<GenerationResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const saveToHistory = useCallback((result: GenerationResult) => {
    setHistory(prev => [result, ...prev.slice(0, 4)]);
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setSelectedHistoryItem(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const mockGenerateAPI = async (
    imageUrl: string,
    prompt: string,
    style: string,
    retryCount: number = 0
  ): Promise<GenerationResult> => {
    return new Promise((resolve, reject) => {
      const delay = Math.min(1000 + (retryCount * 500), 3000);

      setTimeout(() => {
        if (abortControllerRef.current?.signal.aborted) {
          reject(new Error('Generation aborted'));
          return;
        }

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

  const handleGenerate = async () => {
    if (!uploadedImage || !prompt.trim()) return;

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
        const result = await mockGenerateAPI(uploadedImage, prompt, selectedStyle, currentRetry);

        if (!abortControllerRef.current?.signal.aborted) {
          saveToHistory(result);
          setSelectedHistoryItem(result);
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

  const loadHistoryItem = (item: GenerationResult) => {
    setUploadedImage(item.originalImageUrl);
    setPrompt(item.prompt);
    setSelectedStyle(item.style);
    setSelectedHistoryItem(item);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const canGenerate = uploadedImage && prompt.trim() && !generationState.isLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            AI Design Studio
          </h1>
          <p className="text-xl text-gray-600">Transform your images with AI-powered creativity</p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3 space-y-8">
            {/* Upload Section */}
            <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Upload className="w-6 h-6 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">Upload Image</h2>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                aria-label="Upload image file"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-64 border-3 border-dashed border-indigo-200 rounded-2xl hover:border-indigo-400 hover:bg-indigo-50/50 transition-all duration-300 flex flex-col items-center justify-center gap-4 focus:outline-none focus:ring-4 focus:ring-indigo-200 group"
                aria-label="Click to upload image"
              >
                {uploadedImage ? (
                  <img
                    src={uploadedImage}
                    alt="Uploaded preview"
                    className="max-h-56 max-w-full object-contain rounded-xl shadow-lg"
                  />
                ) : (
                  <>
                    <div className="p-6 bg-indigo-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                      <ImageIcon className="w-16 h-16 text-indigo-600" />
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-semibold text-gray-700 mb-2">Drop your image here</p>
                      <p className="text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </>
                )}
              </button>
            </section>

            {/* Prompt Section */}
            <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Wand2 className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">Describe Your Vision</h2>
              </div>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe how you want to transform your image... (e.g., make it futuristic with neon lights, add a vintage film aesthetic, create a minimalist composition)"
                className="w-full h-40 p-6 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300 text-lg"
                aria-label="Enter your transformation prompt"
              />
              <div className="mt-3 text-right">
                <span className="text-sm text-gray-500">{prompt.length}/500</span>
              </div>
            </section>

            {/* Style Selection */}
            <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-md" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">Choose Style</h2>
              </div>

              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-400 transition-all duration-300 text-lg font-medium bg-white"
                aria-label="Select transformation style"
              >
                {STYLE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </section>

            {/* Preview Section */}
            <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Preview</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-700">Original</h3>
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-inner">
                    {uploadedImage ? (
                      <img src={uploadedImage} alt="Original" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-24 h-24 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-700">Generated</h3>
                  <div className="aspect-square bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl overflow-hidden shadow-inner">
                    {selectedHistoryItem ? (
                      <img src={selectedHistoryItem.imageUrl} alt="Generated" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
                        <div className="p-6 bg-white rounded-2xl shadow-lg mb-4">
                          <Wand2 className="w-16 h-16 text-indigo-500" />
                        </div>
                        <p className="text-gray-600 text-lg">Your AI creation will appear here</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {(prompt || selectedStyle) && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-indigo-700 mb-2">Prompt</h4>
                      <p className="text-gray-700">{prompt || 'No prompt entered'}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-700 mb-2">Style</h4>
                      <p className="text-gray-700">
                        {STYLE_OPTIONS.find(s => s.value === selectedStyle)?.label}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Generate Section */}
            <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="flex gap-4">
                <button
                  onClick={handleGenerate}
                  disabled={!canGenerate}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-6 px-8 rounded-xl font-semibold text-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-indigo-200 flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100"
                  aria-label="Generate AI transformation"
                >
                  {generationState.isLoading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Generating Magic...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-6 h-6" />
                      Generate
                    </>
                  )}
                </button>

                {generationState.isLoading && (
                  <button
                    onClick={handleAbort}
                    className="px-8 py-6 bg-red-500 text-white rounded-xl hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-200 flex items-center gap-3 transition-all duration-300 font-semibold"
                    aria-label="Abort generation"
                  >
                    <X className="w-6 h-6" />
                    Abort
                  </button>
                )}
              </div>

              {generationState.error && (
                <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                  <p className="text-red-700 font-medium">{generationState.error}</p>
                </div>
              )}

              {generationState.isAborted && (
                <div className="mt-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                  <p className="text-amber-700 font-medium">Generation was aborted</p>
                </div>
              )}

              {generationState.retryCount > 0 && generationState.isLoading && (
                <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                  <p className="text-blue-700 font-medium">
                    Retrying generation... ({generationState.retryCount}/3)
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* History Sidebar */}
          <aside className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">History</h2>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-6 bg-gray-100 rounded-2xl mb-6 mx-auto w-fit">
                  <Clock className="w-16 h-16 text-gray-400 mx-auto" />
                </div>
                <p className="text-gray-600 font-medium mb-2">No generations yet</p>
                <p className="text-sm text-gray-500">Your creations will appear here</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => loadHistoryItem(item)}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left focus:outline-none focus:ring-4 focus:ring-indigo-200 ${selectedHistoryItem?.id === item.id
                        ? 'border-indigo-300 bg-indigo-50 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    aria-label={`Load generation: ${item.prompt.substring(0, 50)}`}
                  >
                    <div className="flex gap-4">
                      <img
                        src={item.imageUrl}
                        alt="Generation thumbnail"
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0 shadow-md"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate mb-1">
                          {item.prompt.substring(0, 45)}{item.prompt.length > 45 ? '...' : ''}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-indigo-600 font-medium capitalize">
                            {STYLE_OPTIONS.find(s => s.value === item.style)?.label}
                          </span>
                          <span className="text-gray-500">
                            {formatTime(item.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default AIDesignTool;