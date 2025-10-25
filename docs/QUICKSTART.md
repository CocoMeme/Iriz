# Quick Start Guide - Iriz Mobile App

## Prerequisites

Before you begin, ensure you have:
- ✅ Node.js 18+ installed
- ✅ npm or yarn package manager
- ✅ Expo Go app on your phone (for testing)
- ✅ Android Studio or Xcode (for emulators)

## Installation

### 1. Install Dependencies

```powershell
cd mobile_app
npm install
```

This will install all required packages including:
- Expo SDK 51
- React Navigation
- Camera and Audio libraries
- SQLite and SecureStore
- And more...

### 2. Create Placeholder Assets

Before running, create simple placeholder images in the `assets/` folder:

**Quick way (using any image editor):**
- `icon.png` - 1024x1024 px solid color with "Iriz" text
- `splash.png` - 1242x2436 px with app branding
- `favicon.png` - 48x48 px simple icon
- `adaptive-icon.png` - 1024x1024 px for Android

**Or use online generators:**
- Visit https://appicon.co/
- Upload a logo or create a simple one
- Download all required sizes

## Running the App

### Start Development Server

```powershell
npm start
```

This will:
1. Start the Expo development server
2. Open the Expo DevTools in your browser
3. Display QR codes for testing

### Test on Physical Device (Recommended for Camera)

1. Install **Expo Go** from App Store (iOS) or Play Store (Android)
2. Scan the QR code shown in terminal or browser
3. App will load on your device

### Test on Emulator

**Android:**
```powershell
npm run android
```

**iOS (Mac only):**
```powershell
npm run ios
```

**Web (limited features):**
```powershell
npm run web
```

## Testing the Features

### 1. Login Screen
- Opens automatically on first launch
- Try "Continue with Google" (will be mock login for now)
- Or click "Continue as Guest"

### 2. Home Screen
- See the main dashboard
- Explore quick action cards
- Read the usage tips

### 3. Camera Screen ⭐
- Tap "Capture Signboard" on home
- Allow camera permissions when prompted
- Point at any text/signboard
- Tap the white capture button
- Wait for processing (2 seconds simulation)

### 4. Result Screen
- View captured image
- See extracted text (currently mock data)
- Tap speaker icon to hear text-to-speech
- Try Save and Share buttons
- Navigate back or to home

### 5. History Screen
- View list of captures (mock data for now)
- Tap any item to view details
- Try deleting items
- Test "Clear All" function

### 6. Settings Screen
- Toggle various settings
- Try different options
- Logout and return to login

## Known Limitations (Phase 1)

### Currently Using Mock Data
- ✅ UI/UX fully functional
- ✅ Camera capture works
- ✅ Text-to-speech works
- ⏳ OCR returns mock text (integration pending)
- ⏳ History is temporary (SQLite pending)
- ⏳ Auth is simulated (OAuth pending)
- ⏳ No backend connection yet

### These Will Be Implemented in Phase 2
- Real OCR processing with Tesseract
- Persistent SQLite database
- Google OAuth authentication
- Backend API integration
- Cloud synchronization

## Troubleshooting

### Camera Not Working
- **Physical Device:** Ensure camera permissions granted
- **Emulator:** Camera may not work in all emulators
- **Solution:** Test on physical device for best results

### App Won't Start
```powershell
# Clear cache and reinstall
rm -rf node_modules
npm install
npm start -- --clear
```

### Metro Bundler Issues
```powershell
# Kill port and restart
npx react-native start --reset-cache
```

### Dependencies Errors
```powershell
# Check Node version
node --version  # Should be 18+

# Update npm
npm install -g npm@latest

# Reinstall Expo CLI
npm install -g expo-cli
```

## File Structure Overview

```
mobile_app/
├── App.js              # 🚀 START HERE - Main app entry
├── app.json            # Expo configuration
├── package.json        # Dependencies list
│
├── src/
│   ├── screens/       # All 6 screens
│   ├── services/      # Backend services
│   └── utils/         # Helper functions
│
└── assets/            # Images and icons
```

## Development Workflow

### Making Changes

1. **Edit Files**
   - Open any `.js` file in `src/`
   - Make your changes
   - Save the file

2. **See Updates**
   - App automatically reloads
   - Or shake device and tap "Reload"

3. **Debug**
   - Shake device → "Debug Remote JS"
   - Or use React DevTools in browser
   - Console logs appear in terminal

### Adding New Features

1. **New Screen**
   - Create file in `src/screens/`
   - Add to navigation in `App.js`
   - Import and add route

2. **New Service**
   - Create file in `src/services/`
   - Export functions
   - Import where needed

3. **New Component**
   - Create file in `src/components/`
   - Make reusable
   - Export and import

## Testing Checklist

- [ ] App launches without errors
- [ ] Navigation works between screens
- [ ] Camera opens and captures
- [ ] Text-to-speech plays
- [ ] Settings toggles work
- [ ] History displays items
- [ ] No console errors
- [ ] Smooth animations

## Performance Tips

### Device
- Use physical device for camera features
- Enable Developer Mode for better debugging
- Keep device plugged in during development

### Code
- Check React DevTools for re-renders
- Monitor console for warnings
- Test on lower-end devices too

## Next Steps

Once everything is working:

1. **Add Real Assets**
   - Replace placeholder images
   - Add custom fonts if needed
   - Include sound effects

2. **Integrate OCR**
   - Follow docs/setup_guide.md
   - Test with various images
   - Tune confidence thresholds

3. **Connect Backend**
   - Update API_BASE_URL in constants.js
   - Test API endpoints
   - Handle errors gracefully

4. **Deploy**
   - Build APK for Android
   - Submit to App Stores
   - Set up CI/CD pipeline

## Helpful Commands

```powershell
# Start dev server
npm start

# Clear cache
npm start -- --clear

# Check for issues
npm run lint

# View dependencies
npm list

# Update packages
npm update

# Install specific package
npm install package-name
```

## Resources

- [Expo Docs](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Docs](https://reactnative.dev/)
- [Expo Camera](https://docs.expo.dev/versions/latest/sdk/camera/)

## Getting Help

If you encounter issues:

1. Check console logs for errors
2. Read error messages carefully
3. Search Expo documentation
4. Check GitHub issues
5. Review IMPLEMENTATION.md for details

---

## Summary

✅ **You now have a fully functional mobile app UI with:**
- 6 complete screens
- Camera integration
- Text-to-speech
- Navigation system
- Service architecture
- Ready for backend integration

🚀 **Run `npm start` to begin!**

---

**Happy Coding! 👁️📱**
