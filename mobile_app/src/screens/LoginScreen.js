import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';

WebBrowser.maybeCompleteAuthSession();

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '83738139667-b95p2b728lcvf0q8pr50eka8k5cjrsvh.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
  });

  useEffect(() => {
    if (!response) return;

    if (response.type === 'success') {
      setIsLoading(true);
      const { authentication } = response;
      
      // Fetch user info from Google
      fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${authentication.accessToken}` }
      })
      .then(res => res.json())
      .then(async (userInfo) => {
        // Save token and user data
        await SecureStore.setItemAsync('auth_token', authentication.accessToken);
        await SecureStore.setItemAsync('user_data', JSON.stringify({
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
        }));
        
        console.log('Logged in:', userInfo.name);
        navigation.replace('Home');
      })
      .catch((error) => {
        setIsLoading(false);
        Alert.alert('Login Failed', error.message);
      });
    } else if (response.type === 'error') {
      setIsLoading(false);
      Alert.alert('Error', 'Failed to sign in. Please try again.');
    } else if (response.type === 'cancel') {
      setIsLoading(false);
    }
  }, [response]);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    promptAsync().catch(() => {
      setIsLoading(false);
      Alert.alert('Error', 'Could not start sign in.');
    });
  };

  const handleGuestMode = () => {
    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <View style={styles.gradientContainer}>
        <View style={styles.gradientTop} />
      </View>

      {/* Content Container */}
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/logo/iriz-high-resolution-logo-transparent-blue.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.appName}>Iriz</Text>
          <View style={styles.taglineContainer}>
            <Image
              source={require('../../assets/icons/bx-ear.png')}
              style={styles.taglineIcon}
            />
            <Text style={styles.tagline}>See the world through sound</Text>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Welcome</Text>
            <Text style={styles.descriptionText}>
              Sign in to unlock all features and sync your data across devices
            </Text>
          </View>

          {/* Google Sign-In Button */}
          <TouchableOpacity
            style={[styles.googleButton, isLoading && styles.buttonDisabled]}
            onPress={handleGoogleLogin}
            disabled={isLoading || !request}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <View style={styles.buttonContent}>
                <View style={styles.googleIconContainer}>
                  <Text style={styles.googleIcon}>G</Text>
                </View>
                <Text style={styles.googleButtonText}>Continue with Google</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          {/* Guest Mode Button */}
          <TouchableOpacity
            style={[styles.guestButton, isLoading && styles.buttonDisabled]}
            onPress={handleGuestMode}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Image
                source={require('../../assets/icons/bx-user.png')}
                style={styles.guestIcon}
              />
              <Text style={styles.guestButtonText}>Continue as Guest</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <View style={styles.featureItem}>
            <Image
              source={require('../../assets/icons/bx-image.png')}
              style={styles.featureIcon}
            />
            <Text style={styles.featureText}>Capture & Read</Text>
          </View>
          <View style={styles.featureDivider} />
          <View style={styles.featureItem}>
            <Image
              source={require('../../assets/icons/bx-waveform.png')}
              style={styles.featureIcon}
            />
            <Text style={styles.featureText}>Audio Output</Text>
          </View>
          <View style={styles.featureDivider} />
          <View style={styles.featureItem}>
            <Image
              source={require('../../assets/icons/bx-save.png')}
              style={styles.featureIcon}
            />
            <Text style={styles.featureText}>Save History</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  gradientContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.45,
  },
  gradientTop: {
    flex: 1,
    backgroundColor: '#F0F4FF',
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
  },
  logoSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 50,
  },
  logoContainer: {
    width: 110,
    height: 110,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#0000FF',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  logo: {
    width: 85,
    height: 85,
  },
  appName: {
    fontSize: 42,
    fontWeight: '800',
    color: '#0000FF',
    letterSpacing: -1,
    marginBottom: 12,
  },
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taglineIcon: {
    width: 18,
    height: 18,
    tintColor: '#6B7280',
  },
  tagline: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  welcomeSection: {
    marginBottom: 36,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  descriptionText: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    fontWeight: '400',
  },
  googleButton: {
    backgroundColor: '#0000FF',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#0000FF',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIconContainer: {
    backgroundColor: '#FFFFFF',
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  googleIcon: {
    fontSize: 20,
    color: '#0000FF',
    fontWeight: 'bold',
  },
  googleButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '600',
  },
  guestButton: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#0000FF',
    backgroundColor: '#FFFFFF',
  },
  guestIcon: {
    width: 24,
    height: 24,
    tintColor: '#0000FF',
    marginRight: 12,
  },
  guestButtonText: {
    color: '#0000FF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  featuresSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    paddingVertical: 28,
    marginBottom: Platform.OS === 'ios' ? 30 : 20,
    marginHorizontal: 24,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    width: 32,
    height: 32,
    marginBottom: 10,
    tintColor: '#0000FF',
  },
  featureText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  featureDivider: {
    width: 1,
    height: 50,
    backgroundColor: '#E5E7EB',
  },
});

// Helper functions for other components to use
export const getAuthToken = async () => {
  return await SecureStore.getItemAsync('auth_token');
};

export const getCurrentUser = async () => {
  const userDataString = await SecureStore.getItemAsync('user_data');
  return userDataString ? JSON.parse(userDataString) : null;
};

export const logout = async () => {
  await SecureStore.deleteItemAsync('auth_token');
  await SecureStore.deleteItemAsync('user_data');
};

export const isAuthenticated = async () => {
  const token = await getAuthToken();
  return !!token;
};
