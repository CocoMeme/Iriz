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
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as Speech from 'expo-speech';

export default function ResultScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { imageUri, extractedText, timestamp } = route.params || {};
  
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Auto-play text on screen load
    if (extractedText) {
      speakText();
    }
    
    return () => {
      Speech.stop();
    };
  }, []);

  const speakText = async () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    Speech.speak(extractedText || 'No text detected', {
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => {
        setIsSpeaking(false);
        Alert.alert('Error', 'Failed to play text-to-speech');
      },
    });
  };

  const handleSave = () => {
    // TODO: Implement save to SQLite
    Alert.alert('Saved', 'Result saved to history');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: extractedText || 'No text detected',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share text');
    }
  };

  const handleRetake = () => {
    Speech.stop();
    navigation.goBack();
  };

  const handleHome = () => {
    Speech.stop();
    navigation.navigate('Home');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
      </View>

      <View style={styles.textContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Extracted Text</Text>
          <TouchableOpacity onPress={speakText} style={styles.speakerButton}>
            <Text style={styles.speakerIcon}>{isSpeaking ? '🔊' : '🔈'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.textBox}>
          <Text style={styles.extractedText}>
            {extractedText || 'No text detected in the image'}
          </Text>
        </View>

        {timestamp && (
          <Text style={styles.timestamp}>
            Captured: {new Date(timestamp).toLocaleString()}
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton]}
          onPress={handleSave}
        >
          <Text style={styles.actionIcon}>💾</Text>
          <Text style={styles.primaryButtonText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={handleShare}
        >
          <Text style={styles.actionIcon}>📤</Text>
          <Text style={styles.secondaryButtonText}>Share</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.navigation}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={handleRetake}
        >
          <Text style={styles.navButtonText}>📸 Retake</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={handleHome}
        >
          <Text style={styles.navButtonText}>🏠 Home</Text>
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
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
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
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  speakerIcon: {
    fontSize: 24,
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
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
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
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  actionIcon: {
    fontSize: 20,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '600',
  },
  navigation: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 0,
    gap: 10,
  },
  navButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  navButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
});
