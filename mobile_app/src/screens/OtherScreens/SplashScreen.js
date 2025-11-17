import React, { useEffect, useRef } from 'react';
import { View, Image, Text, StyleSheet, Dimensions, Animated, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Image
          source={require('../../../assets/logo/iriz-high-resolution-logo-transparent-blue.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.text}>Iriz</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.4,
    height: height * 0.2,
    marginBottom: 20,
  },
  text: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#0000FF',
    letterSpacing: 2,
  },
});
