import { 
  signInWithRedirect, 
  signUp, 
  signOut, 
  getCurrentUser, 
  fetchUserAttributes,
  confirmSignUp,
  resetPassword,
  confirmResetPassword
} from 'aws-amplify/auth';
import { 
  UserProfile, 
  LoginCredentials, 
  SignUpCredentials, 
  AuthError 
} from '../types/auth';

export class AuthService {
  /**
   * Sign in with Google OAuth
   */
  async signInWithGoogle(): Promise<void> {
    try {
      await signInWithRedirect({ provider: 'Google' });
    } catch (error) {
      console.error('Google OAuth sign in failed:', error);
      throw new Error('Google OAuth failed');
    }
  }

  /**
   * Sign up a new user with email and password
   */
  async signUp(credentials: SignUpCredentials) {
    try {
      const result = await signUp({
        username: credentials.email,
        password: credentials.password,
        options: {
          userAttributes: {
            email: credentials.email,
            name: credentials.name
          }
        }
      });

      return {
        userId: result.user.userId,
        userSub: result.userSub || 'temp-user-sub',
        isSignUpComplete: result.isSignUpComplete
      };
    } catch (error: any) {
      console.error('Sign up failed:', error);
      
      // Handle specific error cases
      if (error.name === 'UsernameExistsException') {
        throw new Error(AuthError.USER_ALREADY_EXISTS);
      } else if (error.name === 'InvalidPasswordException') {
        throw new Error(AuthError.WEAK_PASSWORD);
      } else if (error.name === 'InvalidParameterException') {
        throw new Error(AuthError.INVALID_EMAIL);
      }
      
      throw error;
    }
  }

  /**
   * Confirm user sign up with verification code
   */
  async confirmSignUp(email: string, code: string) {
    try {
      return await confirmSignUp({
        username: email,
        confirmationCode: code
      });
    } catch (error: any) {
      console.error('Sign up confirmation failed:', error);
      
      if (error.name === 'CodeMismatchException') {
        throw new Error('Invalid confirmation code');
      } else if (error.name === 'ExpiredCodeException') {
        throw new Error('Confirmation code has expired');
      }
      
      throw error;
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn(credentials: LoginCredentials): Promise<UserProfile> {
    try {
      await signInWithRedirect({
        username: credentials.email,
        password: credentials.password
      });

      // Get current user and attributes
      const user = await getCurrentUser();
      const attributes = await fetchUserAttributes();

      return this.mapUserAttributesToProfile(attributes, 'COGNITO');
    } catch (error: any) {
      console.error('Sign in failed:', error);
      
      if (error.name === 'NotAuthorizedException') {
        throw new Error(AuthError.INVALID_CREDENTIALS);
      } else if (error.name === 'UserNotFoundException') {
        throw new Error(AuthError.USER_NOT_FOUND);
      } else if (error.name === 'UserNotConfirmedException') {
        throw new Error(AuthError.EMAIL_NOT_VERIFIED);
      }
      
      throw error;
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<void> {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  }

  /**
   * Get the current authenticated user
   */
  async getCurrentUser(): Promise<UserProfile | null> {
    try {
      const user = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      
      return this.mapUserAttributesToProfile(attributes, 'COGNITO');
    } catch (error) {
      console.error('Get current user failed:', error);
      return null;
    }
  }

  /**
   * Check if user is currently authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      await getCurrentUser();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Initiate password reset
   */
  async forgotPassword(email: string) {
    try {
      return await resetPassword({ username: email });
    } catch (error: any) {
      console.error('Forgot password failed:', error);
      
      if (error.name === 'UserNotFoundException') {
        throw new Error(AuthError.USER_NOT_FOUND);
      }
      
      throw error;
    }
  }

  /**
   * Reset password with confirmation code
   */
  async resetPassword(email: string, code: string, newPassword: string) {
    try {
      return await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword: newPassword
      });
    } catch (error: any) {
      console.error('Reset password failed:', error);
      
      if (error.name === 'CodeMismatchException') {
        throw new Error('Invalid confirmation code');
      } else if (error.name === 'ExpiredCodeException') {
        throw new Error('Confirmation code has expired');
      } else if (error.name === 'InvalidPasswordException') {
        throw new Error(AuthError.WEAK_PASSWORD);
      }
      
      throw error;
    }
  }

  /**
   * Map Cognito user attributes to UserProfile interface
   */
  private mapUserAttributesToProfile(attributes: any, provider: 'GOOGLE' | 'COGNITO'): UserProfile {
    return {
      id: attributes.sub || attributes.userSub || 'unknown',
      email: attributes.email || '',
      name: attributes.name || attributes.given_name + ' ' + attributes.family_name || 'Unknown User',
      avatar: attributes.picture || attributes.avatar || undefined,
      provider: provider,
      googleId: attributes.googleId || undefined,
      createdAt: new Date(attributes.created_at || Date.now()),
      lastLogin: new Date(),
      isEmailVerified: attributes.email_verified === 'true' || attributes.emailVerified === true
    };
  }

  /**
   * Handle OAuth redirect and get user profile
   */
  async handleOAuthRedirect(): Promise<UserProfile | null> {
    try {
      const user = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      
      // Determine provider based on attributes
      const provider = attributes.identities ? 'GOOGLE' : 'COGNITO';
      
      return this.mapUserAttributesToProfile(attributes, provider);
    } catch (error) {
      console.error('OAuth redirect handling failed:', error);
      return null;
    }
  }
}

// Export singleton instance
export const authService = new AuthService(); 