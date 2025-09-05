"use client";

import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { GenerationStatusProps } from "@/types";

const GenerationStatus: React.FC<GenerationStatusProps> = ({ generationState, canceled }) => {
    const didMount = useRef(false);

    useEffect(() => {
        // Skip the very first render
        if (!didMount.current) {
            didMount.current = true;
            return;
        }

        if (generationState.isLoading) {
            toast.info(
                <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-orange-300" />
                    <span className="text-orange-200 font-medium">
                        Generating your masterpiece...
                    </span>
                </div>,
                {
                    toastId: "generation-loading",
                    autoClose: false,
                    closeButton: false,
                    className:
                        "backdrop-blur-md bg-gradient-to-r from-orange-500/20 via-pink-500/20 to-purple-500/20 border border-orange-400/30 rounded-2xl shadow-lg text-sm text-white/90",
                    progressClassName: "bg-orange-400/70",
                }
            );
        } else {
            toast.dismiss("generation-loading");
        }

        if (generationState.error) {
            toast.error(
                <div>
                    <p className="text-red-300 font-semibold">Generation Failed</p>
                    <p className="text-red-200 text-sm">{generationState.error}</p>
                </div>,
                {
                    toastId: "generation-error",
                    className:
                        "backdrop-blur-md text-sm text-white/90 bg-gradient-to-r from-red-500/20 via-pink-500/20 to-purple-500/20 border border-red-400/30 rounded-2xl shadow-lg",
                    progressClassName: "bg-red-400/70",
                }
            );
        }

        if (!generationState.isLoading && !generationState.error && didMount.current && !canceled) {
            toast.success("✨ Masterpiece Generated!", {
                toastId: "generation-success",
                className:
                    "backdrop-blur-md bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-2xl shadow-lg text-sm text-white/90 font-medium",
                progressClassName: "bg-purple-400/70",
            });
        }
    }, [generationState, canceled]);

    return null;
};

export default GenerationStatus;
