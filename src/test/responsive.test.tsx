import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import * as fc from 'fast-check';
import { LandingPage } from '../pages/LandingPage';
import { DiagnosticDashboard } from '../pages/DiagnosticDashboard';

/**
 * Property tests for responsive design
 * **Feature: neurosight-ui, Property 9: No horizontal overflow at any viewport**
 * **Validates: Requirements 8.3**
 */
describe('Responsive Design', () => {
     beforeEach(() => {
          // Reset any previous viewport changes
          Object.defineProperty(window, 'innerWidth', {
               writable: true,
               configurable: true,
               value: 1024,
          });
          Object.defineProperty(window, 'innerHeight', {
               writable: true,
               configurable: true,
               value: 768,
          });
     });

     afterEach(() => {
          cleanup();
     });

     describe('Property 9: No horizontal overflow at any viewport', () => {
          /**
           * Helper to check if any element causes horizontal overflow
           * Returns true if no overflow is detected
           */
          const checkNoHorizontalOverflow = (container: HTMLElement, viewportWidth: number): boolean => {
               // Check all elements in the container
               const allElements = container.querySelectorAll('*');

               for (const element of allElements) {
                    const rect = element.getBoundingClientRect();
                    const computedStyle = window.getComputedStyle(element);

                    // Skip hidden elements
                    if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
                         continue;
                    }

                    // Check if element extends beyond viewport
                    // Allow small tolerance for rounding errors
                    if (rect.right > viewportWidth + 1) {
                         return false;
                    }
               }

               return true;
          };

          it('should not produce horizontal overflow on LandingPage at any viewport width', () => {
               fc.assert(
                    fc.property(
                         // Generate viewport widths between 320px (minimum mobile) and 1920px (large desktop)
                         fc.integer({ min: 320, max: 1920 }),
                         (viewportWidth) => {
                              // Set viewport width
                              Object.defineProperty(window, 'innerWidth', {
                                   writable: true,
                                   configurable: true,
                                   value: viewportWidth,
                              });

                              // Trigger resize event
                              window.dispatchEvent(new Event('resize'));

                              const { container, unmount } = render(
                                   <BrowserRouter>
                                        <div style={{ width: viewportWidth, overflow: 'hidden' }}>
                                             <LandingPage />
                                        </div>
                                   </BrowserRouter>
                              );

                              // Check that no element overflows horizontally
                              const noOverflow = checkNoHorizontalOverflow(container, viewportWidth);

                              unmount();

                              return noOverflow;
                         }
                    ),
                    { numRuns: 50 } // Test 50 different viewport widths
               );
          }, 30000);

          it('should not produce horizontal overflow on DiagnosticDashboard at any viewport width', () => {
               fc.assert(
                    fc.property(
                         // Generate viewport widths between 320px (minimum mobile) and 1920px (large desktop)
                         fc.integer({ min: 320, max: 1920 }),
                         (viewportWidth) => {
                              // Set viewport width
                              Object.defineProperty(window, 'innerWidth', {
                                   writable: true,
                                   configurable: true,
                                   value: viewportWidth,
                              });

                              // Trigger resize event
                              window.dispatchEvent(new Event('resize'));

                              const { container, unmount } = render(
                                   <BrowserRouter>
                                        <div style={{ width: viewportWidth, overflow: 'hidden' }}>
                                             <DiagnosticDashboard />
                                        </div>
                                   </BrowserRouter>
                              );

                              // Check that no element overflows horizontally
                              const noOverflow = checkNoHorizontalOverflow(container, viewportWidth);

                              unmount();

                              return noOverflow;
                         }
                    ),
                    { numRuns: 50 } // Test 50 different viewport widths
               );
          }, 30000);

          // Test specific breakpoints to ensure layouts work correctly
          it('should handle mobile breakpoint (320px)', () => {
               const viewportWidth = 320;
               Object.defineProperty(window, 'innerWidth', {
                    writable: true,
                    configurable: true,
                    value: viewportWidth,
               });

               const { container } = render(
                    <BrowserRouter>
                         <div style={{ width: viewportWidth, overflow: 'hidden' }}>
                              <LandingPage />
                         </div>
                    </BrowserRouter>
               );

               // All elements should fit within viewport
               const allElements = container.querySelectorAll('*');
               for (const element of allElements) {
                    const rect = element.getBoundingClientRect();
                    expect(rect.right).toBeLessThanOrEqual(viewportWidth + 1);
               }
          });

          it('should handle tablet breakpoint (768px)', () => {
               const viewportWidth = 768;
               Object.defineProperty(window, 'innerWidth', {
                    writable: true,
                    configurable: true,
                    value: viewportWidth,
               });

               const { container } = render(
                    <BrowserRouter>
                         <div style={{ width: viewportWidth, overflow: 'hidden' }}>
                              <LandingPage />
                         </div>
                    </BrowserRouter>
               );

               // All elements should fit within viewport
               const allElements = container.querySelectorAll('*');
               for (const element of allElements) {
                    const rect = element.getBoundingClientRect();
                    expect(rect.right).toBeLessThanOrEqual(viewportWidth + 1);
               }
          });

          it('should handle desktop breakpoint (1024px)', () => {
               const viewportWidth = 1024;
               Object.defineProperty(window, 'innerWidth', {
                    writable: true,
                    configurable: true,
                    value: viewportWidth,
               });

               const { container } = render(
                    <BrowserRouter>
                         <div style={{ width: viewportWidth, overflow: 'hidden' }}>
                              <LandingPage />
                         </div>
                    </BrowserRouter>
               );

               // All elements should fit within viewport
               const allElements = container.querySelectorAll('*');
               for (const element of allElements) {
                    const rect = element.getBoundingClientRect();
                    expect(rect.right).toBeLessThanOrEqual(viewportWidth + 1);
               }
          });
     });
});
