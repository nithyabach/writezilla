import React, { useState } from 'react';
import './App.css';
import GoogleAuth from './components/auth/GoogleAuth';
import { useAuth } from './hooks/useAuth';

function App() {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [signupForm, setSignupForm] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showSigninPassword, setShowSigninPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleTabClick = (tab: 'signin' | 'signup') => {
    setActiveTab(tab);
  };

  const handleSignupInputChange = (field: string, value: string) => {
    setSignupForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual signup logic
    console.log('Signup form submitted:', signupForm);
  };

  const handleSigninSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual signin logic
    console.log('Signin form submitted');
  };

  const togglePasswordVisibility = (field: 'signin' | 'signup' | 'confirm') => {
    switch (field) {
      case 'signin':
        setShowSigninPassword(!showSigninPassword);
        break;
      case 'signup':
        setShowSignupPassword(!showSignupPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
    }
  };

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
                  <button 
                    className={`auth-tab ${activeTab === 'signin' ? 'active' : ''}`}
                    onClick={() => handleTabClick('signin')}
                  >
                    Sign In
                  </button>
                  <button 
                    className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
                    onClick={() => handleTabClick('signup')}
                  >
                    Sign Up
                  </button>
                </div>

                {activeTab === 'signin' ? (
                  <form className="auth-form" onSubmit={handleSigninSubmit}>
                    <div className="input-group">
                      <input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="form-input"
                        required
                      />
                      <span className="input-icon">Email</span>
                    </div>
                    
                    <div className="input-group">
                      <input 
                        type={showSigninPassword ? "text" : "password"}
                        placeholder="Enter your password" 
                        className="form-input"
                        required
                      />
                      <button 
                        type="button"
                        className="password-toggle"
                        onClick={() => togglePasswordVisibility('signin')}
                      >
                        <span className="material-icons">
                          {showSigninPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>

                    <div className="form-options">
                      <label className="checkbox-label">
                        <input type="checkbox" defaultChecked />
                        <span className="checkmark"></span>
                        Remember me
                      </label>
                      <a href="#forgot" className="forgot-link">Forgot Password?</a>
                    </div>

                    <button type="submit" className="login-btn primary">Login</button>

                    <div className="divider">
                      <span>OR</span>
                    </div>

                    <div className="social-login">
                      <GoogleAuth />
                    </div>
                  </form>
                ) : (
                  <form className="auth-form" onSubmit={handleSignupSubmit}>
                    <div className="input-group">
                      <input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="form-input"
                        value={signupForm.email}
                        onChange={(e) => handleSignupInputChange('email', e.target.value)}
                        required
                      />
                      <span className="input-icon">Email</span>
                    </div>
                    
                    <div className="input-group">
                      <input 
                        type={showSignupPassword ? "text" : "password"}
                        placeholder="Create password" 
                        className="form-input"
                        value={signupForm.password}
                        onChange={(e) => handleSignupInputChange('password', e.target.value)}
                        required
                      />
                      <button 
                        type="button"
                        className="password-toggle"
                        onClick={() => togglePasswordVisibility('signup')}
                      >
                        <span className="material-icons">
                          {showSignupPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>

                    <div className="input-group">
                      <input 
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password" 
                        className="form-input"
                        value={signupForm.confirmPassword}
                        onChange={(e) => handleSignupInputChange('confirmPassword', e.target.value)}
                        required
                      />
                      <button 
                        type="button"
                        className="password-toggle"
                        onClick={() => togglePasswordVisibility('confirm')}
                      >
                        <span className="material-icons">
                          {showConfirmPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>

                    <div className="password-requirements">
                      <p>Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters.</p>
                    </div>

                    <button type="submit" className="login-btn primary">Create Account</button>

                    <div className="divider">
                      <span>OR</span>
                    </div>

                    <div className="social-login">
                      <GoogleAuth />
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Writezilla Editor */}
        <div className="background-panel">
          <div className="editor-container">
            {/* Editor Header */}
            <div className="editor-header">
              <div className="doc-title">The Crocodile and Monkey</div>
              <div className="doc-actions">
                <span className="save-status">All changes saved</span>
              </div>
            </div>
            
            {/* Editor Toolbar */}
            <div className="editor-toolbar">
              <div className="toolbar-group">
                <button className="tool-btn" disabled>B</button>
                <button className="tool-btn" disabled>I</button>
                <button className="tool-btn" disabled>U</button>
              </div>
              <div className="toolbar-group">
                <button className="tool-btn" disabled>Aa</button>
                <button className="tool-btn" disabled>12</button>
              </div>
              <div className="toolbar-group">
                <button className="tool-btn" disabled>≡</button>
                <button className="tool-btn" disabled>•</button>
              </div>
            </div>
            
            {/* Editor Content */}
            <div className="editor-content">
              <div className="writing-area">
                <div className="text-line">
                  <span className="text-content">"Once upon a time, there lived a crocodile. The crocodile had a loving wife, and lived in the river, eating small fish that tasted delicious each time. One day, while basking in the sun on the riverbank, the crocodile met a clever monkey who lived in the trees nearby.</span>
                </div>
                
                <div className="text-line">
                  <span className="text-content">The monkey was known throughout the forest for his wisdom and quick thinking. The crocodile, who was quite greedy, thought to himself, 'If I can trick this monkey into coming to my home, I can eat his heart and become as wise as he is.'</span>
                </div>
                
                <div className="text-line">
                  <span className="text-content">'Dear monkey,' said the crocodile with a sly smile, 'I have heard that you are the wisest creature in the forest. Would you like to visit my beautiful home in the river? I have many delicious fruits that grow on the trees near my house.'</span>
                </div>
                
                <div className="cursor-line">
                  <span className="text-content">The monkey, being clever, sensed something was not quite right. But he was also curious and wanted to see the crocodile's home. 'That sounds wonderful,' replied the monkey, 'but how will I get there? I cannot swim like you.'</span>
                  <span className="cursor">|</span>
                </div>
              </div>
            </div>
            
            {/* Editor Footer */}
            <div className="editor-footer">
              <div className="word-count">156 words</div>
            </div>
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