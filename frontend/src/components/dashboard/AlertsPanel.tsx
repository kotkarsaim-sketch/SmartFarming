import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Alert } from '@/types/sensor';

interface AlertsPanelProps {
  alerts: Alert[];
}

const alertIcons = {
  critical: AlertTriangle,
  warning: AlertCircle,
  info: Info,
};

const alertStyles = {
  critical: 'alert-item critical',
  warning: 'alert-item warning',
  info: 'alert-item info',
};

const iconColors = {
  critical: 'text-red-400',
  warning: 'text-amber-400',
  info: 'text-emerald-400',
};

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  if (alerts.length === 0) {
    return (
      <div className="sensor-card">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
            <Info className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-white/50 text-sm font-medium">No active alerts</p>
          <p className="text-white/20 text-xs mt-1">All systems operating normally</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sensor-card">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-white/80">Recent Alerts</h3>
        <p className="text-xs text-white/30 mt-0.5">
          {alerts.length} notification{alerts.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {alerts.map((alert, index) => {
          const Icon = alertIcons[alert.type];
          return (
            <div
              key={alert.id || index}
              className={cn(alertStyles[alert.type], 'animate-fade-in')}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Icon className={cn('w-4 h-4 flex-shrink-0 mt-0.5', iconColors[alert.type])} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white/70">{alert.message}</p>
                <p className="text-[10px] text-white/25 mt-1">
                  {new Date(alert.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
