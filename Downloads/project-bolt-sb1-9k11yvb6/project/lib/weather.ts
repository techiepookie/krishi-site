import { fetchWeatherApi } from 'openmeteo';

export interface WeatherData {
  current: {
    time: Date;
    temperature: number;
    humidity: number;
    precipitation: number;
    windSpeed: number;
    pressure: number;
    isDay: boolean;
  };
  hourly: {
    time: Date[];
    temperature: number[];
    humidity: number[];
    precipitation: number[];
  };
}

export interface WeatherForecast {
  today: {
    temperature: number;
    humidity: number;
    condition: string;
    icon: string;
  };
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
  }>;
}

class WeatherService {
  async getWeatherData(latitude: number, longitude: number): Promise<WeatherData | null> {
    try {
      const params = {
        latitude,
        longitude,
        hourly: ["temperature_2m", "relative_humidity_2m", "precipitation", "wind_speed_10m"],
        current: ["temperature_2m", "relative_humidity_2m", "precipitation", "wind_speed_10m", "pressure_msl", "is_day"],
        timezone: "auto"
      };
      
      const url = "https://api.open-meteo.com/v1/forecast";
      const responses = await fetchWeatherApi(url, params);
      
      if (!responses || responses.length === 0) {
        throw new Error('No weather data received');
      }
      
      const response = responses[0];
      const utcOffsetSeconds = response.utcOffsetSeconds();
      const current = response.current()!;
      const hourly = response.hourly()!;
      
      const weatherData: WeatherData = {
        current: {
          time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
          temperature: current.variables(0)!.value(),
          humidity: current.variables(1)!.value(),
          precipitation: current.variables(2)!.value(),
          windSpeed: current.variables(3)!.value(),
          pressure: current.variables(4)!.value(),
          isDay: current.variables(5)!.value() === 1,
        },
        hourly: {
          time: [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
            (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
          ),
          temperature: Array.from(hourly.variables(0)!.valuesArray()!),
          humidity: Array.from(hourly.variables(1)!.valuesArray()!),
          precipitation: Array.from(hourly.variables(2)!.valuesArray()!),
        },
      };
      
      return weatherData;
    } catch (error) {
      console.error('Weather API error:', error);
      return null;
    }
  }
  
  async getWeatherForecast(latitude: number, longitude: number): Promise<WeatherForecast | null> {
    try {
      const params = {
        latitude,
        longitude,
        daily: ["temperature_2m_max", "temperature_2m_min", "precipitation_sum", "weather_code"],
        current: ["temperature_2m", "relative_humidity_2m", "weather_code"],
        timezone: "auto"
      };
      
      const url = "https://api.open-meteo.com/v1/forecast";
      const responses = await fetchWeatherApi(url, params);
      
      if (!responses || responses.length === 0) {
        throw new Error('No weather data received');
      }
      
      const response = responses[0];
      const current = response.current()!;
      const daily = response.daily()!;
      
      const currentTemp = current.variables(0)!.value();
      const currentHumidity = current.variables(1)!.value();
      const currentWeatherCode = current.variables(2)!.value();
      
      const dailyTimes = [...Array(7)].map((_, i) => 
        new Date((Number(daily.time()) + i * 86400) * 1000)
      );
      const dailyMaxTemps = Array.from(daily.variables(0)!.valuesArray()!);
      const dailyMinTemps = Array.from(daily.variables(1)!.valuesArray()!);
      const dailyWeatherCodes = Array.from(daily.variables(3)!.valuesArray()!);
      
      return {
        today: {
          temperature: Math.round(currentTemp),
          humidity: Math.round(currentHumidity),
          condition: this.getWeatherCondition(currentWeatherCode),
          icon: this.getWeatherIcon(currentWeatherCode),
        },
        forecast: dailyTimes.slice(0, 5).map((time, index) => ({
          day: index === 0 ? 'Today' : time.toLocaleDateString('en', { weekday: 'short' }),
          high: Math.round(dailyMaxTemps[index]),
          low: Math.round(dailyMinTemps[index]),
          condition: this.getWeatherCondition(dailyWeatherCodes[index]),
          icon: this.getWeatherIcon(dailyWeatherCodes[index]),
        })),
      };
    } catch (error) {
      console.error('Weather forecast error:', error);
      return null;
    }
  }
  
  private getWeatherCondition(code: number): string {
    if (code === 0) return 'Clear';
    if (code <= 3) return 'Partly Cloudy';
    if (code <= 48) return 'Foggy';
    if (code <= 67) return 'Rainy';
    if (code <= 77) return 'Snowy';
    if (code <= 82) return 'Showers';
    if (code <= 99) return 'Thunderstorm';
    return 'Unknown';
  }
  
  private getWeatherIcon(code: number): string {
    if (code === 0) return '☀️';
    if (code <= 3) return '⛅';
    if (code <= 48) return '🌫️';
    if (code <= 67) return '🌧️';
    if (code <= 77) return '❄️';
    if (code <= 82) return '🌦️';
    if (code <= 99) return '⛈️';
    return '🌤️';
  }
}

export const weatherService = new WeatherService();