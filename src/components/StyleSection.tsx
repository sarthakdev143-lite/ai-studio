import React, { useState, useEffect } from 'react';
import { Palette, ChevronDown } from 'lucide-react';

export const STYLE_OPTIONS = [
  { 
    value: 'editorial', 
    label: 'Editorial',
    description: 'Clean, professional magazine-style',
    gradient: 'from-slate-500 to-gray-600'
  },
  { 
    value: 'streetwear', 
    label: 'Streetwear',
    description: 'Urban, edgy street fashion',
    gradient: 'from-orange-500 to-red-600'
  },
  { 
    value: 'vintage', 
    label: 'Vintage',
    description: 'Classic, nostalgic retro feel',
    gradient: 'from-amber-500 to-orange-600'
  },
  { 
    value: 'minimalist', 
    label: 'Minimalist',
    description: 'Simple, clean, less is more',
    gradient: 'from-blue-500 to-cyan-600'
  },
  { 
    value: 'cyberpunk', 
    label: 'Cyberpunk',
    description: 'Futuristic neon sci-fi aesthetic',
    gradient: 'from-purple-500 to-pink-600'
  },
  { 
    value: 'watercolor', 
    label: 'Watercolor',
    description: 'Soft, artistic painting style',
    gradient: 'from-green-500 to-teal-600'
  }
];

interface StyleSectionProps {
  selectedStyle: string;
  onStyleChange: (style: string) => void;
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

const StyleOption = ({ style, isSelected, onClick, index }) => (
  <ScaleIn delay={index * 50}>
    <button
      onClick={() => onClick(style.value)}
      className={`group relative p-6 rounded-2xl text-center transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/20 ${
        isSelected
          ? `bg-gradient-to-r ${style.gradient} text-white shadow-2xl scale-105 ring-4 ring-white/30`
          : 'bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/20 hover:border-white/30'
      }`}
      aria-label={`Select ${style.label} style: ${style.description}`}
    >
      <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${style.gradient} ${
        isSelected ? 'opacity-30' : 'opacity-100'
      } transition-opacity duration-300`} />
      
      <h3 className="font-semibold text-lg mb-1">{style.label}</h3>
      <p className={`text-sm transition-opacity duration-300 ${
        isSelected ? 'opacity-90' : 'opacity-70'
      }`}>
        {style.description}
      </p>
      
      {isSelected && (
        <div className="absolute inset-0 bg-white/10 rounded-2xl pointer-events-none animate-pulse" />
      )}
    </button>
  </ScaleIn>
);

const StyleSection: React.FC<StyleSectionProps> = ({
  selectedStyle,
  onStyleChange
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'dropdown'>('grid');
  const selectedStyleOption = STYLE_OPTIONS.find(s => s.value === selectedStyle);

  return (
    <FadeInUp delay={300}>
      <section 
        className="backdrop-blur-xl bg-black/20 border border-white/20 rounded-2xl p-8 hover:bg-black/30 transition-all duration-300"
        role="region"
        aria-labelledby="style-heading"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Palette className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 id="style-heading" className="text-2xl font-semibold text-white">
              Choose Style
            </h2>
          </div>
          
          <div className="flex bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded text-sm transition-all duration-200 ${
                viewMode === 'grid'
                  ? 'bg-white/20 text-white'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('dropdown')}
              className={`px-3 py-1 rounded text-sm transition-all duration-200 ${
                viewMode === 'dropdown'
                  ? 'bg-white/20 text-white'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              List
            </button>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {STYLE_OPTIONS.map((style, index) => (
              <StyleOption
                key={style.value}
                style={style}
                isSelected={selectedStyle === style.value}
                onClick={onStyleChange}
                index={index}
              />
            ))}
          </div>
        ) : (
          <ScaleIn delay={100}>
            <div className="relative">
              <select
                value={selectedStyle}
                onChange={(e) => onStyleChange(e.target.value)}
                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all duration-300 text-lg font-medium text-white appearance-none hover:bg-white/20 cursor-pointer"
                aria-label="Select transformation style"
              >
                {STYLE_OPTIONS.map(option => (
                  <option 
                    key={option.value} 
                    value={option.value}
                    className="bg-slate-800 text-white"
                  >
                    {option.label} - {option.description}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60 pointer-events-none" />
            </div>
          </ScaleIn>
        )}

        {selectedStyleOption && (
          <FadeInUp delay={200}>
            <div className="mt-6 p-4 bg-gradient-to-r from-white/5 to-white/10 border border-white/20 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-6 h-6 rounded-lg bg-gradient-to-r ${selectedStyleOption.gradient}`} />
                <h3 className="font-semibold text-white">{selectedStyleOption.label} Style</h3>
              </div>
              <p className="text-white/70 text-sm">
                {selectedStyleOption.description}
              </p>
            </div>
          </FadeInUp>
        )}
      </section>
    </FadeInUp>
  );
};

export default StyleSection;