// Utility function to conditionally join class names
export const classNames = (...classes: (string | undefined | null | { [key: string]: boolean })[]): string => {
    const result = classes
      .filter((className): className is string | { [key: string]: boolean } => typeof className === 'string' || typeof className === 'object') // Remove null and undefined
      .reduce((acc, className) => {
        if (typeof className === 'string') {
          return acc + ' ' + className;
        } else {
          return acc + ' ' + Object.entries(className)
            .filter(([, value]) => value)
            .map(([key]) => key)
            .join(' ');
        }
      }, ''); // Initialize accumulator as a string
  
    return String(result).trim(); // Explicitly convert to string before trim()
  };
  