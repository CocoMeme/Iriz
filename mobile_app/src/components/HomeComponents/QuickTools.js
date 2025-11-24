import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from '../Icon';

const tools = [
  { id: 'history', label: 'History', icon: 'time-outline' },
  { id: 'favorites', label: 'Favorites', icon: 'heart-outline' },
  { id: 'analytics', label: 'Analytics', icon: 'bar-chart-outline' },
  { id: 'account', label: 'Account', icon: 'person-outline' },
  { id: 'settings', label: 'Settings', icon: 'settings-outline' },
];

export default function QuickTools({ onToolPress }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>QUICK TOOLS</Text>
      <View style={styles.row}>
        {tools.map(tool => (
          <TouchableOpacity
            key={tool.id}
            style={styles.tool}
            activeOpacity={0.7}
            onPress={() => onToolPress && onToolPress(tool.id)}
          >
            <View style={styles.iconCircle}>
              <Icon
                name={tool.icon}
                family="Ionicons"
                size={22}
                color="#1D4ED8"
              />
            </View>
            <Text style={styles.label}>{tool.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tool: {
    flex: 1,
    alignItems: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
  },
});
