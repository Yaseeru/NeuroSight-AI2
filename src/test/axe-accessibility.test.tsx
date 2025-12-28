import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { BrowserRouter } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';
import { DiagnosticDashboard } from '../pages/DiagnosticDashboard';
import { HeroSection } from '../components/HeroSection';
import { FeaturesGrid } from '../components/FeaturesGrid';
import { FileUploadZone } from '../components/FileUploadZone';
import { ImagePreview } from '../components/ImagePreview';
import { ResultsDisplay } from '../components/ResultsDisplay';
import { SupportWidget } from '../components/SupportWidget';
import { ConfidenceBar } from '../components/ConfidenceBar';
import { ProcessingLoader } from '../components/ProcessingLoader';
import type { Feature } from '../types';

// Extend expect with jest-axe matchers
expect.extend(toHaveNoViolations);

// Cleanup after each test
afterEach(() => {
     cleanup();
});

/**
 * WCAG AA Accessibility Audit Tests
 * Using jest-axe to verify WCAG AA compliance
 * **Validates: Requirements 7.1**
 */
describe('WCAG AA Accessibility Audit', () => {
     describe('Page Components', () => {
          it('LandingPage should have no accessibility violations', async () => {
               const { container } = render(
                    <BrowserRouter>
                         <LandingPage />
                    </BrowserRouter>
               );

               const results = await axe(container);
               expect(results).toHaveNoViolations();
          }, 30000);

          it('DiagnosticDashboard should have no accessibility violations', async () => {
               const { container } = render(
                    <BrowserRouter>
                         <DiagnosticDashboard />
                    </BrowserRouter>
               );

               const results = await axe(container);
               expect(results).toHaveNoViolations();
          }, 30000);
     });

     describe('UI Components', () => {
          it('HeroSection should have no accessibility violations', async () => {
               const { container } = render(
                    <HeroSection
                         headline="Test Headline"
                         subheadline="Test Subheadline"
                         ctaText="Get Started"
                         onCtaClick={() => { }}
                    />
               );

               const results = await axe(container);
               expect(results).toHaveNoViolations();
          });

          it('FeaturesGrid should have no accessibility violations', async () => {
               const features: Feature[] = [
                    { icon: '⚡', title: 'Speed', description: 'Fast processing' },
                    { icon: '🎯', title: 'Accuracy', description: 'Precise results' },
                    { icon: '💜', title: 'Support', description: 'Community help' },
               ];

               const { container } = render(<FeaturesGrid features={features} />);

               const results = await axe(container);
               expect(results).toHaveNoViolations();
          });

          it('FileUploadZone should have no accessibility violations', async () => {
               const { container } = render(
                    <FileUploadZone
                         onFileSelect={() => { }}
                         onError={() => { }}
                         disabled={false}
                    />
               );

               const results = await axe(container);
               expect(results).toHaveNoViolations();
          });

          it('ImagePreview should have no accessibility violations', async () => {
               const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

               const { container } = render(
                    <ImagePreview file={mockFile} onRemove={() => { }} />
               );

               const results = await axe(container);
               expect(results).toHaveNoViolations();
          });

          it('ResultsDisplay should have no accessibility violations', async () => {
               const { container } = render(
                    <ResultsDisplay
                         prediction="Very Mild Dementia"
                         confidence={85.5}
                         disclaimer="This is a test disclaimer."
                    />
               );

               const results = await axe(container);
               expect(results).toHaveNoViolations();
          });

          it('SupportWidget should have no accessibility violations', async () => {
               const { container } = render(
                    <SupportWidget
                         discordUrl="https://discord.gg/test"
                         buttonText="Join Support Group"
                    />
               );

               const results = await axe(container);
               expect(results).toHaveNoViolations();
          });

          it('ConfidenceBar should have no accessibility violations', async () => {
               const { container } = render(
                    <ConfidenceBar percentage={75} label="Confidence Level" />
               );

               const results = await axe(container);
               expect(results).toHaveNoViolations();
          });

          it('ProcessingLoader should have no accessibility violations', async () => {
               const { container } = render(
                    <ProcessingLoader isProcessing={true} message="Analyzing..." />
               );

               const results = await axe(container);
               expect(results).toHaveNoViolations();
          });
     });
});
