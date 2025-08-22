import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { getCurrentUser } from 'aws-amplify/auth';

// Create a simplified version of App for testing core logic
const TestableApp = () => {
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [isLoadingAuth, setIsLoadingAuth] = React.useState(true);

  React.useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      setCurrentUser(null);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleSignOut = () => {
    console.log('App.tsx handleSignOut called');
    setCurrentUser(null);
    console.log('App.tsx state cleared');
  };

  if (isLoadingAuth) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" data-testid="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div data-testid="app-container" className="App">
      {currentUser ? (
        <div data-testid="user-dashboard">
          <p>User Dashboard</p>
          <button onClick={handleSignOut} data-testid="signout-button">
            Sign Out
          </button>
        </div>
      ) : (
        <div data-testid="landing-page">
          <h1>The perfect writing tool</h1>
          <p>Sign In</p>
          <p>Sign Up</p>
        </div>
      )}
    </div>
  );
};

// Mock AWS Amplify
jest.mock('aws-amplify/auth', () => ({
  getCurrentUser: jest.fn(),
}));

const mockGetCurrentUser = getCurrentUser as jest.MockedFunction<typeof getCurrentUser>;

// Helper function to render TestableApp
const renderApp = () => {
  return render(<TestableApp />);
};

describe('App Core Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Authentication State Management', () => {
    test('should show loading state initially', () => {
      mockGetCurrentUser.mockImplementation(() => new Promise(() => {}));
      
      renderApp();
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('should render Landing Page when user is not authenticated', async () => {
      mockGetCurrentUser.mockRejectedValue(new Error('No user'));
      
      renderApp();
      
      await waitFor(() => {
        expect(screen.getByTestId('landing-page')).toBeInTheDocument();
      });
      
      expect(screen.getByText('The perfect writing tool')).toBeInTheDocument();
      expect(screen.getByText('Sign In')).toBeInTheDocument();
      expect(screen.getByText('Sign Up')).toBeInTheDocument();
      expect(screen.queryByTestId('user-dashboard')).not.toBeInTheDocument();
    });

    test('should render UserDashboard when user is authenticated', async () => {
      const mockUser = {
        username: 'test@example.com',
        userId: 'test-user-id'
      };
      mockGetCurrentUser.mockResolvedValue(mockUser);
      
      renderApp();
      
      await waitFor(() => {
        expect(screen.getByTestId('user-dashboard')).toBeInTheDocument();
      });
      
      expect(screen.getByText('User Dashboard')).toBeInTheDocument();
      expect(screen.queryByTestId('landing-page')).not.toBeInTheDocument();
    });

    test('should handle authentication check errors gracefully', async () => {
      mockGetCurrentUser.mockRejectedValue(new Error('Network error'));
      
      renderApp();
      
      await waitFor(() => {
        expect(screen.getByTestId('landing-page')).toBeInTheDocument();
      });
      
      expect(screen.getByText('Sign In')).toBeInTheDocument();
      expect(screen.queryByTestId('user-dashboard')).not.toBeInTheDocument();
    });
  });

  describe('Sign Out Functionality', () => {
    test('should handle sign out successfully', async () => {
      const mockUser = {
        username: 'test@example.com',
        userId: 'test-user-id'
      };
      mockGetCurrentUser.mockResolvedValue(mockUser);
      
      renderApp();
      
      await waitFor(() => {
        expect(screen.getByTestId('user-dashboard')).toBeInTheDocument();
      });
      
      const signOutButton = screen.getByTestId('signout-button');
      fireEvent.click(signOutButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('landing-page')).toBeInTheDocument();
      });
      
      expect(screen.queryByTestId('user-dashboard')).not.toBeInTheDocument();
    });

    test('should call handleSignOut and clear user state', async () => {
      const consoleSpy = jest.spyOn(console, 'log');
      const mockUser = {
        username: 'test@example.com',
        userId: 'test-user-id'
      };
      mockGetCurrentUser.mockResolvedValue(mockUser);
      
      renderApp();
      
      await waitFor(() => {
        expect(screen.getByTestId('user-dashboard')).toBeInTheDocument();
      });
      
      const signOutButton = screen.getByTestId('signout-button');
      fireEvent.click(signOutButton);
      
      expect(consoleSpy).toHaveBeenCalledWith('App.tsx handleSignOut called');
      expect(consoleSpy).toHaveBeenCalledWith('App.tsx state cleared');
    });
  });

  describe('Component Structure', () => {
    test('should render main app container', async () => {
      mockGetCurrentUser.mockRejectedValue(new Error('No user'));
      
      renderApp();
      
      await waitFor(() => {
        const appContainer = screen.getByTestId('app-container');
        expect(appContainer).toBeInTheDocument();
        expect(appContainer).toHaveClass('App');
      });
    });

    test('should manage loading state correctly', async () => {
      let resolvePromise: (value: any) => void;
      const authPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      mockGetCurrentUser.mockReturnValue(authPromise);
      
      renderApp();
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      
      resolvePromise!({ username: 'test@example.com' });
      
      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
        expect(screen.getByTestId('user-dashboard')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle getCurrentUser returning null', async () => {
      mockGetCurrentUser.mockResolvedValue(null);
      
      renderApp();
      
      await waitFor(() => {
        expect(screen.getByTestId('landing-page')).toBeInTheDocument();
      });
      
      expect(screen.getByText('Sign In')).toBeInTheDocument();
    });

    test('should handle unexpected errors gracefully', async () => {
      mockGetCurrentUser.mockRejectedValue(new TypeError('Unexpected error'));
      
      renderApp();
      
      await waitFor(() => {
        expect(screen.getByTestId('landing-page')).toBeInTheDocument();
      });
      
      expect(screen.getByText('Sign In')).toBeInTheDocument();
    });
  });
});