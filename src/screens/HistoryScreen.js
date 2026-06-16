import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem('scanHistory');
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory);
        // Sort by most recent first
        setHistory(parsedHistory.reverse());
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const deleteItem = async (id) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this scan?',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const updatedHistory = history.filter((item) => item.id !== id);
              await AsyncStorage.setItem(
                'scanHistory',
                JSON.stringify(updatedHistory)
              );
              setHistory(updatedHistory);
            } catch (error) {
              console.error('Error deleting item:', error);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const shareItem = async (data) => {
    try {
      await Share.share({
        message: `Scanned QR Code: ${data}`,
        url: data,
        title: 'Share QR Code Result',
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const clearAll = () => {
    Alert.alert(
      'Clear All History',
      'Are you sure you want to clear all scan history?',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Clear',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('scanHistory');
              setHistory([]);
            } catch (error) {
              console.error('Error clearing history:', error);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyItem}>
      <View style={styles.itemContent}>
        <Text style={styles.itemData} numberOfLines={2} selectable>
          {item.data}
        </Text>
        <Text style={styles.itemTimestamp}>{item.timestamp}</Text>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => shareItem(item.data)}
        >
          <Ionicons name="share-social" size={20} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => deleteItem(item.id)}
        >
          <Ionicons name="trash" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {history.length > 0 ? (
        <>
          <FlatList
            data={history}
            renderItem={renderHistoryItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearAll}
          >
            <Ionicons name="trash-bin" size={18} color="#fff" />
            <Text style={styles.clearButtonText}>Clear All History</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="qr-code" size={80} color="#CCCCCC" />
          <Text style={styles.emptyText}>No scans yet</Text>
          <Text style={styles.emptySubtext}>
            Scan QR codes to see them here
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  listContent: {
    padding: 12,
    paddingBottom: 80,
  },
  historyItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  itemContent: {
    flex: 1,
    marginRight: 12,
  },
  itemData: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  itemTimestamp: {
    fontSize: 12,
    color: '#999',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
  },
  clearButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
