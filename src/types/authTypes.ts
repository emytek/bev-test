// authTypes.ts
export interface LoginRequest {
  userNameEmail: string;
  password: string;
}

export interface User {
  claims: any[];
  logins: any[];
  roles: string[];
  firstName: string;
  lastName: string;
  userRole: string;
  isSuspended: boolean;
  dateTimeCreated: string;
  dateTimeUpdated: string;
  company: string;
  restrictToState: boolean;
  transactionState: string;
  email: string;
  emailConfirmed: boolean;
  passwordHash: string;
  securityStamp: string | null;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEndDateUtc: string | null;
  lockoutEnabled: boolean;
  accessFailedCount: number;
  id: string;
  userName: string;
}

export interface LoginResponseRaw {
  status: boolean;
  message: string;
  user: User; // Use the User interface here
  token: string;
}

export interface LoginResponse {
  token: string;
  user: User; // Use the User interface here
}