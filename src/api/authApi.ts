import axiosInstance from "./axiosInstance";
import { LoginRequest, LoginResponse, LoginResponseRaw } from "../types/authTypes";

// export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
//   const response = await axiosInstance.post<LoginResponse>("/api/v1/auth/signin", credentials);
//   return response.data;
// };

export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponseRaw>("/api/v1/auth/signin", credentials);
  return { token: response.data.token, user: response.data.user };
};