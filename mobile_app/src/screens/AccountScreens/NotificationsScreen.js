import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState({
    pushNotifications: true,
    captureReminders: true,
    newsUpdates: false,
    securityAlerts: true,
    emailNotifications: true,
  });

  const toggleNotification = (key) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key],
    });
  };

  const NotificationItem = ({ icon, title, subtitle, value, onToggle }) => (
    <View style={styles.notificationItem}>
      <View style={styles.notificationLeft}>
        <View style={styles.iconBox}>
          <Icon name={icon} family="Ionicons" size={20} color="#1D4ED8" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.itemTitle}>{title}</Text>
          <Text style={styles.itemSubtitle}>{subtitle}</Text>
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
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Push Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PUSH NOTIFICATIONS</Text>
          <View style={styles.card}>
            <NotificationItem
              icon="notifications"
              title="Push Notifications"
              subtitle="Receive notifications from Iriz"
              value={notifications.pushNotifications}
              onToggle={() => toggleNotification('pushNotifications')}
            />
            <View style={styles.separator} />
            <NotificationItem
              icon="camera"
              title="Capture Reminders"
              subtitle="Get reminded to capture signboards"
              value={notifications.captureReminders}
              onToggle={() => toggleNotification('captureReminders')}
            />
            <View style={styles.separator} />
            <NotificationItem
              icon="newspaper"
              title="News & Updates"
              subtitle="Stay updated with new features"
              value={notifications.newsUpdates}
              onToggle={() => toggleNotification('newsUpdates')}
            />
          </View>
        </View>

        {/* Security & Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SECURITY & ACCOUNT</Text>
          <View style={styles.card}>
            <NotificationItem
              icon="lock-closed"
              title="Security Alerts"
              subtitle="Get notified about account security"
              value={notifications.securityAlerts}
              onToggle={() => toggleNotification('securityAlerts')}
            />
            <View style={styles.separator} />
            <NotificationItem
              icon="mail"
              title="Email Notifications"
              subtitle="Receive important updates via email"
              value={notifications.emailNotifications}
              onToggle={() => toggleNotification('emailNotifications')}
            />
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Icon name="information-circle" family="Ionicons" size={24} color="#2196F3" />
            <Text style={styles.infoText}>
              You can manage detailed notification preferences in your device settings.
            </Text>
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
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  notificationLeft: {
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
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '400',
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 68,
  },
  infoSection: {
    marginTop: 16,
  },
  infoCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1D4ED8',
    fontWeight: '500',
    lineHeight: 20,
  },
});
