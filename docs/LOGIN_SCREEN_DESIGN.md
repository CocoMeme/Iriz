# Login Screen Visual Design

## Screen Layout

```
┌─────────────────────────────────────┐
│                                     │
│  ╔═══════════════════════════════╗  │
│  ║   HEADER (Blue #2196F3)      ║  │
│  ║                               ║  │
│  ║         👁️  Iriz              ║  │
│  ║                               ║  │
│  ║  See the world through sound  ║  │
│  ║    Navigate with confidence   ║  │
│  ║                               ║  │
│  ╚═══════════════════════════════╝  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ CONTENT                       │  │
│  │                               │  │
│  │  Welcome                      │  │
│  │  Sign in to save your history │  │
│  │  sync across devices, and     │  │
│  │  access personalized features │  │
│  │                               │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │  [G] Continue with     │  │  │
│  │  │      Google            │  │  │
│  │  │  (Blue #4285F4)        │  │  │
│  │  └─────────────────────────┘  │  │
│  │                               │  │
│  │  ─────────  or  ─────────     │  │
│  │                               │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │  Continue as Guest     │  │  │
│  │  │  (Outlined Blue)       │  │  │
│  │  └─────────────────────────┘  │  │
│  │                               │  │
│  │  ✓ Real-time text recognition │  │
│  │  ✓ Audio playback of text    │  │
│  │  ✓ Save and review history   │  │
│  │                               │  │
│  └───────────────────────────────┘  │
│                                     │
│  ╔═══════════════════════════════╗  │
│  ║ FOOTER                        ║  │
│  ║ By continuing, you agree to   ║  │
│  ║ our Terms and Privacy Policy  ║  │
│  ╚═══════════════════════════════╝  │
│                                     │
└─────────────────────────────────────┘
```

## Color Palette

### Primary Colors
- **Header Background**: `#2196F3` (Material Blue 500)
- **Google Button**: `#4285F4` (Google Blue)
- **Guest Button Border**: `#2196F3` (Material Blue 500)
- **Welcome Title**: `#1976D2` (Material Blue 700)

### Secondary Colors
- **Subtitle Text**: `#E3F2FD` (Material Blue 50)
- **Tagline Text**: `#BBDEFB` (Material Blue 100)
- **Body Text**: `#666666` (Dark Gray)
- **Footer Text**: `#999999` (Light Gray)
- **Divider**: `#E0E0E0` (Very Light Gray)
- **Feature Checkmarks**: `#4CAF50` (Material Green 500)

### Backgrounds
- **Main Background**: `#FFFFFF` (White)
- **Google Icon Container**: `#FFFFFF` (White)
- **Button Disabled**: 60% Opacity

## Typography

### Font Sizes
- **Logo Emoji**: 60px
- **App Title**: 52px (Bold)
- **Welcome Title**: 28px (Bold)
- **Subtitle**: 18px (Italic)
- **Button Text**: 16px (Semi-bold)
- **Description**: 15px (Regular)
- **Tagline**: 14px (Medium)
- **Feature Text**: 14px (Regular)
- **Footer**: 12px (Regular)

### Font Weights
- **Bold**: 700 (Title, Welcome)
- **Semi-bold**: 600 (Buttons, Links)
- **Medium**: 500 (Tagline, Divider)
- **Regular**: 400 (Body, Features)

## Spacing & Layout

### Padding
- **Header**: 40-60px top (platform dependent), 40px bottom, 20px horizontal
- **Content Section**: 30px all sides
- **Buttons**: 16px vertical, 12px horizontal
- **Footer**: 20-30px (platform dependent)

### Margins
- **Logo to Title**: 15px right
- **Title to Subtitle**: 10px bottom
- **Subtitle to Tagline**: 5px bottom
- **Welcome Section**: 20px top, 10px bottom
- **Button Spacing**: 10px between
- **Divider**: 20px vertical
- **Features List**: 30px top
- **Feature Items**: 12px between
- **Google Icon**: 12px right

### Border Radius
- **Header Bottom**: 30px (left and right)
- **Buttons**: 12px
- **Google Icon Container**: 4px

## Shadows & Elevation

### Header
- **Shadow Color**: Black (#000000)
- **Shadow Offset**: 0px horizontal, 4px vertical
- **Shadow Opacity**: 0.1
- **Shadow Radius**: 8px
- **Elevation** (Android): 5

### Google Button
- **Shadow Color**: Google Blue (#4285F4)
- **Shadow Offset**: 0px horizontal, 4px vertical
- **Shadow Opacity**: 0.3
- **Shadow Radius**: 6px
- **Elevation** (Android): 3

## Component Breakdown

### 1. Header Section
**Purpose**: Branding and visual appeal
**Elements**:
- Logo Container (Horizontal flex)
  - Eye emoji (👁️)
  - "Iriz" text
- Subtitle: "See the world through sound"
- Tagline: "Navigate with confidence"

**Styling**:
- Blue background with gradient feel
- Rounded bottom corners
- Centered alignment
- Platform-specific top padding

### 2. Welcome Section
**Purpose**: Onboarding message
**Elements**:
- "Welcome" heading
- Description text explaining benefits

**Styling**:
- Dark blue heading
- Gray body text
- Generous line height (22px)

### 3. Google Sign-In Button
**Purpose**: Primary authentication method
**Elements**:
- White square with blue "G"
- "Continue with Google" text
- Loading spinner (when active)

**Styling**:
- Google brand blue background
- White text
- Rounded corners
- Shadow for depth
- Disabled state at 60% opacity

**States**:
- Normal: Full color, enabled
- Loading: Shows spinner, disabled
- Disabled: Reduced opacity

### 4. Divider
**Purpose**: Visual separation
**Elements**:
- Left line
- "or" text
- Right line

**Styling**:
- Light gray lines
- Gray text
- Flex layout for equal spacing

### 5. Guest Mode Button
**Purpose**: Secondary access method
**Elements**:
- "Continue as Guest" text

**Styling**:
- Outlined style (no fill)
- Blue border (2px)
- Blue text
- Same border radius as Google button

**States**:
- Normal: Full color border
- Disabled: Reduced opacity

### 6. Features List
**Purpose**: Show app capabilities
**Elements**:
- Three feature items
- Green checkmark icon (✓)
- Feature description text

**Styling**:
- Horizontal flex layout
- Green checkmarks
- Gray text
- Even spacing between items

### 7. Footer
**Purpose**: Legal compliance
**Elements**:
- Terms and Privacy links
- Small disclaimer text

**Styling**:
- Centered text
- Small font size
- Blue links
- Platform-specific bottom padding

## Interactions

### Touch Targets
- **Minimum Size**: 44x44 points (iOS standard)
- **Google Button**: Full width, 48px height
- **Guest Button**: Full width, 48px height

### Feedback
- **On Press**: Visual press state
- **Loading**: Activity indicator
- **Error**: Alert dialog
- **Success**: Navigation to Home

### Animations
- **Button Press**: Scale down slightly
- **Loading**: Spinner rotation
- **Success**: Fade out → Navigate

## Accessibility

### ARIA Labels
- Logo: "Iriz app logo"
- Google Button: "Sign in with Google"
- Guest Button: "Continue as guest"

### Contrast Ratios
- **Text on Blue**: 7:1 (AAA)
- **Body Text**: 4.5:1 (AA)
- **Footer Text**: 4.5:1 (AA)

### Screen Reader Support
- Proper heading hierarchy
- Button roles defined
- Loading states announced

### Touch Accessibility
- Large touch targets
- Sufficient spacing
- Clear focus indicators

## Responsive Behavior

### Small Screens (< 375px width)
- Reduce font sizes slightly
- Adjust padding
- Maintain aspect ratios

### Large Screens (> 414px width)
- Max width for content
- Center align
- Increase spacing proportionally

### Landscape Orientation
- Compress header height
- Adjust feature list layout
- Maintain button accessibility

## Platform Differences

### iOS
- **Status Bar**: Transparent over header
- **Safe Area**: Respected at top and bottom
- **Shadows**: Softer appearance
- **Animations**: Spring physics

### Android
- **Status Bar**: Colored to match header
- **Elevation**: Material Design shadows
- **Ripple Effect**: On button press
- **Navigation**: Back button handling

## Design Principles

1. **Clarity**: Clear hierarchy and purpose
2. **Simplicity**: Minimal choices, easy decision
3. **Accessibility**: Works for all users
4. **Trust**: Professional, secure appearance
5. **Speed**: Fast load, quick authentication
6. **Flexibility**: Guest mode for quick access

---

**Design System**: Material Design + iOS Human Interface Guidelines
**Target Platforms**: iOS 13+, Android 8+
**Accessibility Level**: WCAG 2.1 Level AA
