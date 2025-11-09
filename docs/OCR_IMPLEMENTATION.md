# Image Capture & OCR Implementation

## Overview
This implementation provides complete functionality for capturing images and extracting text using Optical Character Recognition (OCR).

## Components Implemented

### 1. OCR Service (`src/services/ocrService.js`)
Handles all OCR operations using Tesseract.js:

**Key Functions:**
- `extractTextFromImage(imageUri, options)` - Main OCR function
- `extractTextOptimized(imageUri)` - Enhanced extraction with preprocessing
- `isOCRAvailable()` - Check OCR service availability
- `getOCRConfidence(imageUri)` - Get confidence score
- `cleanupOCR()` - Release OCR resources
- `batchExtractText(imageUris)` - Process multiple images

**Features:**
- Automatic worker initialization
- Progress tracking
- Base64 image handling for Expo compatibility
- Confidence scoring
- Detailed text block and word detection

### 2. Camera Screen (`src/screens/CameraScreen.js`)
Enhanced camera interface with real OCR integration:

**Features:**
- Camera permission handling
- Photo capture with quality settings
- Real-time OCR processing
- Pinch-to-zoom functionality
- Manual zoom controls
- Camera flip (front/back)
- Visual frame guide
- Processing feedback
- Error handling with user-friendly messages

**User Experience:**
- Shows "Extracting text..." during OCR
- Alerts if no text is detected
- Provides helpful error messages
- Auto-navigates to results on success

### 3. Result Screen (`src/screens/ResultScreen.js`)
Enhanced to display OCR results with confidence metrics:

**New Features:**
- OCR confidence score display
- Visual confidence indicator (color-coded progress bar)
- Green (>70%) / Yellow (40-70%) / Red (<40%)
- Improved metadata layout

**Existing Features:**
- Auto-play text-to-speech on load
- Manual speech toggle
- Save to history (TODO: SQLite integration)
- Share text functionality
- Retake photo option
- Return to home

### 4. Image Processing Utilities (`src/utils/imageProcessor.js`)
Helper functions for image handling:

**Functions:**
- `getImageDimensions(imageUri)` - Get width/height
- `imageToBase64(imageUri)` - Convert to base64
- `validateImage(imageUri)` - Validate before processing
- `getRecommendedQuality(fileSize)` - Calculate compression
- `getImageMetadata(imageUri)` - Get file info
- `getImageOrientation(imageUri)` - Check orientation

## Dependencies

### Installed Packages
```json
{
  "tesseract.js": "^5.x.x",
  "expo-file-system": "~16.0.8",
  "expo-camera": "~17.0.8",
  "expo-speech": "^14.0.7"
}
```

## How It Works

### Capture Flow
1. User opens Camera Screen
2. Permission requested if needed
3. User aligns signboard in frame guide
4. User taps capture button
5. Photo captured at 0.8 quality
6. OCR processing begins
7. Tesseract extracts text
8. Results shown with confidence score

### OCR Processing
```javascript
// Initialization (automatic on first use)
worker = createWorker('eng', 1, { logger: progressCallback });

// Image Processing
1. Read image file as base64 (for Expo compatibility)
2. Convert to data URI format
3. Pass to Tesseract worker
4. Extract text, confidence, blocks, words
5. Return structured result

// Result Object
{
  text: "Extracted text content",
  confidence: 85.5,
  blocks: [...],
  words: [...]
}
```

## Configuration Options

### OCR Language
Currently set to English ('eng'). To add more languages:
```javascript
const worker = await createWorker(['eng', 'spa'], 1);
```

### Image Quality
Captured at 80% quality for balance between size and clarity:
```javascript
takePictureAsync({ quality: 0.8 })
```

### Tesseract Settings
Can be customized in `ocrService.js`:
```javascript
await worker.setParameters({
  tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ',
  tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
});
```

## Performance Considerations

### OCR Processing Time
- Small images (< 1MB): 2-5 seconds
- Medium images (1-3MB): 5-10 seconds
- Large images (> 3MB): 10-20 seconds

### Memory Management
- Worker initialized once and reused
- Call `cleanupOCR()` to release resources
- Automatic cleanup recommended on app background/close

### Optimization Tips
1. **Better Lighting** - Improves accuracy significantly
2. **Clear Focus** - Ensure text is sharp
3. **Proper Distance** - Fill frame without cutting text
4. **High Contrast** - Dark text on light background works best
5. **Avoid Skew** - Keep image aligned

## Error Handling

### Common Errors
1. **"No Text Found"** - No text detected in image
2. **"OCR Error"** - Processing failed (poor lighting, blur, etc.)
3. **"Capture Error"** - Camera issue or permission denied

### User Guidance
- Clear instructions displayed during capture
- Frame guide helps with alignment
- Error messages suggest improvements

## Future Enhancements

### Possible Improvements
1. **Image Preprocessing**
   - Auto-contrast adjustment
   - Noise reduction
   - Deskewing
   - Border removal

2. **Multiple Languages**
   - Language detection
   - Multi-language support
   - User language selection

3. **Batch Processing**
   - Process multiple images
   - Queue management
   - Background processing

4. **Offline Language Packs**
   - Download language data
   - Better offline performance

5. **Advanced Features**
   - Text translation
   - Text highlighting overlay
   - Copy specific sections

## Testing

### Test Scenarios
1. **Clear Signboard** - Should extract with >80% confidence
2. **Poor Lighting** - Should show error message
3. **No Text** - Should detect and inform user
4. **Blurry Image** - Should extract with lower confidence
5. **Multiple Lines** - Should preserve line breaks

### Test Commands
```bash
# Start the app
npm run start

# Test on Android
npm run android

# Test on iOS
npm run ios
```

## Troubleshooting

### OCR Not Working
1. Check console for errors
2. Verify tesseract.js installation
3. Ensure proper image permissions
4. Check network (first-time language download)

### Low Accuracy
1. Improve lighting conditions
2. Reduce camera shake
3. Get closer to signboard
4. Ensure text is in focus
5. Try different angles

### Performance Issues
1. Reduce image quality setting
2. Close other apps
3. Clear app cache
4. Restart app to free memory

## API Reference

### extractTextFromImage(imageUri, options)
```javascript
const result = await extractTextFromImage('file://path/to/image.jpg', {
  language: 'eng',
  onProgress: (progress) => console.log(progress)
});
// Returns: { text, confidence, blocks, words }
```

### isOCRAvailable()
```javascript
const available = await isOCRAvailable();
// Returns: true/false
```

### cleanupOCR()
```javascript
await cleanupOCR();
// Releases worker resources
```

## License
Part of the Iriz - Signboard Reader project.

## Support
For issues or questions, refer to the main project documentation.
