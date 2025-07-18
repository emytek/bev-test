// src/api/sales.ts
import axiosInstance from '../axiosInstance';
import { SalesHeaderPayload, SalesHeaderResponse, AddSalesDetailsPayload, SalesDetailResponse } from '../../types/sales/sales';

const SALES_API_BASE_PATH = '/api/v1/sales';

export const addSalesHeader = async (
  payload: SalesHeaderPayload[],
  authHeader: { Authorization: string }
): Promise<SalesHeaderResponse[]> => {
  const ADD_SALES_HEADER_ENDPOINT = `${SALES_API_BASE_PATH}/add-sales-header`;
  try {
    const response = await axiosInstance.post<SalesHeaderResponse[]>(
      ADD_SALES_HEADER_ENDPOINT,
      payload,
      { headers: authHeader }
    );
    return response.data;
  } catch (error) {
    // Handle error logging or re-throwing specific errors
    console.error("Error adding sales header:", error);
    throw error;
  }
};

export const addSalesDetails = async (
  payload: AddSalesDetailsPayload[],
  authHeader: { Authorization: string }
): Promise<SalesDetailResponse[]> => {
  const ADD_SALES_DETAILS_ENDPOINT = `${SALES_API_BASE_PATH}/add-sales-details`;
  try {
    const response = await axiosInstance.post<SalesDetailResponse[]>(
      ADD_SALES_DETAILS_ENDPOINT,
      payload,
      { headers: authHeader }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding sales details:", error);
    throw error;
  }
};