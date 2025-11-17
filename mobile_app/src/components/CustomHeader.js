import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CustomHeader = ({ title, showBackButton = false }) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.headerContainer}>
        <View style={styles.leftSection}>
          {showBackButton && (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.centerSection}>
          <Text style={styles.title}>{title}</Text>
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#0000FF',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0000FF',
    paddingHorizontal: 16,
    height: 60,
  },
  leftSection: {
    width: 50,
    justifyContent: 'center',
  },
  backButton: {
    padding: 5,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  rightSection: {
    width: 50,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  iconButton: {
    padding: 5,
  },
});

export default CustomHeader;

