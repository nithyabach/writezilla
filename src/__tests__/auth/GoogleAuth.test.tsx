import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { signInWithRedirect, signOut, getCurrentUser } from 'aws-amplify/auth';
import GoogleAuth from '../../components/auth/GoogleAuth';

// Mock AWS Amplify auth functions
jest.mock('aws-amplify/auth', () => ({
  signInWithRedirect: jest.fn(),
  signOut: jest.fn(),
  getCurrentUser: jest.fn(),
  fetchUserAttributes: jest.fn(),
}));

describe('GoogleAuth Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set up default mock implementations
    (signInWithRedirect as jest.Mock).mockResolvedValue({ success: true });
    (signOut as jest.Mock).mockResolvedValue({});
    (getCurrentUser as jest.Mock).mockResolvedValue({ 
      username: 'test@example.com',
      userId: 'test-user-id'
    });
  });

  describe('Component Rendering', () => {
    test('should render login button when user is not authenticated', () => {
      render(<GoogleAuth />);
      
      expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveClass('google-login-btn');
    });

    test('should show loading state during authentication', async () => {
      render(<GoogleAuth />);
      
      const loginButton = screen.getByRole('button');
      fireEvent.click(loginButton);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('should render Google icon SVG', () => {
      render(<GoogleAuth />);
      
      const svg = document.querySelector('svg.google-icon');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });
  });

  describe('Authentication Flow', () => {
    test('should initiate Google OAuth flow when login button is clicked', async () => {
      render(<GoogleAuth />);
      
      const loginButton = screen.getByRole('button');
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(signInWithRedirect).toHaveBeenCalledWith({ provider: 'Google' });
      });
    });

    test('should handle successful authentication', async () => {
      render(<GoogleAuth />);
      
      const loginButton = screen.getByRole('button');
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(signInWithRedirect).toHaveBeenCalledWith({ provider: 'Google' });
      });
    });

    test('should handle authentication errors gracefully', async () => {
      (signInWithRedirect as jest.Mock).mockRejectedValue(new Error('Authentication failed'));

      render(<GoogleAuth />);
      
      const loginButton = screen.getByRole('button');
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText('Failed to sign in with Google. Please try again.')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    test('should display network error message', async () => {
      (signInWithRedirect as jest.Mock).mockRejectedValue(new Error('Network error'));

      render(<GoogleAuth />);
      
      const loginButton = screen.getByRole('button');
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText('Failed to sign in with Google. Please try again.')).toBeInTheDocument();
      });
    });

    test('should display user cancelled error message', async () => {
      (signInWithRedirect as jest.Mock).mockRejectedValue(new Error('User cancelled'));

      render(<GoogleAuth />);
      
      const loginButton = screen.getByRole('button');
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText('Failed to sign in with Google. Please try again.')).toBeInTheDocument();
      });
    });

    test('should allow error message to be cleared', async () => {
      (signInWithRedirect as jest.Mock).mockRejectedValue(new Error('Test error'));

      render(<GoogleAuth />);
      
      const loginButton = screen.getByRole('button');
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText('Failed to sign in with Google. Please try again.')).toBeInTheDocument();
      });

      const closeButton = screen.getByText('×');
      fireEvent.click(closeButton);

      expect(screen.queryByText('Failed to sign in with Google. Please try again.')).not.toBeInTheDocument();
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

    test('should show loading spinner during authentication', async () => {
      render(<GoogleAuth />);
      
      const loginButton = screen.getByRole('button');
      fireEvent.click(loginButton);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });
}); 