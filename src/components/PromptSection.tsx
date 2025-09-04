import React, { useState, useEffect } from 'react';
import { Wand2 } from 'lucide-react';

interface PromptSectionProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
}

// Animation Component
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

const PROMPT_SUGGESTIONS = [
  "Transform into a cyberpunk aesthetic with neon lights",
  "Apply vintage film photography style",
  "Create a minimalist, clean composition",
  "Add dramatic lighting and shadows",
  "Convert to watercolor painting style",
  "Apply street art graffiti effects"
];

const PromptSection: React.FC<PromptSectionProps> = ({
  prompt,
  onPromptChange
}) => {
  const maxLength = 500;
  const remaining = maxLength - prompt.length;
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusCount, setFocusCount] = useState(0);

  const handleSuggestionClick = (suggestion: string) => {
    onPromptChange(suggestion);
    setShowSuggestions(false);
  };

  const handleFocus = () => {
    setFocusCount(prev => prev + 1);
    if (focusCount === 0 && !prompt) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => setShowSuggestions(false), 150);
  };

  return (
    <FadeInUp delay={200}>
      <section 
        className="backdrop-blur-xl bg-black/20 border border-white/20 rounded-2xl p-8 hover:bg-black/30 transition-all duration-300"
        role="region"
        aria-labelledby="prompt-heading"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-500/20 rounded-lg animate-pulse">
            <Wand2 className="w-6 h-6 text-purple-400" />
          </div>
          <h2 id="prompt-heading" className="text-2xl font-semibold text-white">
            Describe Your Vision
          </h2>
        </div>

        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            maxLength={maxLength}
            placeholder="Describe how you want to transform your image... (e.g., make it futuristic with neon lights, add a vintage film aesthetic, create a minimalist composition)"
            className="w-full h-40 p-6 bg-black/20 border-2 border-white/20 rounded-xl resize-none focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-400 transition-all duration-300 text-lg text-white placeholder-white/50 hover:border-white/30 hover:bg-black/30"
            aria-label="Enter your transformation prompt"
            aria-describedby="prompt-counter prompt-help"
          />

          {showSuggestions && (
            <FadeInUp delay={100}>
              <div className="absolute top-full left-0 right-0 mt-2 backdrop-blur-xl bg-black/40 border border-white/20 rounded-xl p-4 z-10 shadow-2xl">
                <p className="text-white/70 text-sm mb-3">Try these suggestions:</p>
                <div className="space-y-2">
                  {PROMPT_SUGGESTIONS.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left p-3 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all duration-200 text-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </FadeInUp>
          )}
        </div>

        <div className="mt-3 flex justify-between items-center">
          <SlideInFromLeft delay={400}>
            <div id="prompt-help" className="text-sm text-white/60">
              <kbd className="px-2 py-1 bg-white/10 rounded text-xs mr-2">Tab</kbd>
              to navigate • 
              <kbd className="px-2 py-1 bg-white/10 rounded text-xs mx-2">Enter</kbd>
              for new lines
            </div>
          </SlideInFromLeft>
          
          <SlideInFromLeft delay={500}>
            <span 
              id="prompt-counter" 
              className={`text-sm transition-colors duration-200 ${
                remaining < 50 
                  ? 'text-red-400 font-semibold animate-pulse' 
                  : remaining < 100
                  ? 'text-yellow-400 font-medium'
                  : 'text-white/60'
              }`}
            >
              {remaining} characters remaining
            </span>
          </SlideInFromLeft>
        </div>

        {prompt && (
          <FadeInUp delay={300}>
            <div className="mt-4 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Wand2 className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400 font-medium text-sm">Preview</span>
              </div>
              <p className="text-white/80 text-sm italic">
                "{prompt}"
              </p>
            </div>
          </FadeInUp>
        )}
      </section>
    </FadeInUp>
  );
};

export default PromptSection;