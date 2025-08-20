# AWS Amplify Testing Utilities

## AuthTestComponent.tsx

This component is used to test AWS Amplify authentication functionality.

### How to Use:

1. **Import the component:**
```tsx
import AuthTest from './utils/AuthTestComponent';
```

2. **Add it to your component:**
```tsx
<AuthTest />
```

3. **Test the authentication:**
   - Click "Refresh Status" to check current auth state
   - Click "Test Sign Up" to create a test user
   - Click "Test Sign In" to authenticate
   - Click "Test Sign Out" to log out

### What it tests:
- ✅ AWS Amplify configuration
- ✅ Cognito User Pool connection
- ✅ User registration
- ✅ User authentication
- ✅ User sign out

### When to use:
- After setting up AWS Amplify
- When debugging authentication issues
- Before implementing real authentication
- To verify AWS configuration

### Location:
`src/utils/AuthTestComponent.tsx`

### Note:
This component is for testing purposes only. Remove it from production code. 