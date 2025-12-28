import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import { FeaturesGrid } from './FeaturesGrid';
import type { Feature } from '../../types';

/**
 * **Feature: neurosight-ui, Property 1: Feature cards contain required elements**
 * **Validates: Requirements 2.3**
 * 
 * For any feature card data object, when rendered by the FeaturesGrid component,
 * the output SHALL contain an icon element, a title element, and a description element.
 */
describe('FeaturesGrid Property Tests', () => {
     // Arbitrary for generating valid Feature objects
     const featureArbitrary: fc.Arbitrary<Feature> = fc.record({
          icon: fc.string({ minLength: 1 }),
          title: fc.string({ minLength: 1 }),
          description: fc.string({ minLength: 1 }),
     });

     it('Property 1: Feature cards contain required elements (icon, title, description)', () => {
          fc.assert(
               fc.property(
                    fc.array(featureArbitrary, { minLength: 1, maxLength: 10 }),
                    (features) => {
                         const { unmount } = render(<FeaturesGrid features={features} />);

                         const cards = screen.getAllByTestId('feature-card');
                         expect(cards).toHaveLength(features.length);

                         features.forEach((feature, index) => {
                              const card = cards[index];

                              // Check icon element exists within the card
                              const icon = card.querySelector('[data-testid="feature-icon"]');
                              expect(icon).not.toBeNull();
                              expect(icon?.textContent).toBe(feature.icon);

                              // Check title element exists within the card
                              const title = card.querySelector('[data-testid="feature-title"]');
                              expect(title).not.toBeNull();
                              expect(title?.textContent).toBe(feature.title);

                              // Check description element exists within the card
                              const description = card.querySelector('[data-testid="feature-description"]');
                              expect(description).not.toBeNull();
                              expect(description?.textContent).toBe(feature.description);
                         });

                         unmount();
                    }
               ),
               { numRuns: 100 }
          );
     });
});
