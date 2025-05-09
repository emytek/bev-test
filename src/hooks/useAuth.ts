import { useState } from "react";
import { loginUser } from "../api/authApi";
import { LoginRequest, LoginResponse, LoginResponseRaw } from "../types/authTypes";
import { useAuth as useAuthProvider } from "../context/AuthContext"; 

// export const useAuth = () => {
//   const { login: loginContext, logout, isAuthenticated, user, token } = useAuthProvider();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const login = async (credentials: LoginRequest) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const data = await loginUser(credentials);
//       loginContext(data); 
//       return data;
//     } catch (err: any) {
//       const backendMessage = err.response?.data?.message || "An unexpected error occurred.";
//       setError(backendMessage);
//       throw new Error(backendMessage);
//     } finally {
//       setLoading(false);
//     }
//   };
//   return { login, logout, isAuthenticated, user, token, loading, error };
// };

// useAuth.ts

export const useAuth = () => {
  const { login: loginContext, logout, isAuthenticated, user, token } = useAuthProvider();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response: LoginResponseRaw = await loginUser(credentials);

      if (response.status) {
        const loginData: LoginResponse = { token: response.token, user: response.user };
        loginContext(loginData);
        return response;
      } else {
        setError(response.message);
        throw new Error(response.message);
      }
    } catch (err: any) {
      const backendMessage = err.message || "An unexpected error occurred.";
      setError(backendMessage);
      throw new Error(backendMessage);
    } finally {
      setLoading(false);
    }
  };
  return { login, logout, isAuthenticated, user, token, loading, error };
};

