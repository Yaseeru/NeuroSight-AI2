import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import { ConfidenceBar } from './ConfidenceBar';

describe('ConfidenceBar', () => {
     // **Feature: neurosight-ui, Property 5: Confidence bar visualization consistency**
     // **Validates: Requirements 5.2, 5.4**
     it('should render bar with width proportional to percentage and display exact percentage value', () => {
          fc.assert(
               fc.property(
                    fc.integer({ min: 0, max: 100 }),
                    (percentage) => {
                         const { unmount } = render(<ConfidenceBar percentage={percentage} />);

                         // Check that the bar fill has correct width
                         const barFill = screen.getByTestId('confidence-bar-fill');
                         expect(barFill).toHaveStyle({ width: `${percentage}%` });

                         // Check that the percentage text is displayed
                         const percentageText = screen.getByTestId('confidence-percentage');
                         expect(percentageText).toHaveTextContent(`${percentage.toFixed(1)}%`);

                         unmount();
                    }
               ),
               { numRuns: 100 }
          );
     });

     it('should clamp percentage values outside 0-100 range', () => {
          fc.assert(
               fc.property(
                    fc.oneof(
                         fc.integer({ min: -1000, max: -1 }),
                         fc.integer({ min: 101, max: 1000 })
                    ),
                    (percentage) => {
                         const { unmount } = render(<ConfidenceBar percentage={percentage} />);

                         const barFill = screen.getByTestId('confidence-bar-fill');
                         const clampedValue = Math.min(100, Math.max(0, percentage));

                         expect(barFill).toHaveStyle({ width: `${clampedValue}%` });

                         unmount();
                    }
               ),
               { numRuns: 100 }
          );
     });
});
