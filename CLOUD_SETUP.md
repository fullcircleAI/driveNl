# Cloud Storage Setup Guide

This guide will help you set up cloud storage for the DriveNL app to enable data synchronization across devices.

## Option 1: JSONBin.io (Recommended - Free & Easy)

JSONBin.io is a free JSON storage service that's perfect for this app.

### Step 1: Create JSONBin Account
1. Go to [JSONBin.io](https://jsonbin.io/)
2. Sign up for a free account
3. Go to your dashboard

### Step 2: Create a Bin
1. Click "Create Bin"
2. Name it "drivenl-user-data"
3. Copy the Bin ID (looks like: `507f1f77bcf86cd799439011`)

### Step 3: Get API Key
1. Go to "API Keys" in your dashboard
2. Create a new API key
3. Copy the Master Key

### Step 4: Configure Environment Variables
Create a `.env` file in the project root:

```env
# JSONBin Configuration
VITE_JSONBIN_API_KEY=your_master_key_here
VITE_JSONBIN_BIN_ID=your_bin_id_here
```

### Step 5: Test the Setup
1. Start the development server: `npm run dev`
2. Create a user account
3. Check the browser console for "Cloud data saved successfully" messages

## Option 2: Firebase (Advanced)

If you prefer Firebase, you'll need to set up a Firebase project:

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database

### Step 2: Get Configuration
1. Go to Project Settings > General
2. Scroll down to "Your apps"
3. Add a web app
4. Copy the configuration

### Step 3: Configure Environment Variables
Create a `.env` file:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Option 3: Local Storage Only (Default)

If you don't set up any cloud storage, the app will work with local storage only. Data will be saved locally but won't sync across devices.

## Testing Cloud Storage

1. **Create a user account** in the app
2. **Take a practice test** and complete it
3. **Check the browser console** for cloud storage messages
4. **Clear browser data** and log back in
5. **Verify your progress** is restored

## Troubleshooting

### "Cloud data saved successfully" not appearing
- Check your environment variables are set correctly
- Verify your API key has the right permissions
- Check the browser console for error messages

### Data not syncing across devices
- Ensure both devices are using the same cloud storage configuration
- Check that both devices are online
- Verify the user ID is the same on both devices

### JSONBin rate limits
- Free tier: 10,000 requests/month
- If you hit limits, consider upgrading or switching to Firebase

## Security Notes

- Never commit your `.env` file to version control
- API keys should be kept secure
- User data is encrypted in transit
- Consider implementing additional security measures for production

## Production Deployment

For production deployment:

1. Set environment variables in your hosting platform (Vercel, Netlify, etc.)
2. Use production API keys
3. Consider implementing additional security measures
4. Set up monitoring for cloud storage usage

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your environment variables
3. Test with a fresh browser session
4. Check the cloud storage service status
