import { useState, useCallback } from 'react';
import type { DiagnosticFlowState, DiagnosticResult } from '../types';
import { FileUploadZone } from '../components/FileUploadZone';
import { ImagePreview } from '../components/ImagePreview';
import { ProcessingLoader } from '../components/ProcessingLoader';
import { ResultsDisplay } from '../components/ResultsDisplay';
import { SupportWidget } from '../components/SupportWidget';
import { analyzeImage as defaultAnalyzeImage } from '../services/diagnosticService';

/**
 * DiagnosticDashboard Page
 * Manages the complete diagnostic flow: idle → file-selected → processing → results
 * Requirements: 3.1, 3.5, 4.1, 4.2, 5.1
 */

interface DiagnosticDashboardProps {
     analyzeImage?: (file: File) => Promise<DiagnosticResult>;
}

export function DiagnosticDashboard({
     analyzeImage = defaultAnalyzeImage
}: DiagnosticDashboardProps) {
     const [flowState, setFlowState] = useState<DiagnosticFlowState>('idle');
     const [selectedFile, setSelectedFile] = useState<File | null>(null);
     const [result, setResult] = useState<DiagnosticResult | null>(null);
     const [error, setError] = useState<string | null>(null);

     const isProcessing = flowState === 'processing';
     const isDisabled = isProcessing;

     const handleFileSelect = useCallback((file: File) => {
          setSelectedFile(file);
          setFlowState('file-selected');
          setError(null);
          setResult(null);
     }, []);

     const handleFileError = useCallback((message: string) => {
          setError(message);
     }, []);

     const handleRemoveFile = useCallback(() => {
          setSelectedFile(null);
          setFlowState('idle');
          setError(null);
          setResult(null);
     }, []);

     const handleAnalyze = useCallback(async () => {
          if (!selectedFile) return;

          setFlowState('processing');
          setError(null);

          try {
               const analysisResult = await analyzeImage(selectedFile);
               setResult(analysisResult);
               setFlowState('results');
          } catch (err) {
               setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
               setFlowState('error');
          }
     }, [selectedFile, analyzeImage]);

     const handleRetry = useCallback(() => {
          setFlowState(selectedFile ? 'file-selected' : 'idle');
          setError(null);
          setResult(null);
     }, [selectedFile]);

     const handleStartOver = useCallback(() => {
          setSelectedFile(null);
          setFlowState('idle');
          setError(null);
          setResult(null);
     }, []);

     return (
          <div className="min-h-screen bg-neutral-gray-50 py-6 px-4 md:py-8 lg:py-12">
               <div className="max-w-2xl mx-auto lg:max-w-4xl">
                    {/* Header */}
                    <header className="text-center mb-6 md:mb-8">
                         <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-gray-900 mb-2">
                              MRI Analysis
                         </h1>
                         <p className="text-sm md:text-base text-neutral-gray-900/60">
                              Upload your MRI scan for AI-powered Alzheimer's screening
                         </p>
                    </header>

                    {/* Main Content */}
                    <main className="space-y-6">
                         {/* File Upload Section - shown in idle and file-selected states */}
                         {(flowState === 'idle' || flowState === 'file-selected' || flowState === 'error') && (
                              <section aria-label="File upload">
                                   <FileUploadZone
                                        onFileSelect={handleFileSelect}
                                        onError={handleFileError}
                                        disabled={isDisabled}
                                   />
                              </section>
                         )}

                         {/* Image Preview - shown when file is selected */}
                         {selectedFile && flowState !== 'processing' && flowState !== 'results' && (
                              <section aria-label="Image preview" className="flex flex-col items-center gap-4">
                                   <ImagePreview file={selectedFile} onRemove={handleRemoveFile} />

                                   {/* Analyze Button - Requirements 3.5, 7.2 */}
                                   <button
                                        type="button"
                                        onClick={handleAnalyze}
                                        disabled={isDisabled}
                                        aria-label="Analyze uploaded MRI scan"
                                        data-testid="analyze-button"
                                        className="px-8 py-3 bg-primary-blue text-neutral-white font-semibold rounded-lg
                  hover:bg-primary-blue/90 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors duration-200 min-h-[48px] min-w-[120px]"
                                   >
                                        Analyze MRI
                                   </button>
                              </section>
                         )}

                         {/* Processing State - Requirements 4.1, 4.2, 4.3 */}
                         {flowState === 'processing' && (
                              <section aria-label="Processing" data-testid="processing-section">
                                   <ProcessingLoader
                                        isProcessing={true}
                                        message="Analyzing your MRI scan..."
                                   />
                              </section>
                         )}

                         {/* Results Display - Requirements 5.1, 5.2, 5.3, 5.4 */}
                         {flowState === 'results' && result && (
                              <section aria-label="Results" className="space-y-6">
                                   <ResultsDisplay
                                        prediction={result.prediction}
                                        confidence={result.confidence}
                                        disclaimer="This result is generated by AI and is not a medical diagnosis. Please consult a neurologist."
                                   />

                                   {/* Support Widget - Requirements 6.1, 6.2, 6.3 */}
                                   <SupportWidget
                                        discordUrl="https://discord.gg/bYjWjZj2"
                                        buttonText="Join our Caregiver Support Group"
                                   />

                                   {/* Start Over Button */}
                                   <div className="text-center">
                                        <button
                                             type="button"
                                             onClick={handleStartOver}
                                             aria-label="Start over and analyze another MRI scan"
                                             data-testid="start-over-button"
                                             className="px-6 py-2 text-primary-blue font-medium hover:underline
                    focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2
                    min-h-[44px]"
                                        >
                                             Analyze Another Scan
                                        </button>
                                   </div>
                              </section>
                         )}

                         {/* Error State */}
                         {flowState === 'error' && error && (
                              <section aria-label="Error" className="text-center">
                                   <div
                                        role="alert"
                                        className="p-4 bg-error-red/10 border border-error-red/20 rounded-lg mb-4"
                                        data-testid="error-alert"
                                   >
                                        <p className="text-error-red font-medium">{error}</p>
                                   </div>
                                   <button
                                        type="button"
                                        onClick={handleRetry}
                                        aria-label="Try analyzing the MRI scan again"
                                        data-testid="retry-button"
                                        className="px-6 py-2 bg-primary-blue text-neutral-white font-semibold rounded-lg
                  hover:bg-primary-blue/90 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2
                  min-h-[48px]"
                                   >
                                        Try Again
                                   </button>
                              </section>
                         )}
                    </main>
               </div>
          </div>
     );
}

export default DiagnosticDashboard;
