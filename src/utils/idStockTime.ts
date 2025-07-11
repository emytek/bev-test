
/**
 * Formats the current date and time into an ISO 8601 string in UTC.
 * @returns {string} The current date and time formatted as an ISO 8601 UTC string.
 */
export const formattedDateTime = (): string => {
  const now = new Date();

  const isoString = now.toISOString();

  return isoString;
};

export const formattedProductionDate = (): string => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  return `${day}-${month}-${year}`;
};

export const formattedTime = (): string => {
    const now = new Date();
    const year = String(now.getFullYear()).slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
    const nanoseconds = String(Math.floor(performance.now() * 1000) % 1000000).padStart(3, '0');
  
    return `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}${nanoseconds}`;
  };
  
  export const getFormattedIdentifiedStockID = (): string => { // Renamed to getFormattedIdentifiedStockID
    const time = formattedTime();
    const result: string = `${time.slice(0, Math.min(time.length, 20))}`;
    return result;
  };

  // utils/numberFormatter.ts
export const formatQuantity = (value: number | null | undefined): string => {
  if (value == null || isNaN(value)) return "-";

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatDecimalQuantity = (
  value: number | null | undefined,
  decimals: number = 2 
): string => {
  if (value == null || isNaN(value)) return "-";

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A';
  try {
    // Attempt to parse date string with or without timezone
    const date = new Date(dateString);
    if (isNaN(date.getTime())) { // Check if parsing failed
      // Fallback for tricky formats, try slicing if it's like "YYYY-MM-DDTHH:MM:SS"
      if (dateString.includes('T')) {
        return new Date(dateString.split('T')[0]).toLocaleDateString('en-GB');
      }
      return new Date(dateString).toLocaleDateString('en-GB');
    }
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', dateString, error);
    return dateString; // Return original if formatting fails
  }
};

export const formatDateTime = (dateString: string | null) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  } catch (error) {
    console.error('Error formatting date-time:', dateString, error);
    return dateString;
  }
};

