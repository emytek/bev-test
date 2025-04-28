export const getToken = (): string | null => {
    return localStorage.getItem('accessToken');
  };
  
  export const saveToken = (token: string): void => {
    localStorage.setItem('accessToken', token);
  };
  
  export const clearToken = (): void => {
    localStorage.removeItem('accessToken');
  };
  
  export const parseJwt = (token: string | null): any => {
    if (!token) {
      return null;
    }
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
  
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error parsing JWT:", error);
      return null;
    }
  };
  