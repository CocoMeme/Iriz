# Authentication Features

## Overview

The Iriz mobile app now includes a complete authentication system with Google Sign-In integration and guest mode access.

## Features

### 🔐 Google Authentication
- **Secure OAuth 2.0 Flow**: Industry-standard authentication using Expo Auth Session
- **Auto Token Management**: Automatic storage and retrieval of authentication tokens
- **User Profile Sync**: Retrieves and stores user information (name, email, profile picture)
- **Cross-Platform**: Works on iOS, Android, and web
- **Session Persistence**: Stays logged in across app restarts

### 👤 Guest Mode
- **No Sign-In Required**: Access core features without an account
- **Quick Start**: Tap "Continue as Guest" to start using the app immediately
- **Privacy Focused**: No data collection for guest users
- **Easy Upgrade**: Can sign in later to sync data

## User Interface

### Login Screen Components

1. **Header Section**
   - App logo and branding
   - Tagline: "See the world through sound"
   - Modern gradient background

2. **Welcome Section**
   - Personalized greeting
   - Brief description of benefits

3. **Authentication Options**
   - Google Sign-In button with official branding
   - Guest mode button
   - Clear visual hierarchy

4. **Features Preview**
   - Checkmarks highlighting key features:
     - Real-time text recognition
     - Audio playback of text
     - Save and review history

5. **Legal Footer**
   - Terms of Service link
   - Privacy Policy link

## Authentication Flow

### Google Sign-In Flow

```
User taps "Continue with Google"
        ↓
App opens Google OAuth in browser
        ↓
User selects Google account
        ↓
User grants permissions
        ↓
Google redirects back to app
        ↓
App receives authentication token
        ↓
App fetches user profile
        ↓
Stores credentials securely
        ↓
Navigates to Home Screen
```

### Guest Mode Flow

```
User taps "Continue as Guest"
        ↓
Navigates directly to Home Screen
        ↓
App functions without cloud sync
```

## Security Features

### Secure Storage
- **Expo SecureStore**: Uses iOS Keychain and Android Keystore
- **Encrypted at Rest**: All tokens encrypted by the OS
- **No Plain Text**: Credentials never stored in plain text

### Token Management
- **Automatic Refresh**: Tokens refreshed as needed (implementation ready)
- **Secure Deletion**: Tokens properly cleared on logout
- **Scope Limited**: Only requests necessary permissions (profile, email)

### Privacy
- **Minimal Data**: Only collects essential information
- **User Control**: Easy logout and data deletion
- **Transparent**: Clear permission requests

## API Reference

### authService.js Functions

#### `useGoogleAuth()`
React hook for Google authentication.
```javascript
const { request, response, promptAsync } = useGoogleAuth();
```

#### `processGoogleAuth(response)`
Processes Google OAuth response and stores user data.
```javascript
const userData = await processGoogleAuth(response);
```

#### `loginWithGoogle()`
Legacy method for direct Google login (compatibility).
```javascript
const userData = await loginWithGoogle();
```

#### `logout()`
Logs out the current user and clears stored credentials.
```javascript
await logout();
```

#### `getCurrentUser()`
Retrieves the currently logged-in user data.
```javascript
const user = await getCurrentUser();
```

#### `isAuthenticated()`
Checks if a user is currently authenticated.
```javascript
const isLoggedIn = await isAuthenticated();
```

#### `saveAuthToken(token)`
Securely saves an authentication token.
```javascript
await saveAuthToken(token);
```

#### `getAuthToken()`
Retrieves the stored authentication token.
```javascript
const token = await getAuthToken();
```

#### `saveUserData(userData)`
Saves user profile data securely.
```javascript
await saveUserData(userData);
```

## User Data Structure

```javascript
{
  id: "google-user-id",
  email: "user@example.com",
  name: "John Doe",
  picture: "https://lh3.googleusercontent.com/...",
  token: "access-token",
  idToken: "id-token"
}
```

## Configuration Required

### 1. Google Cloud Console Setup
- Create OAuth 2.0 credentials
- Configure authorized redirect URIs
- Enable Google+ API

### 2. Update Client IDs
In `src/services/authService.js`:
```javascript
const GOOGLE_CLIENT_ID_ANDROID = 'YOUR_ANDROID_CLIENT_ID';
const GOOGLE_CLIENT_ID_IOS = 'YOUR_IOS_CLIENT_ID';
const GOOGLE_CLIENT_ID_WEB = 'YOUR_WEB_CLIENT_ID';
```

### 3. App Configuration
Ensure `app.json` has the correct:
- Bundle identifier (iOS)
- Package name (Android)
- URL scheme

## Testing

### Development Testing
```bash
# Start development server
npm start

# Test on Android
npm run android

# Test on iOS
npm run ios
```

### Testing Checklist
- [ ] Google Sign-In opens browser
- [ ] Can select Google account
- [ ] Redirects back to app
- [ ] Displays user name/email
- [ ] Stays logged in after app restart
- [ ] Logout clears credentials
- [ ] Guest mode works
- [ ] Can switch from guest to signed-in

## Future Enhancements

### Planned Features
- [ ] Backend user verification
- [ ] Cloud sync for history
- [ ] Multi-device support
- [ ] Account linking (email, Apple Sign-In)
- [ ] Biometric authentication
- [ ] Session expiration handling
- [ ] Offline mode improvements

### Backend Integration Points
- User registration endpoint
- Token validation
- Profile sync
- History cloud backup
- Settings synchronization

## Troubleshooting

### Common Issues

**Google Sign-In doesn't open**
- Check client IDs are configured
- Verify bundle ID/package name matches
- Ensure redirect URI is correct

**"Invalid client" error**
- Double-check client ID spelling
- Verify OAuth consent screen is configured
- Check that Google+ API is enabled

**Can't redirect back to app**
- Ensure `expo-web-browser` is installed
- Check URL scheme in `app.json`
- Verify redirect URI configuration

**User data not persisting**
- Check SecureStore permissions
- Verify user data is being saved
- Check for logout being called unexpectedly

## Best Practices

1. **Always handle errors**: Wrap authentication calls in try-catch
2. **Show loading states**: Use ActivityIndicator during auth flow
3. **Clear error messages**: Tell users what went wrong
4. **Allow retry**: Don't force users to restart the app
5. **Respect privacy**: Only request necessary permissions
6. **Test thoroughly**: Test on both platforms, real devices

## Resources

- [Expo Auth Session Documentation](https://docs.expo.dev/versions/latest/sdk/auth-session/)
- [Google Sign-In Documentation](https://developers.google.com/identity/sign-in/web)
- [Expo SecureStore Documentation](https://docs.expo.dev/versions/latest/sdk/securestore/)
- Full setup guide: `GOOGLE_AUTH_SETUP.md`

---

**Last Updated**: October 2025
