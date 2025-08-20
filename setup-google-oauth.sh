#!/bin/bash

echo "🔧 Google OAuth Setup for Writezilla"
echo "====================================="
echo ""

echo "📋 Prerequisites:"
echo "1. Google Cloud Console project created"
echo "2. OAuth 2.0 credentials obtained"
echo "3. AWS Cognito User Pool ready"
echo ""

read -p "Do you have your Google Client ID ready? (y/n): " has_client_id

if [ "$has_client_id" != "y" ]; then
    echo ""
    echo "❌ Please follow the steps in google-oauth-setup.md first:"
    echo "1. Create Google Cloud project"
    echo "2. Enable Google+ API"
    echo "3. Create OAuth 2.0 credentials"
    echo "4. Get your Client ID and Client Secret"
    echo ""
    exit 1
fi

echo ""
echo "🚀 Setting up Google OAuth with AWS Amplify..."
echo ""

# Add Google OAuth to Amplify
echo "Adding Google OAuth to Amplify configuration..."
amplify add auth --profile writezilla

echo ""
echo "✅ Next steps:"
echo "1. In the AWS Cognito Console, add Google as an identity provider"
echo "2. Enter your Google Client ID and Client Secret"
echo "3. Configure attribute mapping"
echo "4. Update your app client settings"
echo ""
echo "📖 See google-oauth-setup.md for detailed instructions"
echo ""
echo "🔗 AWS Cognito Console:"
echo "https://us-east-1.console.aws.amazon.com/cognito/v2/idp/user-pools/us-east-1_QFsJHi89e/users?region=us-east-1" 