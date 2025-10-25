/**
 * Helper Utilities
 */

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @returns {string}
 */
export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
};

/**
 * Format date to relative time (e.g., "2 hours ago")
 * @param {string|Date} date - Date to format
 * @returns {string}
 */
export const formatRelativeTime = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return formatDate(date);
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string}
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Generate unique ID
 * @returns {string}
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Clean extracted text (remove extra whitespace, etc.)
 * @param {string} text - Text to clean
 * @returns {string}
 */
export const cleanExtractedText = (text) => {
  if (!text) return '';
  
  return text
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n\n');
};

/**
 * Calculate text confidence score
 * @param {string} text - Extracted text
 * @returns {number} - Confidence score (0-100)
 */
export const calculateConfidence = (text) => {
  if (!text) return 0;
  
  // Simple heuristic: longer text with proper words = higher confidence
  const words = text.split(/\s+/);
  const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
  
  let confidence = 50;
  if (words.length > 3) confidence += 20;
  if (avgWordLength > 3) confidence += 20;
  if (/[A-Z]/.test(text)) confidence += 10;
  
  return Math.min(confidence, 100);
};

/**
 * Format file size
 * @param {number} bytes - Size in bytes
 * @returns {string}
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function}
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Check if device is online
 * @returns {Promise<boolean>}
 */
export const isOnline = async () => {
  // TODO: Implement actual network check
  return true;
};

/**
 * Validate image URI
 * @param {string} uri - Image URI
 * @returns {boolean}
 */
export const isValidImageUri = (uri) => {
  if (!uri) return false;
  return uri.startsWith('file://') || uri.startsWith('http://') || uri.startsWith('https://');
};
