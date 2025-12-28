import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FileUploadZone } from './FileUploadZone';

/**
 * Unit tests for FileUploadZone component
 * Requirements: 3.1, 3.2, 3.3, 3.4
 */
describe('FileUploadZone', () => {
     const createMockFile = (
          name: string,
          type: string,
          size: number = 1024
     ): File => {
          // Create a minimal file and override the size property
          const file = new File([''], name, { type });
          Object.defineProperty(file, 'size', { value: size, writable: false });
          return file;
     };

     describe('Drag-over visual feedback (Requirement 3.2)', () => {
          it('should show visual feedback when dragging over the upload zone', () => {
               const onFileSelect = vi.fn();
               const onError = vi.fn();

               render(<FileUploadZone onFileSelect={onFileSelect} onError={onError} />);

               const uploadZone = screen.getByTestId('file-upload-zone');

               // Initial state - should have default border
               expect(uploadZone).toHaveClass('border-neutral-gray-300');

               // Simulate drag over
               fireEvent.dragOver(uploadZone, {
                    dataTransfer: { files: [] },
               });

               // Should show active state with blue border
               expect(uploadZone).toHaveClass('border-primary-blue');
               expect(uploadZone).toHaveClass('bg-blue-50');
          });

          it('should remove visual feedback when drag leaves the zone', () => {
               const onFileSelect = vi.fn();
               const onError = vi.fn();

               render(<FileUploadZone onFileSelect={onFileSelect} onError={onError} />);

               const uploadZone = screen.getByTestId('file-upload-zone');

               // Simulate drag over then leave
               fireEvent.dragOver(uploadZone);
               fireEvent.dragLeave(uploadZone);

               // Should return to default state
               expect(uploadZone).toHaveClass('border-neutral-gray-300');
          });

          it('should not show drag feedback when disabled', () => {
               const onFileSelect = vi.fn();
               const onError = vi.fn();

               render(
                    <FileUploadZone
                         onFileSelect={onFileSelect}
                         onError={onError}
                         disabled={true}
                    />
               );

               const uploadZone = screen.getByTestId('file-upload-zone');

               fireEvent.dragOver(uploadZone);

               // Should remain in disabled state, not show active border
               expect(uploadZone).toHaveClass('opacity-50');
          });
     });

     describe('Valid file acceptance (Requirement 3.3)', () => {
          it('should accept valid JPEG files', () => {
               const onFileSelect = vi.fn();
               const onError = vi.fn();

               render(<FileUploadZone onFileSelect={onFileSelect} onError={onError} />);

               const uploadZone = screen.getByTestId('file-upload-zone');
               const validFile = createMockFile('test.jpg', 'image/jpeg');

               fireEvent.drop(uploadZone, {
                    dataTransfer: { files: [validFile] },
               });

               expect(onFileSelect).toHaveBeenCalledWith(validFile);
               expect(onError).not.toHaveBeenCalled();
          });

          it('should accept valid PNG files', () => {
               const onFileSelect = vi.fn();
               const onError = vi.fn();

               render(<FileUploadZone onFileSelect={onFileSelect} onError={onError} />);

               const uploadZone = screen.getByTestId('file-upload-zone');
               const validFile = createMockFile('test.png', 'image/png');

               fireEvent.drop(uploadZone, {
                    dataTransfer: { files: [validFile] },
               });

               expect(onFileSelect).toHaveBeenCalledWith(validFile);
               expect(onError).not.toHaveBeenCalled();
          });

          it('should accept valid TIFF files', () => {
               const onFileSelect = vi.fn();
               const onError = vi.fn();

               render(<FileUploadZone onFileSelect={onFileSelect} onError={onError} />);

               const uploadZone = screen.getByTestId('file-upload-zone');
               const validFile = createMockFile('test.tiff', 'image/tiff');

               fireEvent.drop(uploadZone, {
                    dataTransfer: { files: [validFile] },
               });

               expect(onFileSelect).toHaveBeenCalledWith(validFile);
               expect(onError).not.toHaveBeenCalled();
          });

          it('should accept files via click input', () => {
               const onFileSelect = vi.fn();
               const onError = vi.fn();

               render(<FileUploadZone onFileSelect={onFileSelect} onError={onError} />);

               const fileInput = screen.getByTestId('file-input');
               const validFile = createMockFile('test.jpg', 'image/jpeg');

               fireEvent.change(fileInput, {
                    target: { files: [validFile] },
               });

               expect(onFileSelect).toHaveBeenCalledWith(validFile);
          });
     });

     describe('Invalid file rejection with error message (Requirement 3.4)', () => {
          it('should reject non-image files and show error message', () => {
               const onFileSelect = vi.fn();
               const onError = vi.fn();

               render(<FileUploadZone onFileSelect={onFileSelect} onError={onError} />);

               const uploadZone = screen.getByTestId('file-upload-zone');
               const invalidFile = createMockFile('test.pdf', 'application/pdf');

               fireEvent.drop(uploadZone, {
                    dataTransfer: { files: [invalidFile] },
               });

               expect(onFileSelect).not.toHaveBeenCalled();
               expect(onError).toHaveBeenCalledWith(
                    'Please upload a JPG, PNG, or TIFF image file.'
               );

               // Error message should be displayed
               const errorMessage = screen.getByTestId('error-message');
               expect(errorMessage).toBeInTheDocument();
               expect(errorMessage).toHaveTextContent(
                    'Please upload a JPG, PNG, or TIFF image file.'
               );
          });

          it('should reject files exceeding size limit', () => {
               const onFileSelect = vi.fn();
               const onError = vi.fn();

               render(<FileUploadZone onFileSelect={onFileSelect} onError={onError} />);

               const uploadZone = screen.getByTestId('file-upload-zone');
               // Create a file larger than 10MB
               const largeFile = createMockFile(
                    'large.jpg',
                    'image/jpeg',
                    11 * 1024 * 1024
               );

               fireEvent.drop(uploadZone, {
                    dataTransfer: { files: [largeFile] },
               });

               expect(onFileSelect).not.toHaveBeenCalled();
               expect(onError).toHaveBeenCalledWith(
                    'File size exceeds 10MB limit. Please upload a smaller image.'
               );
          });

          it('should clear error message when valid file is uploaded', () => {
               const onFileSelect = vi.fn();
               const onError = vi.fn();

               render(<FileUploadZone onFileSelect={onFileSelect} onError={onError} />);

               const uploadZone = screen.getByTestId('file-upload-zone');

               // First upload invalid file
               const invalidFile = createMockFile('test.pdf', 'application/pdf');
               fireEvent.drop(uploadZone, {
                    dataTransfer: { files: [invalidFile] },
               });

               expect(screen.getByTestId('error-message')).toBeInTheDocument();

               // Then upload valid file
               const validFile = createMockFile('test.jpg', 'image/jpeg');
               fireEvent.drop(uploadZone, {
                    dataTransfer: { files: [validFile] },
               });

               expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
          });
     });

     describe('Disabled state', () => {
          it('should not accept files when disabled', () => {
               const onFileSelect = vi.fn();
               const onError = vi.fn();

               render(
                    <FileUploadZone
                         onFileSelect={onFileSelect}
                         onError={onError}
                         disabled={true}
                    />
               );

               const uploadZone = screen.getByTestId('file-upload-zone');
               const validFile = createMockFile('test.jpg', 'image/jpeg');

               fireEvent.drop(uploadZone, {
                    dataTransfer: { files: [validFile] },
               });

               expect(onFileSelect).not.toHaveBeenCalled();
          });

          it('should have aria-disabled attribute when disabled', () => {
               const onFileSelect = vi.fn();
               const onError = vi.fn();

               render(
                    <FileUploadZone
                         onFileSelect={onFileSelect}
                         onError={onError}
                         disabled={true}
                    />
               );

               const uploadZone = screen.getByTestId('file-upload-zone');
               expect(uploadZone).toHaveAttribute('aria-disabled', 'true');
          });
     });

     describe('Accessibility', () => {
          it('should have proper aria-label', () => {
               const onFileSelect = vi.fn();
               const onError = vi.fn();

               render(<FileUploadZone onFileSelect={onFileSelect} onError={onError} />);

               const uploadZone = screen.getByTestId('file-upload-zone');
               // Updated aria-label includes tap-to-upload instruction for mobile accessibility
               expect(uploadZone).toHaveAttribute('aria-label', 'Upload MRI scan file. Tap to browse files.');
          });

          it('should be keyboard accessible', () => {
               const onFileSelect = vi.fn();
               const onError = vi.fn();

               render(<FileUploadZone onFileSelect={onFileSelect} onError={onError} />);

               const uploadZone = screen.getByTestId('file-upload-zone');
               expect(uploadZone).toHaveAttribute('tabIndex', '0');
               expect(uploadZone).toHaveAttribute('role', 'button');
          });
     });
});
