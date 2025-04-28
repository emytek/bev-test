// src/utils/storage.ts

export const saveToStorage = (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error("Error saving to local storage:", error);
    }
  };
  
  export const getFromStorage = (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error("Error getting from local storage:", error);
      return null;
    }
  };
  
  export const clearStorage = (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing local storage:", error);
    }
  };
  
  export const removeFromStorage = (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing from local storage:", error);
    }
  };