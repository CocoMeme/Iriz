import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HistoryScreen() {
  const navigation = useNavigation();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    // TODO: Load from SQLite database
    // Mock data for now
    const mockHistory = [
      {
        id: '1',
        imageUri: null,
        text: 'Exit - Turn Left for Parking',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: '2',
        imageUri: null,
        text: 'Welcome to City Mall - Operating Hours: 9 AM - 9 PM',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: '3',
        imageUri: null,
        text: 'No Parking Zone - Vehicles will be towed',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
    ];
    setHistory(mockHistory);
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
          onPress: () => {
            setHistory(prev => prev.filter(item => item.id !== id));
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
      'Are you sure you want to delete all history items?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => setHistory([]),
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
          {item.imageUri ? (
            <Image source={{ uri: item.imageUri }} style={styles.thumbnailImage} />
          ) : (
            <Text style={styles.thumbnailIcon}>📄</Text>
          )}
        </View>
        <View style={styles.itemText}>
          <Text style={styles.itemTitle} numberOfLines={2}>
            {item.text}
          </Text>
          <Text style={styles.itemDate}>
            {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString()}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteItem(item.id)}
      >
        <Text style={styles.deleteIcon}>🗑️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📚</Text>
      <Text style={styles.emptyText}>No history yet</Text>
      <Text style={styles.emptySubtext}>
        Captured signboards will appear here
      </Text>
      <TouchableOpacity
        style={styles.captureButton}
        onPress={() => navigation.navigate('Camera')}
      >
        <Text style={styles.captureButtonText}>Capture Signboard</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {history.length} {history.length === 1 ? 'item' : 'items'}
        </Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={styles.clearButton}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={history.length === 0 ? styles.emptyList : null}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
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
  thumbnailIcon: {
    fontSize: 30,
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
  itemDate: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    padding: 10,
  },
  deleteIcon: {
    fontSize: 20,
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
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
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
    backgroundColor: '#2196F3',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  captureButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
