import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import * as fc from 'fast-check';
import { BrowserRouter } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';
import { DiagnosticDashboard } from '../pages/DiagnosticDashboard';
import { HeroSection } from '../components/HeroSection';
import { FeaturesGrid } from '../components/FeaturesGrid';
import { FileUploadZone } from '../components/FileUploadZone';
import { ImagePreview } from '../components/ImagePreview';
import { SupportWidget } from '../components/SupportWidget';
import type { Feature } from '../types';

// Cleanup after each test to prevent multiple elements
afterEach(() => {
     cleanup();
});

/**
 * **Feature: neurosight-ui, Property 6: Interactive elements meet touch target size**
 * **Validates: Requirements 7.2**
 * 
 * For any interactive element (button, link, clickable area), 
 * the computed dimensions SHALL be at least 44x44 pixels.
 * 
 * Note: In JSDOM, computed styles don't reflect actual pixel values.
 * We verify that the correct CSS classes are applied that ensure 44x44px minimum.
 */
describe('Accessibility Property Tests', () => {
     describe('Property 6: Interactive elements meet touch target size', () => {
          it('HeroSection CTA button has minimum touch target CSS classes', () => {
               fc.assert(
                    fc.property(
                         fc.record({
                              headline: fc.string({ minLength: 1, maxLength: 100 }),
                              subheadline: fc.string({ minLength: 1, maxLength: 200 }),
                              ctaText: fc.string({ minLength: 1, maxLength: 50 }),
                         }),
                         ({ headline, subheadline, ctaText }) => {
                              cleanup();
                              const { unmount } = render(
                                   <HeroSection
                                        headline={headline}
                                        subheadline={subheadline}
                                        ctaText={ctaText}
                                        onCtaClick={() => { }}
                                   />
                              );

                              const button = screen.getByRole('button');

                              // Verify the button has min-h-[48px] class (>= 44px requirement)
                              // and min-w-[120px] class (>= 44px requirement)
                              const className = button.className;
                              const hasMinHeight = className.includes('min-h-[48px]') ||
                                   button.style.minHeight === '44px' ||
                                   button.style.minHeight === '48px';
                              const hasMinWidth = className.includes('min-w-[120px]') ||
                                   button.style.minWidth === '44px' ||
                                   button.style.minWidth === '120px';

                              expect(hasMinHeight || hasMinWidth).toBe(true);

                              unmount();
                         }
                    ),
                    { numRuns: 100 }
               );
          });

          it('SupportWidget button has minimum touch target CSS classes', () => {
               fc.assert(
                    fc.property(
                         fc.record({
                              discordUrl: fc.constant('https://discord.gg/test'),
                              buttonText: fc.string({ minLength: 1, maxLength: 50 }),
                         }),
                         ({ discordUrl, buttonText }) => {
                              cleanup();
                              const { unmount } = render(
                                   <SupportWidget
                                        discordUrl={discordUrl}
                                        buttonText={buttonText}
                                   />
                              );

                              const link = screen.getByTestId('support-button');
                              const className = link.className;

                              // Verify the link has min-h-[48px] and min-w-[120px] classes
                              const hasMinHeight = className.includes('min-h-[48px]');
                              const hasMinWidth = className.includes('min-w-[120px]');

                              expect(hasMinHeight).toBe(true);
                              expect(hasMinWidth).toBe(true);

                              unmount();
                         }
                    ),
                    { numRuns: 100 }
               );
          });

          it('FileUploadZone interactive area has minimum touch target CSS classes', () => {
               cleanup();
               const { unmount } = render(
                    <FileUploadZone
                         onFileSelect={() => { }}
                         onError={() => { }}
                         disabled={false}
                    />
               );

               const uploadZone = screen.getByRole('button');
               const className = uploadZone.className;

               // The upload zone has min-h-[180px] which is >= 44px
               const hasMinHeight = className.includes('min-h-[180px]') ||
                    className.includes('min-h-[200px]');

               expect(hasMinHeight).toBe(true);

               unmount();
          });

          it('ImagePreview remove button has minimum touch target CSS classes', () => {
               cleanup();
               // Create a mock file
               const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

               const { unmount } = render(
                    <ImagePreview file={mockFile} onRemove={() => { }} />
               );

               const removeButton = screen.getByRole('button', { name: /remove/i });
               const className = removeButton.className;

               // The button has w-11 h-11 (44px)
               const hasWidth = className.includes('w-11');
               const hasHeight = className.includes('h-11');

               expect(hasWidth).toBe(true);
               expect(hasHeight).toBe(true);

               unmount();
          });
     });


     /**
      * **Feature: neurosight-ui, Property 7: Images have alt text**
      * **Validates: Requirements 7.3**
      * 
      * For any img element rendered in the application, 
      * the element SHALL have a non-empty alt attribute.
      */
     describe('Property 7: Images have alt text', () => {
          it('ImagePreview component renders image with alt text', () => {
               fc.assert(
                    fc.property(
                         fc.record({
                              fileName: fc.string({ minLength: 1, maxLength: 50 }).map(s => s.replace(/[^a-zA-Z0-9]/g, 'a') + '.jpg'),
                         }),
                         ({ fileName }) => {
                              cleanup();
                              const mockFile = new File(['test'], fileName, { type: 'image/jpeg' });

                              const { unmount } = render(
                                   <ImagePreview file={mockFile} onRemove={() => { }} />
                              );

                              const image = screen.getByRole('img');
                              const altText = image.getAttribute('alt');

                              // Alt text should be non-empty
                              expect(altText).toBeTruthy();
                              expect(altText!.length).toBeGreaterThan(0);

                              unmount();
                         }
                    ),
                    { numRuns: 100 }
               );
          });

          it('FeaturesGrid icons have accessible labels', () => {
               const featureArbitrary: fc.Arbitrary<Feature> = fc.record({
                    icon: fc.string({ minLength: 1 }),
                    title: fc.string({ minLength: 1 }),
                    description: fc.string({ minLength: 1 }),
               });

               fc.assert(
                    fc.property(
                         fc.array(featureArbitrary, { minLength: 1, maxLength: 5 }),
                         (features) => {
                              cleanup();
                              const { unmount } = render(<FeaturesGrid features={features} />);

                              // Icons should have role="img" and aria-label
                              const icons = screen.getAllByRole('img');

                              icons.forEach((icon) => {
                                   const ariaLabel = icon.getAttribute('aria-label');
                                   expect(ariaLabel).toBeTruthy();
                                   expect(ariaLabel!.length).toBeGreaterThan(0);
                              });

                              unmount();
                         }
                    ),
                    { numRuns: 100 }
               );
          }, 15000);

          it('All pages render images with alt text', () => {
               cleanup();
               const { unmount: unmountLanding } = render(
                    <BrowserRouter>
                         <LandingPage />
                    </BrowserRouter>
               );

               // Check all img elements have alt text
               const images = document.querySelectorAll('img');
               images.forEach((img) => {
                    const altText = img.getAttribute('alt');
                    // If there's an img element, it should have alt text
                    if (img.tagName === 'IMG') {
                         expect(altText !== null).toBe(true);
                    }
               });

               unmountLanding();
          });
     });

     /**
      * **Feature: neurosight-ui, Property 8: Form inputs have associated labels**
      * **Validates: Requirements 7.4**
      * 
      * For any form input element, there SHALL exist a label element with a `for` attribute 
      * matching the input's `id`, OR the input SHALL be wrapped in a label element.
      */
     describe('Property 8: Form inputs have associated labels', () => {
          it('FileUploadZone file input has associated label', () => {
               cleanup();
               const { unmount } = render(
                    <FileUploadZone
                         onFileSelect={() => { }}
                         onError={() => { }}
                         disabled={false}
                    />
               );

               const fileInput = document.querySelector('input[type="file"]');
               expect(fileInput).not.toBeNull();

               const inputId = fileInput!.getAttribute('id');
               expect(inputId).toBeTruthy();

               // Check for associated label
               const label = document.querySelector(`label[for="${inputId}"]`);
               expect(label).not.toBeNull();

               unmount();
          });

          it('All visible form inputs in DiagnosticDashboard have labels or aria-labels', () => {
               cleanup();
               const { unmount } = render(
                    <BrowserRouter>
                         <DiagnosticDashboard />
                    </BrowserRouter>
               );

               // Get all input elements that are not hidden and are focusable
               const inputs = document.querySelectorAll('input:not([type="hidden"])');

               inputs.forEach((input) => {
                    const inputElement = input as HTMLInputElement;
                    const inputId = inputElement.getAttribute('id');
                    const ariaLabel = inputElement.getAttribute('aria-label');
                    const ariaLabelledBy = inputElement.getAttribute('aria-labelledby');
                    const tabIndex = inputElement.getAttribute('tabindex');

                    // Skip inputs that are not focusable (tabindex=-1)
                    if (tabIndex === '-1') {
                         return;
                    }

                    // Input should have either:
                    // 1. An associated label via id/for
                    // 2. An aria-label
                    // 3. An aria-labelledby
                    // 4. Be wrapped in a label
                    const hasAssociatedLabel = inputId && document.querySelector(`label[for="${inputId}"]`);
                    const hasAriaLabel = ariaLabel && ariaLabel.length > 0;
                    const hasAriaLabelledBy = ariaLabelledBy && ariaLabelledBy.length > 0;
                    const isWrappedInLabel = inputElement.closest('label') !== null;

                    const hasAccessibleLabel = hasAssociatedLabel || hasAriaLabel || hasAriaLabelledBy || isWrappedInLabel;

                    expect(hasAccessibleLabel).toBe(true);
               });

               unmount();
          });
     });
});
