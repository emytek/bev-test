
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