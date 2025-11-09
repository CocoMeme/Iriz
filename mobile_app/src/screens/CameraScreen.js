import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { GestureHandlerRootView, PinchGestureHandler, State } from 'react-native-gesture-handler';
import { detectSignboard } from '../services/api';

export default function CameraScreen() {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCamera, setShowCamera] = useState(true); // NEW STATE
  const [facing, setFacing] = useState('back');
  const [zoom, setZoom] = useState(0);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  useFocusEffect(
    React.useCallback(() => {
      setShowCamera(true);
      setIsProcessing(false);
    }, [])
  );

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
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
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        exif: false,
      });

      setShowCamera(false); // Hide camera immediately

      // Call backend to detect signboards
      const detectionResults = await detectSignboard(photo.uri);

      setIsProcessing(false);
      navigation.navigate('Result', {
        boxedImageUri: detectionResults.boxed_image_url,
        detections: detectionResults.detections,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      setIsProcessing(false);
      setShowCamera(true); // Show camera again if error
      Alert.alert('Error', 'Failed to capture or process image. Please try again.');
      console.error('Capture error:', error);
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
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

  if (!showCamera) {
    // Show loading while processing
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.processingText}>Processing image...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <PinchGestureHandler onGestureEvent={handlePinchGesture}>
        <View style={styles.container}>
          <CameraView
            style={styles.camera}
            facing={facing}
            ref={cameraRef}
            zoom={zoom}
          >
            <View style={styles.overlay}>
              <View style={styles.topControls}>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => navigation.goBack()}
                >
                  <Text style={styles.controlIcon}>✕</Text>
                </TouchableOpacity>
                <View style={styles.zoomIndicator}>
                  <Text style={styles.zoomText}>{(zoom * 10).toFixed(1)}x</Text>
                </View>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={toggleCameraFacing}
                >
                  <Text style={styles.controlIcon}>🔄</Text>
                </TouchableOpacity>
              </View>

          <View style={styles.instructions}>
            <Text style={styles.instructionText}>
              Align the signboard within the camera frame
            </Text>
            <Text style={styles.instructionSubtext}>
              Ensure good lighting and hold steady
            </Text>
          </View>

          <View style={styles.bottomControls}>
            <View style={styles.zoomControls}>
              <TouchableOpacity
                style={styles.zoomButton}
                onPress={handleZoomOut}
              >
                <Text style={styles.zoomButtonText}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.zoomButton}
                onPress={handleZoomIn}
              >
                <Text style={styles.zoomButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            {isProcessing ? (
              <View style={styles.processingContainer}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.processingText}>Processing image...</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.captureButton}
                onPress={handleCapture}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </CameraView>
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
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlIcon: {
    fontSize: 24,
    color: '#fff',
  },
  zoomIndicator: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
  },
  zoomText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#2196F3',
    borderWidth: 4,
  },
  topLeft: {
    top: -2,
    left: -2,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 20,
  },
  topRight: {
    top: -2,
    right: -2,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 20,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 20,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 20,
  },
  instructions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    padding: 20,
  },
  instructionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  instructionSubtext: {
    color: '#E3F2FD',
    fontSize: 14,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
    alignItems: 'center',
  },
  zoomControls: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  zoomButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  zoomButtonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  processingContainer: {
    alignItems: 'center',
  },
  processingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 15,
    fontWeight: '600',
  },
  permissionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginHorizontal: 40,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
