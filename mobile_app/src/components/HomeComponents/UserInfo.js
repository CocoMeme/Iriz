import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from '../Icon';

export default function UserInfo({ name = 'User', onNotificationsPress }) {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
        </View>
        <View>
          <Text style={styles.greeting}>Good day,</Text>
          <Text style={styles.name}>{name}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.notificationButton}
        onPress={onNotificationsPress}
        activeOpacity={0.7}
      >
        <Icon name="notifications-outline" family="Ionicons" size={24} color="#111827" />
        <View style={styles.badge} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 24,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  greeting: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
});
