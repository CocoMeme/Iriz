import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart, PieChart, BarChart } from 'react-native-chart-kit';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { 
  getDatabaseStats, 
  getDailyCaptureCounts, 
  getConfidenceDistribution,
  getScansByTimeOfDay,
  seedDatabase
} from '../../services/storageService';
import Icon from '../../components/Icon';

const screenWidth = Dimensions.get('window').width;
const SETTINGS_KEY = '@iriz_settings';

export default function AnalyticsScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('7d'); // '7d', '30d', '90d'
  const [developerMode, setDeveloperMode] = useState(false);
  
  const [stats, setStats] = useState(null);
  const [dailyCounts, setDailyCounts] = useState([]);
  const [confidenceDist, setConfidenceDist] = useState([]);
  const [timeOfDayStats, setTimeOfDayStats] = useState([]);

  const loadData = async () => {
    try {
      // Determine days based on timeRange
      let days = 7;
      if (timeRange === '30d') days = 30;
      if (timeRange === '90d') days = 90;

      const [dbStats, daily, conf, times] = await Promise.all([
        getDatabaseStats(),
        getDailyCaptureCounts(days),
        getConfidenceDistribution(),
        getScansByTimeOfDay()
      ]);
      
      setStats(dbStats);
      setDailyCounts(daily);
      setConfidenceDist(conf);
      setTimeOfDayStats(times);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem(SETTINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setDeveloperMode(parsed.developerMode || false);
      }
    } catch (error) {
      console.error('Load settings error:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, [timeRange]);

  useFocusEffect(
    useCallback(() => {
      loadData();
      loadSettings();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleChartClick = (data) => {
    if (!dailyCounts || dailyCounts.length === 0) return;
    
    const clickedItem = dailyCounts[data.index];
    if (clickedItem) {
      navigation.navigate('History', {
        filterDate: clickedItem.date
      });
    }
  };

  const handleSeedData = async () => {
    setLoading(true);
    try {
      await seedDatabase();
      await loadData();
    } catch (error) {
      console.error('Failed to seed data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000FF" />
      </View>
    );
  }

  // Prepare data for Line Chart (Daily Activity)
  const lineChartData = {
    labels: dailyCounts.length > 0 
      ? dailyCounts.map((d, i) => {
          // Show fewer labels for longer ranges
          if (timeRange === '30d' && i % 5 !== 0) return '';
          if (timeRange === '90d' && i % 15 !== 0) return '';
          
          const date = new Date(d.date);
          return `${date.getDate()}/${date.getMonth() + 1}`;
        })
      : ['Today'],
    datasets: [
      {
        data: dailyCounts.length > 0 ? dailyCounts.map(d => d.count) : [0],
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ["Scans per Day"]
  };

  // Prepare data for Bar Chart (Confidence)
  const confidenceChartData = {
    labels: confidenceDist.map(c => c.range.split(' ')[0]), // Just take the label part
    datasets: [{
      data: confidenceDist.map(c => c.count)
    }]
  };

  // Prepare data for Bar Chart (Time of Day)
  const barChartData = {
    labels: timeOfDayStats.map(t => t.period),
    datasets: [{
      data: timeOfDayStats.map(t => t.count)
    }]
  };

  // Calculate Success Rate (Confidence > 75%)
  const successRate = stats?.totalCaptures > 0 
    ? (confidenceDist.reduce((acc, curr) => {
        if (curr.range.includes('Excellent') || curr.range.includes('Good')) {
          return acc + curr.count;
        }
        return acc;
      }, 0) / stats.totalCaptures * 100)
    : 0;

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
        <Text style={styles.headerSubtitle}>Overview of your scanning activity</Text>
      </View>

      {/* Time Range Selector */}
      <View style={styles.filterContainer}>
        {['7d', '30d', '90d'].map((range) => (
          <TouchableOpacity
            key={range}
            style={[
              styles.filterButton,
              timeRange === range && styles.filterButtonActive
            ]}
            onPress={() => setTimeRange(range)}
          >
            <Text style={[
              styles.filterText,
              timeRange === range && styles.filterTextActive
            ]}>
              {range === '7d' ? 'Week' : range === '30d' ? 'Month' : '3 Months'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Summary Cards */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Icon name="images-outline" family="Ionicons" size={24} color="#0000FF" />
          <Text style={styles.statValue}>{stats?.totalCaptures || 0}</Text>
          <Text style={styles.statLabel}>Total Scans</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="checkmark-circle-outline" family="Ionicons" size={24} color="#4CAF50" />
          <Text style={styles.statValue}>
            {successRate.toFixed(0)}%
          </Text>
          <Text style={styles.statLabel}>Success Rate</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="analytics-outline" family="Ionicons" size={24} color="#FF9800" />
          <Text style={styles.statValue}>
            {stats?.averageConfidence ? stats.averageConfidence.toFixed(0) : 0}%
          </Text>
          <Text style={styles.statLabel}>Avg Conf.</Text>
        </View>
      </View>

      {/* Daily Activity Chart */}
      <TouchableOpacity 
        style={styles.chartContainer}
        onPress={() => navigation.navigate('ActivityTrend')}
        activeOpacity={0.7}
      >
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Activity Trend</Text>
          <Icon name="chevron-forward" family="Ionicons" size={20} color="#9CA3AF" />
        </View>
        {dailyCounts.length > 0 || stats?.totalCaptures > 0 ? (
          <LineChart
            data={lineChartData}
            width={screenWidth - 72}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withDots={false}
            withInnerLines={false}
            fromZero
          />
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No activity data available</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Confidence Distribution */}
      <TouchableOpacity 
        style={styles.chartContainer}
        onPress={() => navigation.navigate('ConfidenceDistribution')}
        activeOpacity={0.7}
      >
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Confidence Distribution</Text>
          <Icon name="chevron-forward" family="Ionicons" size={20} color="#9CA3AF" />
        </View>
        {confidenceDist.length > 0 ? (
          <BarChart
            data={confidenceChartData}
            width={screenWidth - 72}
            height={220}
            yAxisLabel=""
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
            }}
            style={styles.chart}
            fromZero
            showValuesOnTopOfBars
          />
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No confidence data available</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Time of Day Analysis */}
      <TouchableOpacity 
        style={styles.chartContainer}
        onPress={() => navigation.navigate('PeakScanningTimes')}
        activeOpacity={0.7}
      >
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Peak Scanning Times</Text>
          <Icon name="chevron-forward" family="Ionicons" size={20} color="#9CA3AF" />
        </View>
        {timeOfDayStats.length > 0 ? (
          <BarChart
            data={barChartData}
            width={screenWidth - 72}
            height={220}
            yAxisLabel=""
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(255, 152, 0, ${opacity})`,
            }}
            style={styles.chart}
            fromZero
            showValuesOnTopOfBars
          />
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No time data available</Text>
          </View>
        )}
      </TouchableOpacity>
      
      {/* Developer Tools */}
      {developerMode && (
        <View style={styles.devContainer}>
          <Text style={styles.devTitle}>Developer Tools</Text>
          <TouchableOpacity 
            style={styles.seedButton}
            onPress={handleSeedData}
          >
            <Icon name="construct-outline" family="Ionicons" size={20} color="#FFFFFF" />
            <Text style={styles.seedButtonText}>Generate Test Data (20 Records)</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
  decimalPlaces: 0,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingTop: 60, // For status bar
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    padding: 20,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 0,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noDataContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
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
    backgroundColor: '#0000FF',
    borderColor: '#0000FF',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  devContainer: {
    padding: 20,
    alignItems: 'center',
  },
  devTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#9CA3AF',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  seedButton: {
    flexDirection: 'row',
    backgroundColor: '#4B5563',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  seedButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
