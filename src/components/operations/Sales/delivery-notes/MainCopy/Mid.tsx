// src/components/MidSection.tsx
import React from 'react';

// Define the type for the BorderBox component props
interface BorderBoxProps {
  children: React.ReactNode;
  className?: string;
}

// Reusable BorderBox component
const BorderBox: React.FC<BorderBoxProps> = ({ children, className }) => (
  <div className={`border border-gray-300 rounded-md p-3 min-h-[5rem] flex flex-col justify-between ${className}`}>
    {children}
  </div>
);

const MidSection: React.FC = () => {
  return (
    <section className="grid grid-cols-4 md:grid-cols-4 gap-4 mb-8">
      {/* First Border Box - Spans 2 columns */}
      <BorderBox className="col-span-2 md:col-span-2">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start text-sm">
          <span className="font-semibold mb-1 sm:mb-0">Carrier</span>
          <span className="text-right">Road Transport BVN</span>
        </div>
        <div className="text-sm">
          <span>Vehicle Registration Number</span>
        </div>
      </BorderBox>

      {/* Second Border Box - Middle, normal width */}
      <BorderBox className="col-span-2 md:col-span-1 flex flex-col justify-center items-center text-center">
        <p className="text-sm font-semibold mb-1">Promised Delivery Date</p>
        <p className="text-lg font-bold">18/02/2025</p>
      </BorderBox>

      {/* Third Border Box - Spans 2 columns */}
      <BorderBox className="col-span-full md:col-span-1"> {/* Adjusted to col-span-1 for small screens, col-span-2 for medium */}
        <div className="text-sm font-semibold">Special Delivery Instructions</div>
        {/* No content on the second row as per requirements */}
      </BorderBox>
    </section>
  );
};

export default MidSection;