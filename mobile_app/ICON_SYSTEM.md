# 🎨 Icon System Documentation

## Overview
Iriz now uses a centralized icon system powered by `@expo/vector-icons`, replacing emoji icons with professional vector icons.

## Benefits
✅ **Professional appearance** - Vector icons instead of emojis  
✅ **Consistent design** - Unified icon style throughout app  
✅ **Scalable** - Icons work at any size without pixelation  
✅ **Customizable** - Easy to change colors and sizes  
✅ **Accessible** - Better for screen readers and accessibility  
✅ **Cross-platform** - Works identically on iOS and Android  

---

## Icon Component

### Location
`src/components/Icon.js`

### Usage

#### Basic Usage
```javascript
import Icon from '../components/Icon';

<Icon name="camera" size={24} color="#2196F3" />
```

#### With Different Icon Families
```javascript
<Icon 
  name="camera" 
  family="Ionicons"  // Default
  size={24} 
  color="#000" 
/>

<Icon 
  name="delete" 
  family="MaterialIcons" 
  size={24} 
  color="#EF4444" 
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string | required | Icon name from chosen family |
| `size` | number | 24 | Icon size in pixels |
| `color` | string | '#000' | Icon color (hex, rgb, or named) |
| `family` | string | 'Ionicons' | Icon family to use |
| `style` | object | - | Additional styles |

---

## Available Icon Families

The component supports these icon families from `@expo/vector-icons`:

1. **Ionicons** (Default) - Modern, clean iOS-style icons
2. **MaterialIcons** - Google Material Design icons
3. **MaterialCommunityIcons** - Extended Material Design icons
4. **FontAwesome** - Classic FontAwesome icons
5. **FontAwesome5** - FontAwesome 5 icons
6. **Feather** - Simple, beautiful feather icons
7. **AntDesign** - Ant Design icons
8. **Entypo** - Entypo icons

### Finding Icon Names

**Ionicons Directory:**
https://icons.expo.fyi/Index

Search for icons and copy the exact name.

---

## Predefined App Icons

We've created a library of common app icons in `AppIcons` object:

### Navigation Icons
```javascript
import { AppIcons, getAppIcon } from '../components/Icon';

// Use predefined icons
getAppIcon('home', 24, '#2196F3')
getAppIcon('camera', 24, '#2196F3')
getAppIcon('history', 24, '#2196F3')
getAppIcon('settings', 24, '#2196F3')
```

### Complete List

#### Navigation
- `home`, `camera`, `history`, `settings`, `back`, `close`

#### Actions
- `save`, `share`, `delete`, `edit`, `add`, `remove`, `refresh`, `download`, `upload`

#### Media
- `image`, `play`, `pause`, `stop`, `volume`, `volumeMute`

#### UI Elements
- `search`, `filter`, `sort`, `menu`, `more`, `moreVertical`
- `chevronRight`, `chevronLeft`, `chevronDown`, `chevronUp`

#### Status
- `check`, `error`, `warning`, `info`, `success`

#### User
- `user`, `logout`, `login`

#### Camera
- `flash`, `flashOff`, `flip`, `zoomIn`, `zoomOut`

#### Accessibility
- `eye`, `eyeOff`, `ear`

#### Settings
- `toggle`, `notification`, `lock`, `unlock`

#### File
- `document`, `folder`, `file`

#### Network
- `cloud`, `wifi`, `wifiOff`

#### Misc
- `heart`, `star`, `bookmark`, `calendar`, `location`, `link`, `globe`

---

## Implementation Examples

### Settings Screen
```javascript
import Icon from '../components/Icon';

<Icon 
  name="volume-high" 
  family="Ionicons" 
  size={24} 
  color="#2196F3" 
/>
```

### History Screen
```javascript
<Icon 
  name="search" 
  family="Ionicons" 
  size={18} 
  color="#666" 
/>
```

### Buttons
```javascript
<TouchableOpacity style={styles.button}>
  <Icon name="camera" size={20} color="#fff" />
  <Text>Capture</Text>
</TouchableOpacity>
```

---

## Where Icons Are Used

### ✅ Updated Screens

#### Settings Screen
- **Audio & Speech:** `volume-high`, `mic`
- **Camera:** `camera`
- **General:** `phone-portrait`
- **Data Management:** `share-social`, `trash`
- **About:** `information-circle`, `document-text`, `chatbubble-ellipses`
- **Sign Out:** `log-out`
- **Footer:** `eye`

#### History Screen
- **Search:** `search`, `close-circle`
- **Empty State:** `archive-outline`, `camera`
- **Delete:** `trash-outline`
- **No Image Placeholder:** `document-text`

---

## Customization Guide

### Change Icon Color
```javascript
<Icon name="camera" color="#FF0000" />  // Red
<Icon name="camera" color="rgb(255, 0, 0)" />  // RGB
<Icon name="camera" color="red" />  // Named color
```

### Change Icon Size
```javascript
<Icon name="camera" size={16} />  // Small
<Icon name="camera" size={24} />  // Default
<Icon name="camera" size={32} />  // Large
<Icon name="camera" size={48} />  // Extra large
```

### Add Custom Style
```javascript
<Icon 
  name="camera" 
  style={{ 
    marginRight: 10,
    backgroundColor: '#f0f0f0',
    padding: 5,
    borderRadius: 5
  }} 
/>
```

---

## Adding New Icons

### Step 1: Find Icon
Go to https://icons.expo.fyi/ and search for your icon.

### Step 2: Use It
```javascript
<Icon 
  name="heart-outline"  // Copy exact name
  family="Ionicons"     // Note the family
  size={24} 
  color="#E91E63" 
/>
```

### Step 3: Add to AppIcons (Optional)
Edit `src/components/Icon.js`:

```javascript
export const AppIcons = {
  // ... existing icons
  
  // Add your new icon
  favorite: { family: 'Ionicons', name: 'heart' },
  favoriteOutline: { family: 'Ionicons', name: 'heart-outline' },
};
```

---

## Best Practices

### 1. Use Consistent Sizes
```javascript
// Navigation: 24px
<Icon name="home" size={24} />

// Buttons: 20px
<Icon name="save" size={20} />

// Large Features: 32-48px
<Icon name="camera" size={32} />

// Empty States: 64-80px
<Icon name="archive-outline" size={80} />
```

### 2. Color Scheme
```javascript
// Primary Actions
<Icon name="camera" color="#2196F3" />

// Danger Actions
<Icon name="delete" color="#EF4444" />

// Success
<Icon name="check" color="#4CAF50" />

// Neutral
<Icon name="info" color="#666" />

// Disabled
<Icon name="save" color="#CCC" />
```

### 3. Semantic Naming
Use icons that match their function:
- ✅ `camera` for capture
- ✅ `trash` for delete
- ✅ `save` for save
- ❌ Don't use `heart` for save
- ❌ Don't use `star` for delete

---

## Accessibility

Icons are automatically accessible, but add labels for screen readers:

```javascript
<TouchableOpacity 
  accessible={true}
  accessibilityLabel="Delete item"
  accessibilityHint="Removes this item from history"
>
  <Icon name="trash" size={24} color="#EF4444" />
</TouchableOpacity>
```

---

## Performance

Vector icons are:
- ✅ **Lightweight** - Small file size
- ✅ **Cached** - Loaded once, reused
- ✅ **Fast** - Rendered efficiently
- ✅ **Scalable** - No multiple size assets needed

---

## Migration from Emojis

### Before (Emojis)
```javascript
<Text style={styles.icon}>🔊</Text>
<Text style={styles.icon}>📷</Text>
<Text style={styles.icon}>🗑️</Text>
```

### After (Vector Icons)
```javascript
<Icon name="volume-high" size={24} color="#2196F3" />
<Icon name="camera" size={24} color="#2196F3" />
<Icon name="trash" size={24} color="#EF4444" />
```

### Benefits of Migration
1. **Professional** - Icons look native on all devices
2. **Consistent** - Same appearance iOS and Android
3. **Customizable** - Easy to change colors
4. **Scalable** - Works at any size
5. **Accessible** - Better for screen readers

---

## Common Icon Patterns

### List Items
```javascript
<View style={styles.listItem}>
  <Icon name="document-text" size={24} color="#666" />
  <Text>Item Title</Text>
  <Icon name="chevron-forward" size={20} color="#CCC" />
</View>
```

### Button with Icon
```javascript
<TouchableOpacity style={styles.button}>
  <Icon name="save" size={20} color="#fff" />
  <Text style={styles.buttonText}>Save</Text>
</TouchableOpacity>
```

### Icon Button
```javascript
<TouchableOpacity style={styles.iconButton}>
  <Icon name="delete" size={24} color="#EF4444" />
</TouchableOpacity>
```

### Badge with Icon
```javascript
<View style={styles.badge}>
  <Icon name="checkmark-circle" size={16} color="#4CAF50" />
  <Text>Verified</Text>
</View>
```

---

## Troubleshooting

### Icon Not Showing
**Problem:** Icon appears blank or shows "?"
**Solution:** Check icon name spelling and family

### Wrong Icon
**Problem:** Different icon appears
**Solution:** Verify icon name at https://icons.expo.fyi/

### Size Too Large/Small
**Problem:** Icon doesn't fit properly
**Solution:** Adjust `size` prop and container styles

### Color Not Changing
**Problem:** Icon stays same color
**Solution:** Ensure no `tintColor` in styles overriding

---

## Resources

- **Icon Directory:** https://icons.expo.fyi/
- **Expo Vector Icons Docs:** https://docs.expo.dev/guides/icons/
- **Ionicons:** https://ionic.io/ionicons
- **Material Icons:** https://fonts.google.com/icons

---

## Future Enhancements

### Planned Improvements
1. **Icon animations** - Animate icon changes
2. **Icon themes** - Dark mode icon variants
3. **Custom icon set** - Brand-specific icons
4. **Icon library browser** - In-app icon picker

---

## Support

For questions about icons:
1. Check icon directory: https://icons.expo.fyi/
2. Review this documentation
3. Check component code: `src/components/Icon.js`

---

**Icon System:** ✅ Implemented and Production Ready
**Last Updated:** January 2025
