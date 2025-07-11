

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
  updateUser: (updatedUserData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(getFromStorage('accessToken') || null);
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const navigate = useNavigate();
  const sessionTimeout = 2 * 60 * 60 * 1000;


  const isAuthenticated = !!token && !!user && !isInitializing;

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    removeFromStorage('accessToken');
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    if (token) {
      try {
        // Correctly type decodedToken to match JWT claims
        interface DecodedTokenPayload {
          nameid?: string;
          unique_name?: string;
          names?: string; // Contains "FirstName LastName"
          company?: string;
          role?: string;
          // Add other claims if they exist and you need them
          nbf?: number;
          exp?: number;
          iat?: number;
        }

        const decodedToken = jwtDecode<DecodedTokenPayload>(token);

        // Parse firstName and lastName from 'names' claim
        let firstName = '';
        let lastName = '';
        if (decodedToken.names) {
          const nameParts = decodedToken.names.split(' ');
          firstName = nameParts[0] || '';
          lastName = nameParts.slice(1).join(' ') || '';
        }

        // Hydrate the user object from the DECODED JWT claims
      
        setUser({
          id: decodedToken.nameid || '', // Map 'nameid' to 'id'
          email: decodedToken.unique_name || '', // Map 'unique_name' to 'email'
          firstName: firstName, // Mapped from 'names'
          lastName: lastName,   // Mapped from 'names'
          userRole: decodedToken.role || '', // Map 'role' to 'userRole'
          company: decodedToken.company || '', // Map 'company' to 'company'

          claims: [], // JWT usually doesn't have a 'claims' array at top-level
          roles: decodedToken.role ? [decodedToken.role] : [], // Populate roles based on 'role' claim if present
          isSuspended: false, // Default
          dateTimeCreated: new Date().toISOString(), // Use a default or current date
          dateTimeUpdated: new Date().toISOString(), // Use a default or current date
          restrictToState: false, // Default
          transactionState: '', // Default
          emailConfirmed: false, // Default
          passwordHash: '', // Should NEVER be in JWT
          securityStamp: null, // Default
          phoneNumber: '', // Default
          phoneNumberConfirmed: false, // Default
          twoFactorEnabled: false, // Default
          lockoutEnabled: false, // Default
          lockoutEndDateUtc: null, // Default
          accessFailedCount: 0, // Default
          userName: decodedToken.unique_name || '', // Map 'unique_name' to 'userName'
          logins: [], // Default
        } as User);

      } catch (error) {
        logout(); // Logout if token is invalid
      }
    } else {
      setUser(null);
    }
    setIsInitializing(false);
  }, [token, logout]); // Depend on token and logout

  const resetInactivityTimer = useCallback(() => {
    // ... (rest of your resetInactivityTimer logic - no changes needed here)
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
    window.addEventListener('focus', resetTimer);

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
  }, [logout, sessionTimeout]);

  useEffect(() => {
    if (isAuthenticated && !isInitializing) {
      return resetInactivityTimer();
    }
  }, [isAuthenticated, resetInactivityTimer, isInitializing]);

  const login = useCallback((data: LoginResponse, persist: boolean = false) => {
    setToken(data.token);
    setUser(data.user); // <-- THIS IS CORRECT: It uses the full user object from the backend
    const storage = persist ? localStorage : sessionStorage;
    storage.setItem("accessToken", data.token);
    navigate('/dashboard');
  }, [navigate]);

  const updateUser = useCallback((updatedUserData: Partial<User>) => {
    setUser((prevUser) => {
      if (prevUser) {
        return { ...prevUser, ...updatedUserData };
      }

      return updatedUserData as User;
    });
  }, []);

  const value: AuthContextType = {
    token,
    isAuthenticated,
    user,
    login,
    logout,
    updateUser,
  };

  if (isInitializing) {
    return <div>Loading authentication...</div>;
  }

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

export const useUserAuth = () => {
  return useAuthProvider();
};


// import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { LoginResponse, User } from '../types/authTypes';
// import { getFromStorage, removeFromStorage, saveToStorage } from '../utils/storage'; // Import saveToStorage
// import { jwtDecode } from 'jwt-decode';

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
//   // Initialize user state from local storage or null
//   const [user, setUser] = useState<User | null>(getFromStorage('user') || null);
//   const [isInitializing, setIsInitializing] = useState(true);
//   const navigate = useNavigate();
//   const sessionTimeout = 2 * 60 * 60 * 1000; // 2 hours

//   console.log('AuthContext: Initial token from storage:', token);
//   console.log('AuthContext: Initial user state:', user);

//   const isAuthenticated = !!token && !!user && !isInitializing;
//   console.log('AuthContext: isAuthenticated state:', isAuthenticated);

//   const logout = useCallback(() => {
//     console.log('AuthContext: Logging out');
//     setToken(null);
//     setUser(null);
//     removeFromStorage('accessToken');
//     removeFromStorage('user'); // Also remove user object from storage
//     navigate('/');
//   }, [navigate]);

//   useEffect(() => {
//     console.log('AuthContext: useEffect - token changed or initial load. Current token:', token);

//     // If there's no token, ensure user is null and finish initialization
//     if (!token) {
//       setUser(null);
//       removeFromStorage('user'); // Clean up old user data if token is gone
//       setIsInitializing(false);
//       console.log('AuthContext: useEffect - token is null, setting user to null');
//       return;
//     }

//     // If there's a token but the user object is missing from state/storage,
//     // or if you want to ensure the user object in state is valid,
//     // attempt to re-hydrate from storage or decode from token.
//     if (!user) { // Only attempt to re-hydrate if user is currently null in state
//         const storedUser = getFromStorage('user');

//         if (storedUser) {
//             // Option 1: User object is directly in local storage. Use it.
//             console.log('AuthContext: useEffect - Hydrating user from local storage:', storedUser);
//             setUser(storedUser);
//         } else {
//             // Option 2: User object is NOT in local storage (e.g., very first load, or localStorage was cleared).
//             // Fallback to decoding the JWT for essential fields.
//             // THIS WILL NOT HAVE phoneNumber unless backend puts it in JWT.
//             console.log('AuthContext: useEffect - User not in storage, decoding from JWT (limited fields)');
//             try {
//                 interface DecodedTokenPayload {
//                     nameid?: string;
//                     unique_name?: string;
//                     names?: string;
//                     company?: string;
//                     role?: string;
//                     // Add other claims here IF your backend puts them in the JWT
//                     phone_number?: string; // If backend adds this to JWT
//                     nbf?: number;
//                     exp?: number;
//                     iat?: number;
//                 }

//                 const decodedToken = jwtDecode<DecodedTokenPayload>(token);
//                 console.log('AuthContext: useEffect - decoded token for fallback:', decodedToken);

//                 let firstName = '';
//                 let lastName = '';
//                 if (decodedToken.names) {
//                     const nameParts = decodedToken.names.split(' ');
//                     firstName = nameParts[0] || '';
//                     lastName = nameParts.slice(1).join(' ') || '';
//                 }

//                 setUser({
//                     id: decodedToken.nameid || '',
//                     email: decodedToken.unique_name || '',
//                     firstName: firstName,
//                     lastName: lastName,
//                     userRole: decodedToken.role || '',
//                     company: decodedToken.company || '',
//                     phoneNumber: decodedToken.phone_number || '', // Will only work if backend adds to JWT
//                     // Provide default/empty values for other fields not in JWT payload
//                     claims: [],
//                     roles: decodedToken.role ? [decodedToken.role] : [],
//                     isSuspended: false,
//                     dateTimeCreated: new Date().toISOString(),
//                     dateTimeUpdated: new Date().toISOString(),
//                     restrictToState: false,
//                     transactionState: '',
//                     emailConfirmed: false,
//                     passwordHash: '',
//                     securityStamp: null,
//                     phoneNumberConfirmed: false,
//                     twoFactorEnabled: false,
//                     lockoutEnabled: false,
//                     lockoutEndDateUtc: null,
//                     accessFailedCount: 0,
//                     userName: decodedToken.unique_name || '',
//                     logins: [],
//                 } as User);
//             } catch (error) {
//                 console.error('AuthContext: useEffect - Error decoding token or hydrating user (fallback):', error);
//                 logout(); // Logout if token is invalid or decoding fails
//             }
//         }
//     }

//     setIsInitializing(false);
//   }, [token, user, logout]); // Add 'user' to dependencies to trigger re-hydration if user becomes null

//   const resetInactivityTimer = useCallback(() => {
//     // ... (rest of your resetInactivityTimer logic - no changes needed here)
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
//     window.addEventListener('focus', resetTimer);

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
//   }, [logout, sessionTimeout]);

//   useEffect(() => {
//     console.log('AuthContext: useEffect - isAuthenticated changed:', isAuthenticated, 'isInitializing:', isInitializing);
//     if (isAuthenticated && !isInitializing) {
//       return resetInactivityTimer();
//     }
//   }, [isAuthenticated, resetInactivityTimer, isInitializing]);

//   const login = useCallback((data: LoginResponse, persist: boolean = false) => {
//     console.log('AuthContext: login function called with data:', data, 'persist:', persist);
//     setToken(data.token);
//     setUser(data.user); // THIS IS CRUCIAL: Set the full user object from the response

//     const storage = persist ? localStorage : sessionStorage;
//     storage.setItem("accessToken", data.token);
//     saveToStorage('user', data.user); // <--- SAVE THE FULL USER OBJECT HERE!

//     console.log('AuthContext: login function - token set:', data.token);
//     console.log('AuthContext: login function - user set:', data.user);
//     navigate('/dashboard');
//   }, [navigate]);

//   const updateUser = useCallback((updatedUserData: Partial<User>) => {
//     console.log('AuthContext: updateUser called with:', updatedUserData);
//     setUser((prevUser) => {
//       const newUser = prevUser ? { ...prevUser, ...updatedUserData } : updatedUserData as User;
//       saveToStorage('user', newUser); // Update user in storage too
//       return newUser;
//     });
//   }, []);

//   const value: AuthContextType = {
//     token,
//     isAuthenticated,
//     user,
//     login,
//     logout,
//     updateUser,
//   };

//   if (isInitializing) {
//     return <div>Loading authentication...</div>;
//   }

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
