export interface GenerationResult {
    id: string;
    imageUrl: string;
    originalImageUrl: string;
    prompt: string;
    style: string;
    createdAt: number;
}

export interface GenerationState {
    isLoading: boolean;
    isAborted: boolean;
    retryCount: number;
    error: string | null;
}

export interface AnimationProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}

export interface ChatInterfaceProps {
    onGenerate: (data: { prompt: string; image: string; style: string }) => void;
    isGenerating: boolean;
    generationState: GenerationState;
    onAbort: () => void;
}

export interface StyleSelectorProps {
    selectedStyle: string;
    onStyleChange: (style: string) => void;
    isOpen: boolean;
    onToggle: () => void;
}

export interface ImageUploadProps {
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    uploadedImage: string;
    onClear: () => void;
    onFileUpload: (file: File) => void;
    dragActive: boolean;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
}

export interface GenerationStatusProps {
    generationState: GenerationState;
}

export interface GenerationResultProps {
    result: GenerationResult;
}

export interface HistoryItemProps {
    item: GenerationResult;
    isSelected: boolean;
    onClick: () => void;
}
