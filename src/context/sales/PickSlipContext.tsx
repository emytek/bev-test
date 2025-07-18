// src/context/PickslipContext.tsx
import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import { toast } from 'sonner';

// 1. Define the shape of your context data
interface PickslipContextType {
  selectedPickslipId: string | null;
  setSelectedPickslipId: (pickslipId: string | null) => void;
  clearSelectedPickslipId: () => void;
}

// 2. Create the Context with a default undefined value
const PickslipContext = createContext<PickslipContextType | undefined>(undefined);

// 3. Create a Provider component
export const PickslipProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedPickslipId, setSelectedPickslipIdState] = useState<string | null>(null);

  // Memoize the setter function to prevent unnecessary re-renders of consumers
  const setSelectedPickslipId = useCallback((pickslipId: string | null) => {
    setSelectedPickslipIdState(pickslipId);
    if (pickslipId) {
      toast.info(`Pickslip ID selected globally: ${pickslipId.substring(0, 8)}...`, { duration: 2000 }); // Show a truncated ID
    } else {
      toast.info('Pickslip ID cleared globally.', { duration: 2000 });
    }
  }, []);

  const clearSelectedPickslipId = useCallback(() => {
    setSelectedPickslipIdState(null);
    toast.info('Pickslip ID cleared globally.', { duration: 2000 });
  }, []);

  // Memoize the context value to prevent unnecessary re-renders of consumers
  const contextValue = React.useMemo(() => ({
    selectedPickslipId,
    setSelectedPickslipId,
    clearSelectedPickslipId,
  }), [selectedPickslipId, setSelectedPickslipId, clearSelectedPickslipId]);

  return (
    <PickslipContext.Provider value={contextValue}>
      {children}
    </PickslipContext.Provider>
  );
};

// 4. Create a custom hook for easy consumption
export const usePickslipContext = () => {
  const context = useContext(PickslipContext);
  if (context === undefined) {
    throw new Error('usePickslipContext must be used within a PickslipProvider');
  }
  return context;
};