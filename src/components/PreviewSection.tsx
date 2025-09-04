import React, { useState, useEffect } from 'react';
import { ImageIcon, Wand2, Eye, Download, Share2, Heart } from 'lucide-react';
import { STYLE_OPTIONS } from './StyleSection';

interface GenerationResult {
  id: string;
  imageUrl: string;
  originalImageUrl: string;
  prompt: string;
  style: string;
  createdAt: number;
}

interface PreviewSectionProps {
  uploadedImage: string;
  prompt: string;
  selectedStyle: string;
  selectedHistoryItem: GenerationResult | null;
}

// Animation Components
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
      className={`transition-all duration-700 ease-out ${
        isVisible 
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
      className={`transition-all duration-500 ease-out ${
        isVisible 
          ? 'opacity-100 scale-100' 
          : 'opacity-0 scale-95'
      } ${className}`}
    >
      {children}
    </div>
  );
};

const SlideInFromLeft = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`transition-all duration-600 ease-out ${
        isVisible 
          ? 'opacity-100 translate-x-0' 
          : 'opacity-0 -translate-x-8'
      } ${className}`}
    >
      {children}
    </div>
  );
};

// Image Preview Component
const ImagePreview = ({ src, alt, title, isEmpty = false, children }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-medium text-white">{title}</h3>
    <div className="aspect-square bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl overflow-hidden shadow-inner hover:shadow-2xl transition-all duration-500 group relative">
      {src && !isEmpty ? (
        <ScaleIn>
          <img 
            src={src} 
            alt={alt} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
              <Eye className="w-6 h-6 text-white" />
            </button>
          </div>
        </ScaleIn>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  </div>
);

// Action Button Component
const ActionButton = ({ icon: Icon, label, onClick, variant = 'secondary' }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:scale-105 ${
      variant === 'primary'
        ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 shadow-lg'
        : 'bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/20 hover:border-white/30'
    }`}
  >
    <Icon className="w-4 h-4" />
    <span>{label}</span>
  </button>
);

const PreviewSection: React.FC<PreviewSectionProps> = ({
  uploadedImage,
  prompt,
  selectedStyle,
  selectedHistoryItem
}) => {
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleDownload = () => {
    if (selectedHistoryItem?.imageUrl) {
      // In a real app, this would download the image
      console.log('Downloading image:', selectedHistoryItem.imageUrl);
    }
  };

  const handleShare = () => {
    if (navigator.share && selectedHistoryItem) {
      navigator.share({
        title: 'AI Generated Image',
        text: selectedHistoryItem.prompt,
        url: selectedHistoryItem.imageUrl,
      });
    }
  };

  return (
    <FadeInUp delay={400}>
      <section 
        className="backdrop-blur-xl bg-black/20 border border-white/20 rounded-2xl p-8 hover:bg-black/30 transition-all duration-300"
        role="region"
        aria-labelledby="preview-heading"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 id="preview-heading" className="text-2xl font-semibold text-white">
            Preview
          </h2>
          
          {selectedHistoryItem && (
            <div className="flex items-center gap-2">
              <ActionButton
                icon={Heart}
                label={liked ? 'Liked' : 'Like'}
                onClick={() => setLiked(!liked)}
                variant={liked ? 'primary' : 'secondary'}
              />
              <ActionButton
                icon={Download}
                label="Download"
                onClick={handleDownload}
              />
              <ActionButton
                icon={Share2}
                label="Share"
                onClick={handleShare}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <FadeInUp delay={100}>
            <ImagePreview
              src={uploadedImage}
              alt="Original image for transformation"
              title="Original"
              isEmpty={!uploadedImage}
            >
              <div className="flex flex-col items-center gap-4 p-8">
                <div className="p-6 bg-white/10 rounded-2xl animate-pulse">
                  <ImageIcon className="w-24 h-24 text-white/40" />
                </div>
                <div className="text-center">
                  <p className="text-white/60 text-lg">No image uploaded</p>
                  <p className="text-white/40 text-sm">Upload an image to see the original</p>
                </div>
              </div>
            </ImagePreview>
          </FadeInUp>

          <FadeInUp delay={200}>
            <ImagePreview
              src={selectedHistoryItem?.imageUrl}
              alt="AI generated transformation result"
              title="Generated"
              isEmpty={!selectedHistoryItem}
            >
              <div className="flex flex-col items-center gap-4 p-8">
                <div className="p-6 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-2xl animate-bounce" style={{ animationDuration: '3s' }}>
                  <Wand2 className="w-24 h-24 text-orange-400" />
                </div>
                <div className="text-center">
                  <p className="text-white/60 text-lg">Your AI creation will appear here</p>
                  <p className="text-white/40 text-sm">Upload an image and enter a prompt to generate</p>
                </div>
              </div>
            </ImagePreview>
          </FadeInUp>
        </div>

        {/* Generation Info */}
        {(prompt || selectedStyle || selectedHistoryItem) && (
          <div className="space-y-4">
            {selectedHistoryItem && (
              <FadeInUp delay={300}>
                <div className="p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-green-400 font-medium text-sm">Generation Complete</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-white/60">Created:</span>
                      <span className="text-white ml-2">
                        {new Date(selectedHistoryItem.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-white/60">ID:</span>
                      <span className="text-white ml-2 font-mono">#{selectedHistoryItem.id.slice(-8)}</span>
                    </div>
                  </div>
                </div>
              </FadeInUp>
            )}
            
            <FadeInUp delay={350}>
              <div className="p-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SlideInFromLeft delay={100}>
                    <div>
                      <h4 className="font-semibold text-indigo-400 mb-2 flex items-center gap-2">
                        <Wand2 className="w-4 h-4" />
                        Prompt
                      </h4>
                      <p className="text-white/80 text-sm leading-relaxed">
                        {selectedHistoryItem?.prompt || prompt || 'No prompt entered'}
                      </p>
                    </div>
                  </SlideInFromLeft>
                  
                  <SlideInFromLeft delay={200}>
                    <div>
                      <h4 className="font-semibold text-purple-400 mb-2">Style</h4>
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded bg-gradient-to-r ${
                          STYLE_OPTIONS.find(s => s.value === (selectedHistoryItem?.style || selectedStyle))?.gradient || 'from-gray-500 to-gray-600'
                        }`} />
                        <span className="text-white/80 text-sm">
                          {STYLE_OPTIONS.find(s => s.value === (selectedHistoryItem?.style || selectedStyle))?.label}
                        </span>
                      </div>
                    </div>
                  </SlideInFromLeft>
                </div>
              </div>
            </FadeInUp>
          </div>
        )}
      </section>
    </FadeInUp>
  );
};

export default PreviewSection;