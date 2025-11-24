import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
  StatusBar,
  Share as RNShare,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import { getDatabaseStats, exportCapturesToJSON } from '../../services/storageService';
import { getCacheStats, clearAllImages } from '../../services/imageCacheService';
import Icon from '../../components/Icon';

const SETTINGS_KEY = '@iriz_settings';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const [settings, setSettings] = useState({
    autoSpeak: true,
    highQuality: false,
    vibration: true,
    speechRate: 1.0,
    showLanding: true,
    developerMode: false,
  });
  const [cacheStats, setCacheStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
    loadStats();
  }, []);

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem(SETTINGS_KEY);
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Load settings error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const cacheData = await getCacheStats();
      setCacheStats(cacheData);
    } catch (error) {
      console.error('Load stats error:', error);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Save settings error:', error);
    }
  };

  const toggleSetting = (key) => {
    const newSettings = {
      ...settings,
      [key]: !settings[key],
    };
    saveSettings(newSettings);
  };

  const handleExportData = async () => {
    try {
      const jsonData = await exportCapturesToJSON();
      
      // Create shareable file
      Alert.alert(
        'Export Data',
        'Your data has been prepared for export',
        [
          {
            text: 'Share',
            onPress: async () => {
              try {
                await RNShare.share({
                  message: jsonData,
                  title: 'Iriz Capture History',
                });
              } catch (error) {
                console.error('Share error:', error);
              }
            },
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will delete all stored images but keep text history. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllImages();
              await loadStats();
              Alert.alert('Success', 'Image cache cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear cache');
            }
          },
        },
      ]
    );
  };

  const handleTestTTS = () => {
    Speech.speak('This is a test of the text to speech feature. Hello from Iriz!', {
      rate: settings.speechRate,
    });
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Icon name="arrow-back" family="Ionicons" size={24} color="#1D4ED8" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Speech Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AUDIO & SPEECH</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={styles.iconBox}>
                  <Icon name="volume-high" family="Ionicons" size={20} color="#1D4ED8" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.optionText}>Auto-speak Text</Text>
                  <Text style={styles.optionSubtext}>Automatically read text after capture</Text>
                </View>
              </View>
              <Switch
                value={settings.autoSpeak}
                onValueChange={() => toggleSetting('autoSpeak')}
                trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
                thumbColor={settings.autoSpeak ? '#2196F3' : '#F3F4F6'}
                ios_backgroundColor="#E5E7EB"
              />
            </View>
            
            <View style={styles.separator} />
            
            <TouchableOpacity 
              style={styles.option}
              onPress={handleTestTTS}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                <View style={styles.iconBox}>
                  <Icon name="mic" family="Ionicons" size={20} color="#1D4ED8" />
                </View>
                <View>
                  <Text style={styles.optionText}>Test Text-to-Speech</Text>
                  <Text style={styles.optionSubtext}>Hear a sample</Text>
                </View>
              </View>
              <Icon name="chevron-forward-outline" family="Ionicons" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Camera Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CAMERA</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={styles.iconBox}>
                  <Icon name="camera" family="Ionicons" size={20} color="#1D4ED8" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.optionText}>High Quality Images</Text>
                  <Text style={styles.optionSubtext}>Better accuracy, larger file size</Text>
                </View>
              </View>
              <Switch
                value={settings.highQuality}
                onValueChange={() => toggleSetting('highQuality')}
                trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
                thumbColor={settings.highQuality ? '#2196F3' : '#F3F4F6'}
                ios_backgroundColor="#E5E7EB"
              />
            </View>
          </View>
        </View>

        {/* General Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GENERAL</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={styles.iconBox}>
                  <Icon name="phone-portrait-outline" family="Ionicons" size={20} color="#1D4ED8" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.optionText}>Vibration Feedback</Text>
                  <Text style={styles.optionSubtext}>Vibrate on capture and events</Text>
                </View>
              </View>
              <Switch
                value={settings.vibration}
                onValueChange={() => toggleSetting('vibration')}
                trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
                thumbColor={settings.vibration ? '#2196F3' : '#F3F4F6'}
                ios_backgroundColor="#E5E7EB"
              />
            </View>
            
            <View style={styles.separator} />
            
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={styles.iconBox}>
                  <Icon name="information-circle-outline" family="Ionicons" size={20} color="#1D4ED8" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.optionText}>Show Landing Page</Text>
                  <Text style={styles.optionSubtext}>Display tutorial on app start</Text>
                </View>
              </View>
              <Switch
                value={settings.showLanding}
                onValueChange={() => toggleSetting('showLanding')}
                trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
                thumbColor={settings.showLanding ? '#2196F3' : '#F3F4F6'}
                ios_backgroundColor="#E5E7EB"
              />
            </View>

            <View style={styles.separator} />

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={styles.iconBox}>
                  <Icon name="code-slash-outline" family="Ionicons" size={20} color="#1D4ED8" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.optionText}>Developer Mode</Text>
                  <Text style={styles.optionSubtext}>Enable advanced debugging tools</Text>
                </View>
              </View>
              <Switch
                value={settings.developerMode}
                onValueChange={() => toggleSetting('developerMode')}
                trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
                thumbColor={settings.developerMode ? '#2196F3' : '#F3F4F6'}
                ios_backgroundColor="#E5E7EB"
              />
            </View>
          </View>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DATA MANAGEMENT</Text>
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.option}
              onPress={handleExportData}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                <View style={styles.iconBox}>
                  <Icon name="share-social" family="Ionicons" size={20} color="#1D4ED8" />
                </View>
                <View>
                  <Text style={styles.optionText}>Export History</Text>
                  <Text style={styles.optionSubtext}>Share your capture history</Text>
                </View>
              </View>
              <Icon name="chevron-forward-outline" family="Ionicons" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            
            <View style={styles.separator} />
            
            <TouchableOpacity 
              style={styles.option}
              onPress={handleClearCache}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                <View style={styles.iconBox}>
                  <Icon name="trash" family="Ionicons" size={20} color="#1D4ED8" />
                </View>
                <View>
                  <Text style={styles.optionText}>Clear Image Cache</Text>
                  <Text style={styles.optionSubtext}>{cacheStats ? cacheStats.totalSizeFormatted : 'Free up space'}</Text>
                </View>
              </View>
              <Icon name="chevron-forward-outline" family="Ionicons" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ABOUT</Text>
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.option}
              onPress={() => Alert.alert('Version', 'Iriz Version 1.0.0\nBuild: 2025.01')}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                <View style={styles.iconBox}>
                  <Icon name="information-circle-outline" family="Ionicons" size={20} color="#1D4ED8" />
                </View>
                <View>
                  <Text style={styles.optionText}>App Version</Text>
                  <Text style={styles.optionSubtext}>Iriz v1.0.0</Text>
                </View>
              </View>
              <Icon name="chevron-forward-outline" family="Ionicons" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            
            <View style={styles.separator} />
            
            <TouchableOpacity 
              style={styles.option}
              onPress={() => Alert.alert('Terms', 'Terms & Privacy Policy')}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                <View style={styles.iconBox}>
                  <Icon name="document-text-outline" family="Ionicons" size={20} color="#1D4ED8" />
                </View>
                <View>
                  <Text style={styles.optionText}>Terms & Privacy</Text>
                  <Text style={styles.optionSubtext}>View our policies</Text>
                </View>
              </View>
              <Icon name="chevron-forward-outline" family="Ionicons" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            
            <View style={styles.separator} />
            
            <TouchableOpacity 
              style={styles.option}
              onPress={() => Alert.alert('Feedback', 'Thank you for your interest!')}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                <View style={styles.iconBox}>
                  <Icon name="chatbubble-ellipses-outline" family="Ionicons" size={20} color="#1D4ED8" />
                </View>
                <View>
                  <Text style={styles.optionText}>Send Feedback</Text>
                  <Text style={styles.optionSubtext}>Help us improve</Text>
                </View>
              </View>
              <Icon name="chevron-forward-outline" family="Ionicons" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    paddingHorizontal: 8,
    marginBottom: 10,
    letterSpacing: 0.8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
      },
    }),
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  settingLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  optionSubtext: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '400',
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 68,
  },
});
