import { renderHook, act } from '@testing-library/react';
import { Auth } from 'aws-amplify';
import { useAuth } from '../../hooks/useAuth';

// Mock AWS Amplify Auth
jest.mock('aws-amplify', () => ({
  Auth: {
    currentAuthenticatedUser: jest.fn(),
    signOut: jest.fn(),
    federatedSignIn: jest.fn(),
  },
}));

describe('useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    test('should initialize with loading state', () => {
      const { result } = renderHook(() => useAuth());
      
      expect(result.current.isLoading).toBe(true);
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    test('should check for existing authenticated user on mount', () => {
      renderHook(() => useAuth());
      
      expect(Auth.currentAuthenticatedUser).toHaveBeenCalled();
    });
  });

  describe('Authentication State', () => {
    test('should set authenticated state when user is found', async () => {
      const mockUser = {
        username: 'test@example.com',
        attributes: {
          email: 'test@example.com',
          name: 'Test User',
          picture: 'https://example.com/avatar.jpg'
        }
      };

      (Auth.currentAuthenticatedUser as jest.Mock).mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        // Wait for the effect to complete
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    test('should set unauthenticated state when no user is found', async () => {
      (Auth.currentAuthenticatedUser as jest.Mock).mockRejectedValue(new Error('No user'));

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('Login Function', () => {
    test('should call federatedSignIn with Google provider', async () => {
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.login();
      });

      expect(Auth.federatedSignIn).toHaveBeenCalledWith('Google');
    });

    test('should handle login errors', async () => {
      const mockError = new Error('Login failed');
      (Auth.federatedSignIn as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        try {
          await result.current.login();
        } catch (error) {
          // Expected error
        }
      });

      expect(result.current.error).toBe('Login failed');
    });
  });

  describe('Logout Function', () => {
    test('should call signOut and clear user state', async () => {
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.logout();
      });

      expect(Auth.signOut).toHaveBeenCalled();
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    test('should handle logout errors', async () => {
      const mockError = new Error('Logout failed');
      (Auth.signOut as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        try {
          await result.current.logout();
        } catch (error) {
          // Expected error
        }
      });

      expect(result.current.error).toBe('Logout failed');
    });
  });

  describe('Error Handling', () => {
    test('should clear error when new action is performed', async () => {
      const { result } = renderHook(() => useAuth());

      // Set an error
      act(() => {
        result.current.setError('Test error');
      });

      expect(result.current.error).toBe('Test error');

      // Clear error
      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('User Profile', () => {
    test('should return user display name', async () => {
      const mockUser = {
        username: 'test@example.com',
        attributes: {
          email: 'test@example.com',
          name: 'Test User',
          given_name: 'Test',
          family_name: 'User'
        }
      };

      (Auth.currentAuthenticatedUser as jest.Mock).mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.userDisplayName).toBe('Test User');
    });

    test('should return email as display name if name is not available', async () => {
      const mockUser = {
        username: 'test@example.com',
        attributes: {
          email: 'test@example.com'
        }
      };

      (Auth.currentAuthenticatedUser as jest.Mock).mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.userDisplayName).toBe('test@example.com');
    });

    test('should return user avatar URL', async () => {
      const mockUser = {
        username: 'test@example.com',
        attributes: {
          email: 'test@example.com',
          picture: 'https://example.com/avatar.jpg'
        }
      };

      (Auth.currentAuthenticatedUser as jest.Mock).mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.userAvatar).toBe('https://example.com/avatar.jpg');
    });
  });
}); 