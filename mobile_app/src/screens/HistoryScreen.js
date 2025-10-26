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
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getAllCaptures, deleteCapture, clearAllCaptures, searchCaptures } from '../services/storageService';
import Icon from '../components/Icon';

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
    navigation.navigate('Result', {
      imageUri: item.imageUri,
      extractedText: item.text,
      timestamp: item.timestamp,
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
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerText}>
            {filteredHistory.length} {filteredHistory.length === 1 ? 'item' : 'items'}
          </Text>
          {history.length > 0 && (
            <TouchableOpacity onPress={handleClearAll}>
              <Text style={styles.clearButton}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
        {history.length > 0 && (
          <View style={styles.searchContainer}>
            <Icon name="search" family="Ionicons" size={18} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search history..."
              value={searchQuery}
              onChangeText={handleSearch}
              placeholderTextColor="#999"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch('')}>
                <Icon name="close-circle" family="Ionicons" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    marginHorizontal: 15,
    marginBottom: 15,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  clearSearchIcon: {
    fontSize: 18,
    color: '#999',
    padding: 5,
  },
  headerText: {
    fontSize: 16,
    color: '#666',
  },
  clearButton: {
    fontSize: 14,
    color: '#f44336',
    fontWeight: '600',
  },
  historyItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnail: {
    width: 60,
    height: 60,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  itemText: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    fontWeight: '500',
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  itemDate: {
    fontSize: 12,
    color: '#999',
  },
  confidenceBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  confidenceText: {
    fontSize: 11,
    color: '#2196F3',
    fontWeight: '600',
  },
  deleteButton: {
    padding: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyList: {
    flex: 1,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  captureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    gap: 10,
  },
  captureButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
