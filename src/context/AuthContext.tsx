
import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginResponse, User } from '../types/authTypes';
import { getFromStorage, removeFromStorage } from '../utils/storage';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null;
  login: (data: LoginResponse, persist?: boolean) => void;
  logout: () => void;
  updateUser: (updatedUserData: Partial<User>) => void; // Add the updateUser function
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(getFromStorage('accessToken') || null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const sessionTimeout = 2 * 60 * 60 * 1000;

  console.log('AuthContext: Initial token from storage:', token);
  console.log('AuthContext: Initial user state:', user);

  const isAuthenticated = !!token && !!user;
  console.log('AuthContext: isAuthenticated state:', isAuthenticated);

  const logout = useCallback(() => {
    console.log('AuthContext: Logging out');
    setToken(null);
    setUser(null);
    removeFromStorage('accessToken');
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    console.log('AuthContext: useEffect - token changed:', token);
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        console.log('AuthContext: useEffect - decoded token:', decodedToken);
        // If your token contains user information that you want to keep in sync
        // with the main user object, you can merge it here. Otherwise, the
        // user object from the login API response is the primary source.
        // Example of merging (if needed):
        // setUser((prevUser) => ({ ...prevUser, ...decodedToken }));
      } catch (error) {
        console.error('AuthContext: useEffect - Error decoding token:', error);
        logout();
      }
    } else {
      setUser(null);
      console.log('AuthContext: useEffect - token is null, setting user to null');
    }
  }, [token, logout]);

  const resetInactivityTimer = useCallback(() => {
    const logoutUser = () => {
      logout();
      alert('Your session has expired due to inactivity.');
    };

    let inactivityTimeout: NodeJS.Timeout | null = null;

    const handleUserActivity = () => {
      if (inactivityTimeout) {
        clearTimeout(inactivityTimeout);
      }
      inactivityTimeout = setTimeout(logoutUser, sessionTimeout);
    };

    const resetTimer = () => {
      handleUserActivity();
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('scroll', resetTimer);
    window.addEventListener('focus', resetTimer); // Consider when the tab becomes active again

    resetTimer();

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('scroll', resetTimer);
      window.removeEventListener('focus', resetTimer);
      if (inactivityTimeout) {
        clearTimeout(inactivityTimeout);
      }
    };
  }, [navigate, logout, sessionTimeout]);

  useEffect(() => {
    console.log('AuthContext: useEffect - isAuthenticated changed:', isAuthenticated);
    if (isAuthenticated) {
      return resetInactivityTimer();
    }
  }, [isAuthenticated, resetInactivityTimer]);

  const login = useCallback((data: LoginResponse, persist: boolean = false) => {
    console.log('AuthContext: login function called with data:', data, 'persist:', persist);
    setToken(data.token);
    setUser(data.user); // Ensure the user object from the API is being set here
    const storage = persist ? localStorage : sessionStorage;
    storage.setItem("accessToken", data.token);
    console.log('AuthContext: login function - token set:', data.token);
    console.log('AuthContext: login function - user set:', data.user);
  }, []);

  const updateUser = useCallback((updatedUserData: Partial<User>) => {
    console.log('AuthContext: updateUser called with:', updatedUserData);
    setUser((prevUser) => {
      if (prevUser) {
        return { ...prevUser, ...updatedUserData };
      }
      return updatedUserData as User;
    });
    console.log('AuthContext: updateUser - user state updated:', { ...user, ...updatedUserData });
  }, [user]);

  const value: AuthContextType = {
    token,
    isAuthenticated,
    user,
    login,
    logout,
    updateUser, // Include the updateUser function in the context value
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthProvider = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthProvider must be used within an AuthProvider');
  }
  return context;
};

export const useAuth = () => {
  return useAuthProvider(); // Directly use the provider context
};

// AuthContext.tsx
// import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { LoginResponse, User } from '../types/authTypes';
// import { getFromStorage, removeFromStorage } from '../utils/storage';
// import { jwtDecode } from 'jwt-decode';
// import axiosInstance from "../api/axiosInstance"; // Ensure this import exists
// import { toast } from 'sonner'; // Assuming you use sonner for toasts

// interface AuthContextType {
//   token: string | null;
//   isAuthenticated: boolean;
//   user: User | null;
//   isAuthLoading: boolean; // Add loading state
//   login: (data: LoginResponse, persist?: boolean) => void;
//   logout: () => void;
//   updateUser: (updatedUserData: Partial<User>) => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [token, setToken] = useState<string | null>(getFromStorage('accessToken') || null);
//   const [user, setUser] = useState<User | null>(null);
//   const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true); // Initial loading state
//   const navigate = useNavigate();
//   const sessionTimeout = 2 * 60 * 60 * 1000; // 2 hours

//   console.log('AuthContext: Initial token from storage:', token);
//   console.log('AuthContext: Initial user state:', user);
//   console.log('AuthContext: Initial loading state:', isAuthLoading);

//   // isAuthenticated is derived from token and user
//   const isAuthenticated = !!token && !!user;
//   console.log('AuthContext: isAuthenticated state:', isAuthenticated);

//   const logout = useCallback(() => {
//     console.log('AuthContext: Logging out');
//     setToken(null);
//     setUser(null);
//     removeFromStorage('accessToken');
//     setIsAuthLoading(false); // Set loading to false after logout
//     navigate('/');
//   }, [navigate]);

//   // Function to fetch user profile
//   const fetchUserProfile = useCallback(async () => {
//     if (!token) {
//       setUser(null);
//       setIsAuthLoading(false); // Not loading if no token
//       return;
//     }
//     setIsAuthLoading(true); // Start loading before fetching
//     try {
//       console.log('AuthContext: Attempting to fetch user profile...');
//       // Assuming your backend has an endpoint to get the current user's profile
//       // and that axiosInstance automatically handles the Authorization header.
//       const response = await axiosInstance.get<any>('/api/v1/user/me'); // Adjust endpoint as needed (e.g. /api/profile)
      
//       if (response.data?.status) {
//         console.log('AuthContext: User profile fetched successfully:', response.data.user);
//         setUser(response.data.user); // Set the user state with the fetched data
//       } else {
//         console.warn('AuthContext: Failed to fetch user profile - ', response.data?.message || 'Unknown error');
//         // If API indicates failure, clear token and log out
//         toast.error(response.data?.message || "Failed to fetch user profile. Please login again.");
//         logout(); 
//       }
//     } catch (error: any) {
//       console.error('AuthContext: Error fetching user profile:', error);
//       // If the token is invalid or expired, logout the user
//       if (error.response && (error.response.status === 401 || error.response.status === 403)) {
//         toast.error("Session expired or invalid. Please log in again.");
//         logout();
//       } else {
//         // Handle other network errors or server issues.
//         // For enterprise, consider a more specific error message or retry logic.
//         toast.error(error.message || "A network error occurred. Please try again.");
//         logout(); // Log out to ensure a clean state
//       }
//     } finally {
//       setIsAuthLoading(false); // Always stop loading, regardless of success or failure
//     }
//   }, [token, logout]); // Dependency on token and logout

//   // Effect to handle initial token check and user profile fetch
//   useEffect(() => {
//     console.log('AuthContext: useEffect - token changed:', token);
//     if (token) {
//       try {
//         // Optional: Basic token decoding for logging or pre-checks
//         const decodedToken: any = jwtDecode(token);
//         console.log('AuthContext: useEffect - decoded token:', decodedToken);
//         // Consider adding a check for token expiry here if you want to handle it client-side
//         // before making the API call. If (decodedToken.exp * 1000 < Date.now()) logout();
//       } catch (error) {
//         console.error('AuthContext: useEffect - Error decoding token:', error);
//         toast.error("Invalid token. Please log in again.");
//         logout(); // If token is malformed, logout
//         return;
//       }
      
//       // Fetch user profile when token is present
//       fetchUserProfile();
//     } else {
//       // No token, ensure user is null and loading is false
//       setUser(null);
//       setIsAuthLoading(false);
//       console.log('AuthContext: useEffect - token is null, setting user to null and loading to false');
//     }
//   }, [token, logout, fetchUserProfile]); // Add fetchUserProfile to dependencies

//   // Inactivity Timer Logic
//   const resetInactivityTimer = useCallback(() => {
//     const logoutUser = () => {
//       logout();
//       toast.info('Your session has expired due to inactivity.'); // Use toast instead of alert
//     };

//     let inactivityTimeout: NodeJS.Timeout | null = null;

//     const handleUserActivity = () => {
//       if (inactivityTimeout) {
//         clearTimeout(inactivityTimeout);
//       }
//       inactivityTimeout = setTimeout(logoutUser, sessionTimeout);
//     };

//     const resetTimer = () => {
//       handleUserActivity();
//     };

//     window.addEventListener('mousemove', resetTimer);
//     window.addEventListener('keydown', resetTimer);
//     window.addEventListener('scroll', resetTimer);
//     window.addEventListener('focus', resetTimer); 

//     resetTimer(); // Start the timer immediately

//     return () => {
//       window.removeEventListener('mousemove', resetTimer);
//       window.removeEventListener('keydown', resetTimer);
//       window.removeEventListener('scroll', resetTimer);
//       window.removeEventListener('focus', resetTimer);
//       if (inactivityTimeout) {
//         clearTimeout(inactivityTimeout);
//       }
//     };
//   }, [logout, sessionTimeout]); // Removed navigate as it's not directly used inside this useCallback

//   useEffect(() => {
//     console.log('AuthContext: useEffect - isAuthenticated changed:', isAuthenticated);
//     // Only start the inactivity timer if authenticated and not currently loading initial auth state
//     if (isAuthenticated && !isAuthLoading) {
//       return resetInactivityTimer();
//     }
//   }, [isAuthenticated, isAuthLoading, resetInactivityTimer]);

//   const login = useCallback((data: LoginResponse, persist: boolean = false) => {
//     console.log('AuthContext: login function called with data:', data, 'persist:', persist);
//     setToken(data.token);
//     setUser(data.user); // Set user from login response
//     const storage = persist ? localStorage : sessionStorage;
//     storage.setItem("accessToken", data.token);
//     console.log('AuthContext: login function - token set:', data.token);
//     console.log('AuthContext: login function - user set:', data.user);
//     setIsAuthLoading(false); // Ensure loading state is false after successful login
//     // No navigate here, let the calling component handle navigation
//   }, []); // Removed navigate from dependencies as it's not used in the function logic

//   const updateUser = useCallback((updatedUserData: Partial<User>) => {
//     console.log('AuthContext: updateUser called with:', updatedUserData);
//     setUser((prevUser) => {
//       if (prevUser) {
//         return { ...prevUser, ...updatedUserData };
//       }
//       // This scenario (prevUser being null during an update) implies a state inconsistency.
//       // Consider whether a full refetch might be more appropriate if prevUser is null.
//       console.warn("AuthContext: updateUser called when prevUser is null. Data might be incomplete.");
//       return updatedUserData as User; // Cast as User, assuming updatedUserData is a valid partial.
//     });
//     // Note: The console.log here might show the state before the update fully propagates
//     // console.log('AuthContext: updateUser - user state updated:', { ...user, ...updatedUserData });
//   }, []); // Empty dependency array for functional update of state

//   const value: AuthContextType = {
//     token,
//     isAuthenticated,
//     user,
//     isAuthLoading, // Provide the loading state
//     login,
//     logout,
//     updateUser,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuthProvider = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuthProvider must be used within an AuthProvider');
//   }
//   return context;
// };

// export const useAuth = () => {
//   return useAuthProvider();
// };
