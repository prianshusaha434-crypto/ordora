'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Volume2, VolumeX, Maximize, Clock, ChefHat, ArrowLeft } from 'lucide-react';
import { useStore } from '@/lib/useStore';

interface KDSHeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  filterType: string;
  onFilterChange: (type: string) => void;
}

export function KDSHeader({
  soundEnabled,
  onToggleSound,
  filterType,
  onFilterChange,
}: KDSHeaderProps) {
  const { outlets, activeOutletId, orders } = useStore();
  const [time, setTime] = useState<string>('');

  const currentOutlet = outlets.find((o) => o.id === activeOutletId) || outlets[0];
  const activeOrders = orders.filter(
    (o) => o.outletId === currentOutlet.id && ['received', 'accepted', 'preparing'].includes(o.status)
  );

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <header className="bg-ordora-charcoal text-white px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 shadow-lg">
      {/* Left: Brand & Station title */}
      <div className="flex items-center gap-3">
        <Link
          href="/app/dashboard"
          className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 transition-colors"
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-ordora-coral flex items-center justify-center text-white shadow-soft">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black tracking-tight font-display">
                Kitchen Display System (KDS)
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-ordora-coral text-white">
                {activeOrders.length} Active Tickets
              </span>
            </div>
            <span className="text-xs text-white/60">{currentOutlet.name}</span>
          </div>
        </div>
      </div>

      {/* Middle: Order Type Filter */}
      <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl">
        {['all', 'dine_in', 'takeaway', 'pos'].map((type) => (
          <button
            key={type}
            onClick={() => onFilterChange(type)}
            className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
              filterType === type
                ? 'bg-ordora-coral text-white shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            {type.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Right: Clock & Utility Controls */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white/90">
          <Clock className="w-3.5 h-3.5 text-ordora-coral" />
          <span>{time}</span>
        </div>

        <button
          onClick={onToggleSound}
          className={`p-2 rounded-xl border transition-colors ${
            soundEnabled
              ? 'bg-ordora-coral/20 border-ordora-coral text-ordora-coral'
              : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
          }`}
          title={soundEnabled ? 'Mute alert chime' : 'Enable audio chime'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        <button
          onClick={handleFullscreen}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white transition-colors"
          title="Toggle Fullscreen"
        >
          <Maximize className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
