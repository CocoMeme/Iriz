# Assets Directory

This directory contains all app assets including images, icons, fonts, and other media files.

## Required Assets

The following assets need to be added before building the app:

### Icons
- `icon.png` - App icon (1024x1024 px)
- `adaptive-icon.png` - Android adaptive icon (1024x1024 px)
- `favicon.png` - Web favicon (48x48 px)

### Splash Screen
- `splash.png` - Splash screen image (1242x2436 px for best results)

## Icon Specifications

### iOS
- 1024x1024 px PNG
- No transparency
- No rounded corners (iOS handles this)

### Android
- 1024x1024 px PNG
- Can include transparency
- Should work on various background colors

### Web
- 48x48 px PNG
- For browser tabs and bookmarks

## Splash Screen

- Recommended size: 1242x2436 px (iPhone 11 Pro Max resolution)
- Will be automatically scaled for different devices
- Use simple design with app logo/branding
- Background color: #ffffff (white)

## Generating Assets

You can generate all required assets from a single high-resolution image using:

```bash
npx expo-optimize
```

Or use online tools like:
- [App Icon Generator](https://appicon.co/)
- [Expo Assets](https://docs.expo.dev/guides/app-icons/)

## Temporary Placeholders

For development, you can create simple placeholder images:
- Use solid colors with text labels
- Ensure correct dimensions
- Name files exactly as specified above

## Adding Custom Assets

Additional assets can be organized in subdirectories:
- `assets/images/` - UI images
- `assets/fonts/` - Custom fonts
- `assets/sounds/` - Audio files

Remember to update `app.json` if you change asset locations.
