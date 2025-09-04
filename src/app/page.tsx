"use client";

import React, { useState, useRef, useCallback } from 'react';
import { GenerationState, GenerationResult } from './types';
import GenerateSection from '@/components/GenerateSection';
import PreviewSection from '@/components/PreviewSection';
import PromptSection from '@/components/PromptSection';
import StyleSection from '@/components/StyleSection';
import UploadSection from '@/components/UploadSection';
import History from '@/components/History';

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
  const [generationState, setGenerationState] = useState<GenerationState>({ isLoading: false, isAborted: false, retryCount: 0, error: null });
  const [history, setHistory] = useState<GenerationResult[]>([]);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<GenerationResult | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const saveToHistory = useCallback((result: GenerationResult) => {
    setHistory(prev => [result, ...prev.slice(0, 4)]);
  }, []);

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl);
    setSelectedHistoryItem(null);
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

  const canGenerate = Boolean(uploadedImage) && Boolean(prompt.trim()) && !generationState.isLoading;

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
            <UploadSection
              uploadedImage={uploadedImage}
              onImageUpload={handleImageUpload}
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
              selectedHistoryItem={selectedHistoryItem}
            />

            <GenerateSection
              canGenerate={canGenerate}
              generationState={generationState}
              onGenerate={handleGenerate}
              onAbort={handleAbort}
            />
          </div>

          <History
            history={history}
            selectedHistoryItem={selectedHistoryItem}
            onLoadHistoryItem={loadHistoryItem}
          />
        </div>
      </div>
    </div>
  );
};

export default AIDesignTool;