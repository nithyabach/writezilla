import { AuthService } from '../authService';
import { 
  signInWithRedirect, 
  signIn,
  signUp, 
  signOut, 
  getCurrentUser, 
  fetchUserAttributes,
  confirmSignUp,
  resetPassword,
  confirmResetPassword
} from 'aws-amplify/auth';
import { UserProfile, LoginCredentials, SignUpCredentials, AuthError } from '../../types/auth';

// Mock AWS Amplify auth functions
jest.mock('aws-amplify/auth');

const mockSignInWithRedirect = signInWithRedirect as jest.MockedFunction<typeof signInWithRedirect>;
const mockSignIn = signIn as jest.MockedFunction<typeof signIn>;
const mockSignUp = signUp as jest.MockedFunction<typeof signUp>;
const mockSignOut = signOut as jest.MockedFunction<typeof signOut>;
const mockGetCurrentUser = getCurrentUser as jest.MockedFunction<typeof getCurrentUser>;
const mockFetchUserAttributes = fetchUserAttributes as jest.MockedFunction<typeof fetchUserAttributes>;
const mockConfirmSignUp = confirmSignUp as jest.MockedFunction<typeof confirmSignUp>;
const mockResetPassword = resetPassword as jest.MockedFunction<typeof resetPassword>;
const mockConfirmResetPassword = confirmResetPassword as jest.MockedFunction<typeof confirmResetPassword>;

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe('signInWithGoogle', () => {
    it('should successfully initiate Google OAuth sign in', async () => {
      // Arrange
      mockSignInWithRedirect.mockResolvedValue();

      // Act
      await authService.signInWithGoogle();

      // Assert
      expect(mockSignInWithRedirect).toHaveBeenCalledWith({ provider: 'Google' });
    });

    it('should throw error when Google OAuth fails', async () => {
      // Arrange
      const error = new Error('Google OAuth failed');
      mockSignInWithRedirect.mockRejectedValue(error);

      // Act & Assert
      await expect(authService.signInWithGoogle()).rejects.toThrow('Google OAuth failed');
    });
  });

  describe('signUp', () => {
    const signUpCredentials: SignUpCredentials = {
      email: 'test@example.com',
      password: 'TestPassword123!',
      name: 'Test User'
    };

    it('should successfully sign up a new user', async () => {
      // Arrange
      const mockSignUpResult = {
        userId: 'test-user-id',
        isSignUpComplete: false
      };
      mockSignUp.mockResolvedValue(mockSignUpResult);

      // Act
      const result = await authService.signUp(signUpCredentials);

      // Assert
      expect(mockSignUp).toHaveBeenCalledWith({
        username: signUpCredentials.email,
        password: signUpCredentials.password,
        options: {
          userAttributes: {
            email: signUpCredentials.email,
            name: signUpCredentials.name
          }
        }
      });
      expect(result).toEqual({
        userId: 'test-user-id',
        isSignUpComplete: false
      });
    });

    it('should throw error when sign up fails', async () => {
      // Arrange
      const error = new Error('User already exists');
      mockSignUp.mockRejectedValue(error);

      // Act & Assert
      await expect(authService.signUp(signUpCredentials)).rejects.toThrow('User already exists');
    });
  });

  describe('confirmSignUp', () => {
    it('should successfully confirm user sign up', async () => {
      // Arrange
      mockConfirmSignUp.mockResolvedValue({ isSignUpComplete: true });

      // Act
      const result = await authService.confirmSignUp('test@example.com', '123456');

      // Assert
      expect(mockConfirmSignUp).toHaveBeenCalledWith({
        username: 'test@example.com',
        confirmationCode: '123456'
      });
      expect(result).toEqual({ isSignUpComplete: true });
    });

    it('should throw error when confirmation fails', async () => {
      // Arrange
      const error = new Error('Invalid confirmation code');
      mockConfirmSignUp.mockRejectedValue(error);

      // Act & Assert
      await expect(authService.confirmSignUp('test@example.com', '123456')).rejects.toThrow('Invalid confirmation code');
    });
  });

  describe('signIn', () => {
    const loginCredentials: LoginCredentials = {
      email: 'test@example.com',
      password: 'TestPassword123!'
    };

    it('should successfully sign in user', async () => {
      // Arrange
      const mockUser = {
        userId: 'test-user-id',
        username: 'test@example.com'
      };
      const mockAttributes = {
        email: 'test@example.com',
        name: 'Test User',
        email_verified: 'true',
        sub: 'test-user-sub'
      };

      mockSignIn.mockResolvedValue();
      mockGetCurrentUser.mockResolvedValue(mockUser);
      mockFetchUserAttributes.mockResolvedValue(mockAttributes);

      // Act
      const result = await authService.signIn(loginCredentials);

      // Assert
      expect(mockSignIn).toHaveBeenCalledWith({
        username: loginCredentials.email,
        password: loginCredentials.password
      });
      expect(result).toEqual({
        id: 'test-user-sub',
        email: 'test@example.com',
        name: 'Test User',
        provider: 'COGNITO',
        createdAt: expect.any(Date),
        lastLogin: expect.any(Date),
        isEmailVerified: true
      });
    });

    it('should throw error when sign in fails', async () => {
      // Arrange
      const error = new Error('Invalid credentials');
      mockSignIn.mockRejectedValue(error);

      // Act & Assert
      await expect(authService.signIn(loginCredentials)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('signOut', () => {
    it('should successfully sign out user', async () => {
      // Arrange
      mockSignOut.mockResolvedValue();

      // Act
      await authService.signOut();

      // Assert
      expect(mockSignOut).toHaveBeenCalled();
    });

    it('should throw error when sign out fails', async () => {
      // Arrange
      const error = new Error('Sign out failed');
      mockSignOut.mockRejectedValue(error);

      // Act & Assert
      await expect(authService.signOut()).rejects.toThrow('Sign out failed');
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user when authenticated', async () => {
      // Arrange
      const mockUser = {
        userId: 'test-user-id',
        username: 'test@example.com'
      };
      const mockAttributes = {
        email: 'test@example.com',
        name: 'Test User',
        email_verified: 'true',
        sub: 'test-user-sub'
      };

      mockGetCurrentUser.mockResolvedValue(mockUser);
      mockFetchUserAttributes.mockResolvedValue(mockAttributes);

      // Act
      const result = await authService.getCurrentUser();

      // Assert
      expect(result).toEqual({
        id: 'test-user-sub',
        email: 'test@example.com',
        name: 'Test User',
        provider: 'COGNITO',
        createdAt: expect.any(Date),
        lastLogin: expect.any(Date),
        isEmailVerified: true
      });
    });

    it('should return null when no user is authenticated', async () => {
      // Arrange
      mockGetCurrentUser.mockRejectedValue(new Error('No user'));

      // Act
      const result = await authService.getCurrentUser();

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('forgotPassword', () => {
    it('should successfully initiate password reset', async () => {
      // Arrange
      mockResetPassword.mockResolvedValue({ nextStep: { resetPasswordStep: 'CONFIRM_RESET_PASSWORD_WITH_CODE' } });

      // Act
      const result = await authService.forgotPassword('test@example.com');

      // Assert
      expect(mockResetPassword).toHaveBeenCalledWith({ username: 'test@example.com' });
      expect(result).toEqual({ nextStep: { resetPasswordStep: 'CONFIRM_RESET_PASSWORD_WITH_CODE' } });
    });

    it('should throw error when password reset fails', async () => {
      // Arrange
      const error = new Error('User not found');
      mockResetPassword.mockRejectedValue(error);

      // Act & Assert
      await expect(authService.forgotPassword('test@example.com')).rejects.toThrow('User not found');
    });
  });

  describe('resetPassword', () => {
    it('should successfully reset password', async () => {
      // Arrange
      mockConfirmResetPassword.mockResolvedValue({ isPasswordReset: true });

      // Act
      const result = await authService.resetPassword('test@example.com', '123456', 'NewPassword123!');

      // Assert
      expect(mockConfirmResetPassword).toHaveBeenCalledWith({
        username: 'test@example.com',
        confirmationCode: '123456',
        newPassword: 'NewPassword123!'
      });
      expect(result).toEqual({ isPasswordReset: true });
    });

    it('should throw error when password reset confirmation fails', async () => {
      // Arrange
      const error = new Error('Invalid confirmation code');
      mockConfirmResetPassword.mockRejectedValue(error);

      // Act & Assert
      await expect(authService.resetPassword('test@example.com', '123456', 'NewPassword123!')).rejects.toThrow('Invalid confirmation code');
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when user is authenticated', async () => {
      // Arrange
      const mockUser = {
        userId: 'test-user-id',
        username: 'test@example.com'
      };
      mockGetCurrentUser.mockResolvedValue(mockUser);

      // Act
      const result = await authService.isAuthenticated();

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when no user is authenticated', async () => {
      // Arrange
      mockGetCurrentUser.mockRejectedValue(new Error('No user'));

      // Act
      const result = await authService.isAuthenticated();

      // Assert
      expect(result).toBe(false);
    });
  });
}); 