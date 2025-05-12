import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redirect to the login page if not authenticated
    return <Navigate to="/" replace />;
  }

  // Render the child components if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;


// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';
// import { Loader } from '../ui/loader/Loader'; 

// interface ProtectedRouteProps {
//   children: React.ReactNode;
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
//   const { isAuthenticated, isAuthLoading } = useAuth();

//   // While authentication status is being determined, show a loader or null
//   if (isAuthLoading) {
//     return (
//       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//         <Loader /> {/* Or any loading spinner/component */}
//       </div>
//     );
//   }

//   // Once loading is complete, check authentication status
//   if (!isAuthenticated) {
//     // Redirect to the login page if not authenticated
//     return <Navigate to="/" replace />;
//   }

//   // Render the child components if authenticated
//   return <>{children}</>;
// };

// export default ProtectedRoute;