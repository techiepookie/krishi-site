export interface ThingSpeakFeed {
  created_at: string;
  entry_id: number;
  field1: string; // Temperature (°C)
  field2: string; // Humidity (%)
  field3: string; // Soil Moisture (%)
  field4: string; // VPD (kPa)
  field5: string; // Crop Water Need
  field6: string; // Disease Risk
  field7: string; // Pest Risk
  field8: string; // Growth Index
}

export interface ThingSpeakResponse {
  channel: {
    id: number;
    name: string;
    description: string;
    latitude: string;
    longitude: string;
    field1: string;
    field2: string;
    field3: string;
    field4: string;
    field5: string;
    field6: string;
    field7: string;
    field8: string;
    created_at: string;
    updated_at: string;
    last_entry_id: number;
  };
  feeds: ThingSpeakFeed[];
}

export interface SensorData {
  temperature: number;
  humidity: number;
  soilMoisture: number;
  vpd: number;
  cropWaterNeed: number;
  diseaseRisk: number;
  pestRisk: number;
  growthIndex: number;
  lastUpdated: string;
  entryId: number;
}

class ThingSpeakService {
  private baseUrl = 'https://api.thingspeak.com/channels/3004031/feeds.json';
  private isConnected = false;
  private connectionListeners: ((connected: boolean) => void)[] = [];

  async fetchSensorData(results: number = 2): Promise<SensorData[]> {
    try {
      const response = await fetch(`${this.baseUrl}?results=${results}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ThingSpeakResponse = await response.json();
      
      if (!data.feeds || data.feeds.length === 0) {
        throw new Error('No sensor data available');
      }

      this.setConnectionStatus(true);

      return data.feeds.map(feed => this.parseFeedData(feed));
    } catch (error) {
      console.error('ThingSpeak API error:', error);
      this.setConnectionStatus(false);
      throw error;
    }
  }

  private parseFeedData(feed: ThingSpeakFeed): SensorData {
    return {
      temperature: parseFloat(feed.field1) || 0,
      humidity: parseFloat(feed.field2) || 0,
      soilMoisture: parseFloat(feed.field3) || 0,
      vpd: parseFloat(feed.field4) || 0,
      cropWaterNeed: parseFloat(feed.field5) || 0,
      diseaseRisk: parseFloat(feed.field6) || 0,
      pestRisk: parseFloat(feed.field7) || 0,
      growthIndex: parseFloat(feed.field8) || 0,
      lastUpdated: feed.created_at,
      entryId: feed.entry_id,
    };
  }

  async getLatestSensorData(): Promise<SensorData | null> {
    try {
      const data = await this.fetchSensorData(1);
      return data[0] || null;
    } catch (error) {
      console.error('Failed to get latest sensor data:', error);
      return null;
    }
  }

  private setConnectionStatus(connected: boolean) {
    if (this.isConnected !== connected) {
      this.isConnected = connected;
      this.connectionListeners.forEach(listener => listener(connected));
    }
  }

  onConnectionChange(listener: (connected: boolean) => void) {
    this.connectionListeners.push(listener);
    return () => {
      this.connectionListeners = this.connectionListeners.filter(l => l !== listener);
    };
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.fetchSensorData(1);
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const thingSpeakService = new ThingSpeakService();