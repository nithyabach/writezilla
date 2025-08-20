# AWS Amplify Configuration Steps

## 🚀 Step-by-Step Setup Guide

### 1. Configure AWS Credentials
```bash
# Once your AWS account is ready, run:
aws configure

# You'll need:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region (us-east-1 recommended)
# - Default output format (json)
```

### 2. Initialize Amplify in Your Project
```bash
# In your writezilla directory:
amplify init

# Choose options:
# - Enter a name for the project: writezilla
# - Enter a name for the environment: dev
# - Choose your default editor: (your preferred editor)
# - Choose the type of app that you're building: javascript
# - What JavaScript framework are you using: react
# - Source Directory Path: src
# - Distribution Directory Path: build
# - Build Command: npm run build
# - Start Command: npm start
# - Do you want to use an AWS profile? Yes
# - Please choose the profile you want to use: default
```

### 3. Add Authentication
```bash
amplify add auth

# Choose options:
# - Do you want to use the default authentication and security configuration? Default configuration
# - How do you want users to be able to sign in? Email
# - Do you want to configure advanced settings? Yes
# - What attributes are required for signing up? Email, Name
# - Do you want to enable any of the following capabilities? Add Google as a social provider
# - Enter your Google Web Client ID: (we'll get this from Google Cloud Console)
# - Enter your Google Web Client Secret: (we'll get this from Google Cloud Console)
```

### 4. Add API (for user data and stories)
```bash
amplify add api

# Choose options:
# - Please select from one of the below mentioned services: GraphQL
# - Provide a friendly name for your resource to be used as a label for this category in the project: writezillaAPI
# - Provide the AWS location where you want to deploy the GraphQL API: us-east-1
# - Choose the default authorization type for the API: Amazon Cognito User Pool
# - Do you want to configure advanced settings for the GraphQL API: No
# - Do you have an annotated GraphQL schema? No
# - Do you want a guided schema creation? Yes
# - What best describes your project: Single object with fields
# - Do you want to edit the schema now? Yes
```

### 5. Add Storage (for user files)
```bash
amplify add storage

# Choose options:
# - Please select from one of the below mentioned services: Content (S3)
# - Provide a friendly name for your resource that will be used to label this category in the project: writezillaStorage
# - Provide bucket name: writezilla-user-files-[random]
# - Who should have access: Auth users only
# - What kind of access do you want for Authenticated users: create, read, update, delete
# - Do you want to add a Lambda Trigger for your S3 Bucket? No
```

### 6. Push to AWS
```bash
amplify push

# This will create all the AWS resources
# - Cognito User Pool
# - AppSync GraphQL API
# - DynamoDB tables
# - S3 buckets
# - IAM roles and policies
```

### 7. Publish to Production
```bash
amplify publish

# This will build and deploy your app to AWS Amplify Console
```

## 📋 What Gets Created

### AWS Cognito:
- User Pool for authentication
- Identity Pool for authorization
- User groups and roles

### DynamoDB Tables:
- User profiles
- Stories and content
- Analytics data

### S3 Buckets:
- User uploads
- Static website hosting
- Media files

### AppSync GraphQL API:
- Real-time data synchronization
- Offline support
- Optimistic updates

## 🔧 Next Steps After Setup

### 1. Update Environment Variables
Copy the generated values to your `.env` file:
```bash
# The amplify push command will show you the values
# Copy them to your .env file
```

### 2. Update Your React App
```bash
# Import and configure Amplify
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);
```

### 3. Test Authentication
```bash
# Start your development server
npm start

# Test sign up, sign in, and Google OAuth
```

## 🎯 Expected Timeline

- **AWS Account Setup**: 15-30 minutes
- **Amplify Configuration**: 30-45 minutes
- **Testing & Debugging**: 30-60 minutes
- **Total**: 1.5-2.5 hours

## 💡 Tips for Success

1. **Use us-east-1 region** for best compatibility
2. **Enable MFA** on your AWS account immediately
3. **Set up billing alerts** to avoid unexpected charges
4. **Test thoroughly** before going to production
5. **Document your setup** for team members 