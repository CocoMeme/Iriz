/**
 * OCR Service Test
 * Quick test to verify OCR functionality
 */
import { extractTextFromImage, isOCRAvailable, cleanupOCR } from '../services/ocrService';

/**
 * Test OCR with a sample image
 */
export const testOCR = async () => {
  console.log('=== OCR Service Test ===');
  
  try {
    // Check availability
    console.log('1. Checking OCR availability...');
    const available = await isOCRAvailable();
    console.log('   OCR Available:', available);
    
    if (!available) {
      console.error('   ❌ OCR service not available');
      return false;
    }
    
    console.log('   ✅ OCR service is ready');
    return true;
  } catch (error) {
    console.error('   ❌ Test failed:', error);
    return false;
  }
};

/**
 * Test OCR with actual image
 * @param {string} imageUri - URI of test image
 */
export const testOCRWithImage = async (imageUri) => {
  console.log('=== OCR Image Test ===');
  console.log('Image URI:', imageUri);
  
  try {
    const startTime = Date.now();
    
    console.log('Starting OCR processing...');
    const result = await extractTextFromImage(imageUri);
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    console.log('\n=== Results ===');
    console.log('Duration:', duration.toFixed(2), 'seconds');
    console.log('Confidence:', result.confidence.toFixed(2), '%');
    console.log('Text Length:', result.text.length, 'characters');
    console.log('\nExtracted Text:');
    console.log('---');
    console.log(result.text);
    console.log('---\n');
    
    return {
      success: true,
      duration,
      result,
    };
  } catch (error) {
    console.error('❌ OCR Test Failed:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Cleanup after tests
 */
export const cleanupTest = async () => {
  console.log('Cleaning up OCR resources...');
  await cleanupOCR();
  console.log('✅ Cleanup complete');
};

// Export test suite
export default {
  testOCR,
  testOCRWithImage,
  cleanupTest,
};
