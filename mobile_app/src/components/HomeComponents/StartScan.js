import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Icon from '../Icon';

export default function StartScan({ onPress }) {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <Icon name="scan-outline" family="Ionicons" size={26} color="#FFFFFF" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Start Scan</Text>
          <Text style={styles.subtitle}>Point your camera and read any sign</Text>
        </View>
        <View style={styles.arrowContainer}>
          <Icon
            name="arrow-forward-outline"
            family="Ionicons"
            size={22}
            color="#FFFFFF"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#1D4ED8',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#1D4ED8',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
