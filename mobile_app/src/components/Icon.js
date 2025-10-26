/**
 * Icon Component
 * Centralized icon system using Expo Vector Icons
 * Supports multiple icon families with consistent API
 */

import React from 'react';
import { 
  Ionicons, 
  MaterialIcons, 
  MaterialCommunityIcons,
  FontAwesome,
  FontAwesome5,
  Feather,
  AntDesign,
  Entypo,
} from '@expo/vector-icons';

/**
 * Icon component with support for multiple icon families
 * @param {Object} props
 * @param {string} props.name - Icon name
 * @param {number} props.size - Icon size (default: 24)
 * @param {string} props.color - Icon color (default: '#000')
 * @param {string} props.family - Icon family (default: 'Ionicons')
 * @param {Object} props.style - Additional styles
 */
export default function Icon({ 
  name, 
  size = 24, 
  color = '#000', 
  family = 'Ionicons',
  style,
  ...props 
}) {
  const iconProps = {
    name,
    size,
    color,
    style,
    ...props,
  };

  switch (family) {
    case 'MaterialIcons':
      return <MaterialIcons {...iconProps} />;
    case 'MaterialCommunityIcons':
      return <MaterialCommunityIcons {...iconProps} />;
    case 'FontAwesome':
      return <FontAwesome {...iconProps} />;
    case 'FontAwesome5':
      return <FontAwesome5 {...iconProps} />;
    case 'Feather':
      return <Feather {...iconProps} />;
    case 'AntDesign':
      return <AntDesign {...iconProps} />;
    case 'Entypo':
      return <Entypo {...iconProps} />;
    case 'Ionicons':
    default:
      return <Ionicons {...iconProps} />;
  }
}

// Export icon families for direct use
export {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome,
  FontAwesome5,
  Feather,
  AntDesign,
  Entypo,
};

// Predefined app icons for consistency
export const AppIcons = {
  // Navigation
  home: { family: 'Ionicons', name: 'home' },
  camera: { family: 'Ionicons', name: 'camera' },
  history: { family: 'Ionicons', name: 'time' },
  settings: { family: 'Ionicons', name: 'settings' },
  back: { family: 'Ionicons', name: 'arrow-back' },
  close: { family: 'Ionicons', name: 'close' },
  
  // Actions
  save: { family: 'Ionicons', name: 'save' },
  share: { family: 'Ionicons', name: 'share-social' },
  delete: { family: 'Ionicons', name: 'trash' },
  edit: { family: 'Ionicons', name: 'create' },
  add: { family: 'Ionicons', name: 'add' },
  remove: { family: 'Ionicons', name: 'remove' },
  refresh: { family: 'Ionicons', name: 'refresh' },
  download: { family: 'Ionicons', name: 'download' },
  upload: { family: 'Ionicons', name: 'cloud-upload' },
  
  // Media
  image: { family: 'Ionicons', name: 'image' },
  play: { family: 'Ionicons', name: 'play' },
  pause: { family: 'Ionicons', name: 'pause' },
  stop: { family: 'Ionicons', name: 'stop' },
  volume: { family: 'Ionicons', name: 'volume-high' },
  volumeMute: { family: 'Ionicons', name: 'volume-mute' },
  
  // UI Elements
  search: { family: 'Ionicons', name: 'search' },
  filter: { family: 'Ionicons', name: 'filter' },
  sort: { family: 'Ionicons', name: 'swap-vertical' },
  menu: { family: 'Ionicons', name: 'menu' },
  more: { family: 'Ionicons', name: 'ellipsis-horizontal' },
  moreVertical: { family: 'Ionicons', name: 'ellipsis-vertical' },
  chevronRight: { family: 'Ionicons', name: 'chevron-forward' },
  chevronLeft: { family: 'Ionicons', name: 'chevron-back' },
  chevronDown: { family: 'Ionicons', name: 'chevron-down' },
  chevronUp: { family: 'Ionicons', name: 'chevron-up' },
  
  // Status
  check: { family: 'Ionicons', name: 'checkmark-circle' },
  error: { family: 'Ionicons', name: 'close-circle' },
  warning: { family: 'Ionicons', name: 'warning' },
  info: { family: 'Ionicons', name: 'information-circle' },
  success: { family: 'Ionicons', name: 'checkmark-circle' },
  
  // User
  user: { family: 'Ionicons', name: 'person' },
  logout: { family: 'Ionicons', name: 'log-out' },
  login: { family: 'Ionicons', name: 'log-in' },
  
  // Camera
  flash: { family: 'Ionicons', name: 'flash' },
  flashOff: { family: 'Ionicons', name: 'flash-off' },
  flip: { family: 'Ionicons', name: 'camera-reverse' },
  zoomIn: { family: 'Ionicons', name: 'add-circle' },
  zoomOut: { family: 'Ionicons', name: 'remove-circle' },
  
  // Accessibility
  eye: { family: 'Ionicons', name: 'eye' },
  eyeOff: { family: 'Ionicons', name: 'eye-off' },
  ear: { family: 'Ionicons', name: 'ear' },
  
  // Settings
  toggle: { family: 'Ionicons', name: 'toggle' },
  notification: { family: 'Ionicons', name: 'notifications' },
  lock: { family: 'Ionicons', name: 'lock-closed' },
  unlock: { family: 'Ionicons', name: 'lock-open' },
  
  // File
  document: { family: 'Ionicons', name: 'document-text' },
  folder: { family: 'Ionicons', name: 'folder' },
  file: { family: 'Ionicons', name: 'document' },
  
  // Network
  cloud: { family: 'Ionicons', name: 'cloud' },
  wifi: { family: 'Ionicons', name: 'wifi' },
  wifiOff: { family: 'Ionicons', name: 'wifi-off' },
  
  // Misc
  heart: { family: 'Ionicons', name: 'heart' },
  star: { family: 'Ionicons', name: 'star' },
  bookmark: { family: 'Ionicons', name: 'bookmark' },
  calendar: { family: 'Ionicons', name: 'calendar' },
  location: { family: 'Ionicons', name: 'location' },
  link: { family: 'Ionicons', name: 'link' },
  globe: { family: 'Ionicons', name: 'globe' },
};

/**
 * Helper function to get app icon
 * @param {string} iconKey - Key from AppIcons
 * @param {number} size - Icon size
 * @param {string} color - Icon color
 */
export const getAppIcon = (iconKey, size = 24, color = '#000') => {
  const iconConfig = AppIcons[iconKey];
  if (!iconConfig) {
    console.warn(`Icon "${iconKey}" not found in AppIcons`);
    return null;
  }
  
  return (
    <Icon 
      name={iconConfig.name}
      family={iconConfig.family}
      size={size}
      color={color}
    />
  );
};
