import { ChatInterfaceProps } from "@/types";
import { downscaleImage } from "@/utils/downscaleImage";
import { ImageIcon, X, Wand2 } from "lucide-react";
import { useState, useRef } from "react";
import ScaleIn from "./animations/ScaleIn";
import ImageUpload from "./ImageUpload";
import StyleSelector from "./StyleSelector";
import GenerationStatus from "./GenerationStatus";

const ChatInterface: React.FC<ChatInterfaceProps> = ({
    onGenerate,
    isGenerating,
    generationState,
    onAbort,
}) => {
    const [prompt, setPrompt] = useState("");
    const [uploadedImage, setUploadedImage] = useState("");
    const [selectedStyle, setSelectedStyle] = useState("editorial");
    const [showStyleSelector, setShowStyleSelector] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const clearUploadedImage = () => {
        setUploadedImage("");
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // reset file input
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
            fileInputRef.current.value = ""; // reset file input
        }
        setDragActive(false);

        // 👇 scroll to "Your Creations"
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
                <form
                    onSubmit={handleSubmit}
                    className={`relative backdrop-blur-xl bg-black/30 border-2 rounded-3xl p-6 shadow-2xl transition-all duration-300 ${dragActive
                        ? "border-orange-500 bg-orange-500/10 scale-[1.02]"
                        : "border-white/20 hover:border-white/30"
                        }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
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

                    {/* Main Textarea */}
                    <div className="relative">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder={
                                uploadedImage
                                    ? "Describe how you want to transform your image..."
                                    : "Upload an image and describe your vision..."
                            }
                            className="w-full bg-transparent text-white placeholder-white/60 resize-none outline-none text-lg min-h-[80px] max-h-[200px] rounded-lg p-5"
                            rows={4}
                            maxLength={500}
                            aria-label="Describe your vision"
                        />

                        {/* Image Upload Button (when no image) */}
                        {!uploadedImage && (
                            <button
                                type="button" // ✅ prevent accidental submit
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute top-3 right-3 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors group focus:outline-none focus:ring-2 focus:ring-orange-500"
                                aria-label="Upload Image"
                            >
                                <ImageIcon
                                    className="w-5 h-5 text-white/70 group-hover:text-white"
                                    aria-hidden="true"
                                />
                            </button>
                        )}
                    </div>

                    <GenerationStatus generationState={generationState} />

                    {/* Bottom Controls */}
                    <div className="flex items-center justify-between">
                        <StyleSelector
                            selectedStyle={selectedStyle}
                            onStyleChange={setSelectedStyle}
                            isOpen={showStyleSelector}
                            onToggle={() =>
                                setShowStyleSelector(!showStyleSelector)
                            }
                        />

                        <div className="flex items-center gap-3">
                            <span className="text-white/60 text-sm">
                                {500 - prompt.length} left
                            </span>

                            {isGenerating ? (
                                <button
                                    type="button" // ✅ not submit, just abort
                                    onClick={onAbort}
                                    className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    aria-label="Cancel generation"
                                >
                                    <X className="w-4 h-4" aria-hidden="true" />
                                    Cancel
                                </button>
                            ) : (
                                <button
                                    type="submit" // ✅ only this submits
                                    disabled={!canGenerate}
                                    className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-orange-500 ${canGenerate
                                        ? "bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white hover:scale-105 shadow-lg"
                                        : "bg-white/10 text-white/50 cursor-not-allowed"
                                        }`}
                                    aria-label={
                                        canGenerate
                                            ? "Generate image"
                                            : "Please upload an image and enter a description to generate"
                                    }
                                >
                                    <Wand2 className="w-5 h-5" aria-hidden="true" />
                                    <span>Generate</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Help Text */}
                    {!canGenerate && !isGenerating && (
                        <div className="mt-4 text-center text-white/50 text-sm">
                            {!uploadedImage &&
                                !prompt.trim() &&
                                "Upload an image and describe your vision to get started"}
                            {!uploadedImage &&
                                prompt.trim() &&
                                "Please upload an image to continue"}
                            {uploadedImage &&
                                !prompt.trim() &&
                                "Describe how you want to transform your image"}
                        </div>
                    )}
                </form>
            </div>
        </ScaleIn>
    );
};

export default ChatInterface;
