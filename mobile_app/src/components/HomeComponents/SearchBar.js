import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from '../Icon';

export default function SearchBar({ value, onChangeText, onFilterPress }) {
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Icon
          name="search-outline"
          family="Ionicons"
          size={20}
          color="#9CA3AF"
        />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Search scans…"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          returnKeyType="search"
        />
      </View>

      <TouchableOpacity
        style={styles.filterButton}
        onPress={onFilterPress}
        activeOpacity={0.7}
      >
        <Icon name="options-outline" family="Ionicons" size={20} color="#111827" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 46,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  input: {
    flex: 1,
    marginLeft: 6,
    fontSize: 14,
    color: '#111827',
  },
  filterButton: {
    marginLeft: 10,
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
});
