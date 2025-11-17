import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import Icon from '../../components/Icon';

export default function NewsScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.emptyState}>
          <Icon name="newspaper-outline" family="Ionicons" size={64} color="#9CA3AF" />
          <Text style={styles.title}>News & Updates</Text>
          <Text style={styles.subtitle}>
            Stay tuned for the latest features and announcements
          </Text>
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
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 24,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 280,
  },
});
