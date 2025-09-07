// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  ip_address: string;
  device_id: string;
  jwt_id: string;
  created_at: string;
  expires_at: string;
  revoked: boolean;
}

// Form related types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}