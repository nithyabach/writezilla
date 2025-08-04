import { Auth } from 'aws-amplify';
import { AuthService } from '../authService';
import { SignUpData, SignInData, ForgotPasswordData, ResetPasswordData } from '@/types/auth';

// Mock AWS Amplify Auth
jest.mock('aws-amplify', () => ({
  Auth: {
    signUp: jest.fn(),
    confirmSignUp: jest.fn(),
    signIn: jest.fn(),
    federatedSignIn: jest.fn(),
    signOut: jest.fn(),
    currentAuthenticatedUser: jest.fn(),
    forgotPassword: jest.fn(),
    forgotPasswordSubmit: jest.fn(),
  },
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    const mockSignUpData: SignUpData = {
      email: 'test@example.com',
      password: 'TestPassword123!',
      username: 'testuser',
    };

    it('should successfully sign up a new user', async () => {
      const mockUser = { username: 'test@example.com' };
      const mockUserSub = 'user-sub-123';
      
      (Auth.signUp as jest.Mock).mockResolvedValue({
        user: mockUser,
        userSub: mockUserSub,
      });

      const result = await AuthService.signUp(mockSignUpData);

      expect(Auth.signUp).toHaveBeenCalledWith({
        username: mockSignUpData.email,
        password: mockSignUpData.password,
        attributes: {
          email: mockSignUpData.email,
          'custom:username': mockSignUpData.username,
        },
      });
      expect(result).toEqual({
        user: mockUser,
        userSub: mockUserSub,
      });
    });

    it('should throw error for invalid signup data', async () => {
      const mockError = {
        code: 'InvalidPasswordException',
        message: 'Password does not meet requirements',
        name: 'InvalidPasswordException',
      };

      (Auth.signUp as jest.Mock).mockRejectedValue(mockError);

      await expect(AuthService.signUp(mockSignUpData)).rejects.toThrow(
        'Password does not meet requirements'
      );
    });

    it('should throw error for existing user', async () => {
      const mockError = {
        code: 'UsernameExistsException',
        message: 'User already exists',
        name: 'UsernameExistsException',
      };

      (Auth.signUp as jest.Mock).mockRejectedValue(mockError);

      await expect(AuthService.signUp(mockSignUpData)).rejects.toThrow(
        'An account with this email already exists.'
      );
    });
  });

  describe('confirmSignUp', () => {
    it('should successfully confirm sign up', async () => {
      const email = 'test@example.com';
      const code = '123456';

      (Auth.confirmSignUp as jest.Mock).mockResolvedValue(undefined);

      await expect(AuthService.confirmSignUp(email, code)).resolves.toBeUndefined();

      expect(Auth.confirmSignUp).toHaveBeenCalledWith(email, code);
    });

    it('should throw error for invalid confirmation code', async () => {
      const email = 'test@example.com';
      const code = '123456';
      const mockError = {
        code: 'CodeMismatchException',
        message: 'Invalid code',
        name: 'CodeMismatchException',
      };

      (Auth.confirmSignUp as jest.Mock).mockRejectedValue(mockError);

      await expect(AuthService.confirmSignUp(email, code)).rejects.toThrow(
        'Invalid verification code.'
      );
    });
  });

  describe('signIn', () => {
    const mockSignInData: SignInData = {
      email: 'test@example.com',
      password: 'TestPassword123!',
    };

    it('should successfully sign in user', async () => {
      const mockCognitoUser = {
        attributes: {
          sub: 'user-sub-123',
          email: 'test@example.com',
          'custom:username': 'testuser',
          created: '2023-01-01T00:00:00.000Z',
        },
        username: 'test@example.com',
      };

      (Auth.signIn as jest.Mock).mockResolvedValue(mockCognitoUser);

      const result = await AuthService.signIn(mockSignInData);

      expect(Auth.signIn).toHaveBeenCalledWith(
        mockSignInData.email,
        mockSignInData.password
      );
      expect(result).toEqual({
        id: 'user-sub-123',
        email: 'test@example.com',
        username: 'testuser',
        createdAt: '2023-01-01T00:00:00.000Z',
        lastLoginAt: expect.any(String),
        provider: 'email',
        googleId: undefined,
        avatar: undefined,
      });
    });

    it('should throw error for invalid credentials', async () => {
      const mockError = {
        code: 'NotAuthorizedException',
        message: 'Incorrect username or password',
        name: 'NotAuthorizedException',
      };

      (Auth.signIn as jest.Mock).mockRejectedValue(mockError);

      await expect(AuthService.signIn(mockSignInData)).rejects.toThrow(
        'Incorrect email or password.'
      );
    });
  });

  describe('signInWithGoogle', () => {
    it('should successfully sign in user with Google', async () => {
      const mockCognitoUser = {
        attributes: {
          sub: 'user-sub-123',
          email: 'test@gmail.com',
          'custom:username': 'testuser',
          created: '2023-01-01T00:00:00.000Z',
          identities: 'Google',
          'custom:google_id': 'google-user-123',
          picture: 'https://example.com/avatar.jpg',
        },
        username: 'test@gmail.com',
      };

      (Auth.federatedSignIn as jest.Mock).mockResolvedValue(mockCognitoUser);

      const result = await AuthService.signInWithGoogle();

      expect(Auth.federatedSignIn).toHaveBeenCalledWith({ provider: 'Google' });
      expect(result).toEqual({
        id: 'user-sub-123',
        email: 'test@gmail.com',
        username: 'testuser',
        createdAt: '2023-01-01T00:00:00.000Z',
        lastLoginAt: expect.any(String),
        provider: 'google',
        googleId: 'google-user-123',
        avatar: 'https://example.com/avatar.jpg',
      });
    });

    it('should throw error for Google sign-in failure', async () => {
      const mockError = {
        code: 'FederatedSignInFailureException',
        message: 'Google sign-in failed',
        name: 'FederatedSignInFailureException',
      };

      (Auth.federatedSignIn as jest.Mock).mockRejectedValue(mockError);

      await expect(AuthService.signInWithGoogle()).rejects.toThrow(
        'Google sign-in failed. Please try again.'
      );
    });
  });

  describe('signOut', () => {
    it('should successfully sign out user', async () => {
      (Auth.signOut as jest.Mock).mockResolvedValue(undefined);

      await expect(AuthService.signOut()).resolves.toBeUndefined();

      expect(Auth.signOut).toHaveBeenCalled();
    });

    it('should throw error on sign out failure', async () => {
      const mockError = {
        code: 'NetworkError',
        message: 'Network error',
        name: 'NetworkError',
      };

      (Auth.signOut as jest.Mock).mockRejectedValue(mockError);

      await expect(AuthService.signOut()).rejects.toThrow('Network error');
    });
  });

  describe('getCurrentUser', () => {
    it('should return user profile for authenticated email user', async () => {
      const mockCognitoUser = {
        attributes: {
          sub: 'user-sub-123',
          email: 'test@example.com',
          'custom:username': 'testuser',
          created: '2023-01-01T00:00:00.000Z',
        },
        username: 'test@example.com',
      };

      (Auth.currentAuthenticatedUser as jest.Mock).mockResolvedValue(mockCognitoUser);

      const result = await AuthService.getCurrentUser();

      expect(result).toEqual({
        id: 'user-sub-123',
        email: 'test@example.com',
        username: 'testuser',
        createdAt: '2023-01-01T00:00:00.000Z',
        lastLoginAt: expect.any(String),
        provider: 'email',
      });
    });

    it('should return user profile for authenticated Google user', async () => {
      const mockCognitoUser = {
        attributes: {
          sub: 'user-sub-123',
          email: 'test@gmail.com',
          'custom:username': 'testuser',
          created: '2023-01-01T00:00:00.000Z',
          identities: 'Google',
          'custom:google_id': 'google-user-123',
          picture: 'https://example.com/avatar.jpg',
        },
        username: 'test@gmail.com',
      };

      (Auth.currentAuthenticatedUser as jest.Mock).mockResolvedValue(mockCognitoUser);

      const result = await AuthService.getCurrentUser();

      expect(result).toEqual({
        id: 'user-sub-123',
        email: 'test@gmail.com',
        username: 'testuser',
        createdAt: '2023-01-01T00:00:00.000Z',
        lastLoginAt: expect.any(String),
        provider: 'google',
        googleId: 'google-user-123',
        avatar: 'https://example.com/avatar.jpg',
      });
    });

    it('should return null for unauthenticated user', async () => {
      (Auth.currentAuthenticatedUser as jest.Mock).mockRejectedValue(new Error('No user'));

      const result = await AuthService.getCurrentUser();

      expect(result).toBeNull();
    });
  });

  describe('forgotPassword', () => {
    const mockForgotPasswordData: ForgotPasswordData = {
      email: 'test@example.com',
    };

    it('should successfully send password reset email', async () => {
      (Auth.forgotPassword as jest.Mock).mockResolvedValue(undefined);

      await expect(AuthService.forgotPassword(mockForgotPasswordData)).resolves.toBeUndefined();

      expect(Auth.forgotPassword).toHaveBeenCalledWith(mockForgotPasswordData.email);
    });

    it('should throw error for non-existent user', async () => {
      const mockError = {
        code: 'UserNotFoundException',
        message: 'User not found',
        name: 'UserNotFoundException',
      };

      (Auth.forgotPassword as jest.Mock).mockRejectedValue(mockError);

      await expect(AuthService.forgotPassword(mockForgotPasswordData)).rejects.toThrow(
        'User not found. Please check your email.'
      );
    });
  });

  describe('resetPassword', () => {
    const mockResetPasswordData: ResetPasswordData = {
      email: 'test@example.com',
      code: '123456',
      newPassword: 'NewPassword123!',
    };

    it('should successfully reset password', async () => {
      (Auth.forgotPasswordSubmit as jest.Mock).mockResolvedValue(undefined);

      await expect(AuthService.resetPassword(mockResetPasswordData)).resolves.toBeUndefined();

      expect(Auth.forgotPasswordSubmit).toHaveBeenCalledWith(
        mockResetPasswordData.email,
        mockResetPasswordData.code,
        mockResetPasswordData.newPassword
      );
    });

    it('should throw error for invalid reset code', async () => {
      const mockError = {
        code: 'CodeMismatchException',
        message: 'Invalid code',
        name: 'CodeMismatchException',
      };

      (Auth.forgotPasswordSubmit as jest.Mock).mockRejectedValue(mockError);

      await expect(AuthService.resetPassword(mockResetPasswordData)).rejects.toThrow(
        'Invalid verification code.'
      );
    });
  });
}); 