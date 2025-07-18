// src/api/production.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Define types for the production details response
export interface ProductionDetailItem {
  IdentifiedStockID: string;
  ProductionDetailID: string;
  ProductionHeaderID: string;
  ProductionDate: string; // ISO string
  SAPProductID: string;
  SAPProductDescription: string;
  IsApproved: boolean;
  IsPosted: boolean;
  CompletedQuantity: number;
  UoMQuantityPallet: number;
  QuantityUnitCode: string | null;
}

export interface GetProductionByIdentifiedStockResponse {
  status: boolean;
  message: string;
  data: ProductionDetailItem[];
}

/**
 * Fetches production details for a given identified stock ID (barcode).
 * @param identifiedStockID The scanned barcode number.
 * @param authHeader Authorization header with Bearer token.
 * @returns A promise that resolves to the GetProductionByIdentifiedStockResponse.
 */
export const getProductionDetailsByIdentifiedStock = async (
  identifiedStockID: string,
  authHeader: { Authorization: string }
): Promise<GetProductionByIdentifiedStockResponse> => {
  try {
    const response = await axios.get<GetProductionByIdentifiedStockResponse>(
      `${API_BASE_URL}/v1/production/get-production-by-identifiedStock?identifiedStockID=${identifiedStockID}`,
      { headers: authHeader }
    );
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching production details for ${identifiedStockID}:`, error.response?.data || error.message);
    throw error;
  }
};