import React, { useRef } from 'react';
import { Upload, ImageIcon } from 'lucide-react';

interface UploadSectionProps {
    uploadedImage: string;
    onImageUpload: (imageUrl: string) => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ uploadedImage, onImageUpload }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                onImageUpload(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg">
                    <Upload className="w-6 h-6 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">Upload Image</h2>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                aria-label="Upload image file"
            />

            <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-64 border-3 border-dashed border-indigo-200 rounded-2xl hover:border-indigo-400 hover:bg-indigo-50/50 transition-all duration-300 flex flex-col items-center justify-center gap-4 focus:outline-none focus:ring-4 focus:ring-indigo-200 group"
                aria-label="Click to upload image"
            >
                {uploadedImage ? (
                    <img
                        src={uploadedImage}
                        alt="Uploaded preview"
                        className="max-h-56 max-w-full object-contain rounded-xl shadow-lg"
                    />
                ) : (
                    <>
                        <div className="p-6 bg-indigo-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                            <ImageIcon className="w-16 h-16 text-indigo-600" />
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-semibold text-gray-700 mb-2">Drop your image here</p>
                            <p className="text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    </>
                )}
            </button>
        </section>
    );
};

export default UploadSection;