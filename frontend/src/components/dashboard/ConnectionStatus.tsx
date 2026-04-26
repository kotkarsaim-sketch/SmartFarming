import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConnectionStatusProps {
  isConnected: boolean;
  error: string | null;
  onRetry?: () => void;
}

export function ConnectionStatus({ isConnected, error, onRetry }: ConnectionStatusProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border',
        isConnected
          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          : error
          ? 'bg-red-500/10 text-red-400 border-red-500/20'
          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      )}
    >
      {isConnected ? (
        <>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Connected</span>
        </>
      ) : error ? (
        <>
          <WifiOff className="w-3.5 h-3.5" />
          <span>Offline</span>
          {onRetry && (
            <button
              onClick={onRetry}
              className="ml-1 p-0.5 rounded hover:bg-red-500/20 transition-colors"
              title="Retry connection"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          )}
        </>
      ) : (
        <>
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>Connecting</span>
        </>
      )}
    </div>
  );
}
