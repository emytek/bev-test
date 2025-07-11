export const getFinalizedOrders = (userId: string) => {
    const key = `finalizedOrders_${userId}`;
    return JSON.parse(localStorage.getItem(key) || '{}');
  };
  
  export const setFinalizedOrder = (userId: string, productionHeaderID: string) => {
    const key = `finalizedOrders_${userId}`;
    const current = getFinalizedOrders(userId);
    current[productionHeaderID] = true;
    localStorage.setItem(key, JSON.stringify(current));
  };
  
  export const isOrderFinalized = (userId: string, productionHeaderID: string) => {
    const current = getFinalizedOrders(userId);
    return !!current[productionHeaderID];
  };
  