import { Leaf } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6 animate-float">
          <Leaf className="w-7 h-7 text-emerald-400" />
        </div>
        <h2 className="text-lg font-semibold text-white/80 mb-2">Loading Dashboard</h2>
        <p className="text-sm text-white/25">Connecting to sensors...</p>
        <div className="mt-6 w-32 h-0.5 rounded-full bg-white/5 mx-auto overflow-hidden">
          <div className="h-full w-1/2 rounded-full bg-emerald-500/50 animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
