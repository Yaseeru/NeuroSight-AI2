import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { LandingPage } from './LandingPage';

// Mock react-router-dom's useNavigate
vi.mock('react-router-dom', async () => {
     const actual = await vi.importActual('react-router-dom');
     return {
          ...actual,
          useNavigate: vi.fn(),
     };
});

describe('LandingPage', () => {
     const mockNavigate = vi.fn();

     beforeEach(() => {
          vi.mocked(useNavigate).mockReturnValue(mockNavigate);
          mockNavigate.mockClear();
     });

     /**
      * Test hero section renders with correct content
      * Requirements: 1.1, 1.2
      */
     it('renders hero section with headline and CTA button', () => {
          render(
               <MemoryRouter>
                    <LandingPage />
               </MemoryRouter>
          );

          expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/AI-Powered Alzheimer's Screening/i);
          expect(screen.getByRole('button', { name: /Start Diagnosis/i })).toBeInTheDocument();
     });

     /**
      * Test CTA button navigation
      * Requirements: 1.3
      */
     it('navigates to dashboard when CTA button is clicked', () => {
          render(
               <MemoryRouter>
                    <LandingPage />
               </MemoryRouter>
          );

          const ctaButton = screen.getByRole('button', { name: /Start Diagnosis/i });
          fireEvent.click(ctaButton);

          expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
     });

     /**
      * Test features grid renders 3 cards
      * Requirements: 2.1, 2.2
      */
     it('renders features grid with 3 feature cards', () => {
          render(
               <MemoryRouter>
                    <LandingPage />
               </MemoryRouter>
          );

          const featureCards = screen.getAllByTestId('feature-card');
          expect(featureCards).toHaveLength(3);

          // Verify feature titles
          expect(screen.getByText('Speed')).toBeInTheDocument();
          expect(screen.getByText('Accuracy')).toBeInTheDocument();
          expect(screen.getByText('Community Support')).toBeInTheDocument();
     });
});
