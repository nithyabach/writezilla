export interface UserProfile {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  lastLoginAt: string;
  provider?: 'email' | 'google';
  googleId?: string;
  avatar?: string;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface SignUpData {
  email: string;
  password: string;
  username: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  code: string;
  newPassword: string;
}

export interface AuthError {
  code: string;
  message: string;
  name: string;
}

export interface GoogleAuthConfig {
  clientId: string;
  clientSecret: string;
} 