import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
  TextInput,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getAllCaptures, deleteCapture, clearAllCaptures, searchCaptures } from '../../services/storageService';
import Icon from '../../components/Icon';

export default function HistoryScreen() {
  const navigation = useNavigation();
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Load history when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      const captures = await getAllCaptures();
      setHistory(captures);
      setFilteredHistory(captures);
      console.log('Loaded', captures.length, 'captures from database');
    } catch (error) {
      console.error('Load history error:', error);
      Alert.alert('Error', 'Failed to load history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadHistory();
    setIsRefreshing(false);
  };

  const handleSearch = async (text) => {
    setSearchQuery(text);
    
    if (!text.trim()) {
      setFilteredHistory(history);
      return;
    }
    
    try {
      const results = await searchCaptures(text);
      setFilteredHistory(results);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleItemPress = (item) => {
    // Parse detections JSON if it exists
    let detections = null;
    if (item.detections) {
      try {
        detections = JSON.parse(item.detections);
      } catch (e) {
        console.warn('Failed to parse detections JSON:', e);
      }
    }
    
    // Navigate to Result screen with full context
    navigation.navigate('Result', {
      boxedImageUri: item.boxedImageUrl || item.imageUri, // Use Cloudinary URL or fallback to local
      detections: detections, // Restored detections array with cropped URLs
      timestamp: item.timestamp,
      imageUri: item.imageUri,
      extractedText: item.text,
      confidence: item.confidence,
      language: item.language,
      orientation: item.orientation,
    });
  };

  const handleDeleteItem = (id) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCapture(id);
              await loadHistory();
              Alert.alert('Success', 'Item deleted');
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert('Error', 'Failed to delete item');
            }
          },
        },
      ]
    );
  };

  const handleClearAll = () => {
    if (history.length === 0) {
      Alert.alert('Info', 'History is already empty');
      return;
    }

    Alert.alert(
      'Clear All History',
      'Are you sure you want to delete all history items? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllCaptures();
              await loadHistory();
              Alert.alert('Success', 'All history cleared');
            } catch (error) {
              console.error('Clear all error:', error);
              Alert.alert('Error', 'Failed to clear history');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => handleItemPress(item)}
    >
      <View style={styles.itemContent}>
        <View style={styles.thumbnail}>
          {item.thumbnailUri || item.imageUri ? (
            <Image 
              source={{ uri: item.thumbnailUri || item.imageUri }} 
              style={styles.thumbnailImage} 
            />
          ) : (
            <Icon name="document-text" family="Ionicons" size={32} color="#999" />
          )}
        </View>
        <View style={styles.itemText}>
          <Text style={styles.itemTitle} numberOfLines={2}>
            {item.text}
          </Text>
          <View style={styles.itemMeta}>
            <Text style={styles.itemDate}>
              {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            {item.confidence > 0 && (
              <View style={styles.confidenceBadge}>
                <Text style={styles.confidenceText}>
                  {Math.round(item.confidence)}%
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteItem(item.id)}
      >
        <Icon name="trash-outline" family="Ionicons" size={22} color="#EF4444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="archive-outline" family="Ionicons" size={80} color="#D1D5DB" />
      <Text style={styles.emptyText}>No history yet</Text>
      <Text style={styles.emptySubtext}>
        Captured signboards will appear here
      </Text>
      <TouchableOpacity
        style={styles.captureButton}
        onPress={() => navigation.navigate('Camera')}
      >
        <Icon name="camera" family="Ionicons" size={20} color="#fff" />
        <Text style={styles.captureButtonText}>Capture Signboard</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header matching HomeScreen style */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.leftSection}>
            <View style={styles.iconContainer}>
              <Icon name="time" family="Ionicons" size={24} color="#1D4ED8" />
            </View>
            <View>
              <Text style={styles.greeting}>Your scans</Text>
              <Text style={styles.title}>History</Text>
            </View>
          </View>
          
          {history.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={handleClearAll}
            >
              <Icon name="trash-outline" family="Ionicons" size={20} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Search Bar */}
        {history.length > 0 && (
          <View style={styles.searchContainer}>
            <Icon name="search" family="Ionicons" size={18} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search history..."
              value={searchQuery}
              onChangeText={handleSearch}
              placeholderTextColor="#9CA3AF"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch('')}>
                <Icon name="close-circle" family="Ionicons" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        )}
        
        {/* Items count */}
        {history.length > 0 && (
          <Text style={styles.itemCount}>
            {filteredHistory.length} {filteredHistory.length === 1 ? 'item' : 'items'}
          </Text>
        )}
      </View>

      <FlatList
        data={filteredHistory}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={filteredHistory.length === 0 ? styles.emptyList : null}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#2196F3']}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#F9FAFB',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  greeting: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  clearButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  itemCount: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
    paddingHorizontal: 8,
  },
  historyItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnail: {
    width: 60,
    height: 60,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  itemText: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    color: '#111827',
    marginBottom: 6,
    fontWeight: '600',
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemDate: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  confidenceBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  confidenceText: {
    fontSize: 11,
    color: '#1D4ED8',
    fontWeight: '700',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyList: {
    flex: 1,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  captureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1D4ED8',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  captureButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
