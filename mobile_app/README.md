# Iriz Mobile App

Cross-platform mobile application for the Iriz Signboard Reader system, built with Expo and React Native.

## Features

- 📸 Camera capture with visual guides
- 🔍 OCR text extraction (integration ready)
- 🔊 Text-to-speech playback
- 💾 Offline storage with SQLite
- 📚 History management
- ⚙️ Customizable settings
- 🔐 Google OAuth authentication
- 👤 Guest mode for quick access

## Project Structure

```
mobile_app/
├── App.js                 # Main app entry with navigation
├── app.json              # Expo configuration
├── babel.config.js       # Babel configuration
├── package.json          # Dependencies
├── src/
│   ├── screens/         # Screen components
│   │   ├── LoginScreen.js
│   │   ├── HomeScreen.js
│   │   ├── CameraScreen.js
│   │   ├── ResultScreen.js
│   │   ├── HistoryScreen.js
│   │   └── SettingsScreen.js
│   ├── components/      # Reusable components
│   ├── services/        # API and service integrations
│   └── utils/           # Helper functions
└── assets/              # Images, icons, fonts
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on platforms:
```bash
npm run android  # Android
npm run ios      # iOS
npm run web      # Web
```

## Screens

### LoginScreen
- Google OAuth authentication with Expo Auth Session
- Guest mode for immediate access
- Modern, accessible UI design
- Secure token storage with Expo SecureStore
- Auto-redirect after successful authentication

### HomeScreen
- Quick capture button
- Access to history, settings, help
- Usage tips and information

### CameraScreen
- Live camera preview
- Frame guides for alignment
- Camera flip option
- Capture with processing feedback

### ResultScreen
- Display captured image
- Show extracted text
- Text-to-speech playback
- Save and share options

### HistoryScreen
- List of past captures
- View/replay previous results
- Delete individual or all items

### SettingsScreen
- Audio preferences
- Storage options
- Camera quality settings
- Account management
- App information

## Dependencies

Key packages used:
- `expo` - Development framework
- `react-navigation` - Navigation
- `expo-camera` - Camera access
- `expo-av` - Text-to-speech
- `expo-sqlite` - Local storage
- `expo-auth-session` - OAuth authentication flow
- `expo-web-browser` - OAuth browser handling
- `expo-secure-store` - Secure credential storage
- `@react-native-google-signin/google-signin` - Google Sign-In SDK

## Development Status

✅ **Completed:**
- UI/UX for all screens
- Navigation setup
- Camera integration
- Text-to-speech functionality
- Basic history management
- Google OAuth authentication flow
- Secure credential storage

🔄 **In Progress:**
- OCR integration
- SQLite database implementation
- Backend API integration for user sync

📅 **Planned:**
- Backend API integration
- Real OCR processing
- Cloud sync features

## Configuration

### App Configuration

Edit `app.json` to customize:
- App name and version
- Bundle identifiers
- Permissions
- Icons and splash screens
- URL scheme for OAuth redirects

### Google OAuth Setup

To enable Google Sign-In, you need to configure OAuth credentials:

1. Follow the detailed setup guide in `GOOGLE_AUTH_SETUP.md`
2. Create OAuth credentials in Google Cloud Console
3. Update client IDs in `src/services/authService.js`
4. Configure redirect URIs for your Expo project

Quick setup:
```javascript
// In src/services/authService.js
const GOOGLE_CLIENT_ID_ANDROID = 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_CLIENT_ID_IOS = 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_CLIENT_ID_WEB = 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com';
```

See `GOOGLE_AUTH_SETUP.md` for complete instructions.

## Testing

The app can be tested in:
- Expo Go app (iOS/Android)
- iOS Simulator
- Android Emulator
- Web browser

## Notes

- Camera features require physical device or appropriate emulator setup
- Text-to-speech uses native platform engines
- Offline-first architecture for accessibility
- All screens follow accessibility guidelines

## Next Steps

1. Configure Google OAuth credentials (see `GOOGLE_AUTH_SETUP.md`)
2. Integrate Tesseract OCR
3. Implement SQLite storage
4. Connect to backend API for user data sync
5. Enhanced error handling
6. Performance optimization
7. Add analytics and crash reporting

---

**Built with ❤️ for accessibility**
