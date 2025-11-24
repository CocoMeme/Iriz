# Profile System - Architecture & Flow Diagrams

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     PROFILE SYSTEM ARCHITECTURE                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              PERSISTENT STORAGE LAYER                    │   │
│  │  AsyncStorage: @iriz_user_profile (JSON)               │   │
│  │  {name, email, phone}                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                             △                                    │
│                             │                                    │
│                 ┌───────────┴───────────┐                       │
│                 │                       │                       │
│  ┌──────────────▼─────────┐  ┌─────────▼──────────────────┐   │
│  │   PROFILE SERVICE      │  │    IMAGE PICKER            │   │
│  ├────────────────────────┤  ├────────────────────────────┤   │
│  │ • saveProfile()        │  │ • expo-image-picker        │   │
│  │ • loadProfile()        │  │ • Photo selection          │   │
│  │ • updateProfile()      │  │ • Permissions handling     │   │
│  │ • clearProfile()       │  │ • Image quality control    │   │
│  │ • validateProfile()    │  │                            │   │
│  │ • getInitials()        │  │ (Backend storage ready)    │   │
│  │ • getFirstName()       │  │                            │   │
│  └──────────┬──────────────┘  └────────────────────────────┘   │
│             │                                                    │
│  ┌──────────┴──────────────────────────────────────┐            │
│  │          UI LAYER - SCREENS                     │            │
│  ├───────────────────────────────────────────────────┤          │
│  │                                                   │          │
│  │  EditProfileScreen      AccountScreen  HomeScreen│          │
│  │  ┌──────────────┐      ┌──────────┐   ┌────────┐│          │
│  │  │ • Load       │      │ • Load   │   │ • Load ││          │
│  │  │ • Display    │      │ • Show   │   │ • Show ││          │
│  │  │ • Edit       │      │ • Dynamic│   │ • Name ││          │
│  │  │ • Validate   │      │ • Avatar │   │ in     ││          │
│  │  │ • Save       │      │ • Sync   │   │ Greeting         │
│  │  │ • Photo      │      │ • Edit   │   │        ││          │
│  │  │   Picker     │      │   link   │   │        ││          │
│  │  └──────────────┘      └──────────┘   └────────┘│          │
│  │                                                   │          │
│  └───────────────────────────────────────────────────┘          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow: Edit → Save → Display

```
USER INTERACTION
        │
        ▼
┌─────────────────────────┐
│ EditProfileScreen Mounts│
│ useFocusEffect triggers │
└────────────┬────────────┘
             │
             ▼
    ┌────────────────┐
    │ loadProfileData│
    │ isLoading=true │
    └────────┬───────┘
             │
             ▼
  ┌──────────────────────┐
  │ profileService.load()│
  │ (AsyncStorage GET)   │
  └────────┬─────────────┘
           │
           ▼
    ┌────────────────┐
    │ Return profile │
    │ isLoading=false│
    └────────┬───────┘
             │
             ▼
  ┌──────────────────────┐
  │ Form displays with   │
  │ current values       │
  │ e.g., "Iriz User"   │
  └──────────┬───────────┘
             │
      [USER EDITS TEXT]
             │
             ▼
  ┌──────────────────────┐
  │ setProfile updates   │
  │ local state          │
  │ e.g., "John Smith"   │
  └──────────┬───────────┘
             │
      [USER TAPS SAVE]
             │
             ▼
  ┌──────────────────────┐
  │ validateProfile()    │
  │ checks:              │
  │ • name: required     │
  │ • email: valid       │
  │ • phone: format      │
  └────────┬─────────────┘
           │
      ┌────┴────┐
      │          │
   VALID      INVALID
      │          │
      ▼          ▼
  [SAVE]   ┌──────────────┐
      │    │ Show error   │
      │    │ alert        │
      │    │ Return       │
      │    └──────────────┘
      │
      ▼
  isSaving=true
  ┌──────────────────────┐
  │ profileService.save()│
  │ (AsyncStorage SET)   │
  └────────┬─────────────┘
           │
           ▼
    ┌────────────────┐
    │ Success alert  │
    │ isSaving=false │
    └────────┬───────┘
             │
             ▼
  ┌──────────────────────┐
  │ navigation.goBack()  │
  │ Return to Account    │
  └──────────┬───────────┘
             │
             ▼
  ┌──────────────────────┐
  │ AccountScreen        │
  │ useFocusEffect FIRES │
  └────────┬─────────────┘
           │
           ▼
    ┌────────────────┐
    │ loadProfileData│
    └────────┬───────┘
             │
             ▼
  ┌──────────────────────┐
  │ Get profile from     │
  │ AsyncStorage         │
  │ {name:"John Smith"}  │
  └────────┬─────────────┘
           │
           ▼
  ┌──────────────────────┐
  │ Display updates:     │
  │ • Avatar: "JS"       │
  │ • Name: "John Smith" │
  │ • Email: "[email]"   │
  └────────┬─────────────┘
           │
           ▼
  [IF USER GOES TO HOME]
           │
           ▼
  ┌──────────────────────┐
  │ HomeScreen           │
  │ useFocusEffect FIRES │
  └────────┬─────────────┘
           │
           ▼
    ┌────────────────┐
    │ loadUserName() │
    └────────┬───────┘
             │
             ▼
  ┌──────────────────────┐
  │ Get profile from     │
  │ AsyncStorage         │
  │ name="John Smith"    │
  └────────┬─────────────┘
           │
           ▼
  ┌──────────────────────┐
  │ UserInfo gets        │
  │ name="John Smith"    │
  │ Shows:               │
  │ "Good day, John"     │
  └──────────────────────┘
```

---

## 🔄 State Management Flow

```
LOCAL STATE                         PERSISTENT STATE
(EditProfileScreen)                 (AsyncStorage)
    │                                    │
    ├─ profile                          ├─ @iriz_user_profile
    │  {name, email, phone}             │  JSON string
    │                                    │
    ├─ isLoading                        │
    │  boolean                           │
    │                                    │
    └─ isSaving                         └─ (survives app restart)
       boolean


ASYNC OPERATIONS
════════════════════════════════════════════════════════════

┌─ useFocusEffect ─┐
│                  │ ← Triggers when screen becomes visible
│ loadProfileData()│
│                  │
└──────┬───────────┘
       │
       ▼
┌──────────────────────────┐
│ profileService.loadProfile()
│                          │
│ Try:                     │
│  1. Get from AsyncStorage│
│  2. Parse JSON           │
│  3. Return data          │
│                          │
│ Catch:                   │
│  1. Log error            │
│  2. Return default       │
│  3. Show alert           │
└──────────────────────────┘
```

---

## 🎯 Component Lifecycle

### EditProfileScreen Lifecycle
```
MOUNT
  │
  ├─ useFocusEffect registered
  │
  └─ Initial render with defaults
      {name: 'Iriz User', ...}

FOCUS (user navigates to screen)
  │
  ├─ useFocusEffect triggers
  │  ├─ setIsLoading(true)
  │  └─ loadProfile()
  │
  ├─ Async operation
  │  └─ Fetch from AsyncStorage
  │
  ├─ Update state
  │  ├─ setProfile(savedProfile)
  │  └─ setIsLoading(false)
  │
  └─ Re-render with actual data
     {name: 'John Smith', ...}

USER INTERACTION
  │
  ├─ onChangeText updates profile state
  │  └─ Re-render in real-time
  │
  └─ onPress handlers triggered

SAVE
  │
  ├─ validation check
  │  ├─ setIsSaving(true)
  │  ├─ saveProfile()
  │  ├─ setIsSaving(false)
  │  └─ Show alert
  │
  └─ navigation.goBack()

BLUR (user navigates away)
  │
  └─ Component stays in memory
     (React Navigation keeps it)

FOCUS (user returns)
  │
  └─ useFocusEffect triggers again
     Loads fresh data from AsyncStorage
```

---

## 🔌 Service Layer Architecture

```
┌────────────────────────────────────────────────────────┐
│          profileService.js (Service Layer)             │
├────────────────────────────────────────────────────────┤
│                                                         │
│  STORAGE OPERATIONS                                    │
│  ├─ saveProfile(profile)                              │
│  │  └─ AsyncStorage.setItem()                         │
│  │                                                    │
│  ├─ loadProfile()                                     │
│  │  └─ AsyncStorage.getItem()                        │
│  │                                                    │
│  ├─ clearProfile()                                    │
│  │  └─ AsyncStorage.removeItem()                     │
│  │                                                    │
│  └─ updateProfile(updates)                           │
│     ├─ loadProfile()                                 │
│     ├─ merge updates                                 │
│     └─ saveProfile()                                 │
│                                                       │
│  HELPER OPERATIONS                                    │
│  ├─ validateProfile(profile)                         │
│  │  └─ Returns {isValid, errors}                     │
│  │                                                   │
│  ├─ getProfileInitials()                             │
│  │  └─ Returns "IU" from "Iriz User"                 │
│  │                                                   │
│  └─ getProfileFirstName()                            │
│     └─ Returns "Iriz" from "Iriz User"               │
│                                                       │
└────────────────────────────────────────────────────────┘
         │                    │                │
         │                    │                │
         ▼                    ▼                ▼
   EditProfileScreen   AccountScreen    HomeScreen
```

---

## 🎨 UI Update Flow

```
Profile Data Changes in AsyncStorage
        │
        ├─ AccountScreen focuses
        │  ├─ useFocusEffect triggers
        │  ├─ loadProfile() called
        │  ├─ setProfile(newData)
        │  └─ Re-render
        │     ├─ Avatar: Initials update
        │     ├─ Name: Updates
        │     └─ Email: Updates
        │
        ├─ HomeScreen focuses
        │  ├─ useFocusEffect triggers
        │  ├─ loadUserName() called
        │  ├─ setUserName(newName)
        │  └─ Re-render
        │     └─ UserInfo component updates
        │        └─ Greeting: "Good day, [New Name]"
        │
        └─ EditProfileScreen focuses
           ├─ useFocusEffect triggers
           ├─ loadProfile() called
           ├─ setProfile(newData)
           └─ Re-render
              └─ Form fields show latest data
```

---

## 📋 Validation Flow

```
User Input
   │
   ├─ "John Smith" (name)
   │  └─ Non-empty? YES ✓
   │
   ├─ "john@example.com" (email)
   │  ├─ Non-empty? YES ✓
   │  ├─ Contains @? YES ✓
   │  ├─ Has domain? YES ✓
   │  └─ Passes regex? YES ✓
   │
   └─ "+1 (555) 123-4567" (phone)
      ├─ Optional field? YES
      ├─ Provided? YES
      ├─ Valid format? YES ✓
      └─ Passes regex? YES ✓

         ▼
    ┌────────────┐
    │ isValid=   │
    │ TRUE       │
    └────┬───────┘
         │
         ▼
    [CAN SAVE]
```

---

## ⚡ Error Handling Flow

```
Async Operation
   │
   ├─ TRY BLOCK
   │  │
   │  ├─ AsyncStorage call
   │  ├─ JSON parse/stringify
   │  └─ State update
   │
   ├─ CATCH BLOCK
   │  │
   │  ├─ Log to console
   │  │  console.error(error)
   │  │
   │  ├─ Show user alert
   │  │  Alert.alert('Error', message)
   │  │
   │  └─ Fallback/retry
   │     └─ Return default or state
   │
   └─ FINALLY BLOCK
      │
      ├─ setIsLoading(false)
      ├─ setIsSaving(false)
      └─ Stop showing spinners
```

---

## 🎯 Key Design Patterns

### Pattern 1: Load on Focus
```javascript
useFocusEffect(
  React.useCallback(() => {
    loadData();  // Fresh data every time screen shows
  }, [])
);
```

### Pattern 2: Validate Before Save
```javascript
const validation = validateProfile(profile);
if (!validation.isValid) {
  showError(validation.errors);
  return;  // Don't save
}
saveProfile(profile);
```

### Pattern 3: Loading States
```javascript
setIsLoading(true);           // Show spinner
await asyncOperation();        // Do work
setIsLoading(false);          // Hide spinner
```

### Pattern 4: Error Recovery
```javascript
try {
  // Operation
} catch (error) {
  console.error(error);
  Alert.alert('Error', 'Please try again');
  // User can retry
}
```

---

## 🔗 Integration Points

```
External Systems:
    │
    ├─ AsyncStorage
    │  └─ Persistent data storage
    │
    ├─ expo-image-picker
    │  └─ Photo selection
    │
    ├─ react-navigation
    │  └─ Screen navigation & focus
    │
    └─ react-native
       └─ UI components (TextInput, Alert, etc)


Internal Connections:
    │
    ├─ EditProfileScreen ←→ profileService
    │  └─ Load, save, validate
    │
    ├─ AccountScreen ←→ profileService
    │  └─ Load and display
    │
    ├─ HomeScreen ←→ profileService
    │  └─ Load name
    │
    └─ profileService ←→ AsyncStorage
       └─ Persist data
```

---

This architecture ensures:
- ✅ Single source of truth (AsyncStorage)
- ✅ Consistent data across screens
- ✅ Proper error handling
- ✅ Good performance
- ✅ Easy to test
- ✅ Easy to extend
