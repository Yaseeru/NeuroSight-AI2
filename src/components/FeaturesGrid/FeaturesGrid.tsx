import type { FeaturesGridProps } from '../../types';

/**
 * FeaturesGrid Component
 * Displays feature cards with icon, title, and description
 * Requirements: 2.1, 2.2, 2.3, 7.3
 */
export function FeaturesGrid({ features }: FeaturesGridProps) {
     return (
          <section
               className="py-10 px-4 md:py-12 lg:py-16 bg-neutral-white"
               aria-labelledby="features-heading"
          >
               <div className="max-w-6xl mx-auto">
                    <h2
                         id="features-heading"
                         className="text-xl sm:text-2xl md:text-3xl font-semibold text-neutral-gray-900 text-center mb-8 md:mb-12"
                    >
                         Why Choose NeuroSight AI?
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                         {features.map((feature, index) => (
                              <div
                                   key={index}
                                   className="bg-neutral-gray-50 rounded-xl p-4 md:p-6 text-center hover:shadow-lg transition-shadow duration-200"
                                   data-testid="feature-card"
                              >
                                   <div
                                        className="text-3xl md:text-4xl mb-3 md:mb-4"
                                        role="img"
                                        aria-label={`${feature.title} icon`}
                                        data-testid="feature-icon"
                                   >
                                        {feature.icon}
                                   </div>
                                   <h3
                                        className="text-lg md:text-xl font-semibold text-neutral-gray-900 mb-2 md:mb-3"
                                        data-testid="feature-title"
                                   >
                                        {feature.title}
                                   </h3>
                                   <p
                                        className="text-sm md:text-base text-neutral-gray-900/70 leading-relaxed"
                                        data-testid="feature-description"
                                   >
                                        {feature.description}
                                   </p>
                              </div>
                         ))}
                    </div>
               </div>
          </section>
     );
}

export default FeaturesGrid;
