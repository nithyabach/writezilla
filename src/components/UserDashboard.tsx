import React, { useState, useEffect, useRef } from 'react';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { StoryService, Story as StoryType } from '../services/storyService';

import './UserDashboard.css';

interface User {
  username: string;
  attributes?: {
    email?: string;
    name?: string;
  };
}

        interface LocalStory {
  id: number;
  awsId: string; // Store the actual AWS ID
  title: string;
  color: string;
  version?: number; // Store the version for conflict resolution
}

        interface UserDashboardProps {
          onSignOut?: () => void;
        }

        const UserDashboard: React.FC<UserDashboardProps> = ({ onSignOut }) => {
          const [user, setUser] = useState<User | null>(null);
          const [isLoading, setIsLoading] = useState(true);
          const [showProfileMenu, setShowProfileMenu] = useState(false);
          const profileMenuRef = useRef<HTMLDivElement>(null);
          const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
          const [storyToDelete, setStoryToDelete] = useState<number | null>(null);
          const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
          
          // Stories state
          const [stories, setStories] = useState<LocalStory[]>([]);
          const [storyCounter, setStoryCounter] = useState(1);
          
          const colors = ['green', 'blue', 'black', 'brown'];

            useEffect(() => {
            loadUserData();
            loadUserStories();
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

          const loadUserStories = async () => {
            try {
              const userId = await StoryService.getCurrentUserId();
              const awsStories = await StoryService.getUserStories(userId);
              console.log('Loaded AWS stories:', awsStories);
              console.log('Number of stories loaded:', awsStories.length);
              if (awsStories.length > 0) {
                console.log('First AWS story details:', JSON.stringify(awsStories[0], null, 2));
              }
              
              // Convert AWS stories to local format
              const localStories: LocalStory[] = awsStories.map((story, index) => ({
                id: index + 1,
                awsId: story.id, // Store the actual AWS ID
                title: story.title || `New Story ${index + 1}`, // Fallback if title is corrupted
                color: story.color,
                version: story._version // Store the version for conflict resolution
              }));
              
              console.log('Converted to local stories:', localStories);
              console.log('Story IDs in loaded stories:', awsStories.map(s => s.id));
              console.log('Story user IDs:', awsStories.map(s => s.userId));
              setStories(localStories);
              
              // Set the counter to the next number after the highest existing story number
              if (localStories.length > 0) {
                const storyNumbers = localStories
                  .map(story => {
                    const match = story.title.match(/New Story (\d+)/);
                    return match ? parseInt(match[1]) : 0;
                  })
                  .filter(num => !isNaN(num));
                
                if (storyNumbers.length > 0) {
                  const maxNumber = Math.max(...storyNumbers);
                  setStoryCounter(maxNumber + 1);
                }
              }
            } catch (error) {
              console.error('Error loading user stories:', error);
              // Keep empty stories array if loading fails
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

          const handleCreateStory = async () => {
            try {
              const userId = await StoryService.getCurrentUserId();
              const randomColor = colors[Math.floor(Math.random() * colors.length)];
              const title = `New Story ${storyCounter}`;
              console.log('Creating story with title:', title, 'counter:', storyCounter);
              
              const newStory = await StoryService.createStory({
                title,
                color: randomColor,
                userId
              });
              
              console.log('AWS createStory response:', newStory);
              
              // Convert AWS Story to LocalStory format
              const localStory: LocalStory = {
                id: storyCounter,
                awsId: newStory.id, // Store the actual AWS ID
                title: title, // Use our generated title, not AWS response
                color: newStory.color,
                version: newStory._version // Store the version for conflict resolution
              };
              
              console.log('Local story created:', localStory);
              
              setStories([...stories, localStory]);
              setStoryCounter(storyCounter + 1);
            } catch (error) {
              console.error('Error creating story:', error);
              // Fallback to local creation if AWS fails
              const randomColor = colors[Math.floor(Math.random() * colors.length)];
              const newStory: LocalStory = {
                id: storyCounter,
                awsId: `local-${storyCounter}`, // Generate a local ID for fallback
                title: `New Story ${storyCounter}`,
                color: randomColor,
                version: 1 // Default version for local stories
              };
              setStories([...stories, newStory]);
              setStoryCounter(storyCounter + 1);
            }
          };

          const handleDeleteStory = (storyId: number) => {
            setStoryToDelete(storyId);
            setShowDeleteConfirm(true);
          };

          const confirmDelete = async () => {
            if (storyToDelete) {
              try {
                // Find the story to get its AWS ID
                const storyToDeleteObj = stories.find(s => s.id === storyToDelete);
                console.log('Story to delete:', storyToDeleteObj);
                console.log('All stories:', stories);
                console.log('Story to delete details:', JSON.stringify(storyToDeleteObj, null, 2));
                
                if (storyToDeleteObj && !storyToDeleteObj.awsId.startsWith('local-')) {
                  // Only delete from AWS if it's not a local fallback story
                                  console.log('Deleting from AWS with ID:', storyToDeleteObj.awsId, 'version:', storyToDeleteObj.version);
                console.log('Current user ID:', await StoryService.getCurrentUserId());
                await StoryService.deleteStory(storyToDeleteObj.awsId, storyToDeleteObj.version);
                console.log('Successfully deleted from AWS');
                } else {
                  console.log('Skipping AWS deletion - local story or no story found');
                }
                setStories(stories.filter(story => story.id !== storyToDelete));
              } catch (error) {
                console.error('Error deleting story:', error);
                // Fallback to local deletion if AWS fails
                setStories(stories.filter(story => story.id !== storyToDelete));
              }
              setShowDeleteConfirm(false);
              setStoryToDelete(null);
            }
          };

          const cancelDelete = () => {
            setShowDeleteConfirm(false);
            setStoryToDelete(null);
          };

          const handleDeleteAllStories = () => {
            setShowDeleteAllConfirm(true);
          };

          const confirmDeleteAll = async () => {
            try {
              // Get the actual AWS stories to delete
              const userId = await StoryService.getCurrentUserId();
              const awsStories = await StoryService.getUserStories(userId);
              
              // Delete all stories from AWS using their actual IDs
              const deletePromises = awsStories.map(story => 
                StoryService.deleteStory(story.id)
              );
              await Promise.all(deletePromises);
              
              // Clear local state
              setStories([]);
              setStoryCounter(1);
            } catch (error) {
              console.error('Error deleting all stories:', error);
              // Fallback to local deletion if AWS fails
              setStories([]);
              setStoryCounter(1);
            }
            setShowDeleteAllConfirm(false);
          };

          const cancelDeleteAll = () => {
            setShowDeleteAllConfirm(false);
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
                      <button className="action-button" onClick={handleCreateStory}>Stories</button>
                      <button className="action-button">Graphics</button>
                      <button className="action-button">Notes</button>
                      <button className="action-button">Playlists</button>
                    </div>

                                {/* Search Bar */}
                    <div className="search-container">
                      <div className="search-input-wrapper">
                        <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                        </svg>
                        <input
                          type="text"
                          className="search-input"
                          placeholder="Search your content..."
                          aria-label="Search your content"
                          data-testid="search-input"
                        />
                      </div>
                    </div>

                    {/* Writing Section */}
                    <div className="writing-section">
                      <div className="section-header">
                        <h3 className="section-title">Writing</h3>
                        {stories.length > 0 && (
                          <button 
                            className="delete-all-btn"
                            onClick={handleDeleteAllStories}
                            data-testid="delete-all-btn"
                          >
                            Delete All Stories
                          </button>
                        )}
                      </div>
                      <div className="stories-grid">
                        {stories.map((story) => (
                          <div 
                            key={story.id} 
                            className={`story-cover cover-${story.color}`} 
                            data-testid="story-cover"
                          >
                            <div className={`cover-image cover-${story.color}`}>
                              <div className="cover-placeholder">{story.title}</div>
                              <button 
                                className="delete-book-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteStory(story.id);
                                }}
                                aria-label={`Delete ${story.title}`}
                                data-testid="delete-book-btn"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </main>

              {/* Delete Confirmation Dialog */}
              {showDeleteConfirm && (
                <div className="delete-confirm-overlay" data-testid="delete-confirm-overlay">
                  <div className="delete-confirm-dialog">
                    <div className="delete-confirm-header">
                      <h3>Delete Book</h3>
                    </div>
                    <div className="delete-confirm-content">
                      <p>Deleting this book would delete all chapters within this, and this cannot be reversed.</p>
                    </div>
                    <div className="delete-confirm-actions">
                      <button 
                        className="delete-confirm-cancel"
                        onClick={cancelDelete}
                        data-testid="delete-cancel-btn"
                      >
                        Cancel
                      </button>
                      <button 
                        className="delete-confirm-delete"
                        onClick={confirmDelete}
                        data-testid="delete-confirm-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Delete All Confirmation Dialog */}
              {showDeleteAllConfirm && (
                <div className="delete-confirm-overlay" data-testid="delete-all-confirm-overlay">
                  <div className="delete-confirm-dialog">
                    <div className="delete-confirm-header">
                      <h3>Delete All Stories</h3>
                    </div>
                    <div className="delete-confirm-content">
                      <p>This will permanently delete all {stories.length} stories and cannot be reversed. Are you sure?</p>
                    </div>
                    <div className="delete-confirm-actions">
                      <button 
                        className="delete-confirm-cancel"
                        onClick={cancelDeleteAll}
                        data-testid="delete-all-cancel-btn"
                      >
                        Cancel
                      </button>
                      <button 
                        className="delete-confirm-delete"
                        onClick={confirmDeleteAll}
                        data-testid="delete-all-confirm-btn"
                      >
                        Delete All
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        };

export default UserDashboard; 