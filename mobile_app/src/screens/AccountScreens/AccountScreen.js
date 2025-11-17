import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import Icon from '../../components/Icon';

export default function AccountScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>IU</Text>
          </View>
          <Text style={styles.name}>Iriz User</Text>
          <Text style={styles.email}>user@iriz.app</Text>
        </View>

        {/* Account Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.option}>
              <View style={styles.optionLeft}>
                <Icon name="person-outline" family="Ionicons" size={22} color="#1D4ED8" />
                <Text style={styles.optionText}>Edit Profile</Text>
              </View>
              <Icon name="chevron-forward-outline" family="Ionicons" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity style={styles.option}>
              <View style={styles.optionLeft}>
                <Icon name="lock-closed-outline" family="Ionicons" size={22} color="#1D4ED8" />
                <Text style={styles.optionText}>Privacy & Security</Text>
              </View>
              <Icon name="chevron-forward-outline" family="Ionicons" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity style={styles.option}>
              <View style={styles.optionLeft}>
                <Icon name="notifications-outline" family="Ionicons" size={22} color="#1D4ED8" />
                <Text style={styles.optionText}>Notifications</Text>
              </View>
              <Icon name="chevron-forward-outline" family="Ionicons" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign Out */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.signOutButton}>
            <Icon name="log-out-outline" family="Ionicons" size={22} color="#EF4444" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
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
    paddingTop: 60,
    paddingBottom: 24,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  email: {
    fontSize: 15,
    color: '#6B7280',
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
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 50,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        borderWidth: 1,
        borderColor: '#FEE2E2',
      },
    }),
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EF4444',
  },
});
