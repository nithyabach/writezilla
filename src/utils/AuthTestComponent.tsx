import React, { useState, useEffect } from 'react';
import { signUp, signIn, signOut, getCurrentUser } from 'aws-amplify/auth';

const AuthTest: React.FC = () => {
  const [authStatus, setAuthStatus] = useState<string>('Checking...');
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setAuthStatus('Authenticated');
      setError('');
    } catch (err) {
      setAuthStatus('Not authenticated');
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const testSignUp = async () => {
    try {
      setAuthStatus('Testing sign up...');
      const result = await signUp({
        username: 'test@example.com',
        password: 'TestPassword123!',
        options: {
          userAttributes: {
            email: 'test@example.com',
            name: 'Test User'
          }
        }
      });
      setAuthStatus(`Sign up successful: ${result.userId}`);
      setError('');
    } catch (err) {
      setAuthStatus('Sign up failed');
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const testSignIn = async () => {
    try {
      setAuthStatus('Testing sign in...');
      const result = await signIn({ username: 'test@example.com', password: 'TestPassword123!' });
      setUser(result);
      setAuthStatus('Sign in successful');
      setError('');
    } catch (err) {
      setAuthStatus('Sign in failed');
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const testSignOut = async () => {
    try {
      setAuthStatus('Signing out...');
      await signOut();
      setUser(null);
      setAuthStatus('Signed out successfully');
      setError('');
    } catch (err) {
      setAuthStatus('Sign out failed');
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #DA5812', 
      borderRadius: '8px', 
      margin: '20px',
      backgroundColor: '#fff',
      maxWidth: '500px'
    }}>
      <h3 style={{ color: '#DA5812', marginBottom: '15px' }}>
        🔐 AWS Amplify Authentication Test
      </h3>
      
      <div style={{ marginBottom: '15px' }}>
        <strong>Status:</strong> <span style={{ color: authStatus.includes('successful') ? 'green' : 'orange' }}>
          {authStatus}
        </span>
      </div>

      {user && (
        <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
          <strong>User Info:</strong>
          <pre style={{ fontSize: '12px', marginTop: '5px' }}>
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      )}

      {error && (
        <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#ffe6e6', borderRadius: '4px', color: 'red' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button 
          onClick={testSignUp}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#DA5812', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test Sign Up
        </button>
        
        <button 
          onClick={testSignIn}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test Sign In
        </button>
        
        <button 
          onClick={testSignOut}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#dc3545', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test Sign Out
        </button>
        
        <button 
          onClick={checkAuthStatus}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Refresh Status
        </button>
      </div>

      <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
        <strong>What to test:</strong>
        <ul style={{ marginTop: '5px' }}>
          <li>Click "Test Sign Up" to create a test user</li>
          <li>Click "Test Sign In" to authenticate</li>
          <li>Click "Test Sign Out" to log out</li>
          <li>Check browser console for detailed logs</li>
        </ul>
      </div>
    </div>
  );
};

export default AuthTest; 