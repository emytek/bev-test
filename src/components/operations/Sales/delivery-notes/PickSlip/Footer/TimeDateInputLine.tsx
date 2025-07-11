import React from 'react';

interface TimeDateInputLineProps {
  label: string;
  format: 'time' | 'date'; // Differentiates between time and date formats
  className?: string;
}

/**
 * Reusable component for Time and Date input lines with specific formats.
 * Formats: '___H___' for time, '___/___/20__' for date.
 */
const TimeDateInputLine: React.FC<TimeDateInputLineProps> = ({ label, format, className }) => {
  const segmentWidth = 'w-6'; // Width for each underscore segment
  const underlineHeight = 'h-px'; // Very thin line
  const textColor = 'text-black'; // Ensure text is black

  return (
    <div className={`flex flex-col items-start text-sm ${className}`}>
      <span className="mb-1">{label}</span>
      <div className="flex items-center text-xs">
        {format === 'time' && (
          <>
            <div className={`${segmentWidth} ${underlineHeight} bg-black`}></div>
            <span className={`mx-1 font-bold ${textColor}`}>H</span>
            <div className={`${segmentWidth} ${underlineHeight} bg-black`}></div>
          </>
        )}
        {format === 'date' && (
          <>
            <div className={`${segmentWidth} ${underlineHeight} bg-black`}></div>
            <span className={`mx-1 font-bold ${textColor}`}>/</span>
            <div className={`${segmentWidth} ${underlineHeight} bg-black`}></div>
            <span className={`mx-1 font-bold ${textColor}`}>/</span>
            <span className={`font-bold ${textColor}`}>20</span>
            <div className={`${segmentWidth} ${underlineHeight} bg-black`}></div>
          </>
        )}
      </div>
    </div>
  );
};

export default TimeDateInputLine;