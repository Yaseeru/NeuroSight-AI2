import type { HeroSectionProps } from '../../types';

/**
 * HeroSection Component
 * Displays the welcoming hero section with headline, subheadline, and CTA button
 * Requirements: 1.1, 1.2, 7.1, 7.2
 */
export function HeroSection({ headline, subheadline, ctaText, onCtaClick }: HeroSectionProps) {
     return (
          <section
               className="bg-gradient-to-br from-blue-50 to-neutral-white py-12 px-4 md:py-16 lg:py-24"
               aria-labelledby="hero-headline"
          >
               <div className="max-w-4xl mx-auto text-center">
                    <h1
                         id="hero-headline"
                         className="text-3xl sm:text-4xl md:text-5xl lg:text-[3rem] font-bold text-neutral-gray-900 mb-4 md:mb-6 leading-tight"
                    >
                         {headline}
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-neutral-gray-900/80 mb-8 md:mb-10 max-w-2xl mx-auto px-2">
                         {subheadline}
                    </p>
                    <button
                         onClick={onCtaClick}
                         className="inline-flex items-center justify-center min-h-[48px] min-w-[120px] px-6 py-3 md:px-8
                     bg-primary-blue text-neutral-white font-semibold text-base rounded-lg
                     hover:bg-primary-blue/90 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2
                     transition-colors duration-200 w-full sm:w-auto"
                         style={{ minWidth: '44px', minHeight: '44px' }}
                    >
                         {ctaText}
                    </button>
               </div>
          </section>
     );
}

export default HeroSection;
