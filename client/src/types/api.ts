export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterCredentials extends LoginCredentials {
    name: string;
  }
  
  export interface User {
    _id: string;
    name: string;
    email: string;
    avatar: string;
    online: boolean;
    token?: string;
  }
  
  export interface AuthResponse {
    user: User;
    token: string;
  }
  
  export interface ApiError {
    message: string;
    status?: number;
  }