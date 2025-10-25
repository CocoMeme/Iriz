# Quick Start: Testing the Login Screen

This guide will help you quickly test the new login/sign-up screen with Google authentication.

## Prerequisites

- Node.js and npm installed
- Expo CLI installed (`npm install -g expo-cli`)
- Expo Go app on your mobile device (optional, for testing)

## Quick Test (Without Google OAuth Configuration)

You can test the UI and guest mode immediately without setting up Google OAuth:

### Step 1: Install Dependencies

```bash
cd c:\Users\coand\Desktop\Iriz\mobile_app
npm install
```

### Step 2: Start the Development Server

```bash
npm start
```

This will:
- Start the Expo development server
- Open the Metro bundler in your browser
- Display a QR code

### Step 3: Run the App

**Option A: On Physical Device**
1. Install Expo Go from App Store (iOS) or Play Store (Android)
2. Scan the QR code with your camera (iOS) or Expo Go app (Android)
3. The app will load on your device

**Option B: On Emulator/Simulator**
```bash
# For Android (requires Android Studio)
npm run android

# For iOS (requires Xcode, macOS only)
npm run ios

# For Web Browser
npm run web
```

### Step 4: Test Guest Mode

1. The app should open to the Login Screen
2. Tap **"Continue as Guest"**
3. You should be navigated to the Home Screen

**Note**: Google Sign-In button will show but won't work until OAuth is configured.

## Full Test (With Google OAuth)

To test the complete Google Sign-In functionality:

### Step 1: Configure Google OAuth

Follow the detailed instructions in `GOOGLE_AUTH_SETUP.md` to:
1. Create a Google Cloud Project
2. Set up OAuth credentials
3. Get client IDs for Android, iOS, and Web

### Step 2: Update Client IDs

Edit `src/services/authService.js`:

```javascript
// Replace these with your actual client IDs
const GOOGLE_CLIENT_ID_ANDROID = 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_CLIENT_ID_IOS = 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_CLIENT_ID_WEB = 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com';
```

### Step 3: Restart the App

```bash
# Stop the current server (Ctrl+C)
# Start again
npm start
```

### Step 4: Test Google Sign-In

1. Open the app to the Login Screen
2. Tap **"Continue with Google"**
3. A browser window should open
4. Select your Google account
5. Grant permissions
6. You should be redirected back to the app
7. Check the console for user info
8. You should be navigated to the Home Screen

## What You'll See

### Login Screen Features:

✅ **Header**
- Iriz logo (👁️)
- App name and tagline
- Blue gradient background

✅ **Main Content**
- Welcome message
- Feature highlights
- Two authentication buttons

✅ **Google Sign-In Button**
- Official Google blue color (#4285F4)
- White Google "G" icon
- "Continue with Google" text
- Loading spinner when active

✅ **Guest Mode Button**
- Outlined style
- Blue border and text
- "Continue as Guest" text

✅ **Footer**
- Terms and Privacy links
- Small, gray text

## Testing Checklist

### UI Testing
- [ ] Login screen renders correctly
- [ ] Logo and branding visible
- [ ] Both buttons are styled properly
- [ ] Text is readable
- [ ] Layout looks good on different screen sizes
- [ ] Buttons respond to taps

### Guest Mode Testing
- [ ] Guest button navigates to Home
- [ ] No authentication required
- [ ] App functions normally

### Google Sign-In Testing (requires OAuth setup)
- [ ] Button opens browser/OAuth screen
- [ ] Can select Google account
- [ ] Redirects back to app
- [ ] Shows loading state
- [ ] Navigates to Home on success
- [ ] Shows error on failure
- [ ] Can retry after error

### Security Testing
- [ ] User data stored securely
- [ ] Tokens not visible in logs (production)
- [ ] Logout clears credentials
- [ ] Session persists after app restart

## Console Output

When testing, you'll see console logs like:

```
// On Google Sign-In attempt
Logging in with Google...

// On successful authentication
User logged in: John Doe

// User data structure
{
  id: "12345...",
  email: "user@example.com",
  name: "John Doe",
  picture: "https://...",
  token: "ya29...",
  idToken: "eyJh..."
}
```

## Common Development Issues

### Issue: "expo-auth-session not found"
**Solution**: Run `npm install`

### Issue: "Cannot find module 'expo-web-browser'"
**Solution**: Run `npm install expo-web-browser`

### Issue: Google button doesn't do anything
**Solution**: 
1. Check console for errors
2. Verify client IDs are set (even placeholder values for UI testing)
3. Check that `useGoogleAuth` hook is working

### Issue: App crashes on Google Sign-In
**Solution**:
1. Check that all OAuth credentials are configured
2. Verify redirect URI is correct
3. Check console logs for specific error
4. Try guest mode to verify navigation works

### Issue: Can't scan QR code
**Solution**:
1. Make sure you're on the same WiFi network
2. Try running with tunnel: `expo start --tunnel`
3. Use USB connection instead

## Development Tips

### Tip 1: Use Development Build for Better Testing
For more reliable OAuth testing, create a development build:
```bash
expo install expo-dev-client
eas build --profile development --platform android
```

### Tip 2: Clear App Data Between Tests
```bash
# Android
adb shell pm clear com.iriz.app

# iOS Simulator
xcrun simctl uninstall booted com.iriz.app
```

### Tip 3: Monitor Network Requests
Use React Native Debugger or Flipper to monitor:
- OAuth requests
- Token exchanges
- User info fetches

### Tip 4: Test Error States
Simulate errors by:
1. Canceling the OAuth flow
2. Denying permissions
3. Using incorrect client IDs
4. Disconnecting internet

## Next Steps

After testing the login screen:

1. **Test the complete app flow**
   - Login → Home → Camera → Result → History
   
2. **Implement backend integration**
   - Send tokens to your backend
   - Validate tokens server-side
   - Store user data in database

3. **Add account management**
   - View profile in Settings
   - Logout functionality
   - Delete account option

4. **Enhance error handling**
   - Specific error messages
   - Retry mechanisms
   - Offline support

5. **Add analytics**
   - Track login attempts
   - Monitor success/failure rates
   - User behavior tracking

## Support

If you encounter issues:

1. **Check the documentation**:
   - `README.md` - Project overview
   - `GOOGLE_AUTH_SETUP.md` - OAuth configuration
   - `AUTH_FEATURES.md` - Feature documentation

2. **Check console logs**: Look for error messages and warnings

3. **Verify configuration**: Double-check all credentials and settings

4. **Test incrementally**: Test each component separately

5. **Ask for help**: Check Expo forums, GitHub issues, Stack Overflow

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Google OAuth Playground](https://developers.google.com/oauthplayground/)
- [Expo Auth Session](https://docs.expo.dev/versions/latest/sdk/auth-session/)

---

**Happy Testing! 🚀**
