export interface LoginRequest {
    userNameEmail: string;
    password: string;
  }
  
  export interface LoginResponseRaw {
    status: boolean;
    message: string;
    user: any; 
    token: string;
  }
  
  export interface LoginResponse {
    token: string;
    user: any; 
  }
  