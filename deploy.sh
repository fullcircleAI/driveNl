#!/bin/bash

# DriveNL Deployment Script
# This script automates the deployment process to Vercel

echo "🚀 DriveNL Deployment Script"
echo "=============================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo "✅ Build successful!"

# Check if user is logged in to Vercel
echo "🔐 Checking Vercel authentication..."
vercel whoami &> /dev/null

if [ $? -ne 0 ]; then
    echo "🔑 Please log in to Vercel..."
    vercel login
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo ""
    echo "🎉 Your DriveNL app is now live!"
    echo "📱 Test your app and share with beta users"
    echo "📊 Monitor analytics and user feedback"
    echo ""
    echo "Next steps:"
    echo "1. Test the live deployment"
    echo "2. Set up analytics (optional)"
    echo "3. Invite beta users"
    echo "4. Collect feedback and iterate"
else
    echo "❌ Deployment failed. Please check the errors above."
    exit 1
fi
