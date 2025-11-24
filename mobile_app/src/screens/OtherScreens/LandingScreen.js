import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from '../../components/Icon';

const { width } = Dimensions.get('window');

const tutorialSteps = [
  {
    id: '1',
    title: 'Welcome to Iriz',
    description: 'Your personal signboard reader. Let\'s get you started.',
    image: require('../../../assets/logo/iriz-high-resolution-logo-transparent-blue.png'),
    isScreenshot: false,
  },
  {
    id: '2',
    title: 'Step 1: Capture',
    description: 'Point your camera at any signboard and tap the capture button.',
    image: require('../../../assets/pictures/step1.jpg'),
    isScreenshot: true,
  },
  {
    id: '3',
    title: 'Step 2: Listen',
    description: 'Iriz automatically detects text and reads it aloud for you.',
    image: require('../../../assets/pictures/step2.jpg'),
    isScreenshot: true,
  },
  {
    id: '4',
    title: 'Ready to Go!',
    description: 'You are all set. Tap below to start exploring the world with sound.',
    image: require('../../../assets/pictures/step3.jpg'),
    isScreenshot: true,
  },
];

const TutorialSlide = ({ item }) => (
  <View style={styles.slideContainer}>
    <View style={[styles.imageContainer, item.isScreenshot && styles.screenshotContainer]}>
      {item.isScreenshot ? (
        <View style={styles.phoneFrame}>
          <View style={styles.phoneScreen}>
            <Image source={item.image} style={styles.screenshotImage} resizeMode="cover" />
          </View>
          <View style={styles.phoneNotch} />
        </View>
      ) : (
        <Image source={item.image} style={styles.slideImage} resizeMode="contain" />
      )}
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.stepTitle}>{item.title}</Text>
      <View style={styles.titleUnderline} />
      <Text style={styles.stepDescription}>{item.description}</Text>
    </View>
  </View>
);

export default function LandingScreen() {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleNext = () => {
    if (currentIndex < tutorialSteps.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({ index: currentIndex - 1 });
    }
  };

  const handleStart = async () => {
    try {
      await AsyncStorage.setItem('@iriz_show_landing', 'false');
    } catch (error) {
      console.error('Error saving setting:', error);
    }
    navigation.replace('Main');
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.header}>
        <Text style={styles.headerText}>How to Use</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={tutorialSteps}
        renderItem={({ item }) => <TutorialSlide item={item} />}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEventThrottle={16}
      />

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {tutorialSteps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          {currentIndex > 0 && (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Icon name="arrow-back" family="Ionicons" size={24} color="#0000FF" />
            </TouchableOpacity>
          )}

          {currentIndex < tutorialSteps.length - 1 ? (
            <TouchableOpacity style={styles.continueButton} onPress={handleNext}>
              <Text style={styles.buttonText}>Continue</Text>
              <Icon name="arrow-forward" family="Ionicons" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
              <Text style={styles.buttonText}>Get Started</Text>
              <Icon name="checkmark-circle" family="Ionicons" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>

        {currentIndex === tutorialSteps.length - 1 && (
          <View style={{ height: 20 }} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
  },
  slideContainer: {
    width: width,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  imageContainer: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F4FF',
    width: width * 0.8,
    borderRadius: 30,
    marginBottom: 0,
    padding: 20,
    marginTop: 10,
  },
  screenshotContainer: {
    backgroundColor: 'transparent',
    padding: 0,
    justifyContent: 'center',
  },
  phoneFrame: {
    width: width * 0.5,
    aspectRatio: 9/19,
    backgroundColor: '#1F2937',
    borderRadius: 24,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    position: 'relative',
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  screenshotImage: {
    width: '100%',
    height: '100%',
  },
  phoneNotch: {
    position: 'absolute',
    top: 12,
    alignSelf: 'center',
    width: '40%',
    height: 14,
    backgroundColor: '#1F2937',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    zIndex: 10,
  },
  slideImage: {
    width: '80%',
    height: '80%',
  },
  textContainer: {
    flex: 0.4,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  stepTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  titleUnderline: {
    width: 40,
    height: 4,
    backgroundColor: '#0000FF',
    borderRadius: 2,
    marginBottom: 20,
  },
  stepDescription: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  dotActive: {
    width: 25,
    backgroundColor: '#0000FF',
  },
  dotInactive: {
    width: 10,
    backgroundColor: '#D1D5DB',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 60,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: 16,
    borderRadius: 30,
    backgroundColor: '#F0F4FF',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0000FF',
    borderRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 40,
    gap: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#0000FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0000FF',
    borderRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 40,
    gap: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#0000FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F0F4FF',
    borderRadius: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#0000FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#0000FF',
    borderColor: '#0000FF',
  },
  checkboxLabel: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '500',
  },
});
