import React from 'react';
import { Wand2 } from 'lucide-react';

interface PromptSectionProps {
    prompt: string;
    onPromptChange: (prompt: string) => void;
}

const PromptSection: React.FC<PromptSectionProps> = ({ prompt, onPromptChange }) => {
    return (
        <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                    <Wand2 className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">Describe Your Vision</h2>
            </div>

            <textarea
                value={prompt}
                onChange={(e) => onPromptChange(e.target.value)}
                placeholder="Describe how you want to transform your image... (e.g., make it futuristic with neon lights, add a vintage film aesthetic, create a minimalist composition)"
                className="w-full h-40 p-6 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300 text-lg"
                aria-label="Enter your transformation prompt"
            />
            <div className="mt-3 text-right">
                <span className="text-sm text-gray-500">{prompt.length}/500</span>
            </div>
        </section>
    );
};

export default PromptSection;