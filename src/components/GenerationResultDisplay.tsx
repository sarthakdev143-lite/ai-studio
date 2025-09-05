import { GenerationResultProps } from "@/types";
import FadeInUp from "./animations/FadeInUp";

const GenerationResultDisplay: React.FC<GenerationResultProps> = ({ result }) => (
    <div className="mt-16 max-w-4xl mx-auto">
        <FadeInUp delay={300}>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">Your Creation</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-black/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Original</h3>
                        <img
                            src={result.originalImageUrl}
                            alt="Original"
                            className="w-full aspect-square object-cover rounded-xl shadow-lg"
                        />
                    </div>
                    <div className="bg-black/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Generated</h3>
                        <img
                            src={result.imageUrl}
                            alt="Generated"
                            className="w-full aspect-square object-cover rounded-xl shadow-lg"
                        />
                    </div>
                </div>
                <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
                    <p className="text-white/80 italic">&quot;{result.prompt}&quot;</p>
                    <div className="flex items-center justify-center gap-4 mt-2">
                        <span className="text-purple-400 text-sm">Style: {result.style}</span>
                        <span className="text-white/60 text-sm">
                            {new Date(result.createdAt).toLocaleTimeString()}
                        </span>
                    </div>
                </div>
            </div>
        </FadeInUp>
    </div>
);

export default GenerationResultDisplay;