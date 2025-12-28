/**
 * NeuroSight AI - Type Definitions
 * Core types for the Alzheimer's screening application
 */

// Classification Types
export type AlzheimerStage =
     | 'Non-Demented'
     | 'Very Mild Dementia'
     | 'Mild Dementia'
     | 'Moderate Dementia';

// Diagnostic Flow State
export type DiagnosticFlowState = 'idle' | 'file-selected' | 'processing' | 'results' | 'error';

// Diagnostic Result
export interface DiagnosticResult {
     prediction: AlzheimerStage;
     confidence: number;
     timestamp: string;
}

// Diagnostic State
export interface DiagnosticState {
     flowState: DiagnosticFlowState;
     selectedFile: File | null;
     previewUrl: string | null;
     result: DiagnosticResult | null;
     error: string | null;
}

// File Validation
export interface FileValidationResult {
     isValid: boolean;
     error?: string;
}

export const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/tiff'] as const;
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Component Props Interfaces
export interface HeroSectionProps {
     headline: string;
     subheadline: string;
     ctaText: string;
     onCtaClick: () => void;
}

export interface Feature {
     icon: string;
     title: string;
     description: string;
}

export interface FeaturesGridProps {
     features: Feature[];
}

export interface FileUploadZoneProps {
     onFileSelect: (file: File) => void;
     onError: (message: string) => void;
     acceptedTypes?: string[];
     disabled?: boolean;
}

export interface ImagePreviewProps {
     file: File | null;
     onRemove: () => void;
}

export interface ProcessingLoaderProps {
     isProcessing: boolean;
     message?: string;
}

export interface ResultsDisplayProps {
     prediction: string;
     confidence: number;
     disclaimer: string;
}

export interface ConfidenceBarProps {
     percentage: number;
     label?: string;
}

export interface SupportWidgetProps {
     discordUrl: string;
     buttonText: string;
}

// Service Interface
export interface DiagnosticService {
     analyzeImage(file: File): Promise<DiagnosticResult>;
}
