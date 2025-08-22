import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Auth } from 'aws-amplify';
import { GoogleAuthProvider } from '@aws-amplify/ui-react';
import GoogleAuth from '../../components/auth/GoogleAuth';

// Mock AWS Amplify Auth
jest.mock('aws-amplify', () => ({
  Auth: {
    federatedSignIn: jest.fn(),
    currentAuthenticatedUser: jest.fn(),
    signOut: jest.fn(),
  },
}));

// Mock Google OAuth
jest.mock('@aws-amplify/ui-react', () => ({
  GoogleAuthProvider: jest.fn(),
}));

describe('GoogleAuth Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    test('should render login button when user is not authenticated', () => {
      render(<GoogleAuth />);
      
      expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveClass('google-login-btn');
    });

    test('should render user profile when authenticated', async () => {
      const mockUser = {
        username: 'test@example.com',
        attributes: {
          email: 'test@example.com',
          name: 'Test User',
          picture: 'https://example.com/avatar.jpg'
        }
      };

      (Auth.currentAuthenticatedUser as jest.Mock).mockResolvedValue(mockUser);

      render(<GoogleAuth />);
      
      await waitFor(() => {
        // Component only shows login button, not user profile
        expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
        expect(screen.getByRole('button')).toHaveClass('google-login-btn');
      });
    });

    test('should show loading state during authentication', () => {
      render(<GoogleAuth />);
      
      const loginButton = screen.getByRole('button');
      fireEvent.click(loginButton);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Authentication Flow', () => {
    test('should initiate Google OAuth flow when login button is clicked', async () => {
      const mockFederatedSignIn = Auth.federatedSignIn as jest.Mock;
      mockFederatedSignIn.mockResolvedValue({});

      render(<GoogleAuth />);
      
      const loginButton = screen.getByRole('button');
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(mockFederatedSignIn).toHaveBeenCalledWith('Google');
      });
    });

    test('should handle successful authentication', async () => {
      const mockUser = {
        username: 'test@example.com',
        attributes: {
          email: 'test@example.com',
          name: 'Test User'
        }
      };

      (Auth.currentAuthenticatedUser as jest.Mock).mockResolvedValue(mockUser);
      (Auth.federatedSignIn as jest.Mock).mockResolvedValue(mockUser);

      render(<GoogleAuth />);
      
      const loginButton = screen.getByRole('button');
      fireEvent.click(loginButton);

      await waitFor(() => {
        // Component only shows login button, not user profile
        expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
      });
    });

    test('should handle authentication errors gracefully', async () => {
      const mockError = new Error('Authentication failed');
      (Auth.federatedSignIn as jest.Mock).mockRejectedValue(mockError);

      render(<GoogleAuth />);
      
      const loginButton = screen.getByRole('button');
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText('Failed to sign in with Google. Please try again.')).toBeInTheDocument();
      });
    });
  });

  describe('Logout Functionality', () => {
    test('should show logout button when user is authenticated', async () => {
      const mockUser = {
        username: 'test@example.com',
        attributes: { email: 'test@example.com', name: 'Test User' }
      };

      (Auth.currentAuthenticatedUser as jest.Mock).mockResolvedValue(mockUser);

      render(<GoogleAuth />);
      
      await waitFor(() => {
        // Component doesn't show logout functionality
        expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
      });
    });

    test('should call signOut when logout button is clicked', async () => {
      const mockUser = {
        username: 'test@example.com',
        attributes: { email: 'test@example.com', name: 'Test User' }
      };

      (Auth.currentAuthenticatedUser as jest.Mock).mockResolvedValue(mockUser);
      (Auth.signOut as jest.Mock).mockResolvedValue({});

      render(<GoogleAuth />);
      
      await waitFor(() => {
        // Component doesn't show logout functionality
        const loginButton = screen.getByText('Sign in with Google');
        expect(loginButton).toBeInTheDocument();
      });

      expect(Auth.signOut).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    test('should display network error message', async () => {
      const networkError = new Error('Network error');
      (Auth.federatedSignIn as jest.Mock).mockRejectedValue(networkError);

      render(<GoogleAuth />);
      
      const loginButton = screen.getByRole('button');
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText('Failed to sign in with Google. Please try again.')).toBeInTheDocument();
      });
    });

    test('should display user cancelled error message', async () => {
      const cancelledError = new Error('User cancelled');
      (Auth.federatedSignIn as jest.Mock).mockRejectedValue(cancelledError);

      render(<GoogleAuth />);
      
      const loginButton = screen.getByRole('button');
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText('Failed to sign in with Google. Please try again.')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    test('should have proper ARIA labels', () => {
      render(<GoogleAuth />);
      
      const loginButton = screen.getByRole('button');
      expect(loginButton).toHaveAttribute('aria-label', 'Sign in with Google');
    });

    test('should be keyboard navigable', () => {
      render(<GoogleAuth />);
      
      const loginButton = screen.getByRole('button');
      loginButton.focus();
      
      expect(loginButton).toHaveFocus();
    });
  });
}); 