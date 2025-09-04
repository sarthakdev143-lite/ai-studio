import React, { useState, useEffect } from 'react';
import { Clock, Grid, List, Trash2, Search, Filter } from 'lucide-react';
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
    isGridView?: boolean;
}


interface GridHistoryItemProps {
    item: GenerationResult;
    isSelected: boolean;
    onSelect: (item: GenerationResult) => void;
    index: number;
}

interface ListHistoryItemProps {
    item: GenerationResult;
    isSelected: boolean;
    onSelect: (item: GenerationResult) => void;
    index: number;
}

interface EmptyHistoryProps {
    isGridView?: boolean;
}

interface HistoryControlsProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    selectedFilter: string;
    onFilterChange: (filter: string) => void;
    viewMode: 'list' | 'grid';
    onViewModeChange: (mode: 'list' | 'grid') => void;
    showControls?: boolean;
}

interface AnimationProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}

// Animation Components
const FadeInUp: React.FC<AnimationProps> = ({ children, delay = 0, className = "" }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, delay);
        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <div
            className={`transition-all duration-700 ease-out ${isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                } ${className}`}
        >
            {children}
        </div>
    );
};

const ScaleIn: React.FC<AnimationProps> = ({ children, delay = 0, className = "" }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, delay);
        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <div
            className={`transition-all duration-500 ease-out ${isVisible
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-95'
                } ${className}`}
        >
            {children}
        </div>
    );
};

const SlideInFromLeft: React.FC<AnimationProps> = ({ children, delay = 0, className = "" }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, delay);
        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <div
            className={`transition-all duration-600 ease-out ${isVisible
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-8'
                } ${className}`}
        >
            {children}
        </div>
    );
};

const GridHistoryItem: React.FC<GridHistoryItemProps> = ({ item, isSelected, onSelect, index }) => {
    const formatTime = (timestamp: string | number | Date) => {
        return new Date(timestamp).toLocaleTimeString();
    };

    return (
        <FadeInUp delay={index * 100}>
            <div
                onClick={() => onSelect(item)}
                className={`group backdrop-blur-xl bg-black/20 border border-white/20 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:bg-black/30 hover:scale-105 hover:border-white/30 ${isSelected ? 'ring-2 ring-orange-500 bg-black/40' : ''
                    }`}
            >
                <div className="aspect-square bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl overflow-hidden mb-4 shadow-inner">
                    <img
                        src={item.imageUrl}
                        alt="Generated artwork"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                </div>

                <div className="space-y-2">
                    <p className="text-white font-medium truncate">
                        {item.prompt.substring(0, 60)}{item.prompt.length > 60 ? '...' : ''}
                    </p>
                    <div className="flex items-center justify-between">
                        <span className="text-orange-400 text-sm font-medium capitalize">
                            {STYLE_OPTIONS.find(s => s.value === item.style)?.label}
                        </span>
                        <span className="text-white/60 text-sm">
                            {formatTime(item.createdAt)}
                        </span>
                    </div>
                </div>
            </div>
        </FadeInUp>
    );
};

const ListHistoryItem: React.FC<ListHistoryItemProps> = ({ item, isSelected, onSelect, index }) => {
    const formatTime = (timestamp: string | number | Date) => {
        return new Date(timestamp).toLocaleTimeString();
    };

    return (
        <FadeInUp delay={index * 50}>
            <button
                onClick={() => onSelect(item)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left focus:outline-none focus:ring-4 focus:ring-orange-500/30 hover:scale-[1.02] hover:shadow-lg group ${isSelected
                        ? 'border-orange-500/50 bg-orange-500/10 shadow-lg scale-[1.02]'
                        : 'border-white/20 hover:border-white/30 hover:bg-white/5'
                    }`}
                aria-label={`Load generation: ${item.prompt.substring(0, 50)}`}
            >
                <div className="flex gap-4">
                    <ScaleIn delay={50}>
                        <img
                            src={item.imageUrl}
                            alt="Generation thumbnail"
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0 shadow-md group-hover:shadow-xl transition-shadow duration-200"
                        />
                    </ScaleIn>
                    <div className="flex-1 min-w-0">
                        <SlideInFromLeft delay={100}>
                            <p className="font-medium text-white truncate mb-1">
                                {item.prompt.substring(0, 40)}{item.prompt.length > 40 ? '...' : ''}
                            </p>
                        </SlideInFromLeft>
                        <SlideInFromLeft delay={150}>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-orange-400 font-medium capitalize">
                                    {STYLE_OPTIONS.find(s => s.value === item.style)?.label}
                                </span>
                                <span className="text-white/50">
                                    {formatTime(item.createdAt)}
                                </span>
                            </div>
                        </SlideInFromLeft>
                    </div>
                </div>
            </button>
        </FadeInUp>
    );
};

// Empty State Component
const EmptyHistory = ({ isGridView = false }) => (
    <div className={`text-center ${isGridView ? 'py-20' : 'py-12'}`}>
        <div className="animate-bounce" style={{ animationDuration: '3s' }}>
            <div className={`p-6 bg-white/5 rounded-2xl mb-6 mx-auto w-fit ${isGridView ? 'p-12' : ''}`}>
                <Clock className={`text-white/40 mx-auto ${isGridView ? 'w-24 h-24' : 'w-16 h-16'}`} />
            </div>
        </div>
        <FadeInUp delay={200}>
            <p className={`text-white/60 font-medium mb-2 ${isGridView ? 'text-2xl' : 'text-lg'}`}>
                No generations yet
            </p>
            <p className={`text-white/40 ${isGridView ? 'text-lg' : 'text-sm'}`}>
                {isGridView
                    ? 'Start creating amazing AI artwork by uploading an image and entering a prompt'
                    : 'Your creations will appear here'
                }
            </p>
        </FadeInUp>
    </div>
);

const HistoryControls: React.FC<HistoryControlsProps> = ({ searchTerm, onSearchChange, selectedFilter, onFilterChange, viewMode, onViewModeChange, showControls = true }) => {
    if (!showControls) return null;

    return (
        <FadeInUp delay={100}>
            <div className="mb-6 space-y-4">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search generations..."
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/30 focus:border-orange-400 transition-all duration-300 text-white placeholder-white/50"
                    />
                </div>

                {/* Filter and View Mode */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-white/60" />
                        <select
                            value={selectedFilter}
                            onChange={(e) => onFilterChange(e.target.value)}
                            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                        >
                            <option value="all" className="bg-slate-800">All Styles</option>
                            {STYLE_OPTIONS.map(option => (
                                <option key={option.value} value={option.value} className="bg-slate-800">
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex bg-white/10 rounded-lg p-1">
                        <button
                            onClick={() => onViewModeChange('list')}
                            className={`p-2 rounded transition-all duration-200 ${viewMode === 'list'
                                    ? 'bg-white/20 text-white'
                                    : 'text-white/60 hover:text-white/80'
                                }`}
                            aria-label="List view"
                        >
                            <List className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onViewModeChange('grid')}
                            className={`p-2 rounded transition-all duration-200 ${viewMode === 'grid'
                                    ? 'bg-white/20 text-white'
                                    : 'text-white/60 hover:text-white/80'
                                }`}
                            aria-label="Grid view"
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </FadeInUp>
    );
};

const History: React.FC<HistoryProps> = ({
    history,
    selectedHistoryItem,
    onLoadHistoryItem,
    isGridView = false
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>(isGridView ? 'grid' : 'list');

    // Filter and search logic
    const filteredHistory = history.filter(item => {
        const matchesSearch = item.prompt.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = selectedFilter === 'all' || item.style === selectedFilter;
        return matchesSearch && matchesFilter;
    });

    if (isGridView) {
        // Landing page grid view
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {history.length === 0 ? (
                    <div className="col-span-full">
                        <EmptyHistory isGridView={true} />
                    </div>
                ) : (
                    history.map((item, index) => (
                        <GridHistoryItem
                            key={item.id}
                            item={item}
                            isSelected={selectedHistoryItem?.id === item.id}
                            onSelect={onLoadHistoryItem}
                            index={index}
                        />
                    ))
                )}
            </div>
        );
    }

    // Sidebar view
    return (
        <FadeInUp delay={600}>
            <aside
                className="backdrop-blur-xl bg-black/20 border border-white/20 rounded-2xl p-8 hover:bg-black/30 transition-all duration-300"
                role="complementary"
                aria-labelledby="history-heading"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                        <Clock className="w-6 h-6 text-amber-400" />
                    </div>
                    <h2 id="history-heading" className="text-2xl font-semibold text-white">
                        History
                    </h2>
                    {history.length > 0 && (
                        <span className="ml-auto px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium">
                            {history.length}/5
                        </span>
                    )}
                </div>

                <HistoryControls
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    selectedFilter={selectedFilter}
                    onFilterChange={setSelectedFilter}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    showControls={history.length > 3}
                />

                {filteredHistory.length === 0 ? (
                    <EmptyHistory isGridView={false} />
                ) : (
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                        {filteredHistory.map((item, index) => (
                            <ListHistoryItem
                                key={item.id}
                                item={item}
                                isSelected={selectedHistoryItem?.id === item.id}
                                onSelect={onLoadHistoryItem}
                                index={index}
                            />
                        ))}
                    </div>
                )}

                {history.length > 0 && (
                    <FadeInUp delay={300}>
                        <div className="mt-6 pt-4 border-t border-white/10">
                            <button
                                onClick={() => {
                                    if (confirm('Clear all history? This action cannot be undone.')) {
                                        localStorage.removeItem('ai-studio-history');
                                        window.location.reload();
                                    }
                                }}
                                className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>Clear History</span>
                            </button>
                        </div>
                    </FadeInUp>
                )}
            </aside>
        </FadeInUp>
    );
};

export default History;