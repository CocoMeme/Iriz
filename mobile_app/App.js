import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Animated, Alert } from 'react-native';

import CameraScreen from './src/screens/CameraScreens/CameraScreen';
import ImageCropScreen from './src/screens/CameraScreens/ImageCropScreen';
import ResultScreen from './src/screens/CameraScreens/ResultScreen';
import SettingsScreen from './src/screens/AccountScreens/SettingsScreen';
import LandingScreen from './src/screens/OtherScreens/LandingScreen';
import SplashScreen from './src/screens/OtherScreens/SplashScreen';
import AppNavigator from './src/navigation/AppNavigator';

// Import storage services
import { initDatabase } from './src/services/storageService';
import { initImageCache } from './src/services/imageCacheService';

const Stack = createStackNavigator();

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Initialize database and image cache
    const initialize = async () => {
      try {
        await initDatabase();
        await initImageCache();
        console.log('App initialized successfully');
        setIsInitialized(true);
      } catch (error) {
        console.error('App initialization error:', error);
        Alert.alert(
          'Initialization Error',
          'Failed to initialize the app. Please restart.',
          [{ text: 'OK' }]
        );
      }
    };
    
    initialize();
  }, []);

  useEffect(() => {
    // Wait 2 seconds, then fade out
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setShowSplash(false);
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash || !isInitialized) {
    return (
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <SplashScreen />
      </Animated.View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LandingScreen}
        />
        <Stack.Screen 
          name="Main" 
          component={AppNavigator}
        />
        <Stack.Screen 
          name="Camera" 
          component={CameraScreen}
          options={{ 
            headerShown: true,
            title: 'Capture Signboard',
            headerStyle: { backgroundColor: '#0247ae' },
            headerTintColor: '#ffffff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <Stack.Screen 
          name="ImageCrop" 
          component={ImageCropScreen}
          options={{ 
            headerShown: true,
            title: 'Crop & Process',
            headerStyle: { backgroundColor: '#0247ae' },
            headerTintColor: '#ffffff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <Stack.Screen 
          name="Result" 
          component={ResultScreen}
          options={{ 
            headerShown: true,
            title: 'Result',
            headerStyle: { backgroundColor: '#FFFFFF' },
            headerTintColor: '#1F2937',
            headerTitleStyle: { fontWeight: 'bold' },
            headerShadowVisible: true,
          }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{ 
            headerShown: true,
            title: 'Settings',
            headerStyle: { backgroundColor: '#0247ae' },
            headerTintColor: '#ffffff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
