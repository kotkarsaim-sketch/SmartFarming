import { Leaf } from 'lucide-react';
import { ConnectionStatus } from './ConnectionStatus';

interface HeaderProps {
  isConnected: boolean;
  error: string | null;
  onRetry?: () => void;
}

export function Header({ isConnected, error, onRetry }: HeaderProps) {
  return (
    <header className="relative h-16 border-b border-white/[0.06] bg-background/80 backdrop-blur-xl z-50 sticky top-0">
      <div className="h-full flex items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Leaf className="w-4.5 h-4.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <h1 className="text-lg font-bold tracking-tight text-white">
              SCM
            </h1>
            <span className="hidden sm:inline text-xs text-white/30 font-medium tracking-wider uppercase">
              Smart Crop Monitoring
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <ConnectionStatus
            isConnected={isConnected}
            error={error}
            onRetry={onRetry}
          />
        </div>
      </div>
    </header>
  );
}
