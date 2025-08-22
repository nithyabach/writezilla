import React, { useEffect, useState } from 'react';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';

const OAuthCallback: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Check if we have a valid user after OAuth redirect
        const user = await getCurrentUser();
        
        if (user) {
          // Successfully authenticated
          console.log('OAuth authentication successful');
          console.log('Authenticated user:', user);
          
          // Skip fetchUserAttributes for now to avoid scope issues
          // TODO: Fix scope configuration for user attributes
          
          // Redirect to home page
          navigate('/', { replace: true });
        } else {
          setError('Authentication failed. Please try again.');
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        setError('Authentication failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    handleOAuthCallback();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="oauth-callback">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Completing sign in...</h2>
          <p>Please wait while we complete your authentication.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="oauth-callback">
        <div className="error-container">
          <h2>Authentication Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')} className="back-btn">
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default OAuthCallback; 