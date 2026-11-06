'use client';

import { X, MapPin, Clock, Check } from 'lucide-react';
import { useStore } from '@/lib/useStore';

interface OutletPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OutletPickerModal({ isOpen, onClose }: OutletPickerModalProps) {
  const { outlets, activeOutletId, setActiveOutlet } = useStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-ordora-charcoal/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-ordora-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-ordora-coral-light flex items-center justify-center text-ordora-coral">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-ordora-charcoal font-display">
              Select Outlet
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-ordora-subtle flex items-center justify-center text-ordora-muted hover:text-ordora-charcoal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {outlets.map((outlet) => {
            const isSelected = activeOutletId === outlet.id;
            return (
              <button
                key={outlet.id}
                type="button"
                onClick={() => {
                  setActiveOutlet(outlet.id);
                  onClose();
                }}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start justify-between ${
                  isSelected
                    ? 'border-ordora-coral bg-ordora-coral-light/20 shadow-sm'
                    : 'border-ordora-border hover:border-ordora-coral/40'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-ordora-charcoal">
                      {outlet.name}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-ordora-success-light text-ordora-success rounded-full">
                      Open Now
                    </span>
                  </div>
                  <p className="text-xs text-ordora-muted leading-relaxed">
                    {outlet.address}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-ordora-muted pt-1">
                    <Clock className="w-3.5 h-3.5 text-ordora-coral" />
                    <span>{outlet.openingHours}</span>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 flex-shrink-0 ${
                    isSelected
                      ? 'border-ordora-coral bg-ordora-coral text-white'
                      : 'border-ordora-border'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
