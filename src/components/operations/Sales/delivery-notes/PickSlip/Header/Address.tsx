// src/components/Address.tsx
import React from 'react';

interface AddressProps {
  lines: string[];
  className?: string;
}

const Address: React.FC<AddressProps> = ({ lines, className }) => (
  <address className={`not-italic text-sm leading-tight ${className}`}>
    {lines.map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < lines.length - 1 && <br />}
      </React.Fragment>
    ))}
  </address>
);

export default Address;