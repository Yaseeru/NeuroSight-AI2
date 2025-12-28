/**
 * File Validation Utility
 * Validates MRI image files for upload
 */

import type { FileValidationResult } from '../types';
import { ACCEPTED_MIME_TYPES, MAX_FILE_SIZE } from '../types';

/**
 * Validates a file for MRI upload
 * @param file - The file to validate
 * @returns FileValidationResult with isValid flag and optional error message
 */
export function validateFile(file: File): FileValidationResult {
     // Check MIME type
     if (!ACCEPTED_MIME_TYPES.includes(file.type as typeof ACCEPTED_MIME_TYPES[number])) {
          return {
               isValid: false,
               error: 'Please upload a JPG, PNG, or TIFF image file.',
          };
     }

     // Check file size
     if (file.size > MAX_FILE_SIZE) {
          return {
               isValid: false,
               error: 'File size exceeds 10MB limit. Please upload a smaller image.',
          };
     }

     return { isValid: true };
}
