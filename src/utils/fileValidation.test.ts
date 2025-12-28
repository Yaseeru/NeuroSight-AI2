/**
 * Property-Based Tests for File Validation
 * Tests Properties 2 and 3 from the design document
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { validateFile } from './fileValidation';
import { ACCEPTED_MIME_TYPES, MAX_FILE_SIZE } from '../types';

/**
 * Helper to create a mock File object
 */
function createMockFile(name: string, size: number, type: string): File {
     const content = new Uint8Array(Math.min(size, 1024)); // Use small buffer, size is metadata
     const blob = new Blob([content], { type });

     // Create a File-like object with the correct size
     return new File([blob], name, { type });
}

/**
 * Helper to create a mock File with specific size
 */
function createMockFileWithSize(name: string, size: number, type: string): File {
     // For testing, we create a file object and override size via Object.defineProperty
     const blob = new Blob(['x'], { type });
     const file = new File([blob], name, { type });

     // Override the size property for testing
     Object.defineProperty(file, 'size', { value: size, writable: false });

     return file;
}

describe('File Validation - Property Tests', () => {
     /**
      * **Feature: neurosight-ui, Property 2: Valid image files are accepted**
      * **Validates: Requirements 3.3**
      * 
      * For any file with MIME type 'image/jpeg', 'image/png', or 'image/tiff',
      * the file validation function SHALL return `isValid: true` and the file
      * SHALL be accepted for preview.
      */
     describe('Property 2: Valid image files are accepted', () => {
          it('accepts all valid MIME types with valid file sizes', () => {
               const validMimeTypeArb = fc.constantFrom(...ACCEPTED_MIME_TYPES);
               const validFileSizeArb = fc.integer({ min: 1, max: MAX_FILE_SIZE });
               const fileNameArb = fc.string({ minLength: 1, maxLength: 50 })
                    .filter(s => s.trim().length > 0)
                    .map(s => s.replace(/[<>:"/\\|?*]/g, '_') + '.img');

               fc.assert(
                    fc.property(
                         validMimeTypeArb,
                         validFileSizeArb,
                         fileNameArb,
                         (mimeType, fileSize, fileName) => {
                              const file = createMockFileWithSize(fileName, fileSize, mimeType);
                              const result = validateFile(file);

                              expect(result.isValid).toBe(true);
                              expect(result.error).toBeUndefined();
                         }
                    ),
                    { numRuns: 100 }
               );
          });

          it('accepts image/jpeg files', () => {
               const fileSizeArb = fc.integer({ min: 1, max: MAX_FILE_SIZE });

               fc.assert(
                    fc.property(fileSizeArb, (fileSize) => {
                         const file = createMockFileWithSize('test.jpg', fileSize, 'image/jpeg');
                         const result = validateFile(file);

                         expect(result.isValid).toBe(true);
                    }),
                    { numRuns: 100 }
               );
          });

          it('accepts image/png files', () => {
               const fileSizeArb = fc.integer({ min: 1, max: MAX_FILE_SIZE });

               fc.assert(
                    fc.property(fileSizeArb, (fileSize) => {
                         const file = createMockFileWithSize('test.png', fileSize, 'image/png');
                         const result = validateFile(file);

                         expect(result.isValid).toBe(true);
                    }),
                    { numRuns: 100 }
               );
          });

          it('accepts image/tiff files', () => {
               const fileSizeArb = fc.integer({ min: 1, max: MAX_FILE_SIZE });

               fc.assert(
                    fc.property(fileSizeArb, (fileSize) => {
                         const file = createMockFileWithSize('test.tiff', fileSize, 'image/tiff');
                         const result = validateFile(file);

                         expect(result.isValid).toBe(true);
                    }),
                    { numRuns: 100 }
               );
          });
     });

     /**
      * **Feature: neurosight-ui, Property 3: Invalid files are rejected**
      * **Validates: Requirements 3.4**
      * 
      * For any file with MIME type not in ['image/jpeg', 'image/png', 'image/tiff'],
      * the file validation function SHALL return `isValid: false` with an
      * appropriate error message.
      */
     describe('Property 3: Invalid files are rejected', () => {
          it('rejects files with invalid MIME types', () => {
               const invalidMimeTypes = [
                    'application/pdf',
                    'text/plain',
                    'text/html',
                    'application/json',
                    'image/gif',
                    'image/webp',
                    'image/bmp',
                    'video/mp4',
                    'audio/mpeg',
                    'application/octet-stream',
               ];

               const invalidMimeTypeArb = fc.constantFrom(...invalidMimeTypes);
               const fileSizeArb = fc.integer({ min: 1, max: MAX_FILE_SIZE });

               fc.assert(
                    fc.property(
                         invalidMimeTypeArb,
                         fileSizeArb,
                         (mimeType, fileSize) => {
                              const file = createMockFileWithSize('test.file', fileSize, mimeType);
                              const result = validateFile(file);

                              expect(result.isValid).toBe(false);
                              expect(result.error).toBe('Please upload a JPG, PNG, or TIFF image file.');
                         }
                    ),
                    { numRuns: 100 }
               );
          });

          it('rejects files that exceed size limit', () => {
               const validMimeTypeArb = fc.constantFrom(...ACCEPTED_MIME_TYPES);
               // Files larger than MAX_FILE_SIZE
               const oversizedArb = fc.integer({ min: MAX_FILE_SIZE + 1, max: MAX_FILE_SIZE * 2 });

               fc.assert(
                    fc.property(
                         validMimeTypeArb,
                         oversizedArb,
                         (mimeType, fileSize) => {
                              const file = createMockFileWithSize('large.img', fileSize, mimeType);
                              const result = validateFile(file);

                              expect(result.isValid).toBe(false);
                              expect(result.error).toBe('File size exceeds 10MB limit. Please upload a smaller image.');
                         }
                    ),
                    { numRuns: 100 }
               );
          });

          it('rejects files with empty MIME type', () => {
               const fileSizeArb = fc.integer({ min: 1, max: MAX_FILE_SIZE });

               fc.assert(
                    fc.property(fileSizeArb, (fileSize) => {
                         const file = createMockFileWithSize('test.file', fileSize, '');
                         const result = validateFile(file);

                         expect(result.isValid).toBe(false);
                         expect(result.error).toBe('Please upload a JPG, PNG, or TIFF image file.');
                    }),
                    { numRuns: 100 }
               );
          });
     });
});
