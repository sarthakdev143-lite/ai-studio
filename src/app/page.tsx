"use client";

import React, { useState, useRef } from 'react';
import { GenerationResult, GenerationState } from '@/types';
import { useLocalStorageHistory } from "@/hooks/useLocalStorageHistory";
import Footer from '@/components/Footer';
import { MOCK_IMAGES } from '@/const';
import Navigation from '@/components/Navigation';
import FadeInUp from '@/components/animations/FadeInUp';
import ChatInterface from '@/components/ChatInterface';
import GenerationResultDisplay from '@/components/GenerationResultDisplay';
import HistoryItem from '@/components/HistoryItem';

// Generation API
const mockGenerateAPI = async (imageUrl: string, prompt: string, style: string, retryCount = 0): Promise<GenerationResult> => {
  return new Promise((resolve, reject) => {
    const delay = Math.min(1000 * Math.pow(2, retryCount), 8000);

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
const AIStudio: React.FC = () => {
  const [generationState, setGenerationState] = useState<GenerationState>({ isLoading: false, isAborted: false, retryCount: 0, error: null });
  const [selectedResult, setSelectedResult] = useState<GenerationResult | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const { history, addToHistory } = useLocalStorageHistory("ai-history", 5);

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
          addToHistory(result);
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
          <section
            id="history-section"
            className="scroll-mt-32"
            role="region"
            aria-labelledby="history-heading"
          >
            {selectedResult && (
              <GenerationResultDisplay result={selectedResult} />
            )}

            {/* History Grid */}
            {history.length > 0 && (
              <div className="mt-16">
                <FadeInUp delay={600}>
                  <h2 id="history-heading" className="text-2xl font-bold text-white mb-8 text-center">Recent Creations</h2>
                </FadeInUp>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {history.slice(0, 6).map((item, _index) => (
                    <HistoryItem
                      key={item.id}
                      item={item}
                      isSelected={selectedResult?.id === item.id}
                      onClick={() => setSelectedResult(item)}
                    />
                  ))}
                </div>
              </div>
            )}
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AIStudio;