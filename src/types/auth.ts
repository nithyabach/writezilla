export interface UserProfile {
  id: string;                    // Cognito User Sub
  email: string;                 // User email
  name: string;                  // Display name
  avatar?: string;               // Profile picture URL
  provider: 'GOOGLE' | 'COGNITO'; // Auth provider
  googleId?: string;             // Google user ID (if applicable)
  createdAt: Date;               // Account creation date
  lastLogin: Date;               // Last login timestamp
  isEmailVerified: boolean;      // Email verification status
}

export interface AuthResponse {
  user: UserProfile;
  tokens: {
    accessToken: string;
    refreshToken: string;
    idToken: string;
  };
  isNewUser: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  name: string;
}

export enum AuthError {
  INVALID_CREDENTIALS = 'Invalid email or password',
  USER_NOT_FOUND = 'User not found',
  EMAIL_NOT_VERIFIED = 'Please verify your email address',
  GOOGLE_AUTH_FAILED = 'Google authentication failed',
  NETWORK_ERROR = 'Network error. Please try again',
  UNKNOWN_ERROR = 'An unexpected error occurred',
  USER_ALREADY_EXISTS = 'User already exists with this email',
  WEAK_PASSWORD = 'Password does not meet requirements',
  INVALID_EMAIL = 'Please enter a valid email address'
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
} 