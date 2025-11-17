import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getAllCaptures } from '../../services/storageService';
import UserInfo from '../../components/HomeComponents/UserInfo';
import SearchBar from '../../components/HomeComponents/SearchBar';
import QuickTools from '../../components/HomeComponents/QuickTools';
import StartScan from '../../components/HomeComponents/StartScan';
import RecentScans from '../../components/HomeComponents/RecentScans';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [recentScans, setRecentScans] = useState([]);

  // Load recent scans when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadRecentScans();
    }, [])
  );

  const loadRecentScans = async () => {
    try {
      const captures = await getAllCaptures({ limit: 5, orderBy: 'timestamp', order: 'DESC' });
      
      // Transform captures to match RecentScans format
      const formattedScans = captures.map(capture => ({
        id: capture.id.toString(),
        title: capture.text.length > 40 ? capture.text.substring(0, 40) + '...' : capture.text,
        date: formatDate(capture.timestamp),
        image: capture.thumbnailUri || capture.imageUri || null,
      }));
      
      setRecentScans(formattedScans);
    } catch (error) {
      console.error('Error loading recent scans:', error);
      setRecentScans([]);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `Today · ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    if (diffDays === 1) return `Yesterday · ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const handleRecentScanPress = (item) => {
    // Navigate to History screen
    navigation.navigate('History');
  };

  const handleToolPress = (id) => {
    if (id === 'history') navigation.navigate('History');
    if (id === 'settings') navigation.navigate('Settings');
    // favorites / offline / voice can be wired later
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <UserInfo
          name="Iriz User"
          onNotificationsPress={() => {
            // hook up notifications later
          }}
        />

        <SearchBar
          value={search}
          onChangeText={setSearch}
          onFilterPress={() => {
            // open filters later
          }}
        />

        <StartScan onPress={() => navigation.navigate('Camera')} />

        <QuickTools onToolPress={handleToolPress} />

        <RecentScans
          items={recentScans}
          onPressItem={handleRecentScanPress}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 24,
  },
});
