// // src/form/SubSelect.tsx (Example of how it should be structured)
// import React, { SelectHTMLAttributes, CSSProperties } from 'react';

// interface SelectOption {
//   value: string;
//   label: string;
// }

// interface SubSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
//   label?: string;
//   options: SelectOption[];
//   error?: string;
//   className?: string;
//   style?: CSSProperties;
// }

// const SubSelect = React.forwardRef<HTMLSelectElement, SubSelectProps>(
//   ({ label, options, error, className, style, id, ...props }, ref) => {
//     const selectId = id || props.name;

//     return (
//       <div className={`mb-4 ${className}`} style={style}>
//         {label && (
//           <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//             {label}
//           </label>
//         )}
//         <select
//           id={selectId}
//           ref={ref} // <-- Attach the forwarded ref
//           className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white
//             ${error ? 'border-error-500' : ''}
//           `}
//           {...props}
//         >
//           {options.map((option) => (
//             <option key={option.value} value={option.value}>
//               {option.label}
//             </option>
//           ))}
//         </select>
//         {error && <p className="mt-1 text-sm text-error-600 dark:text-error-400">{error}</p>}
//       </div>
//     );
//   }
// );

// SubSelect.displayName = 'SubSelect';

// export default SubSelect;

// src/form/SubSelect.tsx
import React, { SelectHTMLAttributes, CSSProperties } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SubSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  className?: string;
  style?: CSSProperties;
  required?: boolean; // New prop to indicate if the field is required
}

const SubSelect = React.forwardRef<HTMLSelectElement, SubSelectProps>(
  ({ label, options, error, className, style, id, required = false, ...props }, ref) => { // Default required to false
    const selectId = id || props.name;

    return (
      <div className={`mb-4 ${className}`} style={style}>
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>} {/* Red asterisk for required fields */}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white
            ${error ? 'border-error-500' : ''}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-error-600 dark:text-error-400">{error}</p>}
      </div>
    );
  }
);

SubSelect.displayName = 'SubSelect';

export default SubSelect;