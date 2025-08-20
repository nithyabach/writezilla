import React, { useState, useEffect } from 'react';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { getAuth, signOut as firebaseSignOut } from 'firebase/auth';

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

  useEffect(() => {
    loadUserData();
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
      
      // Also sign out from Firebase if it's configured
      try {
        const auth = getAuth();
        if (auth) {
          console.log('Signing out from Firebase...');
          await firebaseSignOut(auth);
          console.log('Firebase sign out successful');
        }
      } catch (firebaseError) {
        console.log('Firebase not configured or already signed out');
      }
      
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
  const userEmail = user?.attributes?.email || user?.username || '';

  return (
    <div className="user-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-brand">
            <h1 className="dashboard-title">Writezilla</h1>
            <span className="dashboard-subtitle">Your Writing Platform</span>
          </div>
          <div className="user-menu">
            <div className="user-info">
              <span className="user-name">{userName}</span>
              <span className="user-email">{userEmail}</span>
            </div>
            <button className="sign-out-btn" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="welcome-section">
          <div className="welcome-content">
            <h2 className="welcome-title">Hello, {userName}! 👋</h2>
            <p className="welcome-message">
              Welcome to Writezilla! Your creative journey starts here. 
              Ready to write your next masterpiece?
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3 className="section-title">Quick Actions</h3>
          <div className="action-grid">
            <div className="action-card primary">
              <div className="action-icon">✍️</div>
              <h4>Start Writing</h4>
              <p>Create a new story or continue where you left off</p>
              <button className="action-btn">Begin Writing</button>
            </div>
            
            <div className="action-card">
              <div className="action-icon">📚</div>
              <h4>My Stories</h4>
              <p>View and manage your existing stories</p>
              <button className="action-btn">View Stories</button>
            </div>
            
            <div className="action-card">
              <div className="action-icon">🎨</div>
              <h4>Moodboards</h4>
              <p>Get inspired with visual moodboards</p>
              <button className="action-btn">Create Moodboard</button>
            </div>
            
            <div className="action-card">
              <div className="action-icon">🎵</div>
              <h4>Playlists</h4>
              <p>Set the perfect writing atmosphere</p>
              <button className="action-btn">Manage Playlists</button>
            </div>
          </div>
        </div>

        {/* Writing Stats */}
        <div className="writing-stats">
          <h3 className="section-title">Your Writing Journey</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">0</div>
              <div className="stat-label">Stories</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">0</div>
              <div className="stat-label">Words Written</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">0</div>
              <div className="stat-label">Writing Days</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">0</div>
              <div className="stat-label">Hours Spent</div>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="getting-started">
          <h3 className="section-title">Getting Started</h3>
          <div className="tips-grid">
            <div className="tip-card">
              <h4>🎯 Set Your Goals</h4>
              <p>Define your writing goals and track your progress</p>
            </div>
            <div className="tip-card">
              <h4>📝 Start Small</h4>
              <p>Begin with short writing sessions to build momentum</p>
            </div>
            <div className="tip-card">
              <h4>🎨 Get Inspired</h4>
              <p>Use moodboards and playlists to spark creativity</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard; 