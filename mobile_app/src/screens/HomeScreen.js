import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  const handleCapturePress = () => {
    navigation.navigate('Camera');
  };

  const handleHistoryPress = () => {
    navigation.navigate('History');
  };

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  const handleHelpPress = () => {
    Alert.alert(
      'How to Use',
      '1. Tap "Capture Signboard" to take a photo\n2. Point your camera at any signboard\n3. Tap the capture button\n4. Listen to the extracted text\n\nFor best results, ensure good lighting and hold the camera steady.',
      [{ text: 'Got it!' }]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/logo/iriz-high-resolution-logo-transparent-blue.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.appTitle}>Iriz</Text>
              <Text style={styles.appSubtitle}>Signboard Reader</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigation.navigate('Settings')}
              activeOpacity={0.7}
            >
              <Image
                source={require('../../assets/icons/bx-user.png')}
                style={styles.headerIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleSettingsPress}
              activeOpacity={0.7}
            >
              <Image
                source={require('../../assets/icons/bx-key-alt.png')}
                style={styles.headerIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Main Capture Action */}
        <View style={styles.mainActionContainer}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={handleCapturePress}
            activeOpacity={0.9}
          >
            <View style={styles.captureIconContainer}>
              <Image
                source={require('../../assets/icons/bx-image.png')}
                style={styles.captureIcon}
              />
            </View>
            <View style={styles.captureTextContainer}>
              <Text style={styles.captureText}>Start Capture</Text>
              <Text style={styles.captureSubtext}>Take a photo to read text aloud</Text>
            </View>
            <View style={styles.captureArrow}>
              <Image
                source={require('../../assets/icons/bx-arrow-right-stroke.png')}
                style={styles.arrowIcon}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>QUICK ACCESS</Text>
          
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={handleHistoryPress}
              activeOpacity={0.8}
            >
              <View style={styles.actionIconContainer}>
                <Image
                  source={require('../../assets/icons/bx-save.png')}
                  style={styles.actionIcon}
                />
              </View>
              <Text style={styles.actionTitle}>History</Text>
              <Text style={styles.actionDescription}>Past captures</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={handleHelpPress}
              activeOpacity={0.8}
            >
              <View style={styles.actionIconContainer}>
                <Image
                  source={require('../../assets/icons/bx-info-square.png')}
                  style={styles.actionIcon}
                />
              </View>
              <Text style={styles.actionTitle}>Help</Text>
              <Text style={styles.actionDescription}>How to use</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>FEATURES</Text>
          
          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <Image
                source={require('../../assets/icons/bx-waveform.png')}
                style={styles.featureIcon}
              />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Audio Playback</Text>
              <Text style={styles.featureDescription}>
                Listen to detected text with natural voice
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <Image
                source={require('../../assets/icons/bx-wifi-slash.png')}
                style={styles.featureIcon}
              />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Offline Mode</Text>
              <Text style={styles.featureDescription}>
                Works completely offline, no internet required
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <Image
                source={require('../../assets/icons/bx-microphone-big.png')}
                style={styles.featureIcon}
              />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Voice Control</Text>
              <Text style={styles.featureDescription}>
                Control playback with voice commands
              </Text>
            </View>
          </View>
        </View>

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <View style={styles.tipsHeader}>
            <Image
              source={require('../../assets/icons/bx-info-shield.png')}
              style={styles.tipsIcon}
            />
            <Text style={styles.tipsTitle}>Pro Tips</Text>
          </View>
          
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <View style={styles.tipBullet} />
              <Text style={styles.tipText}>Hold camera steady for accurate text detection</Text>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipBullet} />
              <Text style={styles.tipText}>Use in well-lit conditions for best results</Text>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipBullet} />
              <Text style={styles.tipText}>Ensure text is clearly visible in frame</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#0000FF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  logo: {
    width: 36,
    height: 36,
  },
  headerTextContainer: {
    flex: 1,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0000FF',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  appSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 11,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    width: 22,
    height: 22,
    tintColor: '#0000FF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  mainActionContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  captureButton: {
    backgroundColor: '#0000FF',
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#0000FF',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  captureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  captureIcon: {
    width: 32,
    height: 32,
    tintColor: '#FFFFFF',
  },
  captureTextContainer: {
    flex: 1,
  },
  captureText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  captureSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  captureArrow: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowIcon: {
    width: 20,
    height: 20,
    tintColor: '#FFFFFF',
  },
  quickActions: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.8,
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
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
  actionIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  actionIcon: {
    width: 28,
    height: 28,
    tintColor: '#0000FF',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  actionDescription: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  featuresSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureIcon: {
    width: 26,
    height: 26,
    tintColor: '#0000FF',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  tipsSection: {
    marginHorizontal: 24,
    backgroundColor: '#F0F4FF',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#0000FF',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tipsIcon: {
    width: 22,
    height: 22,
    tintColor: '#0000FF',
    marginRight: 10,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0000FF',
    letterSpacing: -0.2,
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0000FF',
    marginTop: 6,
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    fontWeight: '500',
  },
});
