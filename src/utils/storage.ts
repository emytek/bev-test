// export const saveToStorage = (key: string, value: string) => {
//   try {
//     localStorage.setItem(key, value);
//   } catch (error) {
//     console.error('Error saving to local storage:', error);
//   }
// };

// export const getFromStorage = (key: string) => {
//   return sessionStorage.getItem(key) || localStorage.getItem(key);
// };

// export const removeFromStorage = (key: string) => {
//   try {
//     localStorage.removeItem(key);
//   } catch (error) {
//     console.error('Error removing from local storage:', error);
//   }
// };

export const saveToStorage = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error('Error saving to local storage:', error);
  }
};

export const getFromStorage = (key: string) => {
  return sessionStorage.getItem(key) || localStorage.getItem(key) || null; // Ensure null is returned if not found
};

export const removeFromStorage = (key: string) => {
  try {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key); // Also remove from sessionStorage for consistency
  } catch (error) {
    console.error('Error removing from local storage:', error);
  }
};