import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import GoogleAuth from './components/auth/GoogleAuth';
import OAuthCallback from './components/auth/OAuthCallback';
import { useAuth } from './hooks/useAuth';
import UserDashboard from './components/UserDashboard';
import './components/UserDashboard.css';
import { signUp, signIn, signOut, getCurrentUser, confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';

// Landing Page Component
const LandingPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [signupForm, setSignupForm] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [signinForm, setSigninForm] = useState({
    email: '',
    password: ''
  });
  const [showSigninPassword, setShowSigninPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState<string>('');
  const [authSuccess, setAuthSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const [pendingPassword, setPendingPassword] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [googleUser, setGoogleUser] = useState<any>(null);

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
      // Update the useAuth hook's authentication state
      // This will be handled by the UserDashboard component
    } catch (error) {
      // User is not authenticated
      setCurrentUser(null);
    }
  };



  // Handle sign-out from UserDashboard
  const handleSignOut = () => {
    console.log('App.tsx handleSignOut called');
    setCurrentUser(null);
    setGoogleUser(null);
    setAuthError('');
    setAuthSuccess('');
    console.log('App.tsx state cleared');
  };

  const handleTabClick = (tab: 'signin' | 'signup') => {
    setActiveTab(tab);
  };

  const handleSignupInputChange = (field: string, value: string) => {
    setSignupForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setIsLoading(true);

    // Validate passwords match
    if (signupForm.password !== signupForm.confirmPassword) {
      setAuthError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Validate password requirements
    if (signupForm.password.length < 8) {
      setAuthError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const result = await signUp({
        username: signupForm.email,
        password: signupForm.password,
        options: {
          userAttributes: {
            email: signupForm.email,
            name: signupForm.email.split('@')[0] // Use email prefix as name
          }
        }
      });
      
      setAuthSuccess(`Account created successfully! Please check your email (${signupForm.email}) for the verification code.`);
      setPendingEmail(signupForm.email);
      setPendingPassword(signupForm.password);
      setShowVerification(true);
      setSignupForm({ email: '', password: '', confirmPassword: '' });
      
    } catch (error) {
      console.error('Signup error:', error);
      if (error instanceof Error) {
        if (error.message.includes('User already exists')) {
          setAuthError('An account with this email already exists. Please sign in instead.');
        } else if (error.message.includes('Password')) {
          setAuthError('Password must be at least 8 characters and contain uppercase, lowercase, numbers, and special characters.');
        } else {
          setAuthError(error.message);
        }
      } else {
        setAuthError('An error occurred during signup. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSigninSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setIsLoading(true);

    try {
      const result = await signIn({ 
        username: signinForm.email, 
        password: signinForm.password 
      });
      
      setAuthSuccess('Sign in successful!');
      setCurrentUser(result);
      setSigninForm({ email: '', password: '' });
      
      // Clear success message after a moment
      setTimeout(() => {
        setAuthSuccess('');
      }, 2000);
      
    } catch (error) {
      console.error('Signin error:', error);
      if (error instanceof Error) {
        if (error.message.includes('User is not confirmed')) {
          setAuthError('Your email is not verified. Please enter the verification code below.');
          setPendingEmail(signinForm.email);
          setShowVerification(true);
        } else if (error.message.includes('Incorrect username or password')) {
          setAuthError('Incorrect email or password. Please try again.');
        } else {
          setAuthError(error.message);
        }
      } else {
        setAuthError('An error occurred during sign in. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setAuthError('');
    setAuthSuccess('');
    setIsLoading(true);

    try {
      await resendSignUpCode({
        username: pendingEmail
      });
      
      setAuthSuccess('Verification code resent! Please check your email.');
      
      // Clear success message after a moment
      setTimeout(() => {
        setAuthSuccess('');
      }, 3000);
      
    } catch (error) {
      console.error('Resend error:', error);
      if (error instanceof Error) {
        setAuthError(error.message);
      } else {
        setAuthError('Failed to resend verification code. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setIsLoading(true);

    try {
      await confirmSignUp({
        username: pendingEmail,
        confirmationCode: verificationCode
      });
      
      setAuthSuccess('Email verified successfully! Signing you in...');
      
      // Automatically sign in the user after verification
      try {
        const signInResult = await signIn({ 
          username: pendingEmail, 
          password: pendingPassword
        });
        
        setCurrentUser(signInResult);
        setShowVerification(false);
        setVerificationCode('');
        setPendingEmail('');
        setAuthSuccess('');
        
      } catch (signInError) {
        // If auto sign-in fails, show message to sign in manually
        setAuthSuccess('Email verified successfully! Please sign in with your credentials.');
        setShowVerification(false);
        setVerificationCode('');
        setPendingEmail('');
        
        setTimeout(() => {
          setActiveTab('signin');
          setAuthSuccess('');
        }, 3000);
      }
      
    } catch (error) {
      console.error('Verification error:', error);
      if (error instanceof Error) {
        if (error.message.includes('Invalid code')) {
          setAuthError('Invalid verification code. Please check your email and try again.');
        } else if (error.message.includes('CodeMismatchException')) {
          setAuthError('Incorrect verification code. Please check your email and try again.');
        } else {
          setAuthError(error.message);
        }
      } else {
        setAuthError('An error occurred during verification. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
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

  // If user is authenticated, show the dashboard
  if (currentUser) {
    return <UserDashboard onSignOut={handleSignOut} />;
  }

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
                    {/* Error and Success Messages */}
                    {authError && (
                      <div className="auth-error">
                        {authError}
                      </div>
                    )}
                    {authSuccess && (
                      <div className="auth-success">
                        {authSuccess}
                      </div>
                    )}
                    
                    <div className="input-group">
                      <input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="form-input"
                        value={signinForm.email}
                        onChange={(e) => setSigninForm(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                      <span className="input-icon">Email</span>
                    </div>
                    
                    <div className="input-group">
                      <input 
                        type={showSigninPassword ? "text" : "password"}
                        placeholder="Enter your password" 
                        className="form-input"
                        value={signinForm.password}
                        onChange={(e) => setSigninForm(prev => ({ ...prev, password: e.target.value }))}
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

                    <button type="submit" className="login-btn primary" disabled={isLoading}>
                      {isLoading ? 'Signing In...' : 'Login'}
                    </button>

                    <div className="divider">
                      <span>OR</span>
                    </div>

                                                 <div className="social-login">
                               <GoogleAuth />
                             </div>
                           </form>
                         ) : (
                  <form className="auth-form" onSubmit={handleSignupSubmit}>
                    {/* Error and Success Messages */}
                    {authError && (
                      <div className="auth-error">
                        {authError}
                      </div>
                    )}
                    {authSuccess && (
                      <div className="auth-success">
                        {authSuccess}
                      </div>
                    )}
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

                    <button type="submit" className="login-btn primary" disabled={isLoading}>
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>

                    <div className="divider">
                      <span>OR</span>
                    </div>

                                                 <div className="social-login">
                               <GoogleAuth />
                             </div>
                           </form>
                         )}

                {/* Email Verification Popup */}
                {showVerification && (
                  <div className="verification-overlay">
                    <div className="verification-popup">
                      <div className="verification-content">
                        <h2 className="verification-title">Verify your email address</h2>
                        <p className="verification-instruction">To verify your email address, enter this code in your browser.</p>
                        
                        {/* Error and Success Messages */}
                        {authError && (
                          <div className="auth-error">
                            {authError}
                          </div>
                        )}
                        {authSuccess && (
                          <div className="auth-success">
                            {authSuccess}
                          </div>
                        )}

                        <form onSubmit={handleVerificationSubmit}>
                          <div className="verification-code-input">
                            <input 
                              type="text" 
                              placeholder="Enter 6-digit code" 
                              className="verification-input"
                              value={verificationCode}
                              onChange={(e) => setVerificationCode(e.target.value)}
                              maxLength={6}
                              required
                            />
                          </div>

                          <button type="submit" className="verify-btn" disabled={isLoading}>
                            {isLoading ? 'Verifying...' : 'Verify'}
                          </button>
                        </form>

                        <div className="verification-help">
                          <p>If you didn't request a code, you can safely ignore this email.</p>
                          <div className="verification-actions">
                            <button 
                              type="button" 
                              className="resend-code-btn"
                              onClick={handleResendCode}
                              disabled={isLoading}
                            >
                              Resend Code
                            </button>
                            <button 
                              type="button" 
                              className="close-popup-btn"
                              onClick={() => {
                                setShowVerification(false);
                                setVerificationCode('');
                                setPendingEmail('');
                                setAuthError('');
                                setAuthSuccess('');
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                          <p className="help-text">
                            Questions? <a href="#help" className="help-link">We're here to help.</a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
};

// Main App Component with Routing
function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      // User is not authenticated
      setCurrentUser(null);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  // Handle sign-out from UserDashboard
  const handleSignOut = () => {
    console.log('App.tsx handleSignOut called');
    setCurrentUser(null);
    console.log('App.tsx state cleared');
  };

  if (isLoadingAuth) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* OAuth Callback Route */}
      <Route path="/oauth/callback" element={<OAuthCallback />} />
      
      {/* Main App Routes */}
      <Route 
        path="/" 
        element={
          currentUser ? (
            <UserDashboard onSignOut={handleSignOut} />
          ) : (
            <LandingPage />
          )
        } 
      />
    </Routes>
  );
}

export default App; 