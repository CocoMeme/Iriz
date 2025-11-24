/**
 * Profile Service
 * Handles user profile data persistence with AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_KEY = '@iriz_user_profile';

// Default profile data
const DEFAULT_PROFILE = {
  name: 'Iriz User',
  email: 'user@iriz.app',
  phone: '09XX XXX XXXX',
};

/**
 * Save user profile to AsyncStorage
 * @param {Object} profile - Profile data {name, email, phone}
 * @returns {Promise<Object>} - Saved profile data
 */
export const saveProfile = async (profile) => {
  try {
    const validatedProfile = {
      name: (profile.name || '').trim(),
      email: (profile.email || '').trim(),
      phone: (profile.phone || '').trim(),
    };

    // Validate required fields
    if (!validatedProfile.name || !validatedProfile.email) {
      throw new Error('Name and email are required');
    }

    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(validatedProfile));
    console.log('Profile saved successfully:', validatedProfile);
    return validatedProfile;
  } catch (error) {
    console.error('Save profile error:', error);
    throw error;
  }
};

/**
 * Load user profile from AsyncStorage
 * @returns {Promise<Object>} - Profile data or default profile
 */
export const loadProfile = async () => {
  try {
    const stored = await AsyncStorage.getItem(PROFILE_KEY);
    
    if (stored) {
      const profile = JSON.parse(stored);
      console.log('Profile loaded from storage:', profile);
      return profile;
    }

    console.log('No stored profile found, returning default');
    return { ...DEFAULT_PROFILE };
  } catch (error) {
    console.error('Load profile error:', error);
    return { ...DEFAULT_PROFILE };
  }
};

/**
 * Update specific profile fields
 * @param {Object} updates - Fields to update {name?, email?, phone?}
 * @returns {Promise<Object>} - Updated profile data
 */
export const updateProfile = async (updates) => {
  try {
    const currentProfile = await loadProfile();
    const updatedProfile = {
      ...currentProfile,
      ...updates,
    };

    return await saveProfile(updatedProfile);
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

/**
 * Clear user profile (reset to default)
 * @returns {Promise<boolean>}
 */
export const clearProfile = async () => {
  try {
    await AsyncStorage.removeItem(PROFILE_KEY);
    console.log('Profile cleared successfully');
    return true;
  } catch (error) {
    console.error('Clear profile error:', error);
    throw error;
  }
};

/**
 * Get user initials from profile name
 * @returns {Promise<string>} - User initials (e.g., "IU")
 */
export const getProfileInitials = async () => {
  try {
    const profile = await loadProfile();
    const initials = profile.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
    
    return initials || 'U';
  } catch (error) {
    console.error('Get initials error:', error);
    return 'U';
  }
};

/**
 * Get user first name from profile
 * @returns {Promise<string>} - First name or full name
 */
export const getProfileFirstName = async () => {
  try {
    const profile = await loadProfile();
    const firstName = profile.name.split(' ')[0];
    return firstName || 'User';
  } catch (error) {
    console.error('Get first name error:', error);
    return 'User';
  }
};

/**
 * Validate profile data
 * @param {Object} profile - Profile data to validate
 * @returns {Object} - {isValid: boolean, errors: string[]}
 */
export const validateProfile = (profile) => {
  const errors = [];

  if (!profile.name || profile.name.trim().length === 0) {
    errors.push('Name is required');
  }

  if (!profile.email || profile.email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
    errors.push('Email format is invalid');
  }

  if (profile.phone && !/^[\d\s\+\-\(\)\.]+$/.test(profile.phone)) {
    errors.push('Phone number format is invalid');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
