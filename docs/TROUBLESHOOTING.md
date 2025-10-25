# Troubleshooting Guide

## Issues Fixed ✅

### 1. **Missing Asset Files**
**Error**: `ENOENT: no such file or directory, open '...\assets\adaptive-icon.png'`

**Solution**: Removed references to missing asset files from `app.json`:
- Removed `icon`, `splash`, `adaptiveIcon`, and `favicon` references
- App now uses Expo default icons

### 2. **Missing babel-preset-expo**
**Error**: `Cannot find module 'babel-preset-expo'`

**Solution**: 
```bash
npm install --save-dev babel-preset-expo
```

### 3. **Missing expo-status-bar**
**Error**: `Unable to resolve "expo-status-bar" from "App.js"`

**Solution**:
```bash
npm install expo-status-bar --legacy-peer-deps
```

### 4. **Syntax Error in SettingsScreen.js**
**Error**: `Unexpected token (188:2)` - Missing parenthesis after `return`

**Solution**: Fixed line 82 in `SettingsScreen.js`:
```javascript
// Before:
return 
  <ScrollView>

// After:
return (
  <ScrollView>
```

## Potential Issues to Watch For ⚠️

### 1. **Package Version Conflicts**
The project uses older Expo SDK 54 packages while SDK 54 expects newer versions.

**Affected Packages**:
- expo-auth-session (current: 6.0.3, expected: ~7.0.8)
- expo-av (current: 15.0.2, expected: ~16.0.7)
- expo-camera (current: 16.0.18, expected: ~17.0.8)
- react (current: 18.3.1, expected: 19.1.0)
- react-native (current: 0.76.5, expected: 0.81.4)

**Recommendation**: 
- Keep current versions for now as they work
- When updating, use `--legacy-peer-deps` flag
- Or migrate to Expo SDK 52 or 51 for better compatibility

### 2. **Google OAuth Not Configured**
The Google Sign-In will fail until OAuth credentials are configured.

**What Happens**: Button shows but OAuth won't work

**Solution**: Follow `GOOGLE_AUTH_SETUP.md` to configure credentials

**Workaround**: Use Guest Mode to test the app

### 3. **Android Emulator Not Running**
**Error**: `No Android connected device found`

**Solutions**:
- Start Android emulator from Android Studio
- Connect a physical Android device via USB
- Or use Expo Go app for testing

### 4. **Metro Bundler Cache Issues**
Sometimes the bundler cache causes issues.

**Solution**:
```bash
npm start -- --clear
# or
npx expo start --clear
```

### 5. **Node Modules Corruption**
If you encounter random errors:

**Solution**:
```bash
rm -r node_modules
rm package-lock.json
npm install --legacy-peer-deps
```

### 6. **Import Errors for Expo Packages**
If you see "Cannot resolve [expo-package]":

**Solution**:
```bash
npm install [package-name] --legacy-peer-deps
```

### 7. **useGoogleAuth Hook Error**
**Error**: "Invalid hook call" or "Cannot use hooks"

**Cause**: `useGoogleAuth` is a custom hook that wraps Expo's hook

**Solution**: Ensure `expo-auth-session` and `expo-web-browser` are installed:
```bash
npm install expo-auth-session expo-web-browser --legacy-peer-deps
```

### 8. **SecureStore Not Available**
**Error**: "SecureStore is not available"

**Cause**: Testing on web browser (SecureStore only works on native)

**Solution**: Test on Android/iOS device or emulator

## Common Development Commands

### Install Dependencies
```bash
npm install --legacy-peer-deps
```

### Start Development Server
```bash
npm start
# or with cache clear
npm start -- --clear
```

### Run on Android
```bash
# Make sure emulator is running or device is connected
npm run android
```

### Run on iOS (macOS only)
```bash
npm run ios
```

### Run on Web
```bash
npm run web
```

### Prebuild (Generate Native Directories)
```bash
npx expo prebuild --clean
```

### Fix Package Versions
```bash
npx expo install --fix --legacy-peer-deps
```

## Testing Recommendations

### 1. **Test with Expo Go (Easiest)**
```bash
npm start
# Scan QR code with Expo Go app
```

**Pros**: Quick, no build required
**Cons**: Google OAuth might not work perfectly

### 2. **Test with Development Build**
```bash
npx expo prebuild
npm run android
```

**Pros**: Full native features, better OAuth
**Cons**: Requires Android Studio setup

### 3. **Test Guest Mode First**
- Always test Guest Mode first to verify navigation works
- Then test Google Sign-In if configured

## Build Issues

### If `npm run android` fails:

1. **Check Android Studio is installed**
2. **Check emulator is running**: Open Android Studio → AVD Manager → Start emulator
3. **Check device is connected**: `adb devices`
4. **Try Expo Go instead**: `npm start` then scan QR code

### If builds are slow:

1. **Clear cache**:
   ```bash
   npm start -- --clear
   npx expo start --clear
   ```

2. **Clear Metro bundler**:
   ```bash
   rm -rf .expo
   ```

3. **Rebuild node_modules**:
   ```bash
   rm -rf node_modules
   npm install --legacy-peer-deps
   ```

## React Native/Expo Specific Issues

### Issue: "Invariant Violation: Module AppRegistry is not a registered callable module"
**Solution**: Clear cache and restart:
```bash
rm -rf node_modules/.cache
npm start -- --clear
```

### Issue: "Unable to resolve module @babel/runtime"
**Solution**:
```bash
npm install @babel/runtime --legacy-peer-deps
```

### Issue: "React Hook rules violation"
**Solution**: Ensure you're not calling hooks conditionally or in nested functions

### Issue: "Can't find variable: __fbBatchedBridgeConfig"
**Solution**: 
```bash
npm start -- --reset-cache
```

## Authentication Specific Issues

### Google Sign-In Button Doesn't Work
**Check**:
1. Client IDs configured in `authService.js`?
2. OAuth consent screen configured in Google Cloud Console?
3. Bundle ID matches in app.json and Google Console?
4. Testing on real device or emulator (not Expo Go for production OAuth)?

### "Invalid Client" Error
**Check**:
1. Client ID spelling is correct
2. Bundle identifier matches exactly
3. OAuth consent screen is published
4. Google+ API is enabled

### User Data Not Persisting
**Check**:
1. SecureStore is available (not on web)
2. Not testing in incognito/private mode
3. App not being force-closed during save

## Getting Help

### Check Logs
```bash
# Android logs
adb logcat | grep ReactNativeJS

# Expo logs are shown in terminal
npm start
```

### Enable Debug Mode
In your app, shake device → Enable "Remote JS Debugging"

### Useful Resources
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation Docs](https://reactnavigation.org/)
- [Expo Forums](https://forums.expo.dev/)
- Stack Overflow (tag: expo, react-native)

## Best Practices

1. **Always use --legacy-peer-deps** when installing packages in this project
2. **Clear cache** when weird errors occur
3. **Test Guest Mode first** before testing authentication
4. **Start Android emulator** before running `npm run android`
5. **Use Expo Go** for quick testing
6. **Keep node_modules clean** - reinstall if issues persist

## Quick Checklist Before Running

- [ ] Node modules installed (`npm install --legacy-peer-deps`)
- [ ] babel-preset-expo installed
- [ ] expo-status-bar installed
- [ ] Android emulator running (for Android testing)
- [ ] Metro bundler started (`npm start`)
- [ ] No syntax errors in code

## Emergency Reset

If everything is broken and nothing works:

```bash
# 1. Clean everything
rm -rf node_modules
rm -rf .expo
rm -rf android
rm -rf ios
rm package-lock.json

# 2. Reinstall
npm install --legacy-peer-deps
npm install --save-dev babel-preset-expo
npm install expo-status-bar --legacy-peer-deps

# 3. Start fresh
npm start -- --clear
```

---

**Last Updated**: October 19, 2025
**Status**: Active Development
