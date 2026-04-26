import { ReactNode, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface SensorCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: ReactNode;
  color: 'moisture' | 'temperature' | 'humidity' | 'rain';
  subtitle?: string;
  isLive?: boolean;
}

const colorConfig = {
  moisture: {
    text: 'text-sky-400',
    bg: 'bg-sky-500/10',
    glow: 'rgba(56, 189, 248, 0.08)',
    border: 'border-sky-500/10',
  },
  temperature: {
    text: 'text-orange-400',
    bg: 'bg-orange-500/10',
    glow: 'rgba(251, 146, 60, 0.08)',
    border: 'border-orange-500/10',
  },
  humidity: {
    text: 'text-teal-400',
    bg: 'bg-teal-500/10',
    glow: 'rgba(45, 212, 191, 0.08)',
    border: 'border-teal-500/10',
  },
  rain: {
    text: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    glow: 'rgba(129, 140, 248, 0.08)',
    border: 'border-indigo-500/10',
  },
};

export function SensorCard({
  title,
  value,
  unit,
  icon,
  color,
  subtitle,
  isLive = false,
}: SensorCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const config = colorConfig[color];

  useEffect(() => {
    setIsUpdating(true);
    const timer = setTimeout(() => setIsUpdating(false), 300);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div
      className={cn(
        "sensor-card group cursor-default",
        config.border
      )}
      style={{ boxShadow: `0 0 60px -15px ${config.glow}` }}
    >
      {/* Subtle glow orb */}
      <div
        className={cn("absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700", config.bg)}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative">
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", config.bg)}>
            <span className={config.text}>{icon}</span>
          </div>
          <div>
            <h3 className="font-medium text-white/80 text-sm">{title}</h3>
            {subtitle && (
              <p className="text-[11px] text-white/30">{subtitle}</p>
            )}
          </div>
        </div>

        {isLive && (
          <div className="live-indicator text-[11px] text-white/40 font-medium">
            Live
          </div>
        )}
      </div>

      {/* Value */}
      <div className="relative">
        <span
          className={cn(
            "sensor-value",
            config.text,
            isUpdating && "animate-value-update"
          )}
        >
          {value}
        </span>
        <span className="ml-2 text-lg text-white/25 font-medium">
          {unit}
        </span>
      </div>
    </div>
  );
}
