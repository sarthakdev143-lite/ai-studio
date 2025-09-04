import React from 'react';

const STYLE_OPTIONS = [
    { value: 'editorial', label: 'Editorial' },
    { value: 'streetwear', label: 'Streetwear' },
    { value: 'vintage', label: 'Vintage' },
    { value: 'minimalist', label: 'Minimalist' },
    { value: 'cyberpunk', label: 'Cyberpunk' },
    { value: 'watercolor', label: 'Watercolor' }
];

interface StyleSectionProps {
    selectedStyle: string;
    onStyleChange: (style: string) => void;
}

const StyleSection: React.FC<StyleSectionProps> = ({ selectedStyle, onStyleChange }) => {
    return (
        <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-lg">
                    <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-md" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">Choose Style</h2>
            </div>

            <select
                value={selectedStyle}
                onChange={(e) => onStyleChange(e.target.value)}
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
    );
};

export { STYLE_OPTIONS };
export default StyleSection;