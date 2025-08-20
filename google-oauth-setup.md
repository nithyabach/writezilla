# Google OAuth Setup Guide for Writezilla

## Step 1: Google Cloud Console Setup

### 1.1 Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name: `writezilla-oauth`
4. Click "Create"

### 1.2 Enable Google+ API
1. Go to "APIs & Services" → "Library"
2. Search for "Google+ API" or "Google Identity"
3. Click "Enable"

### 1.3 Create OAuth 2.0 Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Application type: "Web application"
4. Name: "Writezilla Web Client"
5. Authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
6. Authorized redirect URIs:
   - `http://localhost:3000/auth/callback`
   - `https://yourdomain.com/auth/callback`
7. Click "Create"

### 1.4 Save Credentials
- **Client ID**: Copy this (we'll need it)
- **Client Secret**: Copy this (we'll need it)

## Step 2: AWS Cognito Configuration

### 2.1 Add Google as Identity Provider
1. Go to AWS Cognito Console
2. Select your User Pool: `us-east-1_QFsJHi89e`
3. Go to "Sign-in experience" → "Federated identity provider sign-in"
4. Click "Add identity provider"
5. Select "Google"
6. Enter your Google Client ID and Client Secret
7. Configure attribute mapping:
   - Email: `email`
   - Name: `name`
   - Given name: `given_name`
   - Family name: `family_name`
8. Save

### 2.2 Update App Client
1. Go to "App integration" → "App client list"
2. Select your app client
3. Under "Authentication flows", enable:
   - ALLOW_USER_PASSWORD_AUTH
   - ALLOW_REFRESH_TOKEN_AUTH
   - ALLOW_USER_SRP_AUTH
4. Save

## Step 3: Environment Variables

Add these to your `.env` file:
```
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
REACT_APP_GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

## Step 4: Implementation

The Google OAuth component is already created and ready to be connected! 