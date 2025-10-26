/**
 * Image Processing Utilities
 * Helper functions for image preprocessing to improve OCR accuracy
 */
import * as FileSystem from 'expo-file-system';

/**
 * Get image dimensions
 * @param {string} imageUri 
 * @returns {Promise<{width: number, height: number}>}
 */
export const getImageDimensions = async (imageUri) => {
  return new Promise((resolve, reject) => {
    const Image = require('react-native').Image;
    Image.getSize(
      imageUri,
      (width, height) => resolve({ width, height }),
      (error) => reject(error)
    );
  });
};

/**
 * Convert image to base64
 * @param {string} imageUri 
 * @returns {Promise<string>}
 */
export const imageToBase64 = async (imageUri) => {
  try {
    if (imageUri.startsWith('data:')) {
      return imageUri;
    }
    
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
};

/**
 * Validate image for OCR processing
 * @param {string} imageUri 
 * @returns {Promise<{valid: boolean, message: string}>}
 */
export const validateImage = async (imageUri) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(imageUri);
    
    if (!fileInfo.exists) {
      return { valid: false, message: 'Image file does not exist' };
    }
    
    // Check file size (e.g., max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (fileInfo.size > maxSize) {
      return { valid: false, message: 'Image file is too large' };
    }
    
    // Check dimensions
    try {
      const dimensions = await getImageDimensions(imageUri);
      if (dimensions.width < 100 || dimensions.height < 100) {
        return { valid: false, message: 'Image resolution is too low' };
      }
    } catch (dimError) {
      console.warn('Could not validate dimensions:', dimError);
      // Continue anyway
    }
    
    return { valid: true, message: 'Image is valid' };
  } catch (error) {
    console.error('Error validating image:', error);
    return { valid: false, message: 'Failed to validate image' };
  }
};

/**
 * Calculate recommended compression quality based on image size
 * @param {number} fileSize - File size in bytes
 * @returns {number} - Quality value between 0 and 1
 */
export const getRecommendedQuality = (fileSize) => {
  const MB = 1024 * 1024;
  
  if (fileSize > 5 * MB) return 0.6;
  if (fileSize > 3 * MB) return 0.7;
  if (fileSize > 1 * MB) return 0.8;
  return 0.9;
};

/**
 * Get image metadata
 * @param {string} imageUri 
 * @returns {Promise<Object>}
 */
export const getImageMetadata = async (imageUri) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(imageUri);
    let dimensions = { width: 0, height: 0 };
    
    try {
      dimensions = await getImageDimensions(imageUri);
    } catch (error) {
      console.warn('Could not get image dimensions:', error);
    }
    
    return {
      size: fileInfo.size,
      exists: fileInfo.exists,
      dimensions,
      uri: imageUri,
    };
  } catch (error) {
    console.error('Error getting image metadata:', error);
    return null;
  }
};

/**
 * Check if image is in portrait or landscape orientation
 * @param {string} imageUri 
 * @returns {Promise<'portrait' | 'landscape' | 'square'>}
 */
export const getImageOrientation = async (imageUri) => {
  try {
    const dimensions = await getImageDimensions(imageUri);
    
    if (dimensions.width > dimensions.height) return 'landscape';
    if (dimensions.height > dimensions.width) return 'portrait';
    return 'square';
  } catch (error) {
    console.error('Error getting image orientation:', error);
    return 'unknown';
  }
};
