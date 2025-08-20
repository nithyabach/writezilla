#!/bin/bash

echo "🚀 Switching to Firebase Google Auth (Much Easier!)"
echo "=================================================="
echo ""

echo "📋 This will:"
echo "1. Update your App.tsx to use Firebase Google Auth"
echo "2. Show you the Firebase setup steps"
echo "3. Keep your existing AWS Cognito setup"
echo ""

read -p "Continue? (y/n): " continue_setup

if [ "$continue_setup" != "y" ]; then
    echo "❌ Setup cancelled"
    exit 0
fi

echo ""
echo "🔄 Updating App.tsx to use Firebase Google Auth..."

# Create a backup of the current App.tsx
cp src/App.tsx src/App.tsx.backup

# Update the import statement
sed -i '' 's|import GoogleAuth from '\''./components/auth/GoogleAuth'\'';|import GoogleAuth from '\''./components/auth/FirebaseGoogleAuth'\'';|' src/App.tsx

echo "✅ App.tsx updated!"
echo ""

echo "📖 Next Steps:"
echo "1. Follow the Firebase setup guide: firebase-setup-guide.md"
echo "2. Create a Firebase project (5 minutes)"
echo "3. Add your Firebase config to .env file"
echo "4. Test the Google sign-in!"
echo ""

echo "🔗 Firebase Console: https://console.firebase.google.com/"
echo "📖 Setup Guide: firebase-setup-guide.md"
echo ""

echo "🎉 You're all set! Firebase is much easier than Google Cloud Console." 