export interface AuthResponse {
  message: string;
  token: string;
  email: string;
}

export interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
  token: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: 'USER' | 'ADMIN';
  exp: number;
}