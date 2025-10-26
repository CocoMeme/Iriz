/**
 * OCR Service
 * Handles text extraction from images using cloud OCR API
 * Compatible with Expo Go and development builds
 */
import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';

// OCR.space API configuration (free tier: 25,000 requests/month)
const OCR_API_KEY = 'K87899142388957'; // Free API key for testing
const OCR_API_URL = 'https://api.ocr.space/parse/image';

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const TIMEOUT_MS = 30000; // 30 seconds

/**
 * Sleep utility for retry delays
 * @param {number} ms - Milliseconds to wait
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch with timeout
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @param {number} timeout - Timeout in milliseconds
 */
const fetchWithTimeout = async (url, options, timeout = TIMEOUT_MS) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

/**
 * Compress and prepare image for OCR
 * @param {string} imageUri - URI of the image
 * @returns {Promise<string>} - Base64 encoded image
 */
const prepareImageForOCR = async (imageUri) => {
  try {
    // Resize image to reduce file size and improve processing speed
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 1200 } }], // Resize to max width of 1200px
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG, base64: true }
    );

    return manipulatedImage.base64;
  } catch (error) {
    console.error('Error preparing image:', error);
    // Fallback: try to read the original image
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  }
};

/**
 * Extract text from an image using cloud OCR API with retry logic
 * @param {string} imageUri - URI of the image to process
 * @param {Object} options - OCR options
 * @param {string} options.language - Language code (default: 'eng')
 * @param {Function} options.onProgress - Progress callback
 * @param {number} options.retryCount - Internal retry counter
 * @returns {Promise<Object>} - OCR result with text and confidence
 */
export const extractTextFromImage = async (imageUri, options = {}) => {
  const retryCount = options.retryCount || 0;
  
  try {
    console.log(`Starting OCR processing (attempt ${retryCount + 1}/${MAX_RETRIES + 1})...`);
    
    // Prepare image (compress and convert to base64)
    console.log('Preparing image...');
    const base64Image = await prepareImageForOCR(imageUri);
    
    // Call OCR API with timeout
    console.log('Calling OCR API...');
    const formData = new FormData();
    formData.append('base64Image', `data:image/jpeg;base64,${base64Image}`);
    formData.append('language', options.language || 'eng');
    formData.append('isOverlayRequired', 'false');
    formData.append('detectOrientation', 'true');
    formData.append('scale', 'true');
    formData.append('OCREngine', '2'); // Use OCR Engine 2 for better accuracy
    
    const response = await fetchWithTimeout(OCR_API_URL, {
      method: 'POST',
      headers: {
        'apikey': OCR_API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    console.log('OCR API Response:', {
      isErroredOnProcessing: result.IsErroredOnProcessing,
      ocrExitCode: result.OCRExitCode,
      hasText: result.ParsedResults && result.ParsedResults.length > 0,
    });

    // Check for errors
    if (result.IsErroredOnProcessing) {
      const errorMsg = result.ErrorMessage?.[0] || 'OCR processing failed';
      throw new Error(errorMsg);
    }

    if (!result.ParsedResults || result.ParsedResults.length === 0) {
      throw new Error('No text detected in the image');
    }

    // Extract text and confidence
    const parsedResult = result.ParsedResults[0];
    const extractedText = parsedResult.ParsedText || '';
    
    // Calculate confidence score from file parse exit code
    // Exit code 1 = success, 0 = failed
    const confidence = parsedResult.FileParseExitCode === 1 
      ? (parsedResult.TextOrientation ? 85 : 75) // Higher confidence if orientation detected
      : 50;
    
    console.log('OCR completed successfully');
    console.log('Confidence:', confidence);
    console.log('Text length:', extractedText.length);
    
    return {
      text: extractedText.trim(),
      confidence: confidence,
      blocks: parsedResult.TextOverlay?.Lines || [],
      words: [],
      orientation: parsedResult.TextOrientation || 0,
      errorDetails: parsedResult.ErrorDetails || null,
    };
  } catch (error) {
    console.error(`OCR Error (attempt ${retryCount + 1}):`, error.message);
    
    // Retry logic
    if (retryCount < MAX_RETRIES) {
      // Check if error is retryable
      const isRetryable = 
        error.message?.includes('Network request failed') ||
        error.message?.includes('timeout') ||
        error.message?.includes('HTTP error') ||
        error.name === 'AbortError';
      
      if (isRetryable) {
        const delay = RETRY_DELAY * Math.pow(2, retryCount); // Exponential backoff
        console.log(`Retrying in ${delay}ms...`);
        await sleep(delay);
        
        return extractTextFromImage(imageUri, {
          ...options,
          retryCount: retryCount + 1,
        });
      }
    }
    
    // Provide more helpful error messages
    if (error.message?.includes('Network request failed')) {
      throw new Error('No internet connection. Please check your network and try again.');
    }
    
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    
    throw new Error(`Failed to extract text from image: ${error.message}`);
  }
};

/**
 * Extract text with preprocessing for better accuracy
 * @param {string} imageUri - URI of the image to process
 * @returns {Promise<Object>} - OCR result
 */
export const extractTextOptimized = async (imageUri) => {
  try {
    // Use the standard extraction
    return await extractTextFromImage(imageUri);
  } catch (error) {
    console.error('Optimized OCR Error:', error);
    throw error;
  }
};

/**
 * Check if OCR service is available
 * @returns {Promise<boolean>}
 */
export const isOCRAvailable = async () => {
  try {
    // Test API availability with a simple request
    const response = await fetch(OCR_API_URL, {
      method: 'HEAD',
      headers: {
        'apikey': OCR_API_KEY,
      },
    });
    return response.ok || response.status === 405; // 405 is OK for HEAD request
  } catch (error) {
    console.error('OCR not available:', error);
    return false;
  }
};

/**
 * Get OCR confidence score from a previous result
 * @param {string} imageUri 
 * @returns {Promise<number>} - Confidence score (0-100)
 */
export const getOCRConfidence = async (imageUri) => {
  try {
    const result = await extractTextFromImage(imageUri);
    return result.confidence;
  } catch (error) {
    console.error('Error getting confidence:', error);
    return 0;
  }
};

/**
 * Cleanup OCR resources (not needed for cloud API, kept for compatibility)
 */
export const cleanupOCR = async () => {
  console.log('OCR cleanup (no resources to clean for cloud API)');
};

/**
 * Extract text from multiple images in batch
 * @param {Array<string>} imageUris - Array of image URIs
 * @returns {Promise<Array<Object>>} - Array of OCR results
 */
export const batchExtractText = async (imageUris) => {
  const results = [];
  
  for (const uri of imageUris) {
    try {
      const result = await extractTextFromImage(uri);
      results.push({ uri, ...result, success: true });
    } catch (error) {
      results.push({ uri, error: error.message, success: false });
    }
  }
  
  return results;
};
