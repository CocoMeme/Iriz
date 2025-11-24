# Profile Functionality - Quick Reference

## What's New

### ✅ Service Layer
- `profileService.js` - Handles all profile operations
- AsyncStorage integration - Persistent data storage
- Validation logic - Email & phone format checking
- Helper functions - Initials, first name extraction

### ✅ EditProfileScreen
- Full form functionality with real data loading
- Save/Cancel with proper state management
- Loading and saving indicators
- Form validation with error messages
- Image picker for photo (UI ready, backend pending)
- Dynamic avatar with user initials

### ✅ AccountScreen
- Displays actual user profile data (not hardcoded)
- Avatar initials update with name changes
- Shows real email address
- Real-time updates when edited profile saved

### ✅ HomeScreen
- Greeting uses real user name (not hardcoded "Iriz User")
- Updates when profile is edited
- Shows in "Good day, [First Name]" format

## AsyncStorage Keys Used

| Key | Purpose | Example Value |
|-----|---------|----------------|
| `@iriz_user_profile` | User profile data | `{"name":"John","email":"john@ex.com","phone":"+1..."}` |
| `@iriz_settings` | App settings | `{"autoSpeak":true,"vibration":true,...}` |
| `@iriz_show_landing` | Landing page toggle | `"false"` |

## Component Data Flow

```
EditProfileScreen
  └─ loads profile from AsyncStorage
  └─ displays in form
  └─ user edits
  └─ saves to AsyncStorage
       ├─ AccountScreen notices focus change
       │   └─ reloads profile
       │   └─ updates display
       └─ HomeScreen notices focus change
           └─ reloads user name
           └─ updates greeting
```

## Function Hierarchy

```
profileService.js
├─ saveProfile(profile)
├─ loadProfile()
├─ updateProfile(updates)
├─ clearProfile()
├─ getProfileInitials()
├─ getProfileFirstName()
└─ validateProfile(profile)
     └─ returns {isValid, errors[]}

EditProfileScreen
├─ loadProfileData()
│  └─ await loadProfile()
├─ handleSave()
│  ├─ validateProfile()
│  └─ await saveProfile()
└─ handleChangePhoto()
   └─ ImagePicker.launchImageLibraryAsync()

AccountScreen
└─ loadProfileData()
   └─ await loadProfile()

HomeScreen
└─ loadUserName()
   └─ await loadProfile()
```

## Testing Workflow

1. **First Launch**
   - ProfileScreen shows default values
   - HomeScreen greeting: "Good day, Iriz"
   - AccountScreen name: "Iriz User"

2. **Edit Profile**
   - Change name to "John Smith"
   - Change email to "john@example.com"
   - Tap Save → Success alert

3. **Verify Changes**
   - AccountScreen shows "John Smith" with avatar "JS"
   - HomeScreen shows "Good day, John"
   - Data persists after closing app

4. **Edit Again**
   - Change name to "Jane Doe"
   - Verify avatar changes to "JD"
   - All screens update automatically

## Files Modified

| File | Changes |
|------|---------|
| `src/services/profileService.js` | ✨ NEW - Profile data service |
| `src/services/index.js` | Added profileService export |
| `src/screens/AccountScreens/EditProfileScreen.js` | Full functionality + validation + AsyncStorage |
| `src/screens/AccountScreens/AccountScreen.js` | Dynamic profile display + focus listener |
| `src/screens/HomeScreens/HomeScreen.js` | Dynamic user name + focus listener |

## Error Handling

All functions include:
- ✅ Try-catch blocks
- ✅ Console error logging
- ✅ User-friendly alerts
- ✅ Graceful fallbacks to defaults

## Performance Optimizations

- ✅ `useFocusEffect` only reloads when screen is visible
- ✅ Local state to avoid excessive re-renders
- ✅ Minimal AsyncStorage reads (only on focus)
- ✅ Efficient initials calculation

## Next Steps (Optional)

1. Implement photo storage
   - Save image to file system
   - Display in avatar instead of initials
   - Compress before storage

2. Backend integration
   - Sync profile with API
   - Cloud backup
   - Multi-device sync

3. Enhanced validation
   - Phone number formatting
   - Name length limits
   - Special character handling

4. Additional fields
   - Bio/about section
   - Social media links
   - Language preferences
