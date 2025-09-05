import { ChatInterfaceProps } from "@/types";
import { downscaleImage } from "@/utils/downscaleImage";
import { ImageIcon, X, Wand2, Mic, MicOff } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import ScaleIn from "./animations/ScaleIn";
import ImageUpload from "./ImageUpload";
import StyleSelector from "./StyleSelector";
import GenerationStatus from "./GenerationStatus";

// Define types for speech recognition events
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
}

declare global {
    interface Window {
        SpeechRecognition?: typeof SpeechRecognition;
        webkitSpeechRecognition?: typeof SpeechRecognition;
    }
}


const ChatInterface: React.FC<ChatInterfaceProps> = ({ onGenerate, isGenerating, generationState, onAbort, }) => {
    const [prompt, setPrompt] = useState("");
    const [uploadedImage, setUploadedImage] = useState("");
    const [selectedStyle, setSelectedStyle] = useState("editorial");
    const [showStyleSelector, setShowStyleSelector] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [speechSupported, setSpeechSupported] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const recognitionRef = useRef<any>(null);

    // Check if speech recognition is supported
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            setSpeechSupported(true);
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
                const transcript = Array.from(event.results)
                    .map((result) => result[0])
                    .map(result => result.transcript)
                    .join('');
                setPrompt(prev => prev + transcript);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
                if (event.error === 'network') {
                    alert('Speech recognition requires an internet connection. Please check your connection and try again.');
                }
            };
        }
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
        }
    }, [prompt]);

    const toggleSpeechRecognition = () => {
        if (!speechSupported) {
            alert('Speech recognition is not supported in your browser. Please try Chrome or Edge.');
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            try {
                setPrompt(prev => prev + ' '); // Add space for new words
                recognitionRef.current.start();
                setIsListening(true);
            } catch (error) {
                console.error('Speech recognition start failed', error);
                alert('Unable to start speech recognition. Please ensure your microphone is available and try again.');
            }
        }
    };

    const clearPrompt = () => {
        setPrompt("");
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const clearUploadedImage = () => {
        setUploadedImage("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim() && uploadedImage) {
            onGenerate({
                prompt: prompt.trim(),
                image: uploadedImage,
                style: selectedStyle,
            });
        }
        setPrompt("");
        clearUploadedImage();
        setSelectedStyle("editorial");
        setShowStyleSelector(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setDragActive(false);

        document.getElementById("history-section")?.scrollIntoView({
            behavior: "smooth",
        });
    };

    const handleFileUpload = async (file: File) => {
        if (file && file.type.startsWith("image/")) {
            if (file.size > 10 * 1024 * 1024) {
                alert("File too large (max 10MB)");
                return;
            }

            try {
                const resizedDataUrl = await downscaleImage(file, 1920);
                setUploadedImage(resizedDataUrl);
            } catch (err) {
                console.error("Error resizing image:", err);
            }
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const files = Array.from(e.dataTransfer.files);
        const imageFile = files.find((file) => file.type.startsWith("image/"));
        if (imageFile) handleFileUpload(imageFile);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const canGenerate = prompt.trim() && uploadedImage && !isGenerating;

    return (
        <ScaleIn delay={400}>
            <div className="w-full max-w-5xl mx-auto px-4">
                {/* Style Selector - Outside the input box on the left */}
                <div className="mb-4">
                    <StyleSelector
                        selectedStyle={selectedStyle}
                        onStyleChange={setSelectedStyle}
                        isOpen={showStyleSelector}
                        onToggle={() => setShowStyleSelector(!showStyleSelector)}
                    />
                </div>

                <form
                    onSubmit={handleSubmit}
                    className={`relative backdrop-blur-xl flex flex-col bg-black/30 border-2 rounded-3xl px-4 py-3 shadow-2xl transition-all duration-300 ${dragActive
                        ? "border-orange-500 bg-orange-500/10 scale-[1.02]"
                        : "border-white/20 hover:border-white/30"
                        }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
                    <div className="flex gap-3 items-start">
                        <ImageUpload
                            fileInputRef={fileInputRef}
                            uploadedImage={uploadedImage}
                            onClear={clearUploadedImage}
                            onFileUpload={handleFileUpload}
                            dragActive={dragActive}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        />

                        {/* Image Upload Button (when no image) */}
                        {!uploadedImage && (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 aspect-square h-10 bg-white/10 hover:bg-white/20 rounded-lg transition-colors group focus:outline-none focus:ring-2 focus:ring-orange-500 grid place-items-center mt-1"
                                aria-label="Upload Image"
                            >
                                <ImageIcon
                                    className="w-5 h-5 text-white/70 group-hover:text-white"
                                    aria-hidden="true"
                                />
                            </button>
                        )}

                        {/* Main Textarea Container */}
                        <div className="relative flex-1">
                            <textarea
                                ref={textareaRef}
                                id="prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder={
                                    uploadedImage
                                        ? "Describe how you want to transform your image..."
                                        : "Upload an image and describe your vision..."
                                }
                                className="w-full text-white placeholder-white/60 resize-none outline-none text-lg bg-transparent py-2 max-h-40"
                                maxLength={500}
                                aria-label="Describe your vision"
                                rows={1}
                                disabled={isGenerating}
                            />

                            {/* Character Counter */}
                            {prompt.length > 0 && (
                                <div className="absolute bottom-1 right-2 text-xs text-white/60">
                                    {prompt.length}/500
                                </div>
                            )}
                        </div>

                        {/* Top Right Controls - Microphone and Generate Button */}
                        <div className="flex items-center gap-2 mt-1">
                            {/* Microphone Button - Now on the left of Generate */}
                            {speechSupported && (
                                <button
                                    type="button"
                                    onClick={toggleSpeechRecognition}
                                    disabled={isGenerating}
                                    className={`p-2 rounded-lg transition-colors ${isListening
                                        ? "text-red-400 bg-red-400/20"
                                        : "text-white/60 hover:text-white hover:bg-white/10"
                                        } ${isGenerating ? "opacity-50 cursor-not-allowed" : ""}`}
                                    aria-label={isListening ? "Stop voice input" : "Start voice input"}
                                >
                                    {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                                </button>
                            )}

                            {/* Generate Button and Status */}
                            <div className="flex flex-col items-end gap-2">
                                {isGenerating ? (
                                    <button
                                        type="button"
                                        onClick={onAbort}
                                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        aria-label="Cancel generation"
                                    >
                                        <X className="w-4 h-4" aria-hidden="true" />
                                        Cancel
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={!canGenerate}
                                        className={`px-6 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-orange-500 ${canGenerate
                                            ? "bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white hover:scale-105 shadow-lg"
                                            : "bg-white/10 text-white/50 cursor-not-allowed"
                                            }`}
                                        aria-label={
                                            canGenerate
                                                ? "Generate image"
                                                : "Please upload an image and enter a description to generate"
                                        }
                                    >
                                        <Wand2 className="w-4 h-4" aria-hidden="true" />
                                        <span>Generate</span>
                                    </button>
                                )}
                                <GenerationStatus generationState={generationState} />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </ScaleIn>
    );
};

export default ChatInterface;