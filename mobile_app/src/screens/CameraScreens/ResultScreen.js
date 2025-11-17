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
  Platform,
  StatusBar,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as Speech from 'expo-speech';
import { saveCapture } from '../../services/storageService';
import { saveImage } from '../../services/imageCacheService';
import Icon from '../../components/Icon';

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
  
  // Calculate average confidence from detections
  const avgConfidence = detections && detections.length > 0
    ? detections.reduce((sum, det) => sum + (det.confidence || 0), 0) / detections.length
    : confidence || 0;
  
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
      
      console.log('Saving capture to database...');
      
      let savedImageUri = null;
      let thumbnailUri = null;
      
      // Save boxed image to permanent storage if exists (download from Cloudinary)
      if (boxedImageUri) {
        const imageInfo = await saveImage(boxedImageUri);
        savedImageUri = imageInfo.imageUri;
        thumbnailUri = imageInfo.thumbnailUri;
      }
      
      // Calculate average confidence from detections
      const avgConfidence = detections && detections.length > 0
        ? detections.reduce((sum, det) => sum + (det.confidence || 0), 0) / detections.length
        : confidence || 0;
      
      // Save to database with full detection data
      const captureData = {
        imageUri: savedImageUri,
        thumbnailUri: thumbnailUri,
        boxedImageUrl: boxedImageUri, // Store Cloudinary URL
        text: allExtractedText || extractedText || 'No text detected',
        confidence: avgConfidence,
        timestamp: timestamp || new Date().toISOString(),
        language: language || 'eng',
        orientation: orientation || 0,
        detections: detections || [], // Store full detections array with Cloudinary URLs
      };
      
      const captureId = await saveCapture(captureData);
      console.log('Capture saved successfully with ID:', captureId);
      
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
    navigation.navigate('Main', { screen: 'Home' });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Image Preview */}
      <View style={styles.imageContainer}>
        {boxedImageUri ? (
          <Image source={{ uri: boxedImageUri }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Icon name="image-outline" family="Ionicons" size={48} color="#6B7280" />
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Quick Actions Bar */}
        <View style={styles.quickActionsBar}>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={speakText}
          >
            <View style={[styles.quickActionIcon, isSpeaking && styles.quickActionIconActive]}>
              <Icon 
                name={isSpeaking ? 'volume-high' : 'volume-medium'} 
                family="Ionicons" 
                size={20} 
                color={isSpeaking ? '#FFFFFF' : '#0000FF'} 
              />
            </View>
            <Text style={styles.quickActionText}>{isSpeaking ? 'Stop' : 'Listen'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAction}
            onPress={handleSave}
            disabled={isSaving || isSaved}
          >
            <View style={[styles.quickActionIcon, (isSaving || isSaved) && styles.quickActionIconDisabled]}>
              {isSaving ? (
                <ActivityIndicator size="small" color="#0000FF" />
              ) : (
                <Icon 
                  name={isSaved ? 'checkmark-circle' : 'bookmark-outline'} 
                  family="Ionicons" 
                  size={20} 
                  color={isSaved ? '#4CAF50' : '#0000FF'} 
                />
              )}
            </View>
            <Text style={styles.quickActionText}>{isSaved ? 'Saved' : isSaving ? 'Saving' : 'Save'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAction}
            onPress={handleShare}
          >
            <View style={styles.quickActionIcon}>
              <Icon name="share-social" family="Ionicons" size={20} color="#0000FF" />
            </View>
            <Text style={styles.quickActionText}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Detected Signboards */}
        {detections && detections.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="scan" family="Ionicons" size={18} color="#0000FF" />
              <Text style={styles.sectionTitle}>Detected Signboards ({detections.length})</Text>
            </View>
            <ScrollView horizontal style={styles.signboardScroll} showsHorizontalScrollIndicator={false}>
              {detections.map((det, idx) => {
                const [imgWidth, setImgWidth] = React.useState(0);
                const [imgHeight, setImgHeight] = React.useState(0);

                React.useEffect(() => {
                  Image.getSize(det.cropped_url, (width, height) => {
                    const maxHeight = 90;
                    const scaleFactor = maxHeight / height;
                    setImgWidth(width * scaleFactor);
                    setImgHeight(maxHeight);
                  });
                }, [det.cropped_url]);

                return (
                  <View key={idx} style={styles.signboardCard}>
                    <View style={styles.signboardNumber}>
                      <Text style={styles.signboardNumberText}>{idx + 1}</Text>
                    </View>
                    <Image
                      source={{ uri: det.cropped_url }}
                      style={{ width: imgWidth, height: imgHeight, borderRadius: 8 }}
                      resizeMode="contain"
                    />
                    {det.extracted_text && (
                      <Text style={styles.signboardText} numberOfLines={2}>
                        {det.extracted_text}
                      </Text>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Extracted Text */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="text" family="Ionicons" size={18} color="#0000FF" />
            <Text style={styles.sectionTitle}>Extracted Text</Text>
          </View>
          <View style={styles.textCard}>
            <Text style={styles.extractedText}>
              {allExtractedText || 'No text detected in the image'}
            </Text>
          </View>
        </View>

        {/* Metadata */}
        {(avgConfidence !== undefined || timestamp) && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="analytics" family="Ionicons" size={18} color="#0000FF" />
              <Text style={styles.sectionTitle}>Details</Text>
            </View>
            <View style={styles.metadataCard}>
              {avgConfidence !== undefined && avgConfidence > 0 && (
                <View style={styles.metadataRow}>
                  <Text style={styles.metadataLabel}>Confidence</Text>
                  <View style={styles.confidenceContainer}>
                    <View style={styles.confidenceBar}>
                      <View 
                        style={[
                          styles.confidenceBarFill, 
                          { 
                            width: `${avgConfidence}%`,
                            backgroundColor: avgConfidence > 70 ? '#0000FF' : avgConfidence > 40 ? '#FFA500' : '#FF4444'
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.confidenceText}>{avgConfidence.toFixed(0)}%</Text>
                  </View>
                </View>
              )}
              
              {timestamp && (
                <View style={styles.metadataRow}>
                  <Text style={styles.metadataLabel}>Captured</Text>
                  <Text style={styles.metadataValue}>
                    {new Date(timestamp).toLocaleString()}
                  </Text>
                </View>
              )}
              
              {detections && detections.length > 0 && (
                <View style={styles.metadataRow}>
                  <Text style={styles.metadataLabel}>Signboards Found</Text>
                  <Text style={styles.metadataValue}>
                    {detections.length} {detections.length === 1 ? 'signboard' : 'signboards'}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={handleRetake}
        >
          <Icon name="camera" family="Ionicons" size={22} color="#0000FF" />
          <Text style={styles.navButtonText}>Retake</Text>
        </TouchableOpacity>

        <View style={styles.navDivider} />

        <TouchableOpacity
          style={styles.navButton}
          onPress={handleHome}
        >
          <Icon name="home" family="Ionicons" size={22} color="#0000FF" />
          <Text style={styles.navButtonText}>Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  scrollContent: {
    flex: 1,
  },
  // Quick Actions Bar
  quickActionsBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#0000FF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  quickActionIconActive: {
    backgroundColor: '#0000FF',
  },
  quickActionIconDisabled: {
    backgroundColor: '#F3F4F6',
    opacity: 0.6,
  },
  quickActionText: {
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  // Section Styles
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: -0.2,
  },
  // Signboard Cards
  signboardScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  signboardCard: {
    marginRight: 12,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    minWidth: 100,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  signboardNumber: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0000FF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  signboardNumberText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  signboardText: {
    fontSize: 11,
    marginTop: 8,
    color: '#6B7280',
    fontWeight: '600',
    textAlign: 'center',
    maxWidth: 100,
  },
  // Text Card
  textCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 120,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  extractedText: {
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 26,
    fontWeight: '500',
  },
  // Metadata Card
  metadataCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  metadataRow: {
    gap: 8,
  },
  metadataLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  metadataValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  confidenceContainer: {
    gap: 8,
  },
  confidenceBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  confidenceBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  confidenceText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  // Bottom Navigation
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 32 : 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: '#F0F4FF',
    borderRadius: 12,
  },
  navDivider: {
    width: 12,
  },
  navButtonText: {
    fontSize: 15,
    color: '#0000FF',
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
