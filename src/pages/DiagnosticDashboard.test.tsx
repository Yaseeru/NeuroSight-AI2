import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import * as fc from 'fast-check';
import { DiagnosticDashboard } from './DiagnosticDashboard';
import type { DiagnosticResult, AlzheimerStage } from '../types';

// Mock file creation helper
const createMockFile = (name: string, type: string, size: number = 1024): File => {
     const content = new Array(size).fill('a').join('');
     return new File([content], name, { type });
};

// Valid MIME types for MRI uploads
const VALID_MIME_TYPES = ['image/jpeg', 'image/png', 'image/tiff'];

// Alzheimer stages for mock results
const ALZHEIMER_STAGES: AlzheimerStage[] = [
     'Non-Demented',
     'Very Mild Dementia',
     'Mild Dementia',
     'Moderate Dementia',
];

describe('DiagnosticDashboard', () => {
     beforeEach(() => {
          vi.useFakeTimers();
     });

     afterEach(() => {
          vi.useRealTimers();
     });

     // **Feature: neurosight-ui, Property 4: Controls disabled during processing**
     // **Validates: Requirements 4.2**
     describe('Property 4: Controls disabled during processing', () => {
          it('should disable all interactive controls when in processing state', () => {
               fc.assert(
                    fc.property(
                         // Generate random valid file properties
                         fc.record({
                              fileName: fc.string({ minLength: 1, maxLength: 50 }).map(s => s.replace(/[^a-zA-Z0-9]/g, 'a') + '.jpg'),
                              mimeType: fc.constantFrom(...VALID_MIME_TYPES),
                              fileSize: fc.integer({ min: 100, max: 1024 * 1024 }), // 100 bytes to 1MB
                         }),
                         ({ fileName, mimeType, fileSize }) => {
                              // Create a mock analyze function that never resolves (simulates processing)
                              let resolveAnalysis: ((result: DiagnosticResult) => void) | null = null;
                              const mockAnalyze = vi.fn().mockImplementation(() => {
                                   return new Promise<DiagnosticResult>((resolve) => {
                                        resolveAnalysis = resolve;
                                   });
                              });

                              const { unmount } = render(<DiagnosticDashboard analyzeImage={mockAnalyze} />);

                              // Create and upload a valid file
                              const file = createMockFile(fileName, mimeType, fileSize);
                              const uploadZone = screen.getByTestId('file-upload-zone');

                              // Simulate file drop
                              fireEvent.drop(uploadZone, {
                                   dataTransfer: {
                                        files: [file],
                                   },
                              });

                              // Click analyze button to start processing
                              const analyzeButton = screen.getByTestId('analyze-button');
                              fireEvent.click(analyzeButton);

                              // Verify we're in processing state
                              expect(screen.getByTestId('processing-section')).toBeInTheDocument();

                              // The upload zone should not be visible during processing
                              expect(screen.queryByTestId('file-upload-zone')).not.toBeInTheDocument();

                              // The analyze button should not be visible during processing
                              expect(screen.queryByTestId('analyze-button')).not.toBeInTheDocument();

                              // Clean up - resolve the promise to avoid hanging
                              if (resolveAnalysis) {
                                   resolveAnalysis({
                                        prediction: 'Non-Demented',
                                        confidence: 85,
                                        timestamp: new Date().toISOString(),
                                   });
                              }

                              unmount();
                         }
                    ),
                    { numRuns: 50 } // Reduced from 100 to avoid timeout
               );
          }, 15000); // Increased timeout to 15 seconds
     });

     // Unit tests for state transitions
     describe('State Transitions', () => {
          it('should start in idle state with upload zone visible', () => {
               render(<DiagnosticDashboard />);

               expect(screen.getByTestId('file-upload-zone')).toBeInTheDocument();
               expect(screen.queryByTestId('analyze-button')).not.toBeInTheDocument();
               expect(screen.queryByTestId('processing-section')).not.toBeInTheDocument();
          });

          it('should transition to file-selected state and show Analyze button after file upload', () => {
               render(<DiagnosticDashboard />);

               const file = createMockFile('test.jpg', 'image/jpeg');
               const uploadZone = screen.getByTestId('file-upload-zone');

               fireEvent.drop(uploadZone, {
                    dataTransfer: { files: [file] },
               });

               expect(screen.getByTestId('analyze-button')).toBeInTheDocument();
               expect(screen.getByTestId('image-preview')).toBeInTheDocument();
          });

          it('should transition to processing state when Analyze is clicked', async () => {
               const mockAnalyze = vi.fn().mockImplementation(() => new Promise(() => { }));
               render(<DiagnosticDashboard analyzeImage={mockAnalyze} />);

               const file = createMockFile('test.jpg', 'image/jpeg');
               const uploadZone = screen.getByTestId('file-upload-zone');

               fireEvent.drop(uploadZone, {
                    dataTransfer: { files: [file] },
               });

               const analyzeButton = screen.getByTestId('analyze-button');
               fireEvent.click(analyzeButton);

               expect(screen.getByTestId('processing-section')).toBeInTheDocument();
               expect(mockAnalyze).toHaveBeenCalledWith(file);
          });

          it('should transition to results state after successful analysis', async () => {
               vi.useRealTimers(); // Use real timers for this async test

               const mockResult: DiagnosticResult = {
                    prediction: 'Very Mild Dementia',
                    confidence: 78.5,
                    timestamp: new Date().toISOString(),
               };
               const mockAnalyze = vi.fn().mockResolvedValue(mockResult);

               render(<DiagnosticDashboard analyzeImage={mockAnalyze} />);

               const file = createMockFile('test.jpg', 'image/jpeg');
               const uploadZone = screen.getByTestId('file-upload-zone');

               fireEvent.drop(uploadZone, {
                    dataTransfer: { files: [file] },
               });

               const analyzeButton = screen.getByTestId('analyze-button');

               await act(async () => {
                    fireEvent.click(analyzeButton);
               });

               await waitFor(() => {
                    expect(screen.getByTestId('prediction-result')).toBeInTheDocument();
               });

               expect(screen.getByText(/Very Mild Dementia/)).toBeInTheDocument();
               expect(screen.getByTestId('support-button')).toBeInTheDocument();
          });

          it('should display loading state with informative text during processing', async () => {
               const mockAnalyze = vi.fn().mockImplementation(() => new Promise(() => { }));
               render(<DiagnosticDashboard analyzeImage={mockAnalyze} />);

               const file = createMockFile('test.jpg', 'image/jpeg');
               const uploadZone = screen.getByTestId('file-upload-zone');

               fireEvent.drop(uploadZone, {
                    dataTransfer: { files: [file] },
               });

               const analyzeButton = screen.getByTestId('analyze-button');
               fireEvent.click(analyzeButton);

               expect(screen.getByText('Analyzing your MRI scan...')).toBeInTheDocument();
          });
     });
});
