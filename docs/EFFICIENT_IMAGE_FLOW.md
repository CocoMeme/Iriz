# Efficient Image Processing Flow

## Overview
This document describes the optimized image handling flow from capture to storage, eliminating unnecessary file persistence and ensuring all detection data is properly saved and restored.

---

## 📸 Complete Flow

### 1. **CAPTURE** (CameraScreen)
```
User takes photo
  └─> Saved to temporary file
  └─> Navigate to ImageCropScreen
```

### 2. **CROP** (ImageCropScreen - Optional)
```
User can manually crop or skip
  └─> Still using temporary file
  └─> Send to backend API
```

### 3. **PROCESS** (Backend API)
```
Backend receives image
  ├─> Create temporary directory (tempfile.mkdtemp)
  ├─> Save uploaded image to temp directory
  ├─> Run YOLO detection
  ├─> Generate boxed image (temp file)
  ├─> Generate cropped signboards (temp files)
  ├─> Upload all to Cloudinary
  ├─> Extract text via OCR
  ├─> Return JSON with Cloudinary URLs
  └─> Auto-cleanup: Delete entire temp directory
```

**Backend Response:**
```json
{
  "boxed_image_url": "https://cloudinary.com/.../boxed.jpg",
  "detections": [
    {
      "bbox": [x1, y1, x2, y2],
      "confidence": 0.95,
      "class": 0,
      "cropped_url": "https://cloudinary.com/.../crop_0.jpg",
      "extracted_text": "STOP"
    }
  ]
}
```

### 4. **DISPLAY** (ResultScreen)
```
Show results
  ├─> Boxed image (from Cloudinary URL)
  ├─> Detection cards (from Cloudinary URLs)
  ├─> Extracted text
  └─> Confidence scores
```

### 5. **SAVE** (When user clicks Save button)
```
Download boxed image from Cloudinary
  ├─> Save to permanent local storage
  ├─> Generate thumbnail
  └─> Save to database:
      ├─> imageUri (local file path)
      ├─> thumbnailUri (local file path)
      ├─> boxedImageUrl (Cloudinary URL)
      ├─> text (concatenated OCR results)
      ├─> confidence (average)
      ├─> detections (JSON array with Cloudinary URLs)
      └─> timestamp, language, orientation
```

### 6. **HISTORY VIEW** (HistoryScreen → ResultScreen)
```
User clicks history item
  ├─> Parse detections JSON from database
  ├─> Restore full context:
  │   ├─> boxedImageUrl (Cloudinary URL)
  │   ├─> detections array (with cropped_url)
  │   ├─> text, confidence, timestamp
  │   └─> language, orientation
  └─> Navigate to ResultScreen with complete data
```

---

## 🗄️ Database Schema

### `captures` Table
```sql
CREATE TABLE captures (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  imageUri TEXT,              -- Local saved boxed image
  thumbnailUri TEXT,          -- Local thumbnail
  boxedImageUrl TEXT,         -- Cloudinary URL for boxed image
  text TEXT NOT NULL,         -- Concatenated OCR text
  confidence REAL,            -- Average confidence
  timestamp TEXT NOT NULL,    -- ISO timestamp
  language TEXT DEFAULT 'eng',
  orientation INTEGER DEFAULT 0,
  detections TEXT,            -- JSON array of detection objects
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Detections JSON Structure
```json
[
  {
    "bbox": [x1, y1, x2, y2],
    "confidence": 0.95,
    "class": 0,
    "cropped_url": "https://cloudinary.com/.../crop_0.jpg",
    "extracted_text": "STOP"
  }
]
```

---

## ✅ Benefits of This Flow

### 1. **Backend Efficiency**
- ❌ **Before**: Files accumulated in `static/uploads/`
- ✅ **After**: Temporary files auto-deleted after Cloudinary upload
- 💾 **Storage**: Zero disk usage growth on backend

### 2. **Mobile Storage Optimization**
- Only saves images when user explicitly clicks "Save"
- Downloads from Cloudinary only when needed
- Generates optimized thumbnails for list view

### 3. **Full Data Persistence**
- ✅ Detections data saved in database
- ✅ Cloudinary URLs preserved
- ✅ Complete context restored from history
- ✅ Detection cards render correctly

### 4. **Scalability**
- Images served from Cloudinary CDN
- Backend doesn't store user data
- Mobile app controls local storage

---

## 🔧 Changes Made

### Backend (`backend/app/routes.py`)
```python
# Before
upload_dir = os.path.join('static', 'uploads')
os.makedirs(upload_dir, exist_ok=True)
# Files stayed forever

# After
temp_dir = tempfile.mkdtemp(prefix=f'signboard_{timestamp}_')
try:
    # Process files...
finally:
    shutil.rmtree(temp_dir)  # Auto-cleanup
```

### Database (`mobile_app/src/services/storageService.js`)
```javascript
// Added columns
boxedImageUrl TEXT,  // Cloudinary URL
detections TEXT,     // JSON array

// Migration for existing databases
ALTER TABLE captures ADD COLUMN boxedImageUrl TEXT;
ALTER TABLE captures ADD COLUMN detections TEXT;
```

### Save Function (`mobile_app/src/screens/ResultScreen.js`)
```javascript
const captureData = {
  imageUri: savedImageUri,           // Local file
  thumbnailUri: thumbnailUri,        // Local thumbnail
  boxedImageUrl: boxedImageUri,      // Cloudinary URL
  text: allExtractedText,
  confidence: avgConfidence,
  detections: detections,            // Full array
  // ...
};
```

### History Navigation (`mobile_app/src/screens/HistoryScreen.js`)
```javascript
const handleItemPress = (item) => {
  let detections = JSON.parse(item.detections);  // Restore detections
  
  navigation.navigate('Result', {
    boxedImageUri: item.boxedImageUrl,  // Cloudinary URL
    detections: detections,             // Full array
    // ... other fields
  });
};
```

---

## 🧪 Testing the Flow

1. **Capture a signboard**
   - Take photo with camera
   - Optionally crop

2. **Verify backend cleanup**
   - Check `backend/` folder
   - No new files in any directory
   - Check Cloudinary dashboard for uploads

3. **View results**
   - Boxed image should display
   - Detection cards should show cropped signboards
   - Each card should have extracted text

4. **Save to history**
   - Click "Save" button
   - Check database has new record
   - Verify detections JSON is populated

5. **View from history**
   - Go to History screen
   - Click on saved item
   - Verify detection cards render correctly
   - Verify text is displayed

---

## 🚀 Next Steps (Optional Improvements)

1. **Image Cache Management**
   - Implement LRU cache for Cloudinary images
   - Auto-cleanup old local images when storage limit reached

2. **Offline Support**
   - Queue captures for later upload when offline
   - Show cached results immediately

3. **Performance Optimization**
   - Lazy load detection cards
   - Progressive image loading

4. **Analytics**
   - Track detection accuracy
   - Monitor Cloudinary bandwidth usage

---

## 📝 Summary

**Before**: Images accumulated on backend, detection data lost, history broken
**After**: Clean temporary file handling, full data persistence, complete history functionality

The flow is now efficient, scalable, and maintains complete data integrity throughout the capture-process-save-retrieve cycle.
