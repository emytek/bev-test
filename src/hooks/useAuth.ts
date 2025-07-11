import { useState } from "react";
import { loginUser } from "../api/authApi";
import { LoginRequest, LoginResponse, LoginResponseRaw } from "../types/authTypes";
import { useUserAuth as useAuthProvider } from "../context/AuthContext"; 



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

// export const useAuth = () => {
//   // Destructure all properties from the AuthProvider context, including isAuthLoading
//   const { 
//     login: loginContext, // Renamed to avoid conflict with local login function
//     logout, 
//     isAuthenticated, 
//     user, 
//     token, 
//     isAuthLoading // <--- THIS IS THE ADDITION
//   } = useAuthProvider();

//   // Keep local loading and error states for the 'login' specific API call
//   // Renamed to avoid confusion with the global 'isAuthLoading'
//   const [loginLoading, setLoginLoading] = useState(false); 
//   const [loginError, setLoginError] = useState<string | null>(null); 

//   const login = async (credentials: LoginRequest) => {
//     try {
//       setLoginLoading(true); // Use local loading state for this specific function
//       setLoginError(null); // Use local error state
      
//       const response: LoginResponseRaw = await loginUser(credentials); // Your API call to login

//       if (response.status) {
//         const loginData: LoginResponse = { token: response.token, user: response.user };
//         loginContext(loginData); // Call the context's login function
//         return response; // Return the raw response for further handling if needed
//       } else {
//         setLoginError(response.message);
//         throw new Error(response.message);
//       }
//     } catch (err: any) {
//       const backendMessage = err.message || "An unexpected error occurred.";
//       setLoginError(backendMessage);
//       throw new Error(backendMessage);
//     } finally {
//       setLoginLoading(false);
//     }
//   };

//   // Return all relevant properties.
//   // isAuthenticated, user, token, isAuthLoading come directly from AuthProvider.
//   // login (the function defined above), logout come from AuthProvider or are defined locally.
//   // loginLoading and loginError are specific to the login process.
//   return { 
//     login, 
//     logout, 
//     isAuthenticated, 
//     user, 
//     token, 
//     isAuthLoading, // Provide the global authentication loading status
//     loginLoading, // Provide the loading status specific to the login API call
//     loginError // Provide the error status specific to the login API call
//   };
// };