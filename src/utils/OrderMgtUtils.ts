// Helper for status colors (adjust if needed for isRestricted)
export const getRestrictedPsStatusColor = (isRestricted: 'Yes' | 'No' | null): string => {
    if (isRestricted === 'Yes') return 'bg-red-100 text-red-700';
    if (isRestricted === 'No') return 'bg-green-100 text-green-700';
    return 'bg-gray-100 text-gray-600'; // For null or undefined
  };

  export const getRestrictedStatusColor = (isRestricted: 'Yes' | 'No' | undefined): string => { // Changed 'null' to 'undefined'
    return isRestricted === 'Yes'
      ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
      : 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
  };
  
  // Helper for priority colors (keeping existing as it's not directly from new API, but useful if you add it)
 export const getPriorityColor = (priority: 'High' | 'Medium' | 'Low'): string => {
    switch (priority) {
      case 'High': return 'text-red-500';
      case 'Medium': return 'text-yellow-500';
      case 'Low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };