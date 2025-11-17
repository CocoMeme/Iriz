import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from '../components/Icon';

import HomeScreen from '../screens/HomeScreens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreens/HistoryScreen';
import CameraScreen from '../screens/CameraScreens/CameraScreen';
import NewsScreen from '../screens/NewsScreens/NewsScreen';
import AccountScreen from '../screens/AccountScreens/AccountScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#1D4ED8',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E7EB',
          height: 64,
          paddingBottom: 8,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home-outline';

          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'History') {
            iconName = 'time-outline';
          } else if (route.name === 'Camera') {
            iconName = 'camera-outline';
          } else if (route.name === 'News') {
            iconName = 'newspaper-outline';
          } else if (route.name === 'Account') {
            iconName = 'person-outline';
          }

          return (
            <Icon
              name={iconName}
              family="Ionicons"
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Camera" component={CameraScreen} />
      <Tab.Screen name="News" component={NewsScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}
