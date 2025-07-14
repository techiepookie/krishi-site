import { useCameraPermissions } from 'expo-camera';
import { Alert } from 'react-native';

export interface QRScanResult {
  type: string;
  data: string;
}

export interface DeviceConfig {
  deviceId: string;
  deviceName: string;
  apiEndpoint?: string;
  channelId?: string;
  apiKey?: string;
}

class QRScannerService {
  private validUrlPatterns = [
    /^https:\/\/api\.thingspeak\.com\/channels\/\d+\/feeds\.json/,
    /^https:\/\/.*\.thingspeak\.com/,
    /^krishimitra:\/\/device/,
    /^https:\/\/thingspeak\.com\/channels\/\d+/
  ];

  validateQRUrl(data: string): boolean {
    console.log('Validating QR URL:', data);
    
    try {
      // Check if it's a valid JSON with URL
      const parsed = JSON.parse(data);
      if (parsed.apiEndpoint) {
        const isValid = this.validUrlPatterns.some(pattern => pattern.test(parsed.apiEndpoint));
        console.log('JSON validation result:', isValid);
        return isValid;
      }
    } catch (error) {
      // Check if it's a direct URL
      const isValid = this.validUrlPatterns.some(pattern => pattern.test(data));
      console.log('Direct URL validation result:', isValid);
      return isValid;
    }
    return false;
  }

  parseQRData(data: string): DeviceConfig | null {
    console.log('Parsing QR data:', data);
    
    // First validate the URL
    if (!this.validateQRUrl(data)) {
      console.log('QR validation failed');
      return null;
    }
    
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(data);
      
      if (parsed.deviceId && parsed.deviceName) {
        console.log('Parsed JSON device config:', parsed);
        return {
          deviceId: parsed.deviceId,
          deviceName: parsed.deviceName,
          apiEndpoint: parsed.apiEndpoint,
          channelId: parsed.channelId,
          apiKey: parsed.apiKey,
        };
      }
    } catch (error) {
      // If not JSON, try to parse as URL or simple format
      if (data.includes('thingspeak.com')) {
        const channelMatch = data.match(/channels\/(\d+)/);
        if (channelMatch) {
          const config = {
            deviceId: `device_${channelMatch[1]}`,
            deviceName: `Sensor ${channelMatch[1]}`,
            channelId: channelMatch[1],
            apiEndpoint: `https://api.thingspeak.com/channels/${channelMatch[1]}/feeds.json`,
          };
          console.log('Parsed URL device config:', config);
          return config;
        }
      }
      
      // Handle KrishiMitra custom format
      if (data.startsWith('krishimitra://device')) {
        const url = new URL(data);
        const params = new URLSearchParams(url.search);
        const config = {
          deviceId: params.get('id') || 'unknown',
          deviceName: params.get('name') || 'Unknown Device',
          channelId: params.get('channel'),
          apiEndpoint: params.get('endpoint'),
          apiKey: params.get('key'),
        };
        console.log('Parsed KrishiMitra device config:', config);
        return config;
      }
    }
    
    console.log('Failed to parse QR data');
    return null;
  }

  async connectDevice(config: DeviceConfig): Promise<boolean> {
    try {
      console.log('Connecting device:', config);
      
      // Store device configuration
      const { storage } = require('./storage');
      await storage.setItem('connectedDevice', JSON.stringify(config));
      
      // Test connection if API endpoint is provided
      if (config.apiEndpoint) {
        console.log('Testing API endpoint:', config.apiEndpoint);
        const response = await fetch(`${config.apiEndpoint}?results=1`);
        if (!response.ok) {
          console.log('API test failed:', response.status);
          throw new Error('Failed to connect to device API');
        }
        console.log('API test successful');
      }
      
      console.log('Device connected successfully');
      return true;
    } catch (error) {
      console.error('Device connection error:', error);
      return false;
    }
  }

  async getConnectedDevice(): Promise<DeviceConfig | null> {
    try {
      const { storage } = require('./storage');
      const deviceData = await storage.getItem('connectedDevice');
      return deviceData ? JSON.parse(deviceData) : null;
    } catch (error) {
      console.error('Get connected device error:', error);
      return null;
    }
  }

  async disconnectDevice(): Promise<void> {
    try {
      const { storage } = require('./storage');
      await storage.removeItem('connectedDevice');
    } catch (error) {
      console.error('Disconnect device error:', error);
    }
  }
}

export const qrScannerService = new QRScannerService();