export interface SensorReading {
  moisture: number;
  temperature: number;
  humidity: number;
  rain: boolean;
  timestamp: string;
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: number;
}

export interface HistoricalData {
  timestamp: number;
  moisture: number;
  temperature: number;
  humidity: number;
}
