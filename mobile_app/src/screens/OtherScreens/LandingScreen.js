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
import Icon from '../../components/Icon';

const { width } = Dimensions.get('window');

const tutorialSteps = [
  {
    id: '1',
    title: 'Welcome to Iriz',
    description: 'Your personal signboard reader. Let\'s get you started.',
    image: require('../../../assets/logo/iriz-high-resolution-logo-transparent-blue.png'),
  },
  {
    id: '2',
    title: 'Step 1: Capture',
    description: 'Point your camera at any signboard and tap the capture button.',
    image: require('../../../assets/logo/iriz-high-resolution-logo-transparent-blue.png'),
  },
  {
    id: '3',
    title: 'Step 2: Listen',
    description: 'Iriz automatically detects text and reads it aloud for you.',
    image: require('../../../assets/logo/iriz-high-resolution-logo-transparent-blue.png'),
  },
  {
    id: '4',
    title: 'Ready to Go!',
    description: 'You are all set. Tap below to start exploring the world with sound.',
    image: require('../../../assets/logo/iriz-high-resolution-logo-transparent-blue.png'),
  },
];

const TutorialSlide = ({ item }) => (
  <View style={styles.slideContainer}>
    <View style={styles.imageContainer}>
      <Image source={item.image} style={styles.slideImage} resizeMode="contain" />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.stepTitle}>{item.title}</Text>
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

  const handleStart = () => {
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
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  imageContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F4FF',
    width: width * 0.8,
    borderRadius: 30,
    marginBottom: 40,
    padding: 20,
  },
  slideImage: {
    width: '80%',
    height: '80%',
  },
  textContainer: {
    flex: 0.3,
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0000FF',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  stepDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
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
});
