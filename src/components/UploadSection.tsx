import React, { useRef, useState, useEffect } from 'react';
import { Upload, ImageIcon } from 'lucide-react';

interface UploadSectionProps {
    uploadedImage: string;
    onImageUpload: (imageUrl: string) => void;
}

interface FadeInUpProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}

const FadeInUp: React.FC<FadeInUpProps> = ({ children, delay = 0, className = "" }) => {
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

interface ScaleInProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}

const ScaleIn: React.FC<ScaleInProps> = ({ children, delay = 0, className = "" }) => {
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

const UploadSection: React.FC<UploadSectionProps> = ({
    uploadedImage,
    onImageUpload
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                onImageUpload(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = Array.from(e.dataTransfer.files);
        const imageFile = files.find(file => file.type.startsWith('image/'));

        if (imageFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                onImageUpload(e.target?.result as string);
            };
            reader.readAsDataURL(imageFile);
        }
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

    return (
        <FadeInUp delay={100}>
            <section
                className="backdrop-blur-xl bg-black/20 border border-white/20 rounded-2xl p-8 hover:bg-black/30 transition-all duration-300"
                role="region"
                aria-labelledby="upload-heading"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-orange-500/20 rounded-lg">
                        <Upload className="w-6 h-6 text-orange-400" />
                    </div>
                    <h2 id="upload-heading" className="text-2xl font-semibold text-white">
                        Upload Image
                    </h2>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    aria-label="Upload image file"
                />

                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full h-64 border-2 border-dashed rounded-2xl transition-all duration-300 flex flex-col items-center justify-center gap-4 cursor-pointer group ${dragActive
                            ? 'border-orange-500 bg-orange-500/10'
                            : uploadedImage
                                ? 'border-green-500/50 bg-green-500/5'
                                : 'border-white/30 hover:border-orange-500/50 hover:bg-orange-500/5'
                        }`}
                    role="button"
                    aria-label="Click to upload image or drag and drop"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            fileInputRef.current?.click();
                        }
                    }}
                >
                    {uploadedImage ? (
                        <ScaleIn>
                            <img
                                src={uploadedImage}
                                alt="Uploaded preview"
                                className="max-h-56 max-w-full object-contain rounded-xl shadow-lg group-hover:shadow-2xl transition-shadow duration-300"
                            />
                        </ScaleIn>
                    ) : (
                        <>
                            <div className={`p-6 rounded-2xl transition-all duration-300 ${dragActive ? 'bg-orange-500/30 scale-110' : 'bg-orange-500/20 group-hover:bg-orange-500/30 group-hover:scale-110'
                                }`}>
                                <ImageIcon className="w-16 h-16 text-orange-400" />
                            </div>
                            <div className="text-center">
                                <p className="text-xl font-semibold text-white mb-2">
                                    {dragActive ? 'Drop your image here' : 'Click to upload or drag & drop'}
                                </p>
                                <p className="text-white/60">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </>
                    )}
                </div>

                {uploadedImage && (
                    <FadeInUp delay={200}>
                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-green-400 font-medium">✓ Image uploaded successfully</span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    fileInputRef.current?.click();
                                }}
                                className="text-orange-400 hover:text-orange-300 transition-colors font-medium"
                            >
                                Change Image
                            </button>
                        </div>
                    </FadeInUp>
                )}
            </section>
        </FadeInUp>
    );
};

export default UploadSection;