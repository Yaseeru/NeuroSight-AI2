interface ProcessingLoaderProps {
     isProcessing: boolean;
     message?: string;
}

export function ProcessingLoader({
     isProcessing,
     message = "Analyzing your MRI scan..."
}: ProcessingLoaderProps) {
     if (!isProcessing) {
          return null;
     }

     return (
          <div
               className="flex flex-col items-center justify-center p-6 md:p-8 space-y-4 md:space-y-6"
               role="status"
               aria-live="polite"
          >
               {/* Animated loading indicator */}
               <div className="relative w-12 h-12 md:w-16 md:h-16">
                    <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
               </div>

               {/* Loading message */}
               <p className="text-base md:text-lg text-gray-700 font-medium text-center">
                    {message}
               </p>

               {/* Progress bar animation */}
               <div className="w-48 md:w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                         className="h-full bg-gradient-to-r from-teal-500 to-blue-600 rounded-full animate-pulse"
                         style={{ width: '60%' }}
                    ></div>
               </div>
          </div>
     );
}
