// // src/api/pickslip.ts
// import axios from 'axios';
// import { PickslipHeaderPayload, PickslipHeaderResponse } from '../../types/sales/pickslip';


// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'; // Ensure your .env has VITE_API_BASE_URL

// /**
//  * Adds a new pickslip header to the backend.
//  * @param payload The pickslip header data.
//  * @param authHeader Authorization header with Bearer token.
//  * @returns A promise that resolves to the PickslipHeaderResponse.
//  */
// export const addPickslipHeader = async (
//   payload: PickslipHeaderPayload,
//   authHeader: { Authorization: string }
// ): Promise<PickslipHeaderResponse> => {
//   try {
//     const response = await axios.post<PickslipHeaderResponse>(
//       `${API_BASE_URL}/api/pickslip/add-pickslip-header`,
//       payload,
//       { headers: authHeader }
//     );
//     return response.data;
//   } catch (error: any) {
//     console.error('Error adding pickslip header:', error.response?.data || error.message);
//     throw error;
//   }
// };


// src/api/pickslip.ts
import axios from 'axios';
import {
  PickslipHeaderPayload,
  PickslipHeaderResponse,
  PickslipDetailsPayload, // <-- Import new type
  PickslipDetailsResponse, // <-- Import new type
} from '../../types/sales/pickslip';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Adds a new pickslip header to the backend.
 * @param payload The pickslip header data.
 * @param authHeader Authorization header with Bearer token.
 * @returns A promise that resolves to the PickslipHeaderResponse.
 */
export const addPickslipHeader = async (
  payload: PickslipHeaderPayload,
  authHeader: { Authorization: string }
): Promise<PickslipHeaderResponse> => {
  try {
    const response = await axios.post<PickslipHeaderResponse>(
      `${API_BASE_URL}/api/pickslip/add-pickslip-header`,
      payload,
      { headers: authHeader }
    );
    return response.data;
  } catch (error: any) {
    console.error('Error adding pickslip header:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Adds pickslip details for a given pickslip header.
 * @param payload The pickslip details data.
 * @param authHeader Authorization header with Bearer token.
 * @returns A promise that resolves to the PickslipDetailsResponse.
 */
export const addPickslipDetails = async ( // <-- New API function
  payload: PickslipDetailsPayload,
  authHeader: { Authorization: string }
): Promise<PickslipDetailsResponse> => {
  try {
    const response = await axios.post<PickslipDetailsResponse>(
      `${API_BASE_URL}/api/pickslip/add-pickslip-details`,
      payload,
      { headers: authHeader }
    );
    return response.data;
  } catch (error: any) {
    console.error('Error adding pickslip details:', error.response?.data || error.message);
    throw error;
  }
};