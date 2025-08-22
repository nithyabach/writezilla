import React, { useState, useEffect, useRef } from 'react';
import { getCurrentUser, signOut } from 'aws-amplify/auth';

import './UserDashboard.css';

interface User {
  username: string;
  attributes?: {
    email?: string;
    name?: string;
  };
}

interface UserDashboardProps {
  onSignOut?: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ onSignOut }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    console.log('Sign out button clicked');
    try {
      // Sign out from AWS Cognito
      console.log('Signing out from AWS Cognito...');
      await signOut();
      console.log('AWS Cognito sign out successful');
      

      
      // Clear user state and notify parent component
      console.log('Clearing user state and calling onSignOut...');
      setUser(null);
      if (onSignOut) {
        onSignOut();
      }
      console.log('Sign out process completed');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="user-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const userName = user?.attributes?.name || user?.username?.split('@')[0] || 'Writer';

  return (
    <div className="user-dashboard" data-testid="user-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-brand">
            <h1 className="dashboard-title">WRITEZILLA</h1>
          </div>
          
          {/* Navigation Tabs */}
          <nav className="dashboard-navigation">
            <ul>
              <li><a href="#stories">Stories</a></li>
              <li><a href="#graphics">Graphics</a></li>
              <li><a href="#notes">Notes</a></li>
              <li><a href="#playlists">Playlists</a></li>
            </ul>
          </nav>

          {/* Profile Menu */}
          <div className="user-menu" ref={profileMenuRef}>
            <button 
              className="profile-button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              aria-label="Profile menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </button>
            
            {showProfileMenu && (
              <div className="profile-dropdown">
                <button className="dropdown-item" onClick={handleSignOut}>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="content-container">
          <div className="main-content">
            <h2 className="main-heading">What will you create today?</h2>
            
            {/* Separator Line */}
            <div className="separator-line"></div>
            
            {/* Action Buttons */}
            <div className="action-buttons">
              <button className="action-button">Stories and Novels</button>
              <button className="action-button">Maps</button>
              <button className="action-button">Moodboards</button>
              <button className="action-button">Playlists</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard; 