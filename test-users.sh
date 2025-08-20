#!/bin/bash

# Test Users Management Script for Writezilla
# Usage: ./test-users.sh [list|delete|cleanup]

USER_POOL_ID=$(grep -o 'us-east-1_[a-zA-Z0-9]*' src/aws-exports.js | head -1)
REGION="us-east-1"
PROFILE="writezilla"

echo "🔧 Writezilla Test Users Manager"
echo "User Pool: $USER_POOL_ID"
echo ""

case "$1" in
    "list")
        echo "📋 Current Users:"
        aws cognito-idp list-users --user-pool-id $USER_POOL_ID --region $REGION --profile $PROFILE | jq -r '.Users[] | "\(.Username) - \(.Attributes[] | select(.Name=="email").Value) (\(.UserStatus))"'
        ;;
    "delete")
        if [ -z "$2" ]; then
            echo "❌ Please provide a username to delete"
            echo "Usage: ./test-users.sh delete <username>"
            exit 1
        fi
        echo "🗑️  Deleting user: $2"
        aws cognito-idp admin-delete-user --user-pool-id $USER_POOL_ID --username "$2" --region $REGION --profile $PROFILE
        echo "✅ User deleted successfully"
        ;;
    "cleanup")
        echo "🧹 Cleaning up unconfirmed users..."
        aws cognito-idp list-users --user-pool-id $USER_POOL_ID --region $REGION --profile $PROFILE | jq -r '.Users[] | select(.UserStatus=="UNCONFIRMED") | .Username' | while read username; do
            if [ ! -z "$username" ]; then
                echo "🗑️  Deleting unconfirmed user: $username"
                aws cognito-idp admin-delete-user --user-pool-id $USER_POOL_ID --username "$username" --region $REGION --profile $PROFILE
            fi
        done
        echo "✅ Cleanup completed"
        ;;
    *)
        echo "📖 Usage:"
        echo "  ./test-users.sh list          - List all users"
        echo "  ./test-users.sh delete <user> - Delete specific user"
        echo "  ./test-users.sh cleanup       - Delete all unconfirmed users"
        echo ""
        echo "💡 Testing Tips:"
        echo "  • Use email aliases: yourname+test1@gmail.com"
        echo "  • Use temporary emails: 10minutemail.com"
        echo "  • Run 'cleanup' regularly to remove test users"
        ;;
esac 