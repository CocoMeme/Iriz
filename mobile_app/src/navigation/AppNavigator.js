import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from '../components/Icon';

import HomeScreen from '../screens/HomeScreens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreens/HistoryScreen';
import CameraScreen from '../screens/CameraScreens/CameraScreen';
import AnalyticsScreen from '../screens/AnalyticsScreens/AnalyticsScreen';
import AccountScreen from '../screens/AccountScreens/AccountScreen';
import EditProfileScreen from '../screens/AccountScreens/EditProfileScreen';
import SettingsScreen from '../screens/AccountScreens/SettingsScreen';
import NotificationsScreen from '../screens/AccountScreens/NotificationsScreen';
import ActivityTrend from '../screens/AnalyticsScreens/ActivityTrend';
import ConfidenceDistribution from '../screens/AnalyticsScreens/ConfidenceDistribution';
import PeakScanningTimes from '../screens/AnalyticsScreens/PeakScanningTimes';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Account Stack Navigator
function AccountStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="AccountHome" component={AccountScreen} />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
        options={{
          animationEnabled: true,
        }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          animationEnabled: true,
        }}
      />
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{
          animationEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
}

// Analytics Stack Navigator
function AnalyticsStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="AnalyticsHome" component={AnalyticsScreen} />
      <Stack.Screen 
        name="ActivityTrend" 
        component={ActivityTrend}
        options={{
          animationEnabled: true,
        }}
      />
      <Stack.Screen 
        name="ConfidenceDistribution" 
        component={ConfidenceDistribution}
        options={{
          animationEnabled: true,
        }}
      />
      <Stack.Screen 
        name="PeakScanningTimes" 
        component={PeakScanningTimes}
        options={{
          animationEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
}

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
          } else if (route.name === 'Analytics') {
            iconName = 'bar-chart-outline';
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
      <Tab.Screen name="Analytics" component={AnalyticsStackNavigator} />
      <Tab.Screen name="Account" component={AccountStackNavigator} />
    </Tab.Navigator>
  );
}
