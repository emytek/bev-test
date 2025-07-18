// src/components/ui/Button.tsx
import React, { CSSProperties } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
  icon?: React.ReactNode; // New prop for icon
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  style,
  icon, // Destructure the new icon prop
  ...props
}) => {
  const baseStyles = 'rounded px-4 py-2 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center'; // Added flex, items-center, justify-center
  
  const variantStyles = {
    primary: 'bg-brand-500 text-white hover:bg-blue-600 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600',
    outline: 'border border-gray-300 text-gray-800 hover:bg-gray-50 focus:ring-gray-300 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700',
    ghost: 'text-gray-800 hover:bg-gray-100 focus:ring-gray-100 dark:text-gray-200 dark:hover:bg-gray-700',
  };

  const sizeStyles = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-5 py-2.5',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      style={style}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>} {/* Render icon with margin */}
      {children}
    </button>
  );
};

export default Button;