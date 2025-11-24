import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
import { getConfidenceDistribution, getCapturesByConfidenceRange } from '../../services/storageService';
import Icon from '../../components/Icon';

const screenWidth = Dimensions.get('window').width;

export default function ConfidenceDistribution() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [distribution, setDistribution] = useState([]);
  const [selectedRange, setSelectedRange] = useState('Excellent');
  const [captures, setCaptures] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadCapturesForRange(selectedRange);
  }, [selectedRange]);

  const loadData = async () => {
    try {
      const data = await getConfidenceDistribution();
      setDistribution(data);
    } catch (error) {
      console.error('Error loading confidence data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCapturesForRange = async (range) => {
    try {
      let min = 0, max = 100;
      switch(range) {
        case 'Excellent': min = 90; max = 101; break;
        case 'Good': min = 75; max = 90; break;
        case 'Fair': min = 50; max = 75; break;
        case 'Poor': min = 0; max = 50; break;
      }
      
      const data = await getCapturesByConfidenceRange(min, max);
      setCaptures(data);
    } catch (error) {
      console.error('Error loading captures:', error);
    }
  };

  const renderCaptureItem = (item) => (
    <TouchableOpacity 
      key={item.id}
      style={styles.captureItem}
      onPress={() => navigation.navigate('History', { filterDate: item.timestamp.split('T')[0] })}
    >
      <View style={styles.captureIcon}>
        <Icon name="document-text-outline" family="Ionicons" size={24} color="#1D4ED8" />
      </View>
      <View style={styles.captureInfo}>
        <Text style={styles.captureText} numberOfLines={1}>{item.text}</Text>
        <Text style={styles.captureTime}>
          {new Date(item.timestamp).toLocaleDateString()} • {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      <View style={[styles.confidenceBadge, { 
        borderColor: item.confidence >= 90 ? '#10B981' : item.confidence >= 75 ? '#3B82F6' : item.confidence >= 50 ? '#F59E0B' : '#EF4444',
        backgroundColor: item.confidence >= 90 ? '#ECFDF5' : item.confidence >= 75 ? '#EFF6FF' : item.confidence >= 50 ? '#FFFBEB' : '#FEF2F2'
      }]}>
        <Text style={[styles.confidenceText, {
          color: item.confidence >= 90 ? '#059669' : item.confidence >= 75 ? '#2563EB' : item.confidence >= 50 ? '#D97706' : '#DC2626'
        }]}>{Math.round(item.confidence)}%</Text>
      </View>
    </TouchableOpacity>
  );

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.7,
    decimalPlaces: 0,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  const chartData = {
    labels: distribution.map(c => c.range.split(' ')[0]),
    datasets: [{
      data: distribution.map(c => c.count)
    }]
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" family="Ionicons" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confidence Distribution</Text>
      </View>

      <View style={styles.filterContainer}>
        {['Excellent', 'Good', 'Fair', 'Poor'].map((range) => (
          <TouchableOpacity
            key={range}
            style={[styles.filterButton, selectedRange === range && styles.filterButtonActive]}
            onPress={() => setSelectedRange(range)}
          >
            <Text style={[styles.filterText, selectedRange === range && styles.filterTextActive]}>
              {range}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.chartCard}>
          {loading ? (
            <ActivityIndicator size="large" color="#1D4ED8" />
          ) : distribution.length > 0 ? (
            <BarChart
              data={chartData}
              width={screenWidth - 40}
              height={220}
              yAxisLabel=""
              chartConfig={chartConfig}
              style={styles.chart}
              fromZero
              showValuesOnTopOfBars
            />
          ) : (
            <Text style={styles.emptyText}>No data available</Text>
          )}
        </View>

        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>
            {selectedRange} Quality Captures ({captures.length})
          </Text>
          
          {captures.length > 0 ? (
            captures.map(item => renderCaptureItem(item))
          ) : (
            <Text style={styles.emptyText}>No captures found in this range</Text>
          )}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
    backgroundColor: '#FFFFFF',
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 4,
  },
  filterButtonActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  chartCard: {
    margin: 20,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  chart: {
    borderRadius: 16,
  },
  listContainer: {
    padding: 20,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  captureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  captureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  captureInfo: {
    flex: 1,
  },
  captureText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  captureTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  confidenceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    marginTop: 20,
  },
});
