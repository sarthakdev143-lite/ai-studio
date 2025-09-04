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