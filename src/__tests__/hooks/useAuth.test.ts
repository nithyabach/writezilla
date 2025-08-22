import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../../hooks/useAuth';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

describe('useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    test('should initialize with correct initial state', () => {
      const { result } = renderHook(() => useAuth());
      
      // Check initial state
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toBeNull();
    });

    test('should check for existing authenticated user on mount', async () => {
      renderHook(() => useAuth());
      
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('writezilla_user');
    });
  });

  describe('Authentication State', () => {
    test('should set authenticated state when user is found', async () => {
      const mockUser = {
        id: 'demo-user-123',
        email: 'demo@writezilla.com',
        name: 'Demo User',
        picture: 'https://via.placeholder.com/150/DA5812/FFFFFF?text=U',
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser));

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
      localStorageMock.getItem.mockReturnValue(null);

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
    test('should create demo user and save to localStorage', async () => {
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.login();
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('writezilla_user', expect.any(String));
      expect(result.current.user).toEqual({
        id: 'demo-user-123',
        email: 'demo@writezilla.com',
        name: 'Demo User',
        picture: 'https://via.placeholder.com/150/DA5812/FFFFFF?text=U',
      });
      expect(result.current.isAuthenticated).toBe(true);
    });

    test('should handle login errors', async () => {
      // Mock localStorage.setItem to throw an error
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      await act(async () => {
        try {
          await result.current.login();
        } catch (error) {
          // Expected error
        }
      });

      expect(result.current.error).toBe('Login failed. Please try again.');
    });
  });

  describe('Logout Function', () => {
    test('should clear localStorage and user state', async () => {
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.logout();
      });

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('writezilla_user');
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    test('should handle logout errors', async () => {
      // Mock localStorage.removeItem to throw an error
      localStorageMock.removeItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      await act(async () => {
        try {
          await result.current.logout();
        } catch (error) {
          // Expected error
        }
      });

      expect(result.current.error).toBe('Logout failed. Please try again.');
    });
  });

  describe('Error Handling', () => {
    test('should set and clear error', async () => {
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
        id: 'demo-user-123',
        email: 'demo@writezilla.com',
        name: 'Demo User',
        picture: 'https://via.placeholder.com/150/DA5812/FFFFFF?text=U',
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser));

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.userDisplayName).toBe('Demo User');
    });

    test('should return email as display name if name is not available', async () => {
      const mockUser = {
        id: 'demo-user-123',
        email: 'demo@writezilla.com',
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser));

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.userDisplayName).toBe('demo@writezilla.com');
    });

    test('should return user avatar URL', async () => {
      const mockUser = {
        id: 'demo-user-123',
        email: 'demo@writezilla.com',
        name: 'Demo User',
        picture: 'https://example.com/avatar.jpg',
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser));

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.userAvatar).toBe('https://example.com/avatar.jpg');
    });
  });
}); 