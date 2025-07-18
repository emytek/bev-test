import React, { CSSProperties } from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
}

const Card: React.FC<CardProps> = ({ children, className, style }) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-200 dark:border-gray-700 ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default Card;