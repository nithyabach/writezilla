import { Amplify } from 'aws-amplify';

// AWS Cognito Configuration
// Note: Replace these with your actual AWS Cognito values
const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.REACT_APP_USER_POOL_ID || 'us-east-1_xxxxx',
      userPoolClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID || 'xxxxx',
      signUpVerificationMethod: 'code',
      loginWith: {
        oauth: {
          domain: process.env.REACT_APP_COGNITO_DOMAIN || 'your-domain.auth.us-east-1.amazoncognito.com',
          scopes: ['openid', 'email', 'profile'],
          providers: ['Google'],
          responseType: 'code'
        }
      }
    }
  },
  API: {
    GraphQL: {
      endpoint: process.env.REACT_APP_APPSYNC_ENDPOINT || 'https://xxxxx.appsync-api.us-east-1.amazonaws.com/graphql',
      region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
      defaultAuthMode: 'userPool'
    }
  },
  Storage: {
    S3: {
      bucket: process.env.REACT_APP_S3_BUCKET || 'writezilla-storage',
      region: process.env.REACT_APP_AWS_REGION || 'us-east-1'
    }
  }
};

// Initialize Amplify
export const initializeAmplify = () => {
  try {
    Amplify.configure(amplifyConfig);
    console.log('AWS Amplify configured successfully');
  } catch (error) {
    console.error('Failed to configure AWS Amplify:', error);
    throw error;
  }
};

// Environment variables that need to be set:
// REACT_APP_USER_POOL_ID=us-east-1_xxxxx
// REACT_APP_USER_POOL_CLIENT_ID=xxxxx
// REACT_APP_COGNITO_DOMAIN=your-domain.auth.us-east-1.amazoncognito.com
// REACT_APP_APPSYNC_ENDPOINT=https://xxxxx.appsync-api.us-east-1.amazonaws.com/graphql
// REACT_APP_S3_BUCKET=writezilla-storage
// REACT_APP_AWS_REGION=us-east-1

export default amplifyConfig; 