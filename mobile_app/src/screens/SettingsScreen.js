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
  Share as RNShare,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import { getDatabaseStats, exportCapturesToJSON } from '../services/storageService';
import { getCacheStats, clearAllImages } from '../services/imageCacheService';
import Icon from '../components/Icon';

const SETTINGS_KEY = '@iriz_settings';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const [settings, setSettings] = useState({
    autoSpeak: true,
    highQuality: false,
    vibration: true,
    speechRate: 1.0,
  });
  const [dbStats, setDbStats] = useState(null);
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
      const dbData = await getDatabaseStats();
      const cacheData = await getCacheStats();
      setDbStats(dbData);
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

  const SettingItem = ({ iconName, iconFamily = 'Ionicons', title, subtitle, value, onToggle }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          <Icon name={iconName} family={iconFamily} size={24} color="#2196F3" />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
        thumbColor={value ? '#2196F3' : '#F3F4F6'}
        ios_backgroundColor="#E5E7EB"
      />
    </View>
  );

  const ActionItem = ({ iconName, iconFamily = 'Ionicons', title, subtitle, onPress, danger = false }) => (
    <TouchableOpacity
      style={styles.actionItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Icon 
          name={iconName} 
          family={iconFamily} 
          size={24} 
          color={danger ? '#EF4444' : '#2196F3'} 
        />
      </View>
      <View style={styles.settingText}>
        <Text style={[styles.actionTitle, danger && styles.dangerText]}>
          {title}
        </Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <Icon name="chevron-forward" family="Ionicons" size={20} color="#D1D5DB" />
    </TouchableOpacity>
  );

  const StatItem = ({ label, value }) => (
    <View style={styles.statItem}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Customize your experience</Text>
      </View>

      {/* Storage Stats */}
      {(dbStats || cacheStats) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>STORAGE</Text>
          <View style={styles.card}>
            {dbStats && (
              <>
                <StatItem label="Total Captures" value={dbStats.totalCaptures} />
                <View style={styles.separator} />
                <StatItem 
                  label="Average Confidence" 
                  value={`${Math.round(dbStats.averageConfidence)}%`} 
                />
              </>
            )}
            {cacheStats && (
              <>
                <View style={styles.separator} />
                <StatItem 
                  label="Cache Size" 
                  value={cacheStats.totalSizeFormatted} 
                />
                <View style={styles.separator} />
                <StatItem 
                  label="Images Stored" 
                  value={cacheStats.captureCount} 
                />
              </>
            )}
          </View>
        </View>
      )}

      {/* Speech Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AUDIO & SPEECH</Text>
        <View style={styles.card}>
          <SettingItem
            iconName="volume-high"
            title="Auto-speak Text"
            subtitle="Automatically read text after capture"
            value={settings.autoSpeak}
            onToggle={() => toggleSetting('autoSpeak')}
          />
          <View style={styles.separator} />
          <ActionItem
            iconName="mic"
            title="Test Text-to-Speech"
            subtitle="Hear a sample"
            onPress={handleTestTTS}
          />
        </View>
      </View>

      {/* Camera Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CAMERA</Text>
        <View style={styles.card}>
          <SettingItem
            iconName="camera"
            title="High Quality Images"
            subtitle="Better accuracy, larger file size"
            value={settings.highQuality}
            onToggle={() => toggleSetting('highQuality')}
          />
        </View>
      </View>

      {/* App Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>GENERAL</Text>
        <View style={styles.card}>
          <SettingItem
            iconName="phone-portrait"
            iconFamily="Ionicons"
            title="Vibration Feedback"
            subtitle="Vibrate on capture and events"
            value={settings.vibration}
            onToggle={() => toggleSetting('vibration')}
          />
        </View>
      </View>

      {/* Data Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DATA MANAGEMENT</Text>
        <View style={styles.card}>
          <ActionItem
            iconName="share-social"
            title="Export History"
            subtitle="Share your capture history"
            onPress={handleExportData}
          />
          <View style={styles.separator} />
          <ActionItem
            iconName="trash"
            title="Clear Image Cache"
            subtitle={cacheStats ? cacheStats.totalSizeFormatted : 'Free up space'}
            onPress={handleClearCache}
          />
        </View>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ABOUT</Text>
        <View style={styles.card}>
          <ActionItem
            iconName="information-circle"
            title="App Version"
            subtitle="Iriz v1.0.0"
            onPress={() => Alert.alert('Version', 'Iriz Version 1.0.0\nBuild: 2025.01')}
          />
          <View style={styles.separator} />
          <ActionItem
            iconName="document-text"
            title="Terms & Privacy"
            subtitle="View our policies"
            onPress={() => Alert.alert('Terms', 'Terms & Privacy Policy')}
          />
          <View style={styles.separator} />
          <ActionItem
            iconName="chatbubble-ellipses"
            title="Send Feedback"
            subtitle="Help us improve"
            onPress={() => Alert.alert('Feedback', 'Thank you for your interest!')}
          />
        </View>
      </View>

      {/* Sign Out */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Icon name="log-out" family="Ionicons" size={22} color="#FFFFFF" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Icon name="eye" family="Ionicons" size={32} color="#9CA3AF" />
        <Text style={styles.footerText}>
          Iriz - Empowering accessibility through innovation
        </Text>
      </View>
    </ScrollView>
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
  header: {
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '400',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
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
        elevation: 2,
      },
    }),
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  settingLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  actionTitle: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
  },
  dangerText: {
    color: '#EF4444',
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  statLabel: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 60,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    backgroundColor: '#EF4444',
    marginHorizontal: 16,
    borderRadius: 16,
    gap: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  logoutText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  footer: {
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  footerText: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 12,
  },
});
