// src/context/SalesModuleContext.tsx
import React, { createContext, useState, useContext, useCallback, ReactNode, useMemo } from 'react';
import { toast } from 'sonner';

// Define the stages of the pickslip creation workflow
type PickslipStage = 'header' | 'proceed_to_scan' | 'scanning' | null;

// Define the shape of the SalesModuleContext data
interface SalesModuleContextType {
  pickslipCreationStage: PickslipStage;
  setPickslipCreationStage: (stage: PickslipStage) => void;
  
  createdPickslipId: string | null;
  setCreatedPickslipId: (id: string | null) => void;

  showLoaderAfterHeader: boolean;
  setShowLoaderAfterHeader: (show: boolean) => void;

  // Functions to reset the pickslip flow
  resetPickslipFlow: () => void;
}

// Create the Context with a default undefined value
const SalesModuleContext = createContext<SalesModuleContextType | undefined>(undefined);

// Create a Provider component
export const SalesModuleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Use localStorage for simple persistence, or a more robust solution like IndexedDB/Firestore for enterprise
  // For this example, we'll use localStorage to demonstrate persistence.
  // In a real enterprise app, you might serialize complex states to JSON.
  const [pickslipCreationStage, setPickslipCreationStageState] = useState<PickslipStage>(() => {
    try {
      const storedStage = localStorage.getItem('pickslipCreationStage');
      return storedStage ? (storedStage as PickslipStage) : null;
    } catch (error) {
      console.error("Failed to read pickslipCreationStage from localStorage", error);
      return null;
    }
  });

  const [createdPickslipId, setCreatedPickslipIdState] = useState<string | null>(() => {
    try {
      return localStorage.getItem('createdPickslipId');
    } catch (error) {
      console.error("Failed to read createdPickslipId from localStorage", error);
      return null;
    }
  });

  const [showLoaderAfterHeader, setShowLoaderAfterHeaderState] = useState<boolean>(() => {
    try {
      const storedLoader = localStorage.getItem('showLoaderAfterHeader');
      return storedLoader ? JSON.parse(storedLoader) : false;
    } catch (error) {
      console.error("Failed to read showLoaderAfterHeader from localStorage", error);
      return false;
    }
  });

  // Update localStorage whenever state changes
  React.useEffect(() => {
    try {
      localStorage.setItem('pickslipCreationStage', pickslipCreationStage || '');
    } catch (error) {
      console.error("Failed to write pickslipCreationStage to localStorage", error);
    }
  }, [pickslipCreationStage]);

  React.useEffect(() => {
    try {
      localStorage.setItem('createdPickslipId', createdPickslipId || '');
    } catch (error) {
      console.error("Failed to write createdPickslipId to localStorage", error);
    }
  }, [createdPickslipId]);

  React.useEffect(() => {
    try {
      localStorage.setItem('showLoaderAfterHeader', JSON.stringify(showLoaderAfterHeader));
    } catch (error) {
      console.error("Failed to write showLoaderAfterHeader to localStorage", error);
    }
  }, [showLoaderAfterHeader]);


  const setPickslipCreationStage = useCallback((stage: PickslipStage) => {
    setPickslipCreationStageState(stage);
    toast.info(`Pickslip workflow stage: ${stage || 'Not started'}`, { duration: 1000 });
  }, []);

  const setCreatedPickslipId = useCallback((id: string | null) => {
    setCreatedPickslipIdState(id);
    if (id) {
      toast.info(`Pickslip ID for workflow: ${id.substring(0, 8)}...`, { duration: 1000 });
    } else {
      toast.info('Pickslip ID cleared for workflow.', { duration: 1000 });
    }
  }, []);

  const setShowLoaderAfterHeader = useCallback((show: boolean) => {
    setShowLoaderAfterHeaderState(show);
  }, []);

  const resetPickslipFlow = useCallback(() => {
    setPickslipCreationStageState(null);
    setCreatedPickslipIdState(null);
    setShowLoaderAfterHeaderState(false);
    try {
      localStorage.removeItem('pickslipCreationStage');
      localStorage.removeItem('createdPickslipId');
      localStorage.removeItem('showLoaderAfterHeader');
    } catch (error) {
      console.error("Failed to clear pickslip flow from localStorage", error);
    }
    toast.info('Pickslip creation flow reset.', { duration: 2000 });
  }, []);

  const contextValue = useMemo(() => ({
    pickslipCreationStage,
    setPickslipCreationStage,
    createdPickslipId,
    setCreatedPickslipId,
    showLoaderAfterHeader,
    setShowLoaderAfterHeader,
    resetPickslipFlow,
  }), [
    pickslipCreationStage,
    setPickslipCreationStage,
    createdPickslipId,
    setCreatedPickslipId,
    showLoaderAfterHeader,
    setShowLoaderAfterHeader,
    resetPickslipFlow,
  ]);

  return (
    <SalesModuleContext.Provider value={contextValue}>
      {children}
    </SalesModuleContext.Provider>
  );
};

// Custom hook for easy consumption
export const useSalesModuleContext = () => {
  const context = useContext(SalesModuleContext);
  if (context === undefined) {
    throw new Error('useSalesModuleContext must be used within a SalesModuleProvider');
  }
  return context;
};