import { useNavigate } from 'react-router-dom';
import { HeroSection } from '../components/HeroSection';
import { FeaturesGrid } from '../components/FeaturesGrid';
import type { Feature } from '../types';

const DEFAULT_FEATURES: Feature[] = [
     {
          icon: '⚡',
          title: 'Speed',
          description: 'Get AI-powered screening results in seconds, not days. Our advanced algorithms analyze MRI scans rapidly.',
     },
     {
          icon: '🎯',
          title: 'Accuracy',
          description: 'Trained on thousands of MRI scans, our AI provides reliable classification across 4 stages of Alzheimer\'s.',
     },
     {
          icon: '💜',
          title: 'Community Support',
          description: 'Connect with caregivers and families through our support community. You\'re not alone in this journey.',
     },
];

/**
 * LandingPage Component
 * Main landing page combining HeroSection and FeaturesGrid
 * Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3
 */
export function LandingPage() {
     const navigate = useNavigate();

     const handleCtaClick = () => {
          navigate('/dashboard');
     };

     return (
          <main className="min-h-screen bg-neutral-white">
               <header className="flex items-center justify-center py-8 px-4">
                    <img
                         src="/NeuroSight AI.png"
                         alt="NeuroSight AI Logo"
                         className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto max-w-full"
                    />
               </header>
               <HeroSection
                    headline="AI-Powered Alzheimer's Screening"
                    subheadline="Upload your MRI scan and receive an instant AI-generated assessment. Early detection can make a difference."
                    ctaText="Start Diagnosis"
                    onCtaClick={handleCtaClick}
               />
               <FeaturesGrid features={DEFAULT_FEATURES} />
          </main>
     );
}

export default LandingPage;
