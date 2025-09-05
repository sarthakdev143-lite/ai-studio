import { ImageUploadProps } from "@/types";
import { X } from "lucide-react";

const ImageUpload: React.FC<ImageUploadProps> = ({ fileInputRef, uploadedImage, onClear, onFileUpload, dragActive, onDragOver, onDragLeave, onDrop }) => {

  return (
    <>
      {uploadedImage && (
        <div className="mb-4 bottom-full w-32 relative">
          <img
            src={uploadedImage}
            alt="Uploaded preview"
            className="object-cover rounded-xl shadow-lg mx-auto"
          />
          <button
            onClick={onClear}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 cursor-pointer rounded-full flex items-center justify-center text-white text-xs transition-colors opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Remove image"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileUpload(file);
        }}
        className="hidden"
        aria-label="Upload an image"
      />
    </>
  );
};

export default ImageUpload;