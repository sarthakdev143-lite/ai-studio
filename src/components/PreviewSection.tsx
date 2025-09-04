import React from 'react';
import { ImageIcon, Wand2 } from 'lucide-react';
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

const PreviewSection: React.FC<PreviewSectionProps> = ({
    uploadedImage,
    prompt,
    selectedStyle,
    selectedHistoryItem
}) => {
    return (
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
    );
};

export default PreviewSection;