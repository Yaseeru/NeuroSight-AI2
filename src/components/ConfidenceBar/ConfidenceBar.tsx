interface ConfidenceBarProps {
     percentage: number;
     label?: string;
}

export function ConfidenceBar({ percentage, label }: ConfidenceBarProps) {
     // Clamp percentage between 0 and 100
     const clampedPercentage = Math.min(100, Math.max(0, percentage));

     return (
          <div className="w-full">
               {label && (
                    <p className="text-xs md:text-sm text-gray-600 mb-1 md:mb-2">{label}</p>
               )}
               <div className="flex items-center gap-2 md:gap-4">
                    {/* Progress bar track */}
                    <div
                         className="flex-1 h-5 md:h-6 bg-gray-200 rounded-full overflow-hidden"
                         role="progressbar"
                         aria-valuenow={clampedPercentage}
                         aria-valuemin={0}
                         aria-valuemax={100}
                         aria-label={label || "Confidence level"}
                    >
                         {/* Progress bar fill with gradient */}
                         <div
                              className="h-full bg-gradient-to-r from-teal-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
                              style={{ width: `${clampedPercentage}%` }}
                              data-testid="confidence-bar-fill"
                         />
                    </div>

                    {/* Percentage text */}
                    <span
                         className="text-base md:text-lg font-semibold text-gray-900 min-w-[3.5rem] md:min-w-[4rem] text-right"
                         data-testid="confidence-percentage"
                    >
                         {clampedPercentage.toFixed(1)}%
                    </span>
               </div>
          </div>
     );
}
