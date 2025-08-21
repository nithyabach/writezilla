import React, { useState } from 'react';
import { authService } from '../services/authService';
import { LoginCredentials, AuthError } from '../types/auth';
import GoogleSignIn from './GoogleSignIn';
import './LoginForm.css';

interface LoginFormProps {
  onSuccess?: (user: any) => void;
  onError?: (error: string) => void;
  onSwitchToSignUp?: () => void;
  onForgotPassword?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onError,
  onSwitchToSignUp,
  onForgotPassword
}) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!credentials.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!credentials.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const user = await authService.signIn(credentials);
      onSuccess?.(user);
    } catch (error: any) {
      console.error('Sign in failed:', error);
      
      let errorMessage = 'Sign in failed. Please try again.';
      
      if (error.message === AuthError.INVALID_CREDENTIALS) {
        errorMessage = 'Invalid email or password';
      } else if (error.message === AuthError.USER_NOT_FOUND) {
        errorMessage = 'User not found';
      } else if (error.message === AuthError.EMAIL_NOT_VERIFIED) {
        errorMessage = 'Please verify your email address';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignInError = (error: string) => {
    onError?.(error);
  };

  return (
    <div className="login-form-container">
      <div className="login-form-header">
        <h2 className="login-title">Welcome Back!</h2>
        <p className="login-subtitle">Sign in to continue to Writezilla</p>
      </div>

      <div className="login-form-content">
        {/* Google Sign In */}
        <div className="google-signin-section">
          <GoogleSignIn
            onError={handleGoogleSignInError}
            isLoading={isLoading}
            disabled={isLoading}
          />
        </div>

        {/* Divider */}
        <div className="divider">
          <span className="divider-text">OR</span>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailSignIn} className="email-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Enter your email"
              disabled={isLoading}
              autoComplete="email"
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Enter your password"
              disabled={isLoading}
              autoComplete="current-password"
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="signin-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loading-spinner" />
              ) : (
                'Sign In'
              )}
            </button>

            <button
              type="button"
              className="forgot-password-button"
              onClick={onForgotPassword}
              disabled={isLoading}
            >
              Forgot Password?
            </button>
          </div>
        </form>

        {/* Sign Up Link */}
        <div className="signup-section">
          <p className="signup-text">
            Don't have an account?{' '}
            <button
              type="button"
              className="signup-link"
              onClick={onSwitchToSignUp}
              disabled={isLoading}
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm; 