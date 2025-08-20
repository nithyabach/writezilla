import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // For now, check localStorage for demo purposes
        // Later this will check AWS Cognito
        const savedUser = localStorage.getItem('writezilla_user');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          setAuthState({
            user,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          });
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          error: 'Failed to check authentication',
        });
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate Google OAuth flow
      // In real implementation, this will redirect to Google
      const mockUser: User = {
        id: 'demo-user-123',
        email: 'demo@writezilla.com',
        name: 'Demo User',
        picture: 'https://via.placeholder.com/150/DA5812/FFFFFF?text=U',
      };

      // Save to localStorage for demo
      localStorage.setItem('writezilla_user', JSON.stringify(mockUser));
      
      setAuthState({
        user: mockUser,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });

      return mockUser;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Login failed. Please try again.',
      }));
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Clear localStorage
      localStorage.removeItem('writezilla_user');
      
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        error: 'Logout failed. Please try again.',
      }));
      throw error;
    }
  }, []);

  const setError = useCallback((error: string) => {
    setAuthState(prev => ({ ...prev, error }));
  }, []);

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  // Helper functions
  const userDisplayName = authState.user?.name || authState.user?.email || 'User';
  const userAvatar = authState.user?.picture || 'https://via.placeholder.com/150/DA5812/FFFFFF?text=U';

  return {
    ...authState,
    login,
    logout,
    setError,
    clearError,
    userDisplayName,
    userAvatar,
  };
}; 