import { Auth } from 'aws-amplify';
import {
  SignUpData,
  SignInData,
  ForgotPasswordData,
  ResetPasswordData,
  UserProfile,
  AuthError,
  GoogleAuthConfig,
} from '@/types/auth';

export class AuthService {
  /**
   * Sign up a new user
   */
  static async signUp(data: SignUpData): Promise<{ user: any; userSub: string }> {
    try {
      const { user, userSub } = await Auth.signUp({
        username: data.email,
        password: data.password,
        attributes: {
          email: data.email,
          'custom:username': data.username,
        },
      });
      return { user, userSub };
    } catch (error) {
      throw this.handleAuthError(error as AuthError);
    }
  }

  /**
   * Confirm sign up with verification code
   */
  static async confirmSignUp(email: string, code: string): Promise<void> {
    try {
      await Auth.confirmSignUp(email, code);
    } catch (error) {
      throw this.handleAuthError(error as AuthError);
    }
  }

  /**
   * Sign in user with email/password
   */
  static async signIn(data: SignInData): Promise<UserProfile> {
    try {
      const user = await Auth.signIn(data.email, data.password);
      return this.mapCognitoUserToProfile(user);
    } catch (error) {
      throw this.handleAuthError(error as AuthError);
    }
  }

  /**
   * Sign in user with Google OAuth
   */
  static async signInWithGoogle(): Promise<UserProfile> {
    try {
      const user = await Auth.federatedSignIn({ provider: 'Google' });
      return this.mapCognitoUserToProfile(user);
    } catch (error) {
      throw this.handleAuthError(error as AuthError);
    }
  }

  /**
   * Sign out user
   */
  static async signOut(): Promise<void> {
    try {
      await Auth.signOut();
    } catch (error) {
      throw this.handleAuthError(error as AuthError);
    }
  }

  /**
   * Get current authenticated user
   */
  static async getCurrentUser(): Promise<UserProfile | null> {
    try {
      const user = await Auth.currentAuthenticatedUser();
      return this.mapCognitoUserToProfile(user);
    } catch (error) {
      return null;
    }
  }

  /**
   * Forgot password
   */
  static async forgotPassword(data: ForgotPasswordData): Promise<void> {
    try {
      await Auth.forgotPassword(data.email);
    } catch (error) {
      throw this.handleAuthError(error as AuthError);
    }
  }

  /**
   * Reset password with code
   */
  static async resetPassword(data: ResetPasswordData): Promise<void> {
    try {
      await Auth.forgotPasswordSubmit(data.email, data.code, data.newPassword);
    } catch (error) {
      throw this.handleAuthError(error as AuthError);
    }
  }

  /**
   * Map Cognito user to UserProfile
   */
  private static mapCognitoUserToProfile(cognitoUser: any): UserProfile {
    const isGoogleUser = cognitoUser.attributes.identities?.includes('Google');
    
    return {
      id: cognitoUser.attributes.sub,
      email: cognitoUser.attributes.email,
      username: cognitoUser.attributes['custom:username'] || cognitoUser.username,
      createdAt: cognitoUser.attributes.created,
      lastLoginAt: new Date().toISOString(),
      provider: isGoogleUser ? 'google' : 'email',
      googleId: isGoogleUser ? cognitoUser.attributes['custom:google_id'] : undefined,
      avatar: cognitoUser.attributes.picture || undefined,
    };
  }

  /**
   * Handle authentication errors
   */
  private static handleAuthError(error: AuthError): Error {
    const errorMessages: Record<string, string> = {
      'UserNotFoundException': 'User not found. Please check your email.',
      'NotAuthorizedException': 'Incorrect email or password.',
      'UserNotConfirmedException': 'Please confirm your email address.',
      'CodeMismatchException': 'Invalid verification code.',
      'ExpiredCodeException': 'Verification code has expired.',
      'LimitExceededException': 'Too many attempts. Please try again later.',
      'InvalidPasswordException': 'Password does not meet requirements.',
      'UsernameExistsException': 'An account with this email already exists.',
      'FederatedSignInFailureException': 'Google sign-in failed. Please try again.',
      'InvalidParameterException': 'Invalid authentication parameters.',
    };

    const message = errorMessages[error.code] || error.message || 'Authentication error occurred.';
    return new Error(message);
  }
} 