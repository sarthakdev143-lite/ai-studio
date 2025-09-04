import React from 'react';
import { Clock } from 'lucide-react';
import { STYLE_OPTIONS } from './StyleSection';

interface GenerationResult {
    id: string;
    imageUrl: string;
    originalImageUrl: string;
    prompt: string;
    style: string;
    createdAt: number;
}

interface HistoryProps {
    history: GenerationResult[];
    selectedHistoryItem: GenerationResult | null;
    onLoadHistoryItem: (item: GenerationResult) => void;
}

const History: React.FC<HistoryProps> = ({
    history,
    selectedHistoryItem,
    onLoadHistoryItem
}) => {
    const formatTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString();
    };

    return (
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
                            onClick={() => onLoadHistoryItem(item)}
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
    );
};

export default History;