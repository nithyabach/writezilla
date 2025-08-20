import React from 'react';
import './App.css';
import GoogleAuth from './components/auth/GoogleAuth';
import { useAuth } from './hooks/useAuth';

function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <nav className="navigation">
            <a href="#about">About</a>
            <a href="#features">Features</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      {/* Main Content - Split Layout */}
      <main className="main-split-layout">
        {/* Left Panel - Content */}
        <div className="content-panel">
          <div className="content-container">
            {isAuthenticated ? (
              <div className="dashboard-content">
                <div className="welcome-section">
                  <h2 className="welcome-title">Welcome Back, {user?.name}!</h2>
                  <p className="welcome-subtitle">Ready to create something amazing today?</p>
                </div>
                
                <div className="action-cards">
                  <div className="action-card primary">
                    <div className="card-icon">Create</div>
                    <h3>Create New Story</h3>
                    <p>Start writing your next masterpiece</p>
                  </div>
                  <div className="action-card secondary">
                    <div className="card-icon">Stories</div>
                    <h3>My Stories</h3>
                    <p>Continue where you left off</p>
                  </div>
                  <div className="action-card secondary">
                    <div className="card-icon">Mood</div>
                    <h3>Moodboards</h3>
                    <p>Get inspired with visuals</p>
                  </div>
                  <div className="action-card secondary">
                    <div className="card-icon">Music</div>
                    <h3>Playlists</h3>
                    <p>Set the perfect writing mood</p>
                  </div>
                </div>

                <div className="stats-section">
                  <h3>Your Writing Journey</h3>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-number">0</span>
                      <span className="stat-label">Stories</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">0</span>
                      <span className="stat-label">Words</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">0</span>
                      <span className="stat-label">Days</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="landing-content">
                <div className="brand-section">
                  <div className="brand-logo">
                    <h1 className="brand-title">Writezilla</h1>
                  </div>
                  <p className="brand-tagline">The perfect writing tool</p>
                </div>

                <div className="auth-tabs">
                  <button className="auth-tab active">Sign In</button>
                  <button className="auth-tab">Sign Up</button>
                </div>

                <div className="auth-form">
                  <div className="input-group">
                    <input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="form-input"
                    />
                    <span className="input-icon">Email</span>
                  </div>
                  
                  <div className="input-group">
                    <input 
                      type="password" 
                      placeholder="Enter your password" 
                      className="form-input"
                    />
                    <span className="input-icon">Password</span>
                  </div>

                  <div className="form-options">
                    <label className="checkbox-label">
                      <input type="checkbox" defaultChecked />
                      <span className="checkmark"></span>
                      Remember me
                    </label>
                    <a href="#forgot" className="forgot-link">Forgot Password?</a>
                  </div>

                  <button className="login-btn primary">Login</button>

                  <div className="divider">
                    <span>OR</span>
                  </div>

                  <div className="social-login">
                    <GoogleAuth />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Abstract Background */}
        <div className="background-panel">
          <div className="story-text">
            <p>"Once upon a time, there lived a crocodile. The crocodile had a loving wife, and lived in the river, eating small fish that tasted delicious each time. One day, while basking in the sun on the riverbank, the crocodile met a clever monkey who lived in the trees nearby.</p>
            
            <p>The monkey was known throughout the forest for his wisdom and quick thinking. The crocodile, who was quite greedy, thought to himself, 'If I can trick this monkey into coming to my home, I can eat his heart and become as wise as he is.'</p>
            
            <p>'Dear monkey,' said the crocodile with a sly smile, 'I have heard that you are the wisest creature in the forest. Would you like to visit my beautiful home in the river? I have many delicious fruits that grow on the trees near my house.'</p>
            
            <p>The monkey, being clever, sensed something was not quite right. But he was also curious and wanted to see the crocodile's home. 'That sounds wonderful,' replied the monkey, 'but how will I get there? I cannot swim like you.'</p>
            
            <p>'I will carry you on my back,' said the crocodile. 'You can hold onto my neck, and I will swim you safely across the river.'</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>© 2025 Writezilla. All rights reserved.</p>
          <p>For more information, visit our <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.</p>
        </div>
      </footer>
    </div>
  );
}

export default App; 