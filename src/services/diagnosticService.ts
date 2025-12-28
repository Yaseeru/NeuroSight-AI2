import type { DiagnosticResult, AlzheimerStage } from '../types';

/**
 * Mock Diagnostic Service
 * Simulates AI-powered MRI analysis with 2-3 second processing delay
 * Requirements: 5.1
 */

// Possible Alzheimer stages for mock results
const ALZHEIMER_STAGES: AlzheimerStage[] = [
     'Non-Demented',
     'Very Mild Dementia',
     'Mild Dementia',
     'Moderate Dementia',
];

/**
 * Generates a random delay between min and max milliseconds
 */
const randomDelay = (min: number, max: number): number => {
     return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generates a mock diagnostic result
 * In production, this would call the actual AI backend API
 */
const generateMockResult = (): DiagnosticResult => {
     // Randomly select a stage with weighted probability
     // More likely to return milder stages (realistic distribution)
     const weights = [0.4, 0.3, 0.2, 0.1]; // Non-Demented most common
     const random = Math.random();
     let cumulativeWeight = 0;
     let selectedIndex = 0;

     for (let i = 0; i < weights.length; i++) {
          cumulativeWeight += weights[i];
          if (random < cumulativeWeight) {
               selectedIndex = i;
               break;
          }
     }

     const prediction = ALZHEIMER_STAGES[selectedIndex];

     // Generate confidence between 65% and 95%
     const confidence = Math.round((65 + Math.random() * 30) * 10) / 10;

     return {
          prediction,
          confidence,
          timestamp: new Date().toISOString(),
     };
};

/**
 * Analyzes an MRI image and returns a diagnostic result
 * Simulates 2-3 second processing delay
 * 
 * @param file - The MRI image file to analyze
 * @returns Promise<DiagnosticResult> - The analysis result
 */
export async function analyzeImage(file: File): Promise<DiagnosticResult> {
     // Validate that we received a file (basic sanity check)
     if (!file) {
          throw new Error('No file provided for analysis');
     }

     // Simulate processing delay (2-3 seconds)
     const delay = randomDelay(2000, 3000);
     await new Promise(resolve => setTimeout(resolve, delay));

     // Generate and return mock result
     return generateMockResult();
}

/**
 * Creates a diagnostic service instance
 * Useful for dependency injection and testing
 */
export function createDiagnosticService() {
     return {
          analyzeImage,
     };
}

export default {
     analyzeImage,
     createDiagnosticService,
};
