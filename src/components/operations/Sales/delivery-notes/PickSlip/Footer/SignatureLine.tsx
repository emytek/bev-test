import React from 'react';

interface SignatureLineProps {
  label: string;
  type: 'name' | 'signature'; // Differentiates between name and signature lines for styling
  className?: string;
}

/**
 * Reusable component for Name in Full and Signature lines with an underline.
 */
const SignatureLine: React.FC<SignatureLineProps> = ({ label, type, className }) => {
  const underlineWidthClass = type === 'name' ? 'w-48 sm:w-36 md:w-48 lg:w-56' : 'w-24 sm:w-20 md:w-24 lg:w-28'; // Responsive width
  const underlineHeight = 'h-px'; // Very thin line

  return (
    <div className={`flex flex-col items-start text-sm ${className}`}>
      <span className="mb-1">{label}</span>
      <div className={`${underlineWidthClass} ${underlineHeight} bg-black`}></div>
    </div>
  );
};

export default SignatureLine;