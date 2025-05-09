// AuthContext.tsx
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


// import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { LoginResponse, User } from '../types/authTypes';
// import { getFromStorage, removeFromStorage } from '../utils/storage';
// import { jwtDecode } from 'jwt-decode';
// import axiosInstance from "../api/axiosInstance"; // Import your axiosInstance

// interface AuthContextType {
//   token: string | null;
//   isAuthenticated: boolean;
//   user: User | null;
//   login: (data: LoginResponse, persist?: boolean) => void;
//   logout: () => void;
//   updateUser: (updatedUserData: Partial<User>) => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [token, setToken] = useState<string | null>(getFromStorage('accessToken') || null);
//   const [user, setUser] = useState<User | null>(null); // User is initialized to null
//   const navigate = useNavigate();
//   const sessionTimeout = 2 * 60 * 60 * 1000;

//   console.log('AuthContext: Initial token from storage:', token);
//   console.log('AuthContext: Initial user state:', user);

//   const isAuthenticated = !!token && !!user;
//   console.log('AuthContext: isAuthenticated state:', isAuthenticated);

//   const logout = useCallback(() => {
//     console.log('AuthContext: Logging out');
//     setToken(null);
//     setUser(null);
//     removeFromStorage('accessToken');
//     navigate('/');
//   }, [navigate]);

//   // Function to fetch user profile
//   const fetchUserProfile = useCallback(async () => {
//     if (!token) {
//       setUser(null);
//       return;
//     }
//     try {
//       console.log('AuthContext: Attempting to fetch user profile...');
//       // Assuming your backend has an endpoint to get the current user's profile
//       // and that axiosInstance automatically handles the Authorization header.
//       const response = await axiosInstance.get<any>('/api/v1/user/me'); // Adjust endpoint as needed
      
//       if (response.data?.status) {
//         console.log('AuthContext: User profile fetched successfully:', response.data.user);
//         setUser(response.data.user); // Set the user state with the fetched data
//       } else {
//         console.warn('AuthContext: Failed to fetch user profile - ', response.data?.message || 'Unknown error');
//         logout(); // Log out if the user profile cannot be fetched
//       }
//     } catch (error: any) {
//       console.error('AuthContext: Error fetching user profile:', error);
//       // If the token is invalid or expired, logout the user
//       if (error.response && (error.response.status === 401 || error.response.status === 403)) {
//         console.error("Session expired or invalid. Please log in again.");
//         logout();
//       } else {
//         // Handle other network errors or server issues
//         console.error("AuthContext: Network or server error fetching user profile.");
//         // Optionally, you might not want to logout here for transient errors.
//         // For now, we'll keep logout to ensure a clean state if user data is crucial.
//         logout();
//       }
//     }
//   }, [token, logout]); // Dependency on token and logout

//   useEffect(() => {
//     console.log('AuthContext: useEffect - token changed:', token);
//     if (token) {
//       // Try to decode token (for logging/debug)
//       try {
//         const decodedToken: any = jwtDecode(token);
//         console.log('AuthContext: useEffect - decoded token:', decodedToken);
//       } catch (error) {
//         console.error('AuthContext: useEffect - Error decoding token:', error);
//         logout(); // If token is malformed, logout
//         return;
//       }
      
//       // Fetch user profile when token is present
//       fetchUserProfile();
//     } else {
//       setUser(null);
//       console.log('AuthContext: useEffect - token is null, setting user to null');
//     }
//   }, [token, logout, fetchUserProfile]); // Add fetchUserProfile to dependencies

//   const resetInactivityTimer = useCallback(() => {
//     const logoutUser = () => {
//       logout();
//       alert('Your session has expired due to inactivity.');
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
//     window.addEventListener('focus', resetTimer); // Consider when the tab becomes active again

//     resetTimer();

//     return () => {
//       window.removeEventListener('mousemove', resetTimer);
//       window.removeEventListener('keydown', resetTimer);
//       window.removeEventListener('scroll', resetTimer);
//       window.removeEventListener('focus', resetTimer);
//       if (inactivityTimeout) {
//         clearTimeout(inactivityTimeout);
//       }
//     };
//   }, [logout, sessionTimeout]); // Removed navigate as it's not directly used here

//   useEffect(() => {
//     console.log('AuthContext: useEffect - isAuthenticated changed:', isAuthenticated);
//     if (isAuthenticated) {
//       return resetInactivityTimer();
//     }
//   }, [isAuthenticated, resetInactivityTimer]);

//   const login = useCallback((data: LoginResponse, persist: boolean = false) => {
//     console.log('AuthContext: login function called with data:', data, 'persist:', persist);
//     setToken(data.token);
//     setUser(data.user); // Ensure the user object from the API is being set here
//     const storage = persist ? localStorage : sessionStorage;
//     storage.setItem("accessToken", data.token);
//     console.log('AuthContext: login function - token set:', data.token);
//     console.log('AuthContext: login function - user set:', data.user);
//     // After successful login, you might want to immediately navigate
//     // navigate('/dashboard'); // Example: navigate to dashboard after login
//   }, []); // Removed navigate from dependencies as it's not used in the function logic

//   const updateUser = useCallback((updatedUserData: Partial<User>) => {
//     console.log('AuthContext: updateUser called with:', updatedUserData);
//     setUser((prevUser) => {
//       if (prevUser) {
//         return { ...prevUser, ...updatedUserData };
//       }
//       // If prevUser is null, this means the user was not set yet or had an issue.
//       // In such cases, assigning updatedUserData as User might be risky if it's not a full User object.
//       // Consider fetching the full user profile again if prevUser is null here.
//       return updatedUserData as User; 
//     });
//     // The console.log below will show the state before the update fully propagates
//     // console.log('AuthContext: updateUser - user state updated:', { ...user, ...updatedUserData });
//   }, []); // Removed `user` from dependencies to avoid stale closure and ensure `prevUser` is current

//   const value: AuthContextType = {
//     token,
//     isAuthenticated,
//     user,
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