'use client';

import { useState, useEffect } from 'react';
import { Clock, CheckCircle2, Flame, AlertTriangle, ArrowRight, Ban } from 'lucide-react';
import { Order, OrderStatus } from '@/lib/types';
import { getElapsedTimeMinutes } from '@/lib/utils';
import { FoodDietBadge } from '../storefront/FoodDietBadge';

interface KDSOrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

export function KDSOrderCard({ order, onUpdateStatus }: KDSOrderCardProps) {
  const [elapsed, setElapsed] = useState(getElapsedTimeMinutes(order.createdAt));

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(getElapsedTimeMinutes(order.createdAt));
    }, 15000); // refresh every 15s
    return () => clearInterval(timer);
  }, [order.createdAt]);

  const isOverdue = elapsed >= 15;
  const isWarning = elapsed >= 10 && elapsed < 15;

  const getCardHeaderColor = () => {
    if (order.status === 'ready') return 'bg-ordora-success text-white';
    if (isOverdue) return 'bg-ordora-error text-white animate-pulse';
    if (isWarning) return 'bg-ordora-warning text-white';
    if (order.status === 'preparing') return 'bg-ordora-coral text-white';
    return 'bg-ordora-charcoal text-white';
  };

  return (
    <div className="bg-white rounded-2xl border border-ordora-border shadow-card overflow-hidden flex flex-col justify-between transition-all hover:shadow-lg">
      <div>
        {/* Card Header */}
        <div className={`p-3.5 flex items-center justify-between ${getCardHeaderColor()}`}>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black font-mono">
                {order.orderNumber}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 capitalize">
                {order.orderType.replace('_', ' ')}
              </span>
            </div>
            <div className="text-xl font-black tracking-tight mt-0.5">
              {order.tableNumber ? order.tableNumber : order.pickupToken}
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/20 text-xs font-mono font-bold">
            {isOverdue ? (
              <AlertTriangle className="w-3.5 h-3.5" />
            ) : (
              <Clock className="w-3.5 h-3.5" />
            )}
            <span>{elapsed}m</span>
          </div>
        </div>

        {/* Customer & Order Details */}
        <div className="px-4 py-2 bg-ordora-subtle/40 border-b border-ordora-border flex items-center justify-between text-xs text-ordora-muted">
          <span className="font-semibold text-ordora-charcoal truncate max-w-[180px]">
            {order.customerName}
          </span>
          <span className="font-mono">{order.items.length} items</span>
        </div>

        {/* Items List */}
        <div className="p-4 space-y-3 divide-y divide-ordora-border/60">
          {order.items.map((item) => (
            <div key={item.id} className="pt-2.5 first:pt-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-md bg-ordora-coral/10 text-ordora-coral font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {item.quantity}
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <FoodDietBadge type={item.foodType} />
                      <span className="text-sm font-bold text-ordora-charcoal leading-tight">
                        {item.productName}
                      </span>
                    </div>

                    {item.variantName && (
                      <span className="text-[11px] font-semibold text-ordora-coral block">
                        Size: {item.variantName}
                      </span>
                    )}

                    {item.modifiers.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {item.modifiers.map((m, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-ordora-subtle text-ordora-charcoal"
                          >
                            + {m.optionName}
                          </span>
                        ))}
                      </div>
                    )}

                    {item.specialInstructions && (
                      <div className="mt-1.5 text-[11px] font-bold text-ordora-coral bg-ordora-coral-light/60 px-2 py-1 rounded-md">
                        Note: {item.specialInstructions}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {order.notes && (
          <div className="mx-4 mb-3 p-2 rounded-xl bg-ordora-warning-light text-ordora-warning text-xs font-semibold">
            Order Note: {order.notes}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="p-3 bg-ordora-subtle/30 border-t border-ordora-border flex items-center gap-2">
        {order.status === 'received' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'accepted')}
            className="flex-1 py-2 px-3 bg-ordora-charcoal hover:bg-black text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>Accept Order</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}

        {order.status === 'accepted' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'preparing')}
            className="flex-1 py-2 px-3 bg-ordora-coral hover:bg-ordora-coral-hover text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Start Prep</span>
          </button>
        )}

        {order.status === 'preparing' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'ready')}
            className="flex-1 py-2 px-3 bg-ordora-success hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mark Ready</span>
          </button>
        )}

        {order.status === 'ready' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'completed')}
            className="flex-1 py-2 px-3 bg-ordora-charcoal hover:bg-black text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-ordora-success" />
            <span>Complete / Handover</span>
          </button>
        )}

        {order.status !== 'completed' && order.status !== 'cancelled' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'cancelled')}
            className="p-2 text-ordora-muted hover:text-ordora-error rounded-xl hover:bg-ordora-error-light transition-colors"
            title="Reject / Cancel Order"
          >
            <Ban className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
