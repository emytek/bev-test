
// import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { LoginResponse, User } from '../types/authTypes';
// import { saveToStorage, getFromStorage, removeFromStorage } from '../utils/storage';
// import { jwtDecode } from 'jwt-decode';

// interface AuthContextType {
//   token: string | null;
//   isAuthenticated: boolean;
//   user: User | null;
//   login: (data: LoginResponse, persist?: boolean) => void;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [token, setToken] = useState<string | null>(getFromStorage('accessToken') || null);
//   const [user, setUser] = useState<User | null>(null);
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

//   // Remove or modify this useEffect hook
//   useEffect(() => {
//     console.log('AuthContext: useEffect - token changed:', token);
//     if (token) {
//       try {
//         const decodedToken: any = jwtDecode(token);
//         console.log('AuthContext: useEffect - decoded token:', decodedToken);
//         // We only need to set the user from the decoded token if our API
//         // doesn't return the full user object on login and the token contains
//         // the necessary user details. In your case, the API returns the full
//         // user object, so we should rely on that.

//         // If you DO need to extract some user info from the token (e.g., ID),
//         // you should merge it with the user object from the API response.
//         // For now, let's comment out the direct setting of user from the token.
//         // setUser(decodedToken as User);
//         // console.log('AuthContext: useEffect - user state after decoding token:', user);
//       } catch (error) {
//         console.error('AuthContext: useEffect - Error decoding token:', error);
//         logout();
//       }
//     } else {
//       setUser(null);
//       console.log('AuthContext: useEffect - token is null, setting user to null');
//     }
//   }, [token, logout]);

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

//     // Initial setup
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
//   }, [navigate, logout, sessionTimeout]);

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
//   }, []);

//   const value: AuthContextType = {
//     token,
//     isAuthenticated,
//     user,
//     login,
//     logout,
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
//   return useAuthProvider(); // Directly use the provider context
// };


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