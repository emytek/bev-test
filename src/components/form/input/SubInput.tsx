// src/form/input/SubInput.tsx
// import React, { InputHTMLAttributes, CSSProperties } from 'react';

// interface SubInputProps extends InputHTMLAttributes<HTMLInputElement> {
//   label?: string;
//   error?: string;
//   className?: string;
//   style?: CSSProperties;
// }

// // Use React.forwardRef to correctly forward the ref from react-hook-form
// const SubInput = React.forwardRef<HTMLInputElement, SubInputProps>(
//   ({ label, error, className, style, id, ...props }, ref) => { // <-- Add ref here
//     const inputId = id || props.name;

//     return (
//       <div className={`mb-4 ${className}`} style={style}>
//         {label && (
//           <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//             {label}
//           </label>
//         )}
//         <input
//           id={inputId}
//           ref={ref} // <-- Attach the forwarded ref to the native input
//           className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white
//             ${error ? 'border-error-500' : ''}
//           `}
//           {...props}
//         />
//         {error && <p className="mt-1 text-sm text-error-600 dark:text-error-400">{error}</p>}
//       </div>
//     );
//   }
// );

// SubInput.displayName = 'SubInput'; // Good practice for debugging

// export default SubInput;


// src/form/input/SubInput.tsx
import React, { InputHTMLAttributes, CSSProperties } from 'react';

interface SubInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
  style?: CSSProperties;
  required?: boolean; // New prop to indicate if the field is required
}

const SubInput = React.forwardRef<HTMLInputElement, SubInputProps>(
  ({ label, error, className, style, id, required = false, ...props }, ref) => { // Default required to false
    const inputId = id || props.name;

    return (
      <div className={`mb-4 ${className}`} style={style}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>} {/* Red asterisk for required fields */}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white
            ${error ? 'border-error-500' : ''}
          `}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-error-600 dark:text-error-400">{error}</p>}
      </div>
    );
  }
);

SubInput.displayName = 'SubInput';

export default SubInput;