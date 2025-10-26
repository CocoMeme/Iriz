import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImageManipulator from 'expo-image-manipulator';
import Icon from '../components/Icon';
import { extractTextFromImage } from '../services/ocrService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CROP_CONTAINER_HEIGHT = SCREEN_HEIGHT - 200;

export default function ImageCropScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { imageUri } = route.params || {};
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCropEditor, setShowCropEditor] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [imageLayout, setImageLayout] = useState({ width: 0, height: 0, x: 0, y: 0 });
  
  // Crop area state (relative to display)
  const [cropArea, setCropArea] = useState({
    x: SCREEN_WIDTH * 0.1,
    y: 50,
    width: SCREEN_WIDTH * 0.8,
    height: 250,
  });
  
  const [isDragging, setIsDragging] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);
  const dragStartRef = useRef({ x: 0, y: 0, cropX: 0, cropY: 0, cropWidth: 0, cropHeight: 0 });

  const handleManualCrop = () => {
    setShowCropEditor(true);
  };

  const handleTouchStart = (e) => {
    const { locationX, locationY } = e.nativeEvent;
    
    // Check if touching a resize handle
    const handleSize = 40;
    const handles = [
      { name: 'topLeft', x: cropArea.x, y: cropArea.y },
      { name: 'topRight', x: cropArea.x + cropArea.width, y: cropArea.y },
      { name: 'bottomLeft', x: cropArea.x, y: cropArea.y + cropArea.height },
      { name: 'bottomRight', x: cropArea.x + cropArea.width, y: cropArea.y + cropArea.height },
    ];
    
    let touchedHandle = null;
    for (const handle of handles) {
      if (
        Math.abs(locationX - handle.x) < handleSize &&
        Math.abs(locationY - handle.y) < handleSize
      ) {
        touchedHandle = handle.name;
        break;
      }
    }
    
    setResizeHandle(touchedHandle);
    setIsDragging(true);
    dragStartRef.current = {
      x: locationX,
      y: locationY,
      cropX: cropArea.x,
      cropY: cropArea.y,
      cropWidth: cropArea.width,
      cropHeight: cropArea.height,
    };
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    const { locationX, locationY } = e.nativeEvent;
    const deltaX = locationX - dragStartRef.current.x;
    const deltaY = locationY - dragStartRef.current.y;
    
    if (resizeHandle) {
      // Resizing
      let newCrop = { ...cropArea };
      const minSize = 50;
      
      switch (resizeHandle) {
        case 'topLeft':
          newCrop.x = Math.max(0, dragStartRef.current.cropX + deltaX);
          newCrop.y = Math.max(0, dragStartRef.current.cropY + deltaY);
          newCrop.width = Math.max(minSize, dragStartRef.current.cropWidth - deltaX);
          newCrop.height = Math.max(minSize, dragStartRef.current.cropHeight - deltaY);
          break;
        case 'topRight':
          newCrop.y = Math.max(0, dragStartRef.current.cropY + deltaY);
          newCrop.width = Math.max(minSize, dragStartRef.current.cropWidth + deltaX);
          newCrop.height = Math.max(minSize, dragStartRef.current.cropHeight - deltaY);
          break;
        case 'bottomLeft':
          newCrop.x = Math.max(0, dragStartRef.current.cropX + deltaX);
          newCrop.width = Math.max(minSize, dragStartRef.current.cropWidth - deltaX);
          newCrop.height = Math.max(minSize, dragStartRef.current.cropHeight + deltaY);
          break;
        case 'bottomRight':
          newCrop.width = Math.max(minSize, dragStartRef.current.cropWidth + deltaX);
          newCrop.height = Math.max(minSize, dragStartRef.current.cropHeight + deltaY);
          break;
      }
      
      // Constrain to screen bounds
      if (newCrop.x + newCrop.width > SCREEN_WIDTH) {
        newCrop.width = SCREEN_WIDTH - newCrop.x;
      }
      if (newCrop.y + newCrop.height > CROP_CONTAINER_HEIGHT) {
        newCrop.height = CROP_CONTAINER_HEIGHT - newCrop.y;
      }
      
      setCropArea(newCrop);
    } else {
      // Moving
      let newX = dragStartRef.current.cropX + deltaX;
      let newY = dragStartRef.current.cropY + deltaY;
      
      // Constrain to screen bounds
      newX = Math.max(0, Math.min(newX, SCREEN_WIDTH - cropArea.width));
      newY = Math.max(0, Math.min(newY, CROP_CONTAINER_HEIGHT - cropArea.height));
      
      setCropArea({ ...cropArea, x: newX, y: newY });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setResizeHandle(null);
  };

  const handleConfirmCrop = async () => {
    try {
      setIsProcessing(true);

      // Calculate the actual image bounds in the display
      const imageAspect = imageSize.width / imageSize.height;
      const containerAspect = SCREEN_WIDTH / CROP_CONTAINER_HEIGHT;
      
      let displayWidth, displayHeight, offsetX, offsetY;
      
      if (imageAspect > containerAspect) {
        // Image is wider - fit width
        displayWidth = SCREEN_WIDTH;
        displayHeight = SCREEN_WIDTH / imageAspect;
        offsetX = 0;
        offsetY = (CROP_CONTAINER_HEIGHT - displayHeight) / 2;
      } else {
        // Image is taller - fit height
        displayHeight = CROP_CONTAINER_HEIGHT;
        displayWidth = CROP_CONTAINER_HEIGHT * imageAspect;
        offsetX = (SCREEN_WIDTH - displayWidth) / 2;
        offsetY = 0;
      }

      // Convert crop area from display coordinates to image coordinates
      const scaleX = imageSize.width / displayWidth;
      const scaleY = imageSize.height / displayHeight;
      
      const cropConfig = {
        originX: Math.max(0, Math.round((cropArea.x - offsetX) * scaleX)),
        originY: Math.max(0, Math.round((cropArea.y - offsetY) * scaleY)),
        width: Math.min(imageSize.width, Math.round(cropArea.width * scaleX)),
        height: Math.min(imageSize.height, Math.round(cropArea.height * scaleY)),
      };

      // Ensure valid crop dimensions
      cropConfig.originX = Math.max(0, Math.min(cropConfig.originX, imageSize.width - 1));
      cropConfig.originY = Math.max(0, Math.min(cropConfig.originY, imageSize.height - 1));
      cropConfig.width = Math.max(1, Math.min(cropConfig.width, imageSize.width - cropConfig.originX));
      cropConfig.height = Math.max(1, Math.min(cropConfig.height, imageSize.height - cropConfig.originY));

      console.log('=== CROP DEBUG ===');
      console.log('Image size:', imageSize);
      console.log('Display size:', { displayWidth, displayHeight, offsetX, offsetY });
      console.log('Crop area (display):', cropArea);
      console.log('Crop config (image):', cropConfig);
      console.log('Scale factors:', { scaleX, scaleY });

      const manipResult = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ crop: cropConfig }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      console.log('Cropped image saved at:', manipResult.uri);
      console.log('Cropped image size:', manipResult.width, 'x', manipResult.height);
      
      setShowCropEditor(false);
      await processImage(manipResult.uri);
    } catch (error) {
      setShowCropEditor(false);
      setIsProcessing(false);
      console.error('Crop error:', error);
      Alert.alert('Error', 'Failed to crop image. Please try again.');
    }
  };

  const handleCancelCrop = () => {
    setShowCropEditor(false);
  };

  const handleSkipCrop = async () => {
    await processImage(imageUri);
  };

  const processImage = async (uri) => {
    try {
      setIsProcessing(true);
      console.log('Processing image...');
      
      const ocrResult = await extractTextFromImage(uri);
      
      console.log('OCR Result:', {
        textLength: ocrResult.text.length,
        confidence: ocrResult.confidence,
      });

      setIsProcessing(false);

      if (!ocrResult.text || ocrResult.text.trim().length === 0) {
        Alert.alert(
          'No Text Found',
          'Could not detect any text in the image. Try adjusting the crop or retaking the photo.',
          [
            { text: 'Retake', onPress: () => navigation.goBack() },
            { text: 'Continue Anyway', onPress: () => navigateToResult(uri, ocrResult) },
          ]
        );
        return;
      }

      navigateToResult(uri, ocrResult);
    } catch (error) {
      setIsProcessing(false);
      console.error('OCR processing error:', error);
      Alert.alert(
        'OCR Error',
        error.message || 'Failed to extract text. Please try again.',
        [
          { text: 'Retake', onPress: () => navigation.goBack() },
          { text: 'Try Again', onPress: () => processImage(uri) },
        ]
      );
    }
  };

  const navigateToResult = (uri, ocrResult) => {
    navigation.navigate('Result', {
      imageUri: uri,
      extractedText: ocrResult.text,
      confidence: ocrResult.confidence,
      timestamp: new Date().toISOString(),
      language: ocrResult.language || 'eng',
      orientation: ocrResult.orientation || 0,
    });
  };

  if (showCropEditor) {
    return (
      <View style={styles.container}>
        <View style={styles.cropHeader}>
          <TouchableOpacity onPress={handleCancelCrop} style={styles.headerButton}>
            <Icon name="close" family="Ionicons" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.cropHeaderTitle}>Crop Image</Text>
          <TouchableOpacity onPress={handleConfirmCrop} style={styles.headerButton}>
            <Icon name="checkmark" family="Ionicons" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View 
          style={styles.cropContainer}
          onStartShouldSetResponder={() => true}
          onResponderGrant={handleTouchStart}
          onResponderMove={handleTouchMove}
          onResponderRelease={handleTouchEnd}
        >
          <Image
            source={{ uri: imageUri }}
            style={styles.cropImage}
            resizeMode="contain"
            onLoad={(e) => {
              const { width, height } = e.nativeEvent.source;
              setImageSize({ width, height });
              console.log('Image loaded:', { width, height });
            }}
          />
          
          {/* Dark overlay with transparent crop area */}
          <View style={styles.overlayContainer} pointerEvents="none">
            <View style={[styles.overlayDark, { height: cropArea.y }]} />
            <View style={{ flexDirection: 'row', height: cropArea.height }}>
              <View style={[styles.overlayDark, { width: cropArea.x }]} />
              <View style={{ width: cropArea.width }} />
              <View style={[styles.overlayDark, { flex: 1 }]} />
            </View>
            <View style={[styles.overlayDark, { flex: 1 }]} />
          </View>
          
          {/* Crop box */}
          <View
            style={[
              styles.cropBox,
              {
                left: cropArea.x,
                top: cropArea.y,
                width: cropArea.width,
                height: cropArea.height,
              },
            ]}
            pointerEvents="none"
          >
            {/* Corner handles */}
            <View style={[styles.cropHandle, styles.handleTopLeft]} />
            <View style={[styles.cropHandle, styles.handleTopRight]} />
            <View style={[styles.cropHandle, styles.handleBottomLeft]} />
            <View style={[styles.cropHandle, styles.handleBottomRight]} />
            
            {/* Grid lines */}
            <View style={styles.gridLine1} />
            <View style={styles.gridLine2} />
            <View style={styles.gridLine3} />
            <View style={styles.gridLine4} />
            
            {/* Center icon */}
            <View style={styles.cropCenter}>
              <Icon name="move" family="Ionicons" size={28} color="rgba(255,255,255,0.6)" />
            </View>
          </View>
        </View>

        <View style={styles.cropInstructions}>
          <Icon name="information-circle" size={20} color="#2196F3" />
          <Text style={styles.cropInstructionsText}>
            Drag to move • Drag corners to resize • Tap ✓ to crop
          </Text>
        </View>
      </View>
    );
  }

  if (!imageUri) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Icon name="alert-circle" family="Ionicons" size={64} color="#EF4444" />
        <Text style={styles.errorText}>No image to crop</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" family="Ionicons" size={20} color="#fff" />
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isProcessing) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.processingText}>Processing image...</Text>
        <Text style={styles.processingSubtext}>Extracting text from image</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="information-circle" size={24} color="#2196F3" />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Crop Your Image</Text>
          <Text style={styles.headerSubtitle}>
            Crop to focus on text for better accuracy
          </Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton]}
          onPress={handleManualCrop}
        >
          <Icon name="crop" family="Ionicons" size={28} color="#fff" />
          <View style={styles.buttonTextContainer}>
            <Text style={styles.primaryButtonText}>Crop Image</Text>
            <Text style={styles.buttonSubtext}>Drag and resize to select area</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={handleSkipCrop}
        >
          <Icon name="checkmark-circle-outline" family="Ionicons" size={28} color="#2196F3" />
          <View style={styles.buttonTextContainer}>
            <Text style={styles.secondaryButtonText}>Use Full Image</Text>
            <Text style={[styles.buttonSubtext, styles.secondarySubtext]}>Process without cropping</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.tertiaryButton]}
          onPress={() => navigation.goBack()}
        >
          <Icon name="camera-outline" family="Ionicons" size={28} color="#666" />
          <View style={styles.buttonTextContainer}>
            <Text style={styles.tertiaryButtonText}>Retake Photo</Text>
            <Text style={[styles.buttonSubtext, styles.tertiarySubtext]}>Capture again</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>💡 Tips for better results:</Text>
        <Text style={styles.tipText}>• Crop close to the text area</Text>
        <Text style={styles.tipText}>• Remove backgrounds and borders</Text>
        <Text style={styles.tipText}>• Ensure text is straight and clear</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cropHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  cropHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  headerButton: {
    padding: 8,
  },
  cropContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cropImage: {
    width: SCREEN_WIDTH,
    height: CROP_CONTAINER_HEIGHT,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayDark: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  cropBox: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#fff',
  },
  cropHandle: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#2196F3',
    borderRadius: 15,
  },
  handleTopLeft: {
    top: -15,
    left: -15,
  },
  handleTopRight: {
    top: -15,
    right: -15,
  },
  handleBottomLeft: {
    bottom: -15,
    left: -15,
  },
  handleBottomRight: {
    bottom: -15,
    right: -15,
  },
  gridLine1: {
    position: 'absolute',
    left: '33.33%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  gridLine2: {
    position: 'absolute',
    left: '66.66%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  gridLine3: {
    position: 'absolute',
    top: '33.33%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  gridLine4: {
    position: 'absolute',
    top: '66.66%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  cropCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -16,
    marginLeft: -16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cropInstructions: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 15,
    gap: 10,
  },
  cropInstructionsText: {
    flex: 1,
    fontSize: 14,
    color: '#1976D2',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 20,
    marginBottom: 20,
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#1976D2',
    lineHeight: 20,
  },
  actionsContainer: {
    padding: 20,
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    gap: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  buttonTextContainer: {
    flex: 1,
  },
  primaryButton: {
    backgroundColor: '#2196F3',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  tertiaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2196F3',
    marginBottom: 4,
  },
  tertiaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  buttonSubtext: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  secondarySubtext: {
    color: '#64B5F6',
  },
  tertiarySubtext: {
    color: '#999',
  },
  tipsContainer: {
    margin: 20,
    padding: 16,
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F57C00',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#F57C00',
    marginBottom: 6,
    lineHeight: 20,
  },
  processingText: {
    fontSize: 18,
    color: '#333',
    marginTop: 20,
    fontWeight: '600',
  },
  processingSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginVertical: 20,
    fontWeight: '500',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
    gap: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
