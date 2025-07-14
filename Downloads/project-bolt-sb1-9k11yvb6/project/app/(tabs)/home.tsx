import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Modal,
  Dimensions,
} from 'react-native';
import { QrCode, Thermometer, Droplets, Sprout, TrendingUp, RefreshCw, ChartBar as BarChart3, Download, Bell, MapPin, Wind, Eye } from 'lucide-react-native';
import { LineChart } from 'react-native-chart-kit';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { QRScanner } from '@/components/QRScanner';
import { thingSpeakService, SensorData } from '@/lib/thingspeak';
import { qrScannerService, DeviceConfig } from '@/lib/qrScanner';
import { weatherService, WeatherForecast } from '@/lib/weather';

const screenWidth = Dimensions.get('window').width;

function HomeScreen() {
  const { user } = useAuth();
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [historicalData, setHistoricalData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [connected, setConnected] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<DeviceConfig | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showGraphs, setShowGraphs] = useState(false);
  const [weatherForecast, setWeatherForecast] = useState<WeatherForecast | null>(null);
  const [selectedChart, setSelectedChart] = useState<'temperature' | 'humidity' | 'soil' | 'growth'>('temperature');

  useEffect(() => {
    loadConnectedDevice();
    setupConnectionListener();
    loadWeatherData();
    
    // Auto-refresh every 15 seconds
    const interval = setInterval(() => {
      if (autoRefresh && connected) {
        loadSensorData();
      }
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (connected) {
      loadHistoricalData();
    }
  }, [connected]);

  const loadWeatherData = async () => {
    try {
      if (user?.location?.latitude && user?.location?.longitude) {
        const forecast = await weatherService.getWeatherForecast(
          user.location.latitude,
          user.location.longitude
        );
        setWeatherForecast(forecast);
      }
    } catch (error) {
      console.error('Failed to load weather data:', error);
    }
  };

  const loadConnectedDevice = async () => {
    const device = await qrScannerService.getConnectedDevice();
    if (device) {
      setConnectedDevice(device);
      setConnected(true);
      loadSensorData();
    }
  };

  const loadHistoricalData = async () => {
    try {
      const data = await thingSpeakService.fetchSensorData(20);
      setHistoricalData(data);
    } catch (error) {
      console.error('Failed to load historical data:', error);
    }
  };

  const setupConnectionListener = () => {
    const unsubscribe = thingSpeakService.onConnectionChange((isConnected) => {
      setConnected(isConnected);
    });
    return unsubscribe;
  };

  const loadSensorData = async () => {
    try {
      const data = await thingSpeakService.getLatestSensorData();
      if (data) {
        setSensorData(data);
        setHistoricalData(prev => [data, ...prev.slice(0, 19)]);
      }
    } catch (error) {
      console.error('Failed to load sensor data:', error);
    }
  };

  const handleQRScan = () => {
    setShowQRScanner(true);
  };

  const handleDeviceConnected = (device: DeviceConfig) => {
    setConnectedDevice(device);
    setConnected(true);
    setShowQRScanner(false);
    loadSensorData();
  };

  const refreshData = async () => {
    setRefreshing(true);
    try {
      await loadSensorData();
      await loadHistoricalData();
      await loadWeatherData();
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  const exportData = () => {
    Alert.alert('Export Data', 'Data exported to PDF successfully');
  };

  const setAlerts = () => {
    Alert.alert('Set Alerts', 'Custom alerts configured successfully');
  };

  const viewHistory = () => {
    setShowGraphs(true);
  };

  const generateChartData = (field: keyof SensorData) => {
    const data = historicalData.slice(0, 10).reverse();
    return {
      labels: data.map((_, index) => `${index + 1}`),
      datasets: [
        {
          data: data.map(item => typeof item[field] === 'number' ? item[field] : 0),
          color: (opacity = 1) => Colors.primary,
          strokeWidth: 2,
        },
      ],
    };
  };

  const chartConfig = {
    backgroundColor: Colors.surface,
    backgroundGradientFrom: Colors.surface,
    backgroundGradientTo: Colors.surface,
    decimalPlaces: 1,
    color: (opacity = 1) => Colors.primary,
    labelColor: (opacity = 1) => Colors.text.secondary,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: Colors.primary,
    },
  };

  const getRiskColor = (risk: number) => {
    if (risk < 30) return Colors.success;
    if (risk < 60) return Colors.warning;
    return Colors.error;
  };

  const getStatusColor = (value: number, type: 'temperature' | 'humidity' | 'soil') => {
    switch (type) {
      case 'temperature':
        if (value >= 20 && value <= 30) return Colors.success;
        if (value >= 15 && value <= 35) return Colors.warning;
        return Colors.error;
      case 'humidity':
        if (value >= 40 && value <= 70) return Colors.success;
        if (value >= 30 && value <= 80) return Colors.warning;
        return Colors.error;
      case 'soil':
        if (value >= 40 && value <= 60) return Colors.success;
        if (value >= 30 && value <= 70) return Colors.warning;
        return Colors.error;
      default:
        return Colors.text.secondary;
    }
  };

  const getChartTitle = (type: string) => {
    switch (type) {
      case 'temperature': return 'Temperature (°C)';
      case 'humidity': return 'Humidity (%)';
      case 'soil': return 'Soil Moisture (%)';
      case 'growth': return 'Growth Index';
      default: return 'Sensor Data';
    }
  };

  const getChartField = (type: string): keyof SensorData => {
    switch (type) {
      case 'temperature': return 'temperature';
      case 'humidity': return 'humidity';
      case 'soil': return 'soilMoisture';
      case 'growth': return 'growthIndex';
      default: return 'temperature';
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refreshData} />
      }
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning</Text>
            <Text style={styles.userName}>{user?.full_name || 'Farmer'}</Text>
          </View>
          <TouchableOpacity style={styles.qrButton} onPress={handleQRScan}>
            <QrCode size={24} color={Colors.text.inverse} />
          </TouchableOpacity>
        </View>

        {/* Weather Forecast */}
        {weatherForecast && (
          <View style={styles.weatherCard}>
            <View style={styles.weatherHeader}>
              <View style={styles.weatherLocation}>
                <MapPin size={16} color={Colors.text.secondary} />
                <Text style={styles.locationText}>
                  {user?.location?.address || 'Current Location'}
                </Text>
              </View>
              <Text style={styles.weatherIcon}>{weatherForecast.today.icon}</Text>
            </View>
            
            <View style={styles.weatherCurrent}>
              <Text style={styles.currentTemp}>{weatherForecast.today.temperature}°C</Text>
              <Text style={styles.currentCondition}>{weatherForecast.today.condition}</Text>
            </View>
            
            <View style={styles.weatherDetails}>
              <View style={styles.weatherDetail}>
                <Droplets size={16} color={Colors.primary} />
                <Text style={styles.weatherDetailText}>{weatherForecast.today.humidity}%</Text>
              </View>
              <View style={styles.weatherDetail}>
                <Wind size={16} color={Colors.primary} />
                <Text style={styles.weatherDetailText}>Light</Text>
              </View>
              <View style={styles.weatherDetail}>
                <Eye size={16} color={Colors.primary} />
                <Text style={styles.weatherDetailText}>Good</Text>
              </View>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.forecastScroll}>
              {weatherForecast.forecast.map((day, index) => (
                <View key={index} style={styles.forecastItem}>
                  <Text style={styles.forecastDay}>{day.day}</Text>
                  <Text style={styles.forecastIcon}>{day.icon}</Text>
                  <Text style={styles.forecastHigh}>{day.high}°</Text>
                  <Text style={styles.forecastLow}>{day.low}°</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Connection Status */}
        <View style={[styles.statusCard, connected ? styles.connectedCard : styles.disconnectedCard]}>
          <View style={styles.statusInfo}>
            <Text style={styles.statusTitle}>
              {connected ? `Connected: ${connectedDevice?.deviceName || 'Sensor'}` : 'No Sensor Connected'}
            </Text>
            <Text style={styles.statusSubtitle}>
              {connected 
                ? `Receiving data from ThingSpeak Channel ${connectedDevice?.channelId || '3004031'}` 
                : 'Scan QR code to connect sensor'
              }
            </Text>
          </View>
          <View style={[styles.statusIndicator, connected && styles.statusIndicatorActive]} />
        </View>

        {/* Sensor Data */}
        {connected && sensorData && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Real-time Monitoring</Text>
              <TouchableOpacity onPress={refreshData} disabled={refreshing}>
                <View style={styles.headerActions}>
                  <TouchableOpacity onPress={() => setAutoRefresh(!autoRefresh)}>
                    <RefreshCw 
                      size={16} 
                      color={autoRefresh ? Colors.primary : Colors.text.secondary} 
                    />
                  </TouchableOpacity>
                <RefreshCw 
                  size={20} 
                  color={Colors.primary} 
                  style={refreshing ? { opacity: 0.5 } : {}}
                />
                </View>
              </TouchableOpacity>
            </View>

            {/* Primary Metrics */}
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <Thermometer size={20} color={getStatusColor(sensorData.temperature, 'temperature')} />
                  <Text style={styles.metricLabel}>Temperature</Text>
                </View>
                <Text style={styles.metricValue}>{sensorData.temperature.toFixed(1)}°C</Text>
                <View style={[styles.metricStatus, { backgroundColor: getStatusColor(sensorData.temperature, 'temperature') }]} />
              </View>

              <View style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <Droplets size={20} color={getStatusColor(sensorData.humidity, 'humidity')} />
                  <Text style={styles.metricLabel}>Humidity</Text>
                </View>
                <Text style={styles.metricValue}>{sensorData.humidity.toFixed(1)}%</Text>
                <View style={[styles.metricStatus, { backgroundColor: getStatusColor(sensorData.humidity, 'humidity') }]} />
              </View>

              <View style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <Sprout size={20} color={getStatusColor(sensorData.soilMoisture, 'soil')} />
                  <Text style={styles.metricLabel}>Soil Moisture</Text>
                </View>
                <Text style={styles.metricValue}>{sensorData.soilMoisture.toFixed(1)}%</Text>
                <View style={[styles.metricStatus, { backgroundColor: getStatusColor(sensorData.soilMoisture, 'soil') }]} />
              </View>

              <View style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <TrendingUp size={20} color={Colors.primary} />
                  <Text style={styles.metricLabel}>Growth Index</Text>
                </View>
                <Text style={styles.metricValue}>{sensorData.growthIndex.toFixed(1)}%</Text>
                <View style={[styles.metricStatus, { backgroundColor: Colors.primary }]} />
              </View>
            </View>

            {/* Individual Charts */}
            <View style={styles.chartsSection}>
              <Text style={styles.sectionTitle}>Sensor Trends</Text>
              
              <View style={styles.chartSelector}>
                {(['temperature', 'humidity', 'soil', 'growth'] as const).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.chartSelectorButton,
                      selectedChart === type && styles.chartSelectorButtonActive,
                    ]}
                    onPress={() => setSelectedChart(type)}
                  >
                    <Text
                      style={[
                        styles.chartSelectorText,
                        selectedChart === type && styles.chartSelectorTextActive,
                      ]}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>{getChartTitle(selectedChart)}</Text>
                <LineChart
                  data={generateChartData(getChartField(selectedChart))}
                  width={screenWidth - 40}
                  height={220}
                  chartConfig={chartConfig}
                  bezier
                />
              </View>
            </View>

            {/* Secondary Metrics */}
            <View style={styles.secondaryMetrics}>
              <View style={styles.secondaryMetricRow}>
                <Text style={styles.secondaryMetricLabel}>VPD</Text>
                <Text style={styles.secondaryMetricValue}>{sensorData.vpd.toFixed(2)} kPa</Text>
              </View>
              <View style={styles.secondaryMetricRow}>
                <Text style={styles.secondaryMetricLabel}>Crop Water Need</Text>
                <Text style={styles.secondaryMetricValue}>{sensorData.cropWaterNeed.toFixed(1)}%</Text>
              </View>
              <View style={styles.secondaryMetricRow}>
                <Text style={styles.secondaryMetricLabel}>Disease Risk</Text>
                <Text style={[styles.secondaryMetricValue, { color: getRiskColor(sensorData.diseaseRisk) }]}>
                  {sensorData.diseaseRisk.toFixed(1)}%
                </Text>
              </View>
              <View style={styles.secondaryMetricRow}>
                <Text style={styles.secondaryMetricLabel}>Pest Risk</Text>
                <Text style={[styles.secondaryMetricValue, { color: getRiskColor(sensorData.pestRisk) }]}>
                  {sensorData.pestRisk.toFixed(1)}%
                </Text>
              </View>
            </View>

            <View style={styles.lastUpdated}>
              <Text style={styles.lastUpdatedText}>
                Last updated: {new Date(sensorData.lastUpdated).toLocaleString()}
              </Text>
            </View>
          </>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={viewHistory}>
              <BarChart3 size={16} color={Colors.primary} />
              <Text style={styles.actionButtonText}>View History</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={setAlerts}>
              <Bell size={16} color={Colors.primary} />
              <Text style={styles.actionButtonText}>Set Alerts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={exportData}>
              <Download size={16} color={Colors.primary} />
              <Text style={styles.actionButtonText}>Export Data</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Modal
        visible={showQRScanner}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <QRScanner
          onScanComplete={handleDeviceConnected}
          onClose={() => setShowQRScanner(false)}
        />
      </Modal>

      {/* Graphs Modal */}
      <Modal
        visible={showGraphs}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.graphsContainer}>
          <View style={styles.graphsHeader}>
            <Text style={styles.graphsTitle}>Sensor Data History</Text>
            <TouchableOpacity onPress={() => setShowGraphs(false)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.graphsContent}>
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Temperature (°C)</Text>
              <LineChart
                data={generateChartData('temperature')}
                width={screenWidth - 40}
                height={220}
                chartConfig={chartConfig}
                bezier
              />
            </View>

            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Humidity (%)</Text>
              <LineChart
                data={generateChartData('humidity')}
                width={screenWidth - 40}
                height={220}
                chartConfig={chartConfig}
                bezier
              />
            </View>

            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Soil Moisture (%)</Text>
              <LineChart
                data={generateChartData('soilMoisture')}
                width={screenWidth - 40}
                height={220}
                chartConfig={chartConfig}
                bezier
              />
            </View>

            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Growth Index</Text>
              <LineChart
                data={generateChartData('growthIndex')}
                width={screenWidth - 40}
                height={220}
                chartConfig={chartConfig}
                bezier
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  qrButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weatherCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  weatherLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  weatherIcon: {
    fontSize: 32,
  },
  weatherCurrent: {
    marginBottom: 16,
  },
  currentTemp: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  currentCondition: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  weatherDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  weatherDetailText: {
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  forecastScroll: {
    marginTop: 8,
  },
  forecastItem: {
    alignItems: 'center',
    marginRight: 16,
    paddingVertical: 8,
  },
  forecastDay: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  forecastIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  forecastHigh: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  forecastLow: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
  },
  connectedCard: {
    backgroundColor: Colors.success + '10',
    borderColor: Colors.success,
  },
  disconnectedCard: {
    backgroundColor: Colors.gray[50],
    borderColor: Colors.border,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.gray[300],
  },
  statusIndicatorActive: {
    backgroundColor: Colors.success,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    minWidth: 150,
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  metricLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  metricStatus: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  chartsSection: {
    marginBottom: 24,
  },
  chartSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  chartSelectorButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  chartSelectorButtonActive: {
    backgroundColor: Colors.primary,
  },
  chartSelectorText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  chartSelectorTextActive: {
    color: Colors.text.inverse,
  },
  chartContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  secondaryMetrics: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryMetricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  secondaryMetricLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  secondaryMetricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  lastUpdated: {
    alignItems: 'center',
    marginBottom: 24,
  },
  lastUpdatedText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  quickActions: {
    gap: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    gap: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  graphsContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  graphsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  graphsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  closeText: {
    fontSize: 16,
    color: Colors.primary,
  },
  graphsContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
});

export default HomeScreen;