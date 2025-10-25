import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Image,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const [settings, setSettings] = useState({
    autoSpeak: true,
    saveHistory: true,
    offlineMode: true,
    highQuality: false,
    vibration: true,
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
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

  const SettingItem = ({ title, subtitle, value, onToggle, iconSource }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          <Image source={iconSource} style={styles.settingIcon} />
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
        thumbColor={value ? '#0000FF' : '#F3F4F6'}
        ios_backgroundColor="#E5E7EB"
      />
    </View>
  );

  const ActionItem = ({ title, iconSource, onPress, danger = false }) => (
    <TouchableOpacity
      style={styles.actionItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Image 
          source={iconSource} 
          style={[
            styles.settingIcon,
            danger && { tintColor: '#EF4444' }
          ]} 
        />
      </View>
      <Text style={[styles.actionTitle, danger && styles.dangerText]}>
        {title}
      </Text>
      <Text style={styles.actionArrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Customize your experience</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AUDIO & SPEECH</Text>
        <View style={styles.card}>
          <SettingItem
            iconSource={require('../../assets/icons/bx-waveform.png')}
            title="Auto-speak Text"
            subtitle="Automatically read text after capture"
            value={settings.autoSpeak}
            onToggle={() => toggleSetting('autoSpeak')}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>STORAGE & PRIVACY</Text>
        <View style={styles.card}>
          <SettingItem
            iconSource={require('../../assets/icons/bx-save.png')}
            title="Save History"
            subtitle="Store captured images and text"
            value={settings.saveHistory}
            onToggle={() => toggleSetting('saveHistory')}
          />
          <View style={styles.separator} />
          <SettingItem
            iconSource={require('../../assets/icons/bx-wifi-slash.png')}
            title="Offline Mode"
            subtitle="Work without internet connection"
            value={settings.offlineMode}
            onToggle={() => toggleSetting('offlineMode')}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CAMERA</Text>
        <View style={styles.card}>
          <SettingItem
            iconSource={require('../../assets/icons/bx-image.png')}
            title="High Quality"
            subtitle="Better accuracy, larger file size"
            value={settings.highQuality}
            onToggle={() => toggleSetting('highQuality')}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ACCESSIBILITY</Text>
        <View style={styles.card}>
          <SettingItem
            iconSource={require('../../assets/icons/bx-volume-mute.png')}
            title="Vibration Feedback"
            subtitle="Vibrate on capture and events"
            value={settings.vibration}
            onToggle={() => toggleSetting('vibration')}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ACCOUNT</Text>
        <View style={styles.card}>
          <ActionItem
            iconSource={require('../../assets/icons/bx-user.png')}
            title="Profile"
            onPress={() => Alert.alert('Profile', 'Profile settings coming soon')}
          />
          <View style={styles.separator} />
          <ActionItem
            iconSource={require('../../assets/icons/bx-key-alt.png')}
            title="Privacy & Security"
            onPress={() => Alert.alert('Privacy', 'Privacy settings coming soon')}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ABOUT</Text>
        <View style={styles.card}>
          <ActionItem
            iconSource={require('../../assets/icons/bx-info-square.png')}
            title="App Version"
            onPress={() => Alert.alert('Version', 'Iriz v1.0.0')}
          />
          <View style={styles.separator} />
          <ActionItem
            iconSource={require('../../assets/icons/bx-file-detail.png')}
            title="Terms & Conditions"
            onPress={() => Alert.alert('Terms', 'Terms & Conditions coming soon')}
          />
          <View style={styles.separator} />
          <ActionItem
            iconSource={require('../../assets/icons/bx-info-shield.png')}
            title="Privacy Policy"
            onPress={() => Alert.alert('Privacy', 'Privacy Policy coming soon')}
          />
          <View style={styles.separator} />
          <ActionItem
            iconSource={require('../../assets/icons/bx-message-exclamation.png')}
            title="Send Feedback"
            onPress={() => Alert.alert('Feedback', 'Thank you for your interest!')}
          />
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Image
            source={require('../../assets/icons/bx-user.png')}
            style={styles.logoutIcon}
          />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Image
          source={require('../../assets/icons/bx-ear.png')}
          style={styles.footerIcon}
        />
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
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
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
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingIcon: {
    width: 24,
    height: 24,
    tintColor: '#0000FF',
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
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
  },
  dangerText: {
    color: '#EF4444',
  },
  actionArrow: {
    fontSize: 20,
    color: '#D1D5DB',
    fontWeight: '300',
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 76,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    backgroundColor: '#EF4444',
    marginHorizontal: 16,
    borderRadius: 16,
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
  logoutIcon: {
    width: 22,
    height: 22,
    tintColor: '#FFFFFF',
    marginRight: 10,
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
  },
  footerIcon: {
    width: 24,
    height: 24,
    tintColor: '#9CA3AF',
    marginBottom: 12,
  },
  footerText: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
});
