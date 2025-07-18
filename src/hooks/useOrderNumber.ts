import { useContext } from "react";
import { OrderNumberContext } from "../context/production/OrderNoContext";

export const useOrderNumber = () => {
    const context = useContext(OrderNumberContext);
    if (!context) {
        throw new Error('useOrderNumber must be used within an OrderNumberProvider');
    }
    return context;
};