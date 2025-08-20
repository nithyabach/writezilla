import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import './GoogleAuth.css';

// Firebase configuration (you'll get this from Firebase Console)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase (only if config is available)
let app: any = null;
let auth: any = null;
let googleProvider: any = null;

if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'your_firebase_api_key_here') {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
  } catch (error) {
    console.warn('Firebase not configured, Google Auth will be disabled');
  }
}

interface FirebaseGoogleAuthProps {
  onGoogleSignIn?: (user: User) => void;
  onGoogleSignOut?: () => void;
}

const FirebaseGoogleAuth: React.FC<FirebaseGoogleAuthProps> = ({ 
  onGoogleSignIn, 
  onGoogleSignOut 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user && onGoogleSignIn) {
        onGoogleSignIn(user);
      } else if (!user && onGoogleSignOut) {
        onGoogleSignOut();
      }
    });

    return () => unsubscribe();
  }, [onGoogleSignIn, onGoogleSignOut]);

  const handleGoogleSignIn = async () => {
    if (!auth || !googleProvider) {
      setError('Google authentication is not configured. Please set up Firebase.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      console.log('Google sign-in successful:', user);
      
      // Call the callback if provided
      if (onGoogleSignIn) {
        onGoogleSignIn(user);
      }
      
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Sign-in was cancelled. Please try again.');
      } else {
        setError('Failed to sign in with Google. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError('');
  };

  // If Firebase is not configured, show a disabled button
  if (!auth || !googleProvider) {
    return (
      <div className="auth-container">
        <button 
          className="google-login-btn disabled"
          disabled={true}
          title="Google authentication not configured"
        >
          <svg className="google-icon" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>Sign in with Google</span>
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="auth-loading">
        <div className="loading-spinner"></div>
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="auth-container">
      {error && (
        <div className="error-message">
          <span>{error}</span>
          <button onClick={clearError} className="error-close">×</button>
        </div>
      )}
      
      <button 
        onClick={handleGoogleSignIn}
        className="google-login-btn"
        aria-label="Sign in with Google"
        disabled={isLoading}
      >
        <svg className="google-icon" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <span>Sign in with Google</span>
      </button>
    </div>
  );
};

export default FirebaseGoogleAuth; 