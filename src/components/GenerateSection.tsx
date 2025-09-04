import React from 'react';
import { Wand2, Loader2, X } from 'lucide-react';

interface GenerationState {
    isLoading: boolean;
    isAborted: boolean;
    retryCount: number;
    error: string | null;
}

interface GenerateSectionProps {
    canGenerate: boolean;
    generationState: GenerationState;
    onGenerate: () => void;
    onAbort: () => void;
}

const GenerateSection: React.FC<GenerateSectionProps> = ({
    canGenerate,
    generationState,
    onGenerate,
    onAbort
}) => {
    return (
        <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex gap-4">
                <button
                    onClick={onGenerate}
                    disabled={!canGenerate}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-6 px-8 rounded-xl font-semibold text-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-indigo-200 flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100"
                    aria-label="Generate AI transformation"
                >
                    {generationState.isLoading ? (
                        <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            Generating Magic...
                        </>
                    ) : (
                        <>
                            <Wand2 className="w-6 h-6" />
                            Generate
                        </>
                    )}
                </button>

                {generationState.isLoading && (
                    <button
                        onClick={onAbort}
                        className="px-8 py-6 bg-red-500 text-white rounded-xl hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-200 flex items-center gap-3 transition-all duration-300 font-semibold"
                        aria-label="Abort generation"
                    >
                        <X className="w-6 h-6" />
                        Abort
                    </button>
                )}
            </div>

            {generationState.error && (
                <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                    <p className="text-red-700 font-medium">{generationState.error}</p>
                </div>
            )}

            {generationState.isAborted && (
                <div className="mt-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                    <p className="text-amber-700 font-medium">Generation was aborted</p>
                </div>
            )}

            {generationState.retryCount > 0 && generationState.isLoading && (
                <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                    <p className="text-blue-700 font-medium">
                        Retrying generation... ({generationState.retryCount}/3)
                    </p>
                </div>
            )}
        </section>
    );
};

export default GenerateSection;