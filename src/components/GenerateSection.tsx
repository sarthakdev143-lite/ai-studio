import React, { useState, useEffect } from 'react';
import { Wand2, Loader2, X, Zap, AlertCircle, CheckCircle2 } from 'lucide-react';
import { GenerationState } from '@/app/types';

interface StatusMessageProps {
    generationState: GenerationState;
}

interface ProgressIndicatorProps {
    isLoading: boolean;
}

interface RequirementCheckerProps {
    hasImage: boolean;
    hasPrompt: boolean;
}

interface AnimationProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}

interface GenerateSectionProps {
    canGenerate: boolean;
    generationState: GenerationState;
    onGenerate: () => void;
    onAbort: () => void;
}

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

const StatusMessage: React.FC<StatusMessageProps> = ({ generationState }) => {
    if (generationState.error) {
        return (
            <FadeInUp>
                <div
                    className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl animate-pulse"
                    role="alert"
                    aria-live="polite"
                >
                    <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <div>
                            <p className="text-red-400 font-medium">Generation Failed</p>
                            <p className="text-red-300 text-sm">{generationState.error}</p>
                        </div>
                    </div>
                </div>
            </FadeInUp>
        );
    }

    if (generationState.isAborted) {
        return (
            <FadeInUp>
                <div
                    className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl"
                    role="alert"
                    aria-live="polite"
                >
                    <div className="flex items-center gap-3">
                        <X className="w-5 h-5 text-amber-400 flex-shrink-0" />
                        <div>
                            <p className="text-amber-400 font-medium">Generation Cancelled</p>
                            <p className="text-amber-300 text-sm">You can try again with different settings</p>
                        </div>
                    </div>
                </div>
            </FadeInUp>
        );
    }

    if (generationState.retryCount > 0 && generationState.isLoading) {
        return (
            <FadeInUp>
                <div
                    className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl"
                    role="status"
                    aria-live="polite"
                >
                    <div className="flex items-center gap-3">
                        <div className="animate-spin">
                            <Loader2 className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-blue-400 font-medium">
                                Retrying Generation ({generationState.retryCount}/3)
                            </p>
                            <p className="text-blue-300 text-sm">
                                Our AI is busy, please wait while we retry...
                            </p>
                        </div>
                    </div>
                    <div className="mt-3 bg-blue-500/20 rounded-full h-2">
                        <div
                            className="bg-blue-400 h-2 rounded-full animate-pulse transition-all duration-1000"
                            style={{ width: `${(generationState.retryCount / 3) * 100}%` }}
                        />
                    </div>
                </div>
            </FadeInUp>
        );
    }

    if (generationState.isLoading) {
        return (
            <FadeInUp>
                <div
                    className="p-4 bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-500/30 rounded-xl"
                    role="status"
                    aria-live="polite"
                >
                    <div className="flex items-center gap-3">
                        <div className="animate-spin">
                            <Loader2 className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                            <p className="text-orange-400 font-medium">Generating Your Masterpiece...</p>
                            <p className="text-orange-300 text-sm">Our AI is working its magic, this may take a moment</p>
                        </div>
                    </div>
                    <div className="mt-3 flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="h-2 bg-orange-400/30 rounded-full flex-1 animate-pulse"
                                style={{ animationDelay: `${i * 0.2}s` }}
                            />
                        ))}
                    </div>
                </div>
            </FadeInUp>
        );
    }

    return null;
};

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ isLoading }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (isLoading) {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 90) return prev;
                    return prev + Math.random() * 10;
                });
            }, 500);

            return () => clearInterval(interval);
        } else {
            setProgress(0);
        }
    }, [isLoading]);

    if (!isLoading) return null;

    return (
        <div className="mt-4">
            <div className="flex justify-between text-sm text-white/70 mb-2">
                <span>Processing...</span>
                <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
                <div
                    className="bg-gradient-to-r from-orange-400 to-pink-400 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};

const RequirementChecker: React.FC<RequirementCheckerProps> = ({ hasImage, hasPrompt }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className={`flex items-center gap-2 p-3 rounded-lg border transition-all duration-200 ${hasImage
            ? 'bg-green-500/10 border-green-500/30 text-green-400'
            : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
            {hasImage ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span className="text-sm font-medium">Image uploaded</span>
        </div>

        <div className={`flex items-center gap-2 p-3 rounded-lg border transition-all duration-200 ${hasPrompt
            ? 'bg-green-500/10 border-green-500/30 text-green-400'
            : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
            {hasPrompt ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span className="text-sm font-medium">Prompt entered</span>
        </div>
    </div>
);

const GenerateSection: React.FC<GenerateSectionProps> = ({ canGenerate, generationState, onGenerate, onAbort }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Extract requirements from canGenerate logic (assuming parent passes this info)
    const hasImage = true; // This would be passed as prop in real implementation
    const hasPrompt = true; // This would be passed as prop in real implementation

    const getButtonText = () => {
        if (generationState.isLoading) {
            if (generationState.retryCount > 0) {
                return 'Retrying...';
            }
            return 'Generating Magic...';
        }
        return 'Generate';
    };

    const getButtonIcon = () => {
        if (generationState.isLoading) {
            return <Loader2 className="w-6 h-6 animate-spin" />;
        }
        return isHovered ? <Zap className="w-6 h-6" /> : <Wand2 className="w-6 h-6" />;
    };

    return (
        <FadeInUp delay={500}>
            <section
                className="backdrop-blur-xl bg-black/20 border border-white/20 rounded-2xl p-8 hover:bg-black/30 transition-all duration-300"
                role="region"
                aria-labelledby="generate-heading"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-lg">
                        <Wand2 className="w-6 h-6 text-orange-400" />
                    </div>
                    <h2 id="generate-heading" className="text-2xl font-semibold text-white">
                        Generate
                    </h2>
                </div>

                {/* Requirements Checker */}
                <RequirementChecker hasImage={hasImage} hasPrompt={hasPrompt} />

                {/* Main Action Buttons */}
                <div className="flex gap-4 mb-6">
                    <ScaleIn className="flex-1">
                        <button
                            onClick={onGenerate}
                            disabled={!canGenerate}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            className={`w-full py-6 px-8 rounded-xl font-semibold text-xl flex items-center justify-center gap-3 transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-orange-500/30 ${canGenerate
                                ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 hover:scale-[1.02] hover:shadow-2xl'
                                : 'bg-white/10 text-white/50 cursor-not-allowed border border-white/20'
                                }`}
                            aria-label="Generate AI transformation"
                            aria-describedby="generate-status"
                        >
                            {getButtonIcon()}
                            <span>{getButtonText()}</span>
                        </button>
                    </ScaleIn>

                    {generationState.isLoading && (
                        <ScaleIn delay={100}>
                            <button
                                onClick={onAbort}
                                className="px-8 py-6 bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/30 flex items-center gap-3 transition-all duration-300 font-semibold hover:scale-105"
                                aria-label="Abort generation"
                            >
                                <X className="w-6 h-6" />
                                <span>Cancel</span>
                            </button>
                        </ScaleIn>
                    )}
                </div>

                {/* Progress Indicator */}
                <ProgressIndicator isLoading={generationState.isLoading} />

                {/* Status Messages */}
                <div id="generate-status">
                    <StatusMessage generationState={generationState} />
                </div>

                {/* Help Text */}
                {!canGenerate && !generationState.isLoading && (
                    <FadeInUp delay={200}>
                        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-blue-400 font-medium mb-1">Ready to Generate?</p>
                                    <p className="text-blue-300 text-sm">
                                        Make sure you&apos;ve uploaded an image and entered a creative prompt.
                                        Our AI will transform your image based on your vision!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </FadeInUp>
                )}

                {/* Generation Tips */}
                {canGenerate && !generationState.isLoading && (
                    <FadeInUp delay={300}>
                        <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-xl">
                            <div className="flex items-start gap-3">
                                <Zap className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-purple-400 font-medium mb-1">Pro Tips</p>
                                    <ul className="text-purple-300 text-sm space-y-1">
                                        <li>• Be specific about colors, lighting, and mood</li>
                                        <li>• Mention artistic styles or techniques</li>
                                        <li>• Generation typically takes 10-30 seconds</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </FadeInUp>
                )}
            </section>
        </FadeInUp>
    );
};

export default GenerateSection;