// // src/context/ProductContext.tsx
// import React, { createContext, useState, useContext, useCallback, ReactNode, useMemo } from 'react';
// import { toast } from 'sonner';

// // 1. Define the shape of your context data
// interface ProductContextType {
//   selectedProductId: string | null;
//   setSelectedProductId: (productId: string | null) => void;
//   clearSelectedProductId: () => void;
  
//   numberOfPacks: number | null; // New: to store number of packs
//   setNumberOfPacks: (packs: number | null) => void; // New: setter for number of packs
//   clearNumberOfPacks: () => void; // New: clearer for number of packs
// }

// // 2. Create the Context with a default undefined value
// const ProductContext = createContext<ProductContextType | undefined>(undefined);

// // 3. Create a Provider component
// export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [selectedProductId, setSelectedProductIdState] = useState<string | null>(null);
//   const [numberOfPacks, setNumberOfPacksState] = useState<number | null>(null); // New state for numberOfPacks

//   const setSelectedProductId = useCallback((productId: string | null) => {
//     setSelectedProductIdState(productId);
//     if (productId) {
//       toast.info(`Product ID selected globally: ${productId}`, { duration: 2000 });
//     } else {
//       toast.info('Product ID cleared globally.', { duration: 2000 });
//     }
//   }, []);

//   const clearSelectedProductId = useCallback(() => {
//     setSelectedProductIdState(null);
//     toast.info('Product ID cleared globally.', { duration: 2000 });
//   }, []);

//   // New: Memoized setter for numberOfPacks
//   const setNumberOfPacks = useCallback((packs: number | null) => {
//     setNumberOfPacksState(packs);
//     if (packs !== null) {
//       toast.info(`Number of Packs set globally: ${packs}`, { duration: 2000 });
//     } else {
//       toast.info('Number of Packs cleared globally.', { duration: 2000 });
//     }
//   }, []);

//   // New: Memoized clearer for numberOfPacks
//   const clearNumberOfPacks = useCallback(() => {
//     setNumberOfPacksState(null);
//     toast.info('Number of Packs cleared globally.', { duration: 2000 });
//   }, []);

//   // Memoize the context value to prevent unnecessary re-renders of consumers
//   const contextValue = useMemo(() => ({
//     selectedProductId,
//     setSelectedProductId,
//     clearSelectedProductId,
//     numberOfPacks, // Include new state
//     setNumberOfPacks, // Include new setter
//     clearNumberOfPacks, // Include new clearer
//   }), [
//     selectedProductId,
//     setSelectedProductId,
//     clearSelectedProductId,
//     numberOfPacks,
//     setNumberOfPacks,
//     clearNumberOfPacks,
//   ]);

//   return (
//     <ProductContext.Provider value={contextValue}>
//       {children}
//     </ProductContext.Provider>
//   );
// };

// // 4. Create a custom hook for easy consumption
// export const useProductContext = () => {
//   const context = useContext(ProductContext);
//   if (context === undefined) {
//     throw new Error('useProductContext must be used within a ProductProvider');
//   }
//   return context;
// };



// src/context/ProductContext.tsx
import React, { createContext, useState, useContext, useCallback, ReactNode, useMemo } from 'react';
import { toast } from 'sonner';

interface ProductContextType {
  selectedProductId: string | null;
  setSelectedProductId: (productId: string | null) => void;
  clearSelectedProductId: () => void;
  
  numberOfPacks: number | null; // New: to store number of packs
  setNumberOfPacks: (packs: number | null) => void; // New: setter for number of packs
  clearNumberOfPacks: () => void; // New: clearer for number of packs
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedProductId, setSelectedProductIdState] = useState<string | null>(null);
  const [numberOfPacks, setNumberOfPacksState] = useState<number | null>(null);

  const setSelectedProductId = useCallback((productId: string | null) => {
    setSelectedProductIdState(productId);
    if (productId) {
      toast.info(`Product ID selected globally: ${productId}`, { duration: 2000 });
    } else {
      toast.info('Product ID cleared globally.', { duration: 2000 });
    }
  }, []);

  const clearSelectedProductId = useCallback(() => {
    setSelectedProductIdState(null);
    toast.info('Product ID cleared globally.', { duration: 2000 });
  }, []);

  const setNumberOfPacks = useCallback((packs: number | null) => {
    setNumberOfPacksState(packs);
    if (packs !== null) {
      toast.info(`Number of Packs set globally: ${packs}`, { duration: 2000 });
    } else {
      toast.info('Number of Packs cleared globally.', { duration: 2000 });
    }
  }, []);

  const clearNumberOfPacks = useCallback(() => {
    setNumberOfPacksState(null);
    toast.info('Number of Packs cleared globally.', { duration: 2000 });
  }, []);

  const contextValue = useMemo(() => ({
    selectedProductId,
    setSelectedProductId,
    clearSelectedProductId,
    numberOfPacks,
    setNumberOfPacks,
    clearNumberOfPacks,
  }), [
    selectedProductId,
    setSelectedProductId,
    clearSelectedProductId,
    numberOfPacks,
    setNumberOfPacks,
    clearNumberOfPacks,
  ]);

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};