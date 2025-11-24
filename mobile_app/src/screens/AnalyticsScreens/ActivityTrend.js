import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
import { getDailyCaptureCounts, getCapturesByDateRange } from '../../services/storageService';
import Icon from '../../components/Icon';

const screenWidth = Dimensions.get('window').width;

export default function ActivityTrend() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [dailyCounts, setDailyCounts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [captures, setCaptures] = useState([]);

  useEffect(() => {
    loadChartData();
  }, [timeRange]);

  useEffect(() => {
    if (selectedDate) {
      loadCapturesForDate(selectedDate);
    } else {
      // Load recent captures if no date selected
      loadRecentCaptures();
    }
  }, [selectedDate]);

  const loadChartData = async () => {
    try {
      let days = 7;
      if (timeRange === '30d') days = 30;
      if (timeRange === '90d') days = 90;
      
      const data = await getDailyCaptureCounts(days);
      setDailyCounts(data);
      
      // Select the last date by default if available
      if (data.length > 0 && !selectedDate) {
        setSelectedDate(data[data.length - 1].date);
      }
    } catch (error) {
      console.error('Error loading chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCapturesForDate = async (dateStr) => {
    try {
      // Construct start and end of the day in ISO format
      // This is a bit tricky with local time vs UTC, but let's try a simple approach
      // Assuming dateStr is YYYY-MM-DD
      const start = `${dateStr}T00:00:00`;
      const end = `${dateStr}T23:59:59`;
      
      const data = await getCapturesByDateRange(start, end);
      setCaptures(data);
    } catch (error) {
      console.error('Error loading captures:', error);
    }
  };

  const loadRecentCaptures = async () => {
    // Just load last 20 captures or something, but for now let's leave it empty or handle differently
    // We'll just rely on selecting a date
  };

  const handleChartClick = (data) => {
    if (!dailyCounts || dailyCounts.length === 0) return;
    const clickedItem = dailyCounts[data.index];
    if (clickedItem) {
      setSelectedDate(clickedItem.date);
    }
  };

  const renderCaptureItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.captureItem}
      onPress={() => navigation.navigate('History', { filterDate: item.timestamp.split('T')[0] })}
    >
      <View style={styles.captureIcon}>
        <Icon name="document-text-outline" family="Ionicons" size={24} color="#1D4ED8" />
      </View>
      <View style={styles.captureInfo}>
        <Text style={styles.captureText} numberOfLines={1}>{item.text}</Text>
        <Text style={styles.captureTime}>
          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
    color: (opacity = 1) => `rgba(29, 78, 216, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    decimalPlaces: 0,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  const lineChartData = {
    labels: dailyCounts.length > 0 
      ? dailyCounts.map((d, i) => {
          if (timeRange === '30d' && i % 5 !== 0) return '';
          if (timeRange === '90d' && i % 15 !== 0) return '';
          const date = new Date(d.date);
          return `${date.getDate()}/${date.getMonth() + 1}`;
        })
      : ['Today'],
    datasets: [{
      data: dailyCounts.length > 0 ? dailyCounts.map(d => d.count) : [0],
    }]
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" family="Ionicons" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Activity Trend</Text>
      </View>

      <View style={styles.filterContainer}>
        {['7d', '30d', '90d'].map((range) => (
          <TouchableOpacity
            key={range}
            style={[styles.filterButton, timeRange === range && styles.filterButtonActive]}
            onPress={() => setTimeRange(range)}
          >
            <Text style={[styles.filterText, timeRange === range && styles.filterTextActive]}>
              {range === '7d' ? 'Week' : range === '30d' ? 'Month' : '3 Months'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.chartCard}>
          {loading ? (
            <ActivityIndicator size="large" color="#1D4ED8" />
          ) : (
            <LineChart
              data={lineChartData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              onDataPointClick={handleChartClick}
              fromZero
            />
          )}
        </View>

        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>
            {selectedDate 
              ? `Captures on ${new Date(selectedDate).toLocaleDateString()}`
              : 'Select a date on the chart'}
          </Text>
          
          {captures.length > 0 ? (
            captures.map(item => (
              <View key={item.id}>
                {renderCaptureItem({ item })}
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No captures found for this date</Text>
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
    gap: 12,
    backgroundColor: '#FFFFFF',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterButtonActive: {
    backgroundColor: '#1D4ED8',
    borderColor: '#1D4ED8',
  },
  filterText: {
    fontSize: 14,
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
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    marginTop: 20,
  },
});
