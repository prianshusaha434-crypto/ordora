'use client';

import { X, Printer } from 'lucide-react';
import { Order, Restaurant, Outlet } from '@/lib/types';
import { formatCurrency, formatDateTime } from '@/lib/utils';

interface ThermalReceiptModalProps {
  order: Order | null;
  restaurant: Restaurant;
  outlet: Outlet;
  isOpen: boolean;
  onClose: () => void;
}

export function ThermalReceiptModal({
  order,
  restaurant,
  outlet,
  isOpen,
  onClose,
}: ThermalReceiptModalProps) {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ordora-charcoal/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden p-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-ordora-border">
          <span className="text-xs font-bold uppercase tracking-wider text-ordora-muted">
            Thermal POS Receipt
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg bg-ordora-subtle hover:bg-ordora-coral hover:text-white transition-colors"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-ordora-subtle text-ordora-muted hover:text-ordora-charcoal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The Printable Thermal Paper (80mm styling) */}
        <div
          id="printable-receipt"
          className="flex-1 overflow-y-auto py-4 font-mono text-xs text-ordora-charcoal space-y-3 bg-white"
        >
          {/* Header */}
          <div className="text-center space-y-1">
            <h2 className="text-base font-black tracking-wider uppercase">
              {restaurant.name}
            </h2>
            <p className="text-[11px] text-ordora-muted">{outlet.name}</p>
            <p className="text-[10px] text-ordora-muted leading-tight">{outlet.address}</p>
            <p className="text-[10px] text-ordora-muted">Ph: {outlet.phone}</p>
            {restaurant.gstin && (
              <p className="text-[10px] font-bold">GSTIN: {restaurant.gstin}</p>
            )}
            {restaurant.fssaiNumber && (
              <p className="text-[10px]">FSSAI: {restaurant.fssaiNumber}</p>
            )}
          </div>

          <div className="border-b border-dashed border-gray-400 my-2" />

          {/* Token & Order ID */}
          <div className="text-center py-1">
            <span className="text-xs font-bold uppercase block">Token Number</span>
            <span className="text-2xl font-black block tracking-widest">
              {order.tableNumber ? order.tableNumber : order.pickupToken}
            </span>
            <span className="text-[11px] block text-ordora-muted font-bold mt-0.5 capitalize">
              [{order.orderType.replace('_', ' ')}]
            </span>
          </div>

          <div className="border-b border-dashed border-gray-400 my-2" />

          {/* Meta Info */}
          <div className="text-[11px] space-y-0.5">
            <div className="flex justify-between">
              <span>Order #:</span>
              <span className="font-bold">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{formatDateTime(order.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span>Customer:</span>
              <span className="font-bold">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment:</span>
              <span className="capitalize font-bold">{order.paymentMethod.replace('_', ' ')}</span>
            </div>
          </div>

          <div className="border-b border-dashed border-gray-400 my-2" />

          {/* Itemized Table */}
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="py-1">Item</th>
                <th className="py-1 text-center">Qty</th>
                <th className="py-1 text-right">Amt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.items.map((it) => (
                <tr key={it.id}>
                  <td className="py-1.5 pr-2">
                    <span className="font-bold block">{it.productName}</span>
                    {it.variantName && (
                      <span className="text-[9px] text-gray-500 block">
                        Size: {it.variantName}
                      </span>
                    )}
                    {it.modifiers.map((m, idx) => (
                      <span key={idx} className="text-[9px] text-gray-500 block">
                        +{m.optionName}
                      </span>
                    ))}
                  </td>
                  <td className="py-1.5 text-center font-bold">{it.quantity}</td>
                  <td className="py-1.5 text-right font-bold">{formatCurrency(it.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-b border-dashed border-gray-400 my-2" />

          {/* Financial Breakdown */}
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-700 font-bold">
                <span>Discount ({order.couponCode || 'Promo'}):</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>CGST (2.5%):</span>
              <span>{formatCurrency(order.tax / 2)}</span>
            </div>
            <div className="flex justify-between">
              <span>SGST (2.5%):</span>
              <span>{formatCurrency(order.tax / 2)}</span>
            </div>
            <div className="border-t border-double border-gray-800 pt-1 flex justify-between text-sm font-black">
              <span>NET PAYABLE:</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>

          <div className="border-b border-dashed border-gray-400 my-2" />

          {/* Footer note */}
          <div className="text-center text-[10px] space-y-1 text-gray-600">
            <p>Thank you for dining with {restaurant.name}!</p>
            <p className="font-bold">Powered by ORDORA Cloud POS</p>
            <p>*** Have a delicious day ***</p>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="pt-3 border-t border-ordora-border flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 bg-ordora-coral text-white font-bold text-xs rounded-xl hover:bg-ordora-coral-hover transition-colors flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Thermal Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
}
