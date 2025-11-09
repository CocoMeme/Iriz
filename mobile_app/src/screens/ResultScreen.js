import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Share,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as Speech from 'expo-speech';
import { saveCapture } from '../services/storageService';
import { saveImage } from '../services/imageCacheService';
import Icon from '../components/Icon';

export default function ResultScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const {
    boxedImageUri,
    detections,
    timestamp,
    apiBaseUrl
  } = route.params || {};

  const { imageUri, extractedText, confidence, language, orientation } = route.params || {};
  
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Concatenate all extracted texts
  const allExtractedText = detections?.map(d => d.extracted_text).join('\n\n') || '';
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (allExtractedText) speakText();
    return () => Speech.stop();
  }, []);

  const speakText = async () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    Speech.speak(allExtractedText || 'No text detected', {
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => {
        setIsSpeaking(false);
        Alert.alert('Error', 'Failed to play text-to-speech');
      },
    });
  };

  const handleSave = async () => {
    if (isSaving || isSaved) {
      if (isSaved) {
        Alert.alert('Already Saved', 'This capture has already been saved to history');
      }
      return;
    }

    try {
      setIsSaving(true);
      
      let savedImageUri = null;
      let thumbnailUri = null;
      
      // Save image to permanent storage if exists
      if (imageUri) {
        const imageInfo = await saveImage(imageUri);
        savedImageUri = imageInfo.imageUri;
        thumbnailUri = imageInfo.thumbnailUri;
      }
      
      // Save to database
      const captureData = {
        imageUri: savedImageUri,
        thumbnailUri: thumbnailUri,
        text: extractedText || 'No text detected',
        confidence: confidence || 0,
        timestamp: timestamp || new Date().toISOString(),
        language: language || 'eng',
        orientation: orientation || 0,
      };
      
      const captureId = await saveCapture(captureData);
      
      setIsSaving(false);
      setIsSaved(true);
      
      Alert.alert(
        'Success',
        'Capture saved to history',
        [
          {
            text: 'View History',
            onPress: () => navigation.navigate('History'),
          },
          { text: 'OK' },
        ]
      );
    } catch (error) {
      setIsSaving(false);
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save capture. Please try again.');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: allExtractedText || 'No text detected',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share text');
    }
  };

  const handleRetake = () => {
    Speech.stop();
    navigation.navigate('Camera');
  };

  const handleHome = () => {
    Speech.stop();
    navigation.navigate('Home');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        {boxedImageUri ? (
          <Image source={{ uri: boxedImageUri }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Icon name="image-outline" family="Ionicons" size={48} color="#ccc" />
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
      </View>

      <Text style={styles.headerTitle}>Detected Signboards</Text>
      <ScrollView horizontal style={{ marginVertical: 10 }}>
        {detections?.map((det, idx) => {
          const [imgWidth, setImgWidth] = React.useState(0);
          const [imgHeight, setImgHeight] = React.useState(0);

          // Get original image size
          React.useEffect(() => {
            Image.getSize(det.cropped_url, (width, height) => {
              const maxHeight = 100; // max height for scrollview preview
              const scaleFactor = maxHeight / height;
              setImgWidth(width * scaleFactor);
              setImgHeight(maxHeight);
            });
          }, [det.cropped_url]);

          return (
            <View key={idx} style={{ marginRight: 10, alignItems: 'center' }}>
              <Image
                source={{ uri: det.cropped_url }}
                style={{ width: imgWidth, height: imgHeight, borderRadius: 8, borderWidth: 1, borderColor: '#2196F3' }}
                resizeMode="contain"
              />
              <Text style={{ fontSize: 12, marginTop: 4, color: '#333' }}>
                {det.extracted_text || 'No text'}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.textContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>All Extracted Text</Text>
          <TouchableOpacity onPress={speakText} style={styles.speakerButton}>
            <Icon 
              name={isSpeaking ? 'volume-high' : 'volume-medium'} 
              family="Ionicons" 
              size={24} 
              color="#2196F3" 
            />
          </TouchableOpacity>
        </View>
        <View style={styles.textBox}>
          <Text style={styles.extractedText}>
            {allExtractedText || 'No text detected in the image'}
          </Text>
        </View>

        <View style={styles.metadataContainer}>
          {confidence !== undefined && (
            <View style={styles.confidenceContainer}>
              <Text style={styles.metadataLabel}>Confidence:</Text>
              <View style={styles.confidenceBar}>
                <View 
                  style={[
                    styles.confidenceBarFill, 
                    { 
                      width: `${confidence}%`,
                      backgroundColor: confidence > 70 ? '#4CAF50' : confidence > 40 ? '#FFC107' : '#F44336'
                    }
                  ]} 
                />
              </View>
              <Text style={styles.confidenceText}>{confidence.toFixed(1)}%</Text>
            </View>
          )}
          
          {timestamp && (
            <Text style={styles.timestamp}>
              Captured: {new Date(timestamp).toLocaleString()}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton, (isSaving || isSaved) && styles.disabledButton]}
          onPress={handleSave}
          disabled={isSaving || isSaved}
        >
          {isSaving ? (
            <>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.primaryButtonText}>Saving...</Text>
            </>
          ) : (
            <>
              <Icon 
                name={isSaved ? 'checkmark-circle' : 'save'} 
                family="Ionicons" 
                size={20} 
                color="#fff" 
              />
              <Text style={styles.primaryButtonText}>{isSaved ? 'Saved' : 'Save'}</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={handleShare}
        >
          <Icon name="share-social" family="Ionicons" size={20} color="#2196F3" />
          <Text style={styles.secondaryButtonText}>Share</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.navigation}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={handleRetake}
        >
          <Icon name="camera" family="Ionicons" size={20} color="#666" />
          <Text style={styles.navButtonText}>Retake</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={handleHome}
        >
          <Icon name="home" family="Ionicons" size={20} color="#666" />
          <Text style={styles.navButtonText}>Home</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  imageContainer: {
    backgroundColor: '#000',
    aspectRatio: 4/3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  placeholderText: {
    color: '#999',
    fontSize: 14,
  },
  textContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  speakerButton: {
    padding: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    minHeight: 150,
  },
  extractedText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  metadataContainer: {
    marginTop: 15,
  },
  confidenceContainer: {
    marginBottom: 10,
  },
  metadataLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    fontWeight: '600',
  },
  confidenceBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 5,
  },
  confidenceBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  confidenceText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  actions: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 0,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
  },
  disabledButton: {
    backgroundColor: '#9E9E9E',
    opacity: 0.6,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  navigation: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 0,
    gap: 10,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    gap: 8,
  },
  navButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
});
