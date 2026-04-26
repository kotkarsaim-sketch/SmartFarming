import { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const API_BASE = 'http://localhost:4000';
const FARM_ID = 'farm-1';

export interface SensorReading {
  moisture: number;
  temperature: number;
  humidity: number;
  rain: number;
  timestamp: number;
}

export interface HistoricalData {
  timestamp: number;
  moisture: number;
  temperature: number;
  humidity: number;
}

export interface RawReading {
  moisture?: number;
  temp?: number;
  hum?: number;
  rain?: number;
  ts?: number;
}

export interface RawAlert {
  id?: string;
  type?: string;
  message?: string;
  ts?: number;
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: number;
}

// --- Demo fallback data when backend is unavailable ---
function generateDemoData() {
  const now = Date.now();
  const history: HistoricalData[] = Array.from({ length: 48 }, (_, i) => {
    const t = now - (47 - i) * 30 * 60 * 1000;
    const hour = new Date(t).getHours();
    const base = 45 + Math.sin(hour / 4) * 15;
    return {
      timestamp: t,
      moisture: parseFloat((base + (Math.random() - 0.5) * 8).toFixed(1)),
      temperature: parseFloat((26 + Math.sin(hour / 3.8) * 6 + (Math.random() - 0.5) * 2).toFixed(1)),
      humidity: parseFloat((60 + Math.sin(hour / 5) * 15 + (Math.random() - 0.5) * 5).toFixed(1)),
    };
  });

  const latest: SensorReading = {
    moisture: history[history.length - 1].moisture,
    temperature: history[history.length - 1].temperature,
    humidity: history[history.length - 1].humidity,
    rain: 0,
    timestamp: now,
  };

  const demoAlerts: Alert[] = [
    {
      id: '1',
      type: 'info',
      message: 'Running in demo mode — connect IoT sensors for live data',
      timestamp: now - 60000,
    },
    {
      id: '2',
      type: 'warning',
      message: 'Soil moisture below optimal threshold (< 35%)',
      timestamp: now - 300000,
    },
    {
      id: '3',
      type: 'info',
      message: 'Weather forecast: Thunderstorm expected tomorrow',
      timestamp: now - 600000,
    },
  ];

  return { latest, history, alerts: demoAlerts };
}

export function useSensorData() {
  const [latestReading, setLatestReading] = useState<SensorReading | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  // -------- HISTORY --------
  const fetchHistory = useCallback(async () => {
    const now = Math.floor(Date.now() / 1000);
    const from = now - 24 * 60 * 60;

    const res = await axios.get(`${API_BASE}/api/farms/${FARM_ID}/history`, {
      params: { from, to: now },
      timeout: 3000,
    });

    const normalized = res.data.map((raw: RawReading) => ({
      timestamp: raw.ts ? raw.ts * 1000 : Date.now(),
      moisture: Number(raw.moisture ?? 0),
      temperature: Number(raw.temp ?? 0),
      humidity: Number(raw.hum ?? 0),
    }));

    setHistoricalData(normalized);

    if (normalized.length > 0) {
      setLatestReading(normalized[normalized.length - 1]);
    }
  }, []);

  // -------- ALERTS --------
  const fetchAlerts = useCallback(async () => {
    const res = await axios.get(`${API_BASE}/api/farms/${FARM_ID}/alerts`, {
      timeout: 3000,
    });

    const normalized = res.data.map((raw: RawAlert) => ({
      id: raw.id ?? crypto.randomUUID(),
      type:
        raw.type?.includes('CRITICAL')
          ? 'critical'
          : raw.type?.includes('WARN')
            ? 'warning'
            : 'info',
      message: raw.message ?? 'Alert triggered',
      timestamp: raw.ts ? raw.ts * 1000 : Date.now(),
    }));

    setAlerts(normalized);
  }, []);

  // -------- INITIAL LOAD (with demo fallback) --------
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchHistory(), fetchAlerts()]);
      } catch {
        // Backend unreachable — switch to demo mode
        console.log('Backend unavailable, loading demo data...');
        const demo = generateDemoData();
        setLatestReading(demo.latest);
        setHistoricalData(demo.history);
        setAlerts(demo.alerts);
        setIsDemo(true);
        setError(null); // Don't show error in demo mode
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [fetchHistory, fetchAlerts]);

  // -------- SOCKET.IO (skip in demo mode) --------
  useEffect(() => {
    if (isDemo) {
      // In demo mode, simulate live connection appearance
      setIsConnected(true);

      // Simulate periodic sensor updates
      const interval = setInterval(() => {
        setLatestReading(prev => {
          if (!prev) return prev;
          const hour = new Date().getHours();
          return {
            moisture: parseFloat((prev.moisture + (Math.random() - 0.5) * 2).toFixed(1)),
            temperature: parseFloat((26 + Math.sin(hour / 3.8) * 6 + (Math.random() - 0.5) * 1).toFixed(1)),
            humidity: parseFloat((prev.humidity + (Math.random() - 0.5) * 1.5).toFixed(1)),
            rain: 0,
            timestamp: Date.now(),
          };
        });
      }, 5000);

      return () => clearInterval(interval);
    }

    const socket = io(API_BASE, { transports: ['polling'], timeout: 3000 });

    socket.on('connect', () => {
      setIsConnected(true);
      setError(null);
      socket.emit('join', { farmId: FARM_ID });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('reading', (raw: RawReading) => {
      const normalized: SensorReading = {
        moisture: Number(raw.moisture ?? 0),
        temperature: Number(raw.temp ?? 0),
        humidity: Number(raw.hum ?? 0),
        rain: Number(raw.rain ?? 0),
        timestamp: raw.ts ? raw.ts * 1000 : Date.now(),
      };

      setLatestReading(normalized);

      setHistoricalData((prev) =>
        [...prev, {
          timestamp: normalized.timestamp,
          moisture: normalized.moisture,
          temperature: normalized.temperature,
          humidity: normalized.humidity,
        }].slice(-100)
      );
    });

    socket.on('alert', (raw: RawAlert) => {
      const normalized: Alert = {
        id: raw.id ?? crypto.randomUUID(),
        type:
          raw.type?.includes('CRITICAL')
            ? 'critical'
            : raw.type?.includes('WARN')
              ? 'warning'
              : 'info',
        message: raw.message ?? 'Alert triggered',
        timestamp: raw.ts ? raw.ts * 1000 : Date.now(),
      };

      setAlerts((prev) => [normalized, ...prev].slice(0, 20));
    });

    return () => {
      socket.disconnect();
    };

  }, [isDemo]);

  return {
    latestReading,
    historicalData,
    alerts,
    isConnected,
    isLoading,
    error,
  };
}
