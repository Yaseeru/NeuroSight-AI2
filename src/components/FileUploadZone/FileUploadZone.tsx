import { useRef, useState, useCallback } from 'react';
import type { FileUploadZoneProps } from '../../types';
import { validateFile } from '../../utils/fileValidation';

/**
 * FileUploadZone Component
 * Drag-and-drop file upload zone with click-to-upload fallback
 * Requirements: 3.1, 3.2, 3.3, 3.4, 7.2, 7.4
 */
export function FileUploadZone({
     onFileSelect,
     onError,
     acceptedTypes = ['image/jpeg', 'image/png', 'image/tiff'],
     disabled = false,
}: FileUploadZoneProps) {
     const [isDragOver, setIsDragOver] = useState(false);
     const [errorMessage, setErrorMessage] = useState<string | null>(null);
     const fileInputRef = useRef<HTMLInputElement>(null);

     const handleFile = useCallback(
          (file: File) => {
               setErrorMessage(null);
               const validation = validateFile(file);

               if (!validation.isValid) {
                    const error = validation.error || 'Invalid file';
                    setErrorMessage(error);
                    onError(error);
                    return;
               }

               onFileSelect(file);
          },
          [onFileSelect, onError]
     );

     const handleDragOver = useCallback(
          (e: React.DragEvent<HTMLDivElement>) => {
               e.preventDefault();
               e.stopPropagation();
               if (!disabled) {
                    setIsDragOver(true);
               }
          },
          [disabled]
     );

     const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragOver(false);
     }, []);

     const handleDrop = useCallback(
          (e: React.DragEvent<HTMLDivElement>) => {
               e.preventDefault();
               e.stopPropagation();
               setIsDragOver(false);

               if (disabled) return;

               const files = e.dataTransfer.files;
               if (files.length > 0) {
                    handleFile(files[0]);
               }
          },
          [disabled, handleFile]
     );

     const handleClick = useCallback(() => {
          if (!disabled && fileInputRef.current) {
               fileInputRef.current.click();
          }
     }, [disabled]);

     const handleInputChange = useCallback(
          (e: React.ChangeEvent<HTMLInputElement>) => {
               const files = e.target.files;
               if (files && files.length > 0) {
                    handleFile(files[0]);
               }
               // Reset input so the same file can be selected again
               e.target.value = '';
          },
          [handleFile]
     );

     return (
          <div className="w-full">
               {/* Hidden file input - placed outside the button to avoid nested interactive controls */}
               <input
                    ref={fileInputRef}
                    type="file"
                    id="mri-file-input"
                    accept={acceptedTypes.join(',')}
                    onChange={handleInputChange}
                    disabled={disabled}
                    className="sr-only"
                    tabIndex={-1}
                    data-testid="file-input"
               />
               <label htmlFor="mri-file-input" className="sr-only">
                    Upload MRI scan file
               </label>

               <div
                    role="button"
                    tabIndex={disabled ? -1 : 0}
                    aria-label="Upload MRI scan file. Tap to browse files."
                    aria-disabled={disabled}
                    data-testid="file-upload-zone"
                    onClick={handleClick}
                    onKeyDown={(e) => {
                         if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleClick();
                         }
                    }}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
          min-h-[180px] md:min-h-[200px] flex flex-col items-center justify-center p-6 md:p-8
          border-2 border-dashed rounded-xl cursor-pointer
          transition-colors duration-200 touch-manipulation
          ${disabled ? 'opacity-50 cursor-not-allowed bg-neutral-gray-50' : ''}
          ${isDragOver && !disabled
                              ? 'border-primary-blue bg-blue-50'
                              : 'border-neutral-gray-300 bg-neutral-gray-50 hover:border-primary-blue hover:bg-blue-50 active:bg-blue-50'
                         }
        `}
               >
                    <svg
                         className={`w-10 h-10 md:w-12 md:h-12 mb-3 md:mb-4 ${isDragOver ? 'text-primary-blue' : 'text-neutral-gray-300'}`}
                         fill="none"
                         stroke="currentColor"
                         viewBox="0 0 24 24"
                         aria-hidden="true"
                    >
                         <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                         />
                    </svg>

                    <p className="text-base md:text-lg font-medium text-neutral-gray-900 mb-1 md:mb-2 text-center">
                         {isDragOver ? 'Drop your MRI scan here' : 'Tap to upload your MRI scan'}
                    </p>
                    <p className="text-sm text-neutral-gray-900/60 mb-3 md:mb-4 hidden md:block">or drag and drop</p>
                    <p className="text-xs text-neutral-gray-900/50 text-center">
                         Supported: JPG, PNG, TIFF (max 10MB)
                    </p>
               </div>

               {errorMessage && (
                    <div
                         role="alert"
                         className="mt-4 p-3 bg-error-red/10 border border-error-red/20 rounded-lg"
                         data-testid="error-message"
                    >
                         <p className="text-sm text-error-red font-medium">{errorMessage}</p>
                    </div>
               )}
          </div>
     );
}

export default FileUploadZone;
