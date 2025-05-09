import React, { createContext, useState, useCallback } from 'react';

// 1. Create a context
interface OrderNumberContextProps {
    orderNumber: string | null;
    setOrderNumber: (orderNumber: string | null) => void;
}
export const OrderNumberContext = createContext<OrderNumberContextProps | undefined>(undefined);

// 2. Create a provider component
export const OrderNumberProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [orderNumber, setOrderNumber] = useState<string | null>(null);

    const setGlobalOrderNumber = useCallback((newOrderNumber: string | null) => {
        setOrderNumber(newOrderNumber);
    }, []);

    const contextValue = {
        orderNumber,
        setOrderNumber: setGlobalOrderNumber,
    };

    return (
        <OrderNumberContext.Provider value={contextValue}>
            {children}
        </OrderNumberContext.Provider>
    );
};
