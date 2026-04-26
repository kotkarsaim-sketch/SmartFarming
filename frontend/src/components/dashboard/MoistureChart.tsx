import { useMemo } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import type { HistoricalData } from '@/types/sensor';

interface MoistureChartProps {
  data: HistoricalData[];
}

export function MoistureChart({ data }: MoistureChartProps) {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      time: new Date(item.timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }));
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="sensor-card h-[350px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/30 text-sm">No historical data available</p>
          <p className="text-white/15 text-xs mt-1">Run the simulator to generate data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sensor-card">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-white/80">
          Soil Moisture Over Time
        </h3>
        <p className="text-xs text-white/30 mt-0.5">
          Last 24 hours of readings
        </p>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="moistureGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(200, 80%, 55%)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(200, 80%, 55%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.25)' }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.25)' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(220, 13%, 12%)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                color: 'rgba(255,255,255,0.8)',
              }}
              labelStyle={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500, fontSize: 11 }}
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'Moisture']}
            />
            <Area
              type="monotone"
              dataKey="moisture"
              stroke="hsl(200, 80%, 55%)"
              strokeWidth={2}
              fill="url(#moistureGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
