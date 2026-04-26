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

export function useSensorData() {
  const [latestReading, setLatestReading] = useState<SensorReading | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // -------- HISTORY --------
  const fetchHistory = useCallback(async () => {
    const now = Math.floor(Date.now() / 1000);
    const from = now - 24 * 60 * 60;

    const res = await axios.get(`${API_BASE}/api/farms/${FARM_ID}/history`, {
      params: { from, to: now },
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
    const res = await axios.get(`${API_BASE}/api/farms/${FARM_ID}/alerts`);

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

  // -------- INITIAL LOAD --------
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchHistory(), fetchAlerts()]);
      } catch {
        setError('Failed to load initial data');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [fetchHistory, fetchAlerts]);

  // -------- SOCKET.IO --------
  useEffect(() => {
    const socket = io(API_BASE, { transports: ['polling'] });

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

  }, []);

  return {
    latestReading,
    historicalData,
    alerts,
    isConnected,
    isLoading,
    error,
  };
}
