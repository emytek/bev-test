// src/components/ui/Loader.tsx
import React from "react";
import { Loader2 } from "lucide-react"; // Ensure lucide-react is installed: npm install lucide-react

interface LoaderProps {
  message?: string;
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ message = "Processing...", fullScreen = true }) => {
  return (
    <div
      className={`${
        fullScreen
          ? "fixed inset-0 z-50 flex items-center justify-center bg-gray-50/90 dark:bg-gray-950/90 backdrop-blur-sm transition-opacity duration-300 ease-in-out" // More subtle background, transition
          : "flex items-center justify-center py-8"
      }
      font-inter`} // Assuming 'Inter' font is used globally
    >
      <div className="flex flex-col items-center space-y-5 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 transform transition-all duration-300 ease-out scale-100">
        <Loader2 className="w-16 h-16 text-blue-600 dark:text-blue-400 animate-spin-slow" /> {/* Larger, custom animation */}
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 animate-pulse-fade">
          {message}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Please wait a moment...
        </p>
      </div>
      {/* Custom CSS for animations if needed beyond Tailwind's default */}
      <style>
        {`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite; /* Slower spin */
        }

        @keyframes pulse-fade {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .animate-pulse-fade {
          animation: pulse-fade 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        `}
      </style>
    </div>
  );
};

export default Loader;