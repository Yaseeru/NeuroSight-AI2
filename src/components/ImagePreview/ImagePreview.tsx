import { useMemo } from 'react';
import type { ImagePreviewProps } from '../../types';

/**
 * ImagePreview Component
 * Displays a thumbnail preview of the uploaded MRI image with remove option
 * Requirements: 3.3, 7.3
 */
export function ImagePreview({ file, onRemove }: ImagePreviewProps) {
     const previewUrl = useMemo(() => {
          if (!file) return null;
          return URL.createObjectURL(file);
     }, [file]);

     if (!file || !previewUrl) {
          return null;
     }

     return (
          <div className="relative inline-block" data-testid="image-preview">
               <div className="relative rounded-lg overflow-hidden border-2 border-neutral-gray-200 bg-neutral-gray-50">
                    <img
                         src={previewUrl}
                         alt="Uploaded MRI scan preview"
                         className="w-36 h-36 sm:w-40 sm:h-40 md:w-48 md:h-48 object-cover"
                         onLoad={() => {
                              // Revoke URL after image loads to free memory
                              // Note: We don't revoke immediately to allow the image to render
                         }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-neutral-gray-900/70 px-2 py-1 md:px-3 md:py-2">
                         <p className="text-xs text-neutral-white truncate" title={file.name}>
                              {file.name}
                         </p>
                         <p className="text-xs text-neutral-white/70">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                         </p>
                    </div>
               </div>

               <button
                    type="button"
                    onClick={onRemove}
                    aria-label="Remove uploaded image"
                    className="absolute -top-2 -right-2 w-11 h-11 flex items-center justify-center
          bg-error-red text-neutral-white rounded-full
          hover:bg-error-red/90 focus:outline-none focus:ring-2 focus:ring-error-red focus:ring-offset-2
          transition-colors duration-200"
                    data-testid="remove-button"
               >
                    <svg
                         className="w-4 h-4"
                         fill="none"
                         stroke="currentColor"
                         viewBox="0 0 24 24"
                         aria-hidden="true"
                    >
                         <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                         />
                    </svg>
               </button>
          </div>
     );
}

export default ImagePreview;
