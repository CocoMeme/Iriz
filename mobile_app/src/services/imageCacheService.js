/**
 * Image Cache Service
 * Handles image storage, caching, and management
 */

import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';

const CAPTURES_DIR = `${FileSystem.documentDirectory}captures/`;
const THUMBNAILS_DIR = `${FileSystem.documentDirectory}thumbnails/`;
const MAX_STORAGE_SIZE = 100 * 1024 * 1024; // 100MB limit

/**
 * Initialize image cache directories
 */
export const initImageCache = async () => {
  try {
    console.log('Initializing image cache...');
    
    // Create captures directory
    const capturesInfo = await FileSystem.getInfoAsync(CAPTURES_DIR);
    if (!capturesInfo.exists) {
      await FileSystem.makeDirectoryAsync(CAPTURES_DIR, { intermediates: true });
      console.log('Created captures directory');
    }
    
    // Create thumbnails directory
    const thumbnailsInfo = await FileSystem.getInfoAsync(THUMBNAILS_DIR);
    if (!thumbnailsInfo.exists) {
      await FileSystem.makeDirectoryAsync(THUMBNAILS_DIR, { intermediates: true });
      console.log('Created thumbnails directory');
    }
    
    console.log('Image cache initialized');
    return true;
  } catch (error) {
    console.error('Image cache initialization error:', error);
    throw error;
  }
};

/**
 * Save image to permanent storage
 * @param {string} tempUri - Temporary image URI
 * @returns {Promise<Object>} - Saved image info {imageUri, thumbnailUri, size}
 */
export const saveImage = async (tempUri) => {
  try {
    console.log('Saving image to permanent storage...');
    
    // Generate unique filename
    const timestamp = Date.now();
    const filename = `capture_${timestamp}.jpg`;
    const thumbnailFilename = `thumb_${timestamp}.jpg`;
    
    const permanentUri = `${CAPTURES_DIR}${filename}`;
    const thumbnailUri = `${THUMBNAILS_DIR}${thumbnailFilename}`;
    
    // Copy original image to permanent location
    await FileSystem.copyAsync({
      from: tempUri,
      to: permanentUri,
    });
    
    console.log('Image saved to:', permanentUri);
    
    // Generate thumbnail
    const thumbnail = await createThumbnail(tempUri);
    await FileSystem.moveAsync({
      from: thumbnail.uri,
      to: thumbnailUri,
    });
    
    console.log('Thumbnail saved to:', thumbnailUri);
    
    // Get file size
    const fileInfo = await FileSystem.getInfoAsync(permanentUri);
    
    return {
      imageUri: permanentUri,
      thumbnailUri: thumbnailUri,
      size: fileInfo.size,
      filename: filename,
    };
  } catch (error) {
    console.error('Save image error:', error);
    throw error;
  }
};

/**
 * Create thumbnail from image
 * @param {string} imageUri - Source image URI
 * @param {number} width - Thumbnail width (default: 200)
 * @returns {Promise<Object>} - Thumbnail info
 */
export const createThumbnail = async (imageUri, width = 200) => {
  try {
    const thumbnail = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );
    
    return thumbnail;
  } catch (error) {
    console.error('Create thumbnail error:', error);
    throw error;
  }
};

/**
 * Delete image and thumbnail
 * @param {string} imageUri - Image URI
 * @param {string} thumbnailUri - Thumbnail URI
 */
export const deleteImage = async (imageUri, thumbnailUri) => {
  try {
    if (imageUri) {
      const imageInfo = await FileSystem.getInfoAsync(imageUri);
      if (imageInfo.exists) {
        await FileSystem.deleteAsync(imageUri, { idempotent: true });
        console.log('Deleted image:', imageUri);
      }
    }
    
    if (thumbnailUri) {
      const thumbInfo = await FileSystem.getInfoAsync(thumbnailUri);
      if (thumbInfo.exists) {
        await FileSystem.deleteAsync(thumbnailUri, { idempotent: true });
        console.log('Deleted thumbnail:', thumbnailUri);
      }
    }
  } catch (error) {
    console.error('Delete image error:', error);
    throw error;
  }
};

/**
 * Get total cache size
 * @returns {Promise<number>} - Total size in bytes
 */
export const getCacheSize = async () => {
  try {
    let totalSize = 0;
    
    // Get captures directory size
    const capturesInfo = await FileSystem.getInfoAsync(CAPTURES_DIR);
    if (capturesInfo.exists) {
      const files = await FileSystem.readDirectoryAsync(CAPTURES_DIR);
      for (const file of files) {
        const fileInfo = await FileSystem.getInfoAsync(`${CAPTURES_DIR}${file}`);
        totalSize += fileInfo.size || 0;
      }
    }
    
    // Get thumbnails directory size
    const thumbnailsInfo = await FileSystem.getInfoAsync(THUMBNAILS_DIR);
    if (thumbnailsInfo.exists) {
      const files = await FileSystem.readDirectoryAsync(THUMBNAILS_DIR);
      for (const file of files) {
        const fileInfo = await FileSystem.getInfoAsync(`${THUMBNAILS_DIR}${file}`);
        totalSize += fileInfo.size || 0;
      }
    }
    
    return totalSize;
  } catch (error) {
    console.error('Get cache size error:', error);
    return 0;
  }
};

/**
 * Clear old images to free up space
 * @param {number} maxSize - Maximum size in bytes (default: 100MB)
 */
export const cleanupOldImages = async (maxSize = MAX_STORAGE_SIZE) => {
  try {
    console.log('Checking cache size...');
    const currentSize = await getCacheSize();
    
    if (currentSize <= maxSize) {
      console.log('Cache size OK:', formatBytes(currentSize));
      return;
    }
    
    console.log('Cache size exceeds limit, cleaning up...');
    
    // Get all files with timestamps
    const capturesInfo = await FileSystem.getInfoAsync(CAPTURES_DIR);
    if (!capturesInfo.exists) return;
    
    const files = await FileSystem.readDirectoryAsync(CAPTURES_DIR);
    const fileInfos = await Promise.all(
      files.map(async (file) => {
        const uri = `${CAPTURES_DIR}${file}`;
        const info = await FileSystem.getInfoAsync(uri);
        return {
          uri,
          modificationTime: info.modificationTime,
          size: info.size,
        };
      })
    );
    
    // Sort by modification time (oldest first)
    fileInfos.sort((a, b) => a.modificationTime - b.modificationTime);
    
    // Delete oldest files until under limit
    let deletedSize = 0;
    for (const file of fileInfos) {
      if (currentSize - deletedSize <= maxSize) break;
      
      await FileSystem.deleteAsync(file.uri, { idempotent: true });
      deletedSize += file.size;
      
      // Delete corresponding thumbnail
      const thumbUri = file.uri.replace(CAPTURES_DIR, THUMBNAILS_DIR).replace('capture_', 'thumb_');
      await FileSystem.deleteAsync(thumbUri, { idempotent: true });
    }
    
    console.log('Cleaned up', formatBytes(deletedSize), 'of old images');
  } catch (error) {
    console.error('Cleanup old images error:', error);
  }
};

/**
 * Clear all cached images
 */
export const clearAllImages = async () => {
  try {
    console.log('Clearing all cached images...');
    
    // Delete captures directory
    const capturesInfo = await FileSystem.getInfoAsync(CAPTURES_DIR);
    if (capturesInfo.exists) {
      await FileSystem.deleteAsync(CAPTURES_DIR, { idempotent: true });
      await FileSystem.makeDirectoryAsync(CAPTURES_DIR, { intermediates: true });
    }
    
    // Delete thumbnails directory
    const thumbnailsInfo = await FileSystem.getInfoAsync(THUMBNAILS_DIR);
    if (thumbnailsInfo.exists) {
      await FileSystem.deleteAsync(THUMBNAILS_DIR, { idempotent: true });
      await FileSystem.makeDirectoryAsync(THUMBNAILS_DIR, { intermediates: true });
    }
    
    console.log('All images cleared');
  } catch (error) {
    console.error('Clear all images error:', error);
    throw error;
  }
};

/**
 * Check if image exists
 * @param {string} imageUri - Image URI
 * @returns {Promise<boolean>}
 */
export const imageExists = async (imageUri) => {
  try {
    if (!imageUri) return false;
    const info = await FileSystem.getInfoAsync(imageUri);
    return info.exists;
  } catch (error) {
    return false;
  }
};

/**
 * Get cache statistics
 * @returns {Promise<Object>}
 */
export const getCacheStats = async () => {
  try {
    const totalSize = await getCacheSize();
    
    const capturesInfo = await FileSystem.getInfoAsync(CAPTURES_DIR);
    const captureCount = capturesInfo.exists 
      ? (await FileSystem.readDirectoryAsync(CAPTURES_DIR)).length 
      : 0;
    
    const thumbnailsInfo = await FileSystem.getInfoAsync(THUMBNAILS_DIR);
    const thumbnailCount = thumbnailsInfo.exists
      ? (await FileSystem.readDirectoryAsync(THUMBNAILS_DIR)).length
      : 0;
    
    return {
      totalSize,
      totalSizeFormatted: formatBytes(totalSize),
      captureCount,
      thumbnailCount,
      percentUsed: (totalSize / MAX_STORAGE_SIZE) * 100,
      maxSize: MAX_STORAGE_SIZE,
      maxSizeFormatted: formatBytes(MAX_STORAGE_SIZE),
    };
  } catch (error) {
    console.error('Get cache stats error:', error);
    return {
      totalSize: 0,
      totalSizeFormatted: '0 B',
      captureCount: 0,
      thumbnailCount: 0,
      percentUsed: 0,
      maxSize: MAX_STORAGE_SIZE,
      maxSizeFormatted: formatBytes(MAX_STORAGE_SIZE),
    };
  }
};

/**
 * Format bytes to human readable string
 * @param {number} bytes
 * @returns {string}
 */
const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export { formatBytes };
