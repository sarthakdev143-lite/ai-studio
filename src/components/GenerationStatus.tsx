import { GenerationStatusProps } from "@/types";
import { Loader2 } from "lucide-react";

const GenerationStatus: React.FC<GenerationStatusProps> = ({ generationState }) => {
    if (!generationState.isLoading && !generationState.error) return null;

    return (
        <div
            className="mb-4 p-4 rounded-xl"
            aria-live="polite"
            aria-atomic="true"
        >
            {generationState.isLoading && (
                <div className="bg-orange-500/10 border border-orange-500/30">
                    <div className="flex items-center gap-3">
                        <div className="animate-spin">
                            <Loader2 className="w-5 h-5 text-orange-400" aria-hidden="true" />
                        </div>
                        <div className="flex-1">
                            <p className="text-orange-400 font-medium">Generating Your Masterpiece...</p>
                            {generationState.retryCount > 0 && (
                                <p className="text-orange-300 text-sm">Retrying... ({generationState.retryCount}/3)</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {generationState.error && (
                <div className="bg-red-500/10 border border-red-500/30">
                    <p className="text-red-400 font-medium">Generation Failed</p>
                    <p className="text-red-300 text-sm">{generationState.error}</p>
                </div>
            )}
        </div>
    );
};

export default GenerationStatus;