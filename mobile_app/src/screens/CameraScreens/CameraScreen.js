import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  StatusBar,
  Image,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { GestureHandlerRootView, PinchGestureHandler, State } from 'react-native-gesture-handler';
import { detectSignboard } from '../../services/api';
import Icon from '../../components/Icon';

export default function CameraScreen() {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const [facing, setFacing] = useState('back');
  const [zoom, setZoom] = useState(0);
  const [flash, setFlash] = useState('off');
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [showCropOption, setShowCropOption] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  useFocusEffect(
    React.useCallback(() => {
      setIsProcessing(false);
      // Hide navigation bar when camera screen is focused
      navigation.setOptions({
        headerShown: false,
        tabBarStyle: { display: 'none' },
      });
      
      return () => {
        // Show navigation bar when leaving camera screen
        navigation.setOptions({
          tabBarStyle: { display: 'flex' },
        });
      };
    }, [navigation])
  );

  if (!permission) {
    return (
      <View style={[styles.container, { backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0000FF" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }]}>
        <View style={styles.logoContainer}>
          <Icon name="camera" family="Ionicons" size={48} color="#0000FF" />
        </View>
        <Text style={styles.permissionText}>
          Camera permission is required to capture signboards
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCapture = async () => {
    if (!cameraRef.current || isProcessing) return;
    setIsProcessing(true);

    try {
      // Capture the photo
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        exif: false,
      });

      setIsProcessing(false);
      setCapturedPhoto(photo.uri);
      setShowCropOption(true);
    } catch (error) {
      setIsProcessing(false);
      Alert.alert('Error', 'Failed to capture image. Please try again.');
      console.error('Capture error:', error);
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    setShowCropOption(false);
  };

  const handleOkay = async () => {
    if (!capturedPhoto) return;
    await processImage(capturedPhoto);
  };

  const handleCropImage = () => {
    if (!capturedPhoto) return;
    // Navigate to crop screen with the captured photo
    navigation.navigate('ImageCrop', {
      imageUri: capturedPhoto,
    });
    // Reset camera state
    setCapturedPhoto(null);
    setShowCropOption(false);
  };

  const processImage = async (uri) => {
    try {
      setIsProcessing(true);
      console.log('Processing image with signboard detection...');
      
      // Call backend API to detect signboards
      const detectionResults = await detectSignboard(uri);
      
      console.log('Detection Results:', {
        detectionsCount: detectionResults.detections?.length || 0,
        hasBoxedImage: !!detectionResults.boxed_image_url,
      });

      setIsProcessing(false);
      setCapturedPhoto(null);
      setShowCropOption(false);

      if (!detectionResults.detections || detectionResults.detections.length === 0) {
        Alert.alert(
          'No Signboards Detected',
          'Could not detect any signboards in the image. Try adjusting the angle or retaking the photo.',
          [
            { text: 'Retake', onPress: handleRetake },
            { text: 'OK' },
          ]
        );
        return;
      }

      // Navigate to Result screen
      navigation.navigate('Result', {
        boxedImageUri: detectionResults.boxed_image_url,
        detections: detectionResults.detections,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      setIsProcessing(false);
      console.error('Detection processing error:', error);
      Alert.alert(
        'Detection Error',
        error.message || 'Failed to detect signboards. Please try again.',
        [
          { text: 'Retake', onPress: handleRetake },
          { text: 'Try Again', onPress: () => processImage(uri) },
        ]
      );
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash(current => {
      if (current === 'off') return 'on';
      if (current === 'on') return 'auto';
      return 'off';
    });
  };

  const getFlashIcon = () => {
    switch (flash) {
      case 'on':
        return 'flash';
      case 'auto':
        return 'flash-outline';
      default:
        return 'flash-off';
    }
  };

  const handlePinchGesture = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      const velocity = event.nativeEvent.velocity;
      let newZoom = zoom;

      if (velocity > 0) {
        newZoom = Math.min(zoom + 0.05, 1);
      } else {
        newZoom = Math.max(zoom - 0.05, 0);
      }

      setZoom(newZoom);
    }
  };

  const handleZoomIn = () => {
    setZoom(current => Math.min(current + 0.1, 1));
  };

  const handleZoomOut = () => {
    setZoom(current => Math.max(current - 0.1, 0));
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar hidden={true} barStyle="dark-content" />
      <PinchGestureHandler onGestureEvent={handlePinchGesture}>
        <View style={styles.container}>
          <CameraView
            style={styles.camera}
            facing={facing}
            ref={cameraRef}
            zoom={zoom}
            enableTorch={flash === 'on'}
          >
            <View style={styles.overlay}>
              {/* Top Bar with Safe Area */}
              <View style={styles.topBar}>
                <TouchableOpacity
                  style={styles.topBarButton}
                  onPress={() => navigation.goBack()}
                >
                  <Icon name="close" family="Ionicons" size={24} color="#1F2937" />
                </TouchableOpacity>
                
                <View style={styles.topBarSpacer} />
                
                <TouchableOpacity
                  style={styles.topBarButton}
                  onPress={toggleFlash}
                >
                  <Icon name={getFlashIcon()} family="Ionicons" size={22} color="#1F2937" />
                </TouchableOpacity>
              </View>

              {/* Center Frame Guide */}
              <View style={styles.frameGuide}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </View>

              {/* Instructions Tooltip */}
              <View style={styles.instructionTooltip}>
                <Icon name="information-circle" family="Ionicons" size={18} color="#0000FF" />
                <Text style={styles.tooltipText}>Position signboard within frame</Text>
              </View>

              {/* Side Controls */}
              <View style={styles.sideControls}>
                {/* Flip Camera */}
                <TouchableOpacity
                  style={styles.sideButton}
                  onPress={toggleCameraFacing}
                >
                  <Icon name="camera-reverse" family="Ionicons" size={28} color="#FFFFFF" />
                </TouchableOpacity>

                {/* Zoom Controls */}
                <View style={styles.zoomControls}>
                  <TouchableOpacity
                    style={styles.sideButton}
                    onPress={handleZoomIn}
                  >
                    <Icon name="add" family="Ionicons" size={24} color="#FFFFFF" />
                  </TouchableOpacity>
                  <View style={styles.zoomIndicatorSide}>
                    <Text style={styles.zoomTextSide}>{(zoom * 10).toFixed(1)}x</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.sideButton}
                    onPress={handleZoomOut}
                  >
                    <Icon name="remove" family="Ionicons" size={24} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Bottom Capture Button (only show when no photo captured) */}
              {!showCropOption && !isProcessing && (
                <View style={styles.bottomCaptureArea}>
                  <TouchableOpacity
                    style={styles.captureButtonContainer}
                    onPress={handleCapture}
                    activeOpacity={0.8}
                  >
                    <View style={styles.captureButton}>
                      <View style={styles.captureButtonInner} />
                    </View>
                    <Text style={styles.captureLabel}>Capture</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </CameraView>

          {/* Captured Photo Preview */}
          {capturedPhoto && (
            <View style={styles.previewOverlay}>
              <Image
                source={{ uri: capturedPhoto }}
                style={styles.previewImage}
                resizeMode="contain"
              />
            </View>
          )}

          {/* Processing Indicator */}
          {isProcessing && (
            <View style={styles.processingOverlay}>
              <View style={styles.captureButtonProcessing}>
                <ActivityIndicator size="large" color="#0000FF" />
              </View>
              <Text style={styles.processingLabel}>Processing...</Text>
            </View>
          )}

          {/* Action Buttons */}
          {showCropOption && !isProcessing && (
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleRetake}
                activeOpacity={0.8}
              >
                <Icon name="camera" family="Ionicons" size={24} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Retake</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleCropImage}
                activeOpacity={0.8}
              >
                <Icon name="crop" family="Ionicons" size={24} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Crop</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleOkay}
                activeOpacity={0.8}
              >
                <Icon name="checkmark" family="Ionicons" size={24} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Okay</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </PinchGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  // Top Bar Styles
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
  },
  topBarButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  topBarSpacer: {
    flex: 1,
  },
  // Frame Guide Styles
  frameGuide: {
    position: 'absolute',
    top: '25%',
    left: '10%',
    right: '10%',
    bottom: '25%',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: 'rgba(0, 0, 255, 0.8)',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 12,
  },
  // Instruction Tooltip
  instructionTooltip: {
    position: 'absolute',
    top: '20%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  tooltipText: {
    color: '#1F2937',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  // Side Controls
  sideControls: {
    position: 'absolute',
    right: 20,
    top: '40%',
    gap: 24,
    alignItems: 'center',
  },
  sideButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  zoomControls: {
    alignItems: 'center',
    gap: 12,
  },
  zoomIndicatorSide: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  zoomTextSide: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  // Bottom Capture Area
  bottomCaptureArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 50 : 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Capture Button Styles
  captureButtonContainer: {
    alignItems: 'center',
    gap: 8,
  },
  captureButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#0000FF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#0000FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#0000FF',
  },
  captureButtonProcessing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0000FF',
  },
  captureLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: -0.1,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  // Preview Overlay
  previewOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  // Processing Overlay
  processingOverlay: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 50 : 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 12,
  },
  processingLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: -0.1,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  // Action Buttons
  actionButtonsContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 50 : 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 6,
    backgroundColor: '#0000FF',
    ...Platform.select({
      ios: {
        shadowColor: '#0000FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  // Loading/Permission States
  processingContainer: {
    alignItems: 'center',
    gap: 12,
  },
  processingText: {
    color: '#1F2937',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#0000FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  permissionText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
    fontWeight: '500',
    maxWidth: 280,
  },
  button: {
    backgroundColor: '#0000FF',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#0000FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
