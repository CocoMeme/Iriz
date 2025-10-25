# Google Authentication Setup Guide

This guide will walk you through setting up Google OAuth authentication for the Iriz mobile app.

## Prerequisites

- Google Cloud Console account
- Expo account (for development and deployment)
- Node.js and npm installed

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your project name and ID

## Step 2: Enable Google+ API

1. In the Google Cloud Console, go to **APIs & Services** > **Library**
2. Search for "Google+ API"
3. Click on it and press **Enable**

## Step 3: Create OAuth 2.0 Credentials

### For Android:

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Select **Android** as application type
4. Fill in the following:
   - **Name**: Iriz Android Client
   - **Package name**: `com.iriz.app` (must match `app.json`)
   - **SHA-1 certificate fingerprint**: Get this by running:
     ```bash
     # For development (Expo)
     expo credentials:manager
     ```
     Or for local keystore:
     ```bash
     keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
     ```
5. Click **Create**
6. Copy the **Client ID** (it will look like: `xxxxx.apps.googleusercontent.com`)

### For iOS:

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Select **iOS** as application type
4. Fill in the following:
   - **Name**: Iriz iOS Client
   - **Bundle ID**: `com.iriz.app` (must match `app.json`)
5. Click **Create**
6. Copy the **Client ID**
7. Also copy the **iOS URL scheme** (it will look like: `com.googleusercontent.apps.xxxxx`)

### For Web (needed for Expo):

1. Click **Create Credentials** > **OAuth client ID**
2. Select **Web application** as application type
3. Fill in:
   - **Name**: Iriz Web Client
   - **Authorized redirect URIs**: Add your Expo redirect URI:
     ```
     https://auth.expo.io/@YOUR_EXPO_USERNAME/iriz-signboard-reader
     ```
4. Click **Create**
5. Copy the **Client ID**

## Step 4: Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. Select **External** user type
3. Fill in the application information:
   - **App name**: Iriz
   - **User support email**: Your email
   - **App logo**: Upload your app icon (optional)
   - **Developer contact email**: Your email
4. Add scopes:
   - `userinfo.email`
   - `userinfo.profile`
5. Save and continue

## Step 5: Update Your Code

### Update `authService.js`:

Open `src/services/authService.js` and replace the placeholder client IDs:

```javascript
const GOOGLE_CLIENT_ID_ANDROID = 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_CLIENT_ID_IOS = 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_CLIENT_ID_WEB = 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com';
```

With your actual client IDs:

```javascript
const GOOGLE_CLIENT_ID_ANDROID = '123456789-abcdefg.apps.googleusercontent.com';
const GOOGLE_CLIENT_ID_IOS = '123456789-hijklmn.apps.googleusercontent.com';
const GOOGLE_CLIENT_ID_WEB = '123456789-opqrstu.apps.googleusercontent.com';
```

## Step 6: Test the Implementation

### Development Mode:

```bash
# Start the Expo development server
npm start

# For Android
npm run android

# For iOS
npm run ios
```

### Testing Google Sign-In:

1. Launch the app
2. On the Login screen, tap **Continue with Google**
3. You should see the Google OAuth consent screen
4. Select your Google account
5. Grant permissions
6. You should be redirected back to the app and logged in

## Troubleshooting

### Common Issues:

1. **"Invalid client" error**
   - Verify your client IDs are correct
   - Ensure bundle ID/package name matches exactly
   - Check that the OAuth consent screen is configured

2. **"Redirect URI mismatch" error**
   - Make sure your Expo username is correct in the redirect URI
   - Verify the redirect URI is added in Google Cloud Console

3. **"Google+ API not enabled" error**
   - Enable Google+ API in the API Library

4. **SHA-1 fingerprint issues (Android)**
   - Use the correct keystore (debug vs. release)
   - Regenerate SHA-1 if you created a new keystore

5. **App doesn't redirect back**
   - Check that `expo-web-browser` is installed
   - Verify the `scheme` is set in `app.json`

### Testing in Expo Go:

Google Sign-In works in Expo Go, but you need to:
1. Use the Web client ID
2. Ensure your Expo account is properly configured
3. The redirect URI should use Expo's auth proxy

### Production Build:

For production builds with EAS Build:

```bash
# Configure credentials
eas credentials

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

## Security Best Practices

1. **Never commit credentials**: Don't commit client IDs to public repositories
2. **Use environment variables**: Consider using `app.config.js` with environment variables:
   ```javascript
   export default {
     expo: {
       // ... other config
       extra: {
         googleClientIdAndroid: process.env.GOOGLE_CLIENT_ID_ANDROID,
         googleClientIdIos: process.env.GOOGLE_CLIENT_ID_IOS,
         googleClientIdWeb: process.env.GOOGLE_CLIENT_ID_WEB,
       }
     }
   }
   ```
3. **Restrict API keys**: Add application restrictions in Google Cloud Console
4. **Regularly rotate credentials**: Update OAuth credentials periodically

## Additional Resources

- [Expo Auth Session Documentation](https://docs.expo.dev/versions/latest/sdk/auth-session/)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)

## Support

If you encounter issues:
1. Check the console logs for error messages
2. Verify all configuration steps were completed
3. Test with a fresh Google account
4. Check Expo forums and GitHub issues

---

**Note**: This setup is for development and testing. For production, ensure you have proper backend validation of the Google tokens and implement additional security measures.
