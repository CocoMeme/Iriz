/**
 * Application Constants
 */

export const APP_NAME = 'Iriz';
export const APP_VERSION = '1.0.0';
export const APP_TAGLINE = 'See the world through sound';

// API Configuration
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:5000/api'
  : 'https://api.iriz.app/api';

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  SETTINGS: 'app_settings',
};

// Default Settings
export const DEFAULT_SETTINGS = {
  autoSpeak: true,
  saveHistory: true,
  offlineMode: true,
  highQuality: false,
  vibration: true,
  language: 'en',
  speechRate: 1.0,
  speechPitch: 1.0,
};

// Camera Settings
export const CAMERA_QUALITY = {
  LOW: 0.5,
  MEDIUM: 0.7,
  HIGH: 0.9,
};

// OCR Settings
export const OCR_LANGUAGES = ['eng', 'spa', 'fra', 'deu', 'ita'];

// Error Messages
export const ERROR_MESSAGES = {
  CAMERA_PERMISSION: 'Camera permission is required to capture signboards',
  OCR_FAILED: 'Failed to extract text from image',
  NETWORK_ERROR: 'Network connection error',
  AUTH_FAILED: 'Authentication failed',
  STORAGE_ERROR: 'Failed to save data',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  CAPTURE_SAVED: 'Capture saved to history',
  TEXT_SHARED: 'Text shared successfully',
  SETTINGS_SAVED: 'Settings saved',
  LOGOUT_SUCCESS: 'Logged out successfully',
};

// Navigation Routes
export const ROUTES = {
  LOGIN: 'Login',
  HOME: 'Home',
  CAMERA: 'Camera',
  RESULT: 'Result',
  HISTORY: 'History',
  SETTINGS: 'Settings',
};

// Color Palette
export const COLORS = {
  PRIMARY: '#2196F3',
  PRIMARY_DARK: '#1976D2',
  PRIMARY_LIGHT: '#E3F2FD',
  ACCENT: '#4CAF50',
  ERROR: '#f44336',
  WARNING: '#FBC02D',
  SUCCESS: '#4CAF50',
  BACKGROUND: '#f5f5f5',
  WHITE: '#ffffff',
  BLACK: '#000000',
  TEXT_PRIMARY: '#333333',
  TEXT_SECONDARY: '#666666',
  TEXT_HINT: '#999999',
  BORDER: '#e0e0e0',
};

// Spacing
export const SPACING = {
  XS: 5,
  SM: 10,
  MD: 15,
  LG: 20,
  XL: 30,
  XXL: 40,
};

// Font Sizes
export const FONT_SIZES = {
  XS: 10,
  SM: 12,
  MD: 14,
  LG: 16,
  XL: 20,
  XXL: 24,
  XXXL: 28,
};
