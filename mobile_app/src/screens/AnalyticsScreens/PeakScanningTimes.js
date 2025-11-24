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
import { getPeakScanningTimes, getCapturesByTimeOfDay } from '../../services/storageService';
import Icon from '../../components/Icon';

const screenWidth = Dimensions.get('window').width;

export default function PeakScanningTimes() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [timeData, setTimeData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('Morning');
  const [captures, setCaptures] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadCapturesForPeriod(selectedPeriod);
  }, [selectedPeriod]);

  const loadData = async () => {
    try {
      const data = await getPeakScanningTimes();
      setTimeData(data);
      
      // Find the period with the most activity to set as default
      if (data.length > 0) {
        const max = data.reduce((prev, current) => (prev.count > current.count) ? prev : current);
        setSelectedPeriod(max.period);
      }
    } catch (error) {
      console.error('Error loading time data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCapturesForPeriod = async (period) => {
    try {
      const data = await getCapturesByTimeOfDay(period);
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
        <Icon name="time-outline" family="Ionicons" size={24} color="#7C3AED" />
      </View>
      <View style={styles.captureInfo}>
        <Text style={styles.captureText} numberOfLines={1}>{item.text}</Text>
        <Text style={styles.captureTime}>
          {new Date(item.timestamp).toLocaleDateString()} • {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      <View style={styles.confidenceBadge}>
        <Text style={styles.confidenceText}>{Math.round(item.confidence)}%</Text>
      </View>
    </TouchableOpacity>
  );

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(124, 58, 237, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.7,
    decimalPlaces: 0,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  // Ensure we have data for all periods even if 0
  const periods = ['Morning', 'Afternoon', 'Evening', 'Night'];
  const chartData = {
    labels: periods,
    datasets: [{
      data: periods.map(p => {
        const found = timeData.find(d => d.period === p);
        return found ? found.count : 0;
      })
    }]
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" family="Ionicons" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Peak Scanning Times</Text>
      </View>

      <View style={styles.filterContainer}>
        {periods.map((period) => (
          <TouchableOpacity
            key={period}
            style={[styles.filterButton, selectedPeriod === period && styles.filterButtonActive]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text style={[styles.filterText, selectedPeriod === period && styles.filterTextActive]}>
              {period}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.chartCard}>
          {loading ? (
            <ActivityIndicator size="large" color="#7C3AED" />
          ) : (
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
          )}
        </View>

        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>
            {selectedPeriod} Activity ({captures.length})
          </Text>
          <Text style={styles.periodDescription}>
            {selectedPeriod === 'Morning' ? '6:00 AM - 12:00 PM' : 
             selectedPeriod === 'Afternoon' ? '12:00 PM - 6:00 PM' : 
             selectedPeriod === 'Evening' ? '6:00 PM - 12:00 AM' : '12:00 AM - 6:00 AM'}
          </Text>
          
          {captures.length > 0 ? (
            captures.map(item => renderCaptureItem(item))
          ) : (
            <Text style={styles.emptyText}>No captures found in this time period</Text>
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
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
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
    marginBottom: 4,
  },
  periodDescription: {
    fontSize: 12,
    color: '#6B7280',
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
    backgroundColor: '#F5F3FF',
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
    backgroundColor: '#F3F4F6',
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    marginTop: 20,
  },
});
