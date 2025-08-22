import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import UserDashboard from '../components/UserDashboard';

// Mock AWS Amplify
jest.mock('aws-amplify/auth', () => ({
  getCurrentUser: jest.fn(),
  signOut: jest.fn(),
}));

const mockGetCurrentUser = getCurrentUser as jest.MockedFunction<typeof getCurrentUser>;
const mockSignOut = signOut as jest.MockedFunction<typeof signOut>;

// Mock the onSignOut prop
const mockOnSignOut = jest.fn();

describe('UserDashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock successful authentication by default
    mockGetCurrentUser.mockResolvedValue({
      username: 'test@example.com',
      userId: 'test-user-id'
    });
    mockSignOut.mockResolvedValue(undefined);
  });

  describe('Component Rendering', () => {
    test('should render WRITEZILLA logo', async () => {
      render(<UserDashboard onSignOut={mockOnSignOut} />);
      
      await waitFor(() => {
        expect(screen.getByText('WRITEZILLA')).toBeInTheDocument();
      });
    });

    test('should render navigation tabs', async () => {
      render(<UserDashboard onSignOut={mockOnSignOut} />);
      
      await waitFor(() => {
        expect(screen.getByRole('link', { name: 'Stories' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Graphics' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Notes' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Playlists' })).toBeInTheDocument();
      });
    });

    test('should render main heading', async () => {
      render(<UserDashboard onSignOut={mockOnSignOut} />);
      
      await waitFor(() => {
        expect(screen.getByText('What will you create today?')).toBeInTheDocument();
      });
    });

                test('should render action buttons', async () => {
              render(<UserDashboard onSignOut={mockOnSignOut} />);
              
              await waitFor(() => {
                expect(screen.getByRole('button', { name: 'Stories' })).toBeInTheDocument();
                expect(screen.getByRole('button', { name: 'Graphics' })).toBeInTheDocument();
                expect(screen.getByRole('button', { name: 'Notes' })).toBeInTheDocument();
                expect(screen.getByRole('button', { name: 'Playlists' })).toBeInTheDocument();
              });
            });

    test('should render profile icon', async () => {
      render(<UserDashboard onSignOut={mockOnSignOut} />);
      
      await waitFor(() => {
        const profileButton = screen.getByRole('button', { name: /profile/i });
        expect(profileButton).toBeInTheDocument();
      });
    });
  });

  describe('Profile Menu Functionality', () => {
    test('should show profile dropdown when profile icon is clicked', async () => {
      render(<UserDashboard onSignOut={mockOnSignOut} />);
      
      await waitFor(() => {
        const profileButton = screen.getByRole('button', { name: /profile/i });
        fireEvent.click(profileButton);
      });
      
      expect(screen.getByText('Sign Out')).toBeInTheDocument();
    });

    test('should call onSignOut when Sign Out is clicked', async () => {
      render(<UserDashboard onSignOut={mockOnSignOut} />);
      
      await waitFor(() => {
        const profileButton = screen.getByRole('button', { name: /profile/i });
        fireEvent.click(profileButton);
      });
      
      const signOutButton = screen.getByRole('button', { name: 'Sign Out' });
      fireEvent.click(signOutButton);
      
      await waitFor(() => {
        expect(mockOnSignOut).toHaveBeenCalledTimes(1);
      });
    });

    test('should toggle dropdown when profile button is clicked', async () => {
      render(<UserDashboard onSignOut={mockOnSignOut} />);
      
      await waitFor(() => {
        const profileButton = screen.getByRole('button', { name: /profile/i });
        
        // First click - should open dropdown
        fireEvent.click(profileButton);
        expect(screen.getByRole('button', { name: 'Sign Out' })).toBeInTheDocument();
        
        // Second click - should close dropdown
        fireEvent.click(profileButton);
        expect(screen.queryByRole('button', { name: 'Sign Out' })).not.toBeInTheDocument();
      });
    });
  });

  describe('Navigation Tabs', () => {
    test('should have clickable navigation tabs', async () => {
      render(<UserDashboard onSignOut={mockOnSignOut} />);
      
      await waitFor(() => {
        const storiesTab = screen.getByRole('link', { name: 'Stories' });
        const graphicsTab = screen.getByRole('link', { name: 'Graphics' });
        const notesTab = screen.getByRole('link', { name: 'Notes' });
        const playlistsTab = screen.getByRole('link', { name: 'Playlists' });
        
        expect(storiesTab).toBeInTheDocument();
        expect(graphicsTab).toBeInTheDocument();
        expect(notesTab).toBeInTheDocument();
        expect(playlistsTab).toBeInTheDocument();
        
        // Test that they are clickable (even if functionality not implemented yet)
        fireEvent.click(storiesTab);
        fireEvent.click(graphicsTab);
        fireEvent.click(notesTab);
        fireEvent.click(playlistsTab);
        
        // Should not throw any errors
        expect(true).toBe(true);
      });
    });
  });

  describe('Action Buttons', () => {
    test('should have clickable action buttons', async () => {
      render(<UserDashboard onSignOut={mockOnSignOut} />);
      
      await waitFor(() => {
        const storiesButton = screen.getByRole('button', { name: 'Stories' });
        const graphicsButton = screen.getByRole('button', { name: 'Graphics' });
        const notesButton = screen.getByRole('button', { name: 'Notes' });
        const playlistsButton = screen.getByRole('button', { name: 'Playlists' });
        
        expect(storiesButton).toBeInTheDocument();
        expect(graphicsButton).toBeInTheDocument();
        expect(notesButton).toBeInTheDocument();
        expect(playlistsButton).toBeInTheDocument();
        
        // Test that they are clickable (even if functionality not implemented yet)
        fireEvent.click(storiesButton);
        fireEvent.click(graphicsButton);
        fireEvent.click(notesButton);
        fireEvent.click(playlistsButton);
        
        // Should not throw any errors
        expect(true).toBe(true);
      });
    });
  });

  describe('Search Bar', () => {
    test('should render search bar below action buttons', async () => {
      render(<UserDashboard onSignOut={mockOnSignOut} />);
      
      await waitFor(() => {
        const searchInput = screen.getByRole('textbox', { name: /search/i });
        expect(searchInput).toBeInTheDocument();
        expect(searchInput).toHaveAttribute('placeholder', 'Search your content...');
      });
    });

    test('should allow typing in search bar', async () => {
      render(<UserDashboard onSignOut={mockOnSignOut} />);
      
      await waitFor(() => {
        const searchInput = screen.getByRole('textbox', { name: /search/i });
        
        // Test typing functionality
        fireEvent.change(searchInput, { target: { value: 'test search' } });
        expect(searchInput).toHaveValue('test search');
      });
    });

    test('should have proper accessibility attributes', async () => {
      render(<UserDashboard onSignOut={mockOnSignOut} />);
      
      await waitFor(() => {
        const searchInput = screen.getByRole('textbox', { name: /search/i });
        expect(searchInput).toHaveAttribute('aria-label', 'Search your content');
        expect(searchInput).toHaveAttribute('type', 'text');
      });
    });
  });

  describe('Component Structure', () => {
    test('should render main dashboard container', async () => {
      render(<UserDashboard onSignOut={mockOnSignOut} />);
      
      await waitFor(() => {
        const dashboardContainer = screen.getByTestId('user-dashboard');
        expect(dashboardContainer).toBeInTheDocument();
      });
    });

    test('should apply correct CSS classes', async () => {
      render(<UserDashboard onSignOut={mockOnSignOut} />);
      
      await waitFor(() => {
        const dashboardContainer = screen.getByTestId('user-dashboard');
        expect(dashboardContainer).toHaveClass('user-dashboard');
      });
    });
  });

  describe('Accessibility', () => {
    test('should have proper ARIA labels', async () => {
      render(<UserDashboard onSignOut={mockOnSignOut} />);
      
      await waitFor(() => {
        const profileButton = screen.getByRole('button', { name: /profile/i });
        expect(profileButton).toHaveAttribute('aria-label', 'Profile menu');
      });
    });

    test('should have proper button roles', async () => {
      render(<UserDashboard onSignOut={mockOnSignOut} />);
      
      await waitFor(() => {
        const actionButtons = screen.getAllByRole('button');
        expect(actionButtons.length).toBeGreaterThan(0);
      });
    });
  });
}); 