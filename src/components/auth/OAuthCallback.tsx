import React, { useEffect, useState } from 'react';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';

const OAuthCallback: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Check if we have a valid session after OAuth redirect
        const session = await fetchAuthSession();
        
        if (session.tokens) {
          // Successfully authenticated
          console.log('OAuth authentication successful');
          
          // Get current user details
          const user = await getCurrentUser();
          console.log('Authenticated user:', user);
          
          // Redirect to dashboard or home page
          navigate('/dashboard', { replace: true });
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