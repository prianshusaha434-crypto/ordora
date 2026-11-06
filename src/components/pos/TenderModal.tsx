'use client';

import { useState } from 'react';
import { X, DollarSign, QrCode, CreditCard, Check, ArrowRight } from 'lucide-react';
import { PaymentMethod } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface TenderModalProps {
  totalAmount: number;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (method: PaymentMethod, tenderAmount: number, change: number) => void;
}

export function TenderModal({
  totalAmount,
  isOpen,
  onClose,
  onConfirm,
}: TenderModalProps) {
  const [method, setMethod] = useState<PaymentMethod>('cash_counter');
  const [tenderCash, setTenderCash] = useState<number>(totalAmount);

  if (!isOpen) return null;

  const changeReturn = Math.max(0, tenderCash - totalAmount);

  const handleQuickCash = (amt: number) => {
    setTenderCash(amt);
  };

  const handleFinish = () => {
    onConfirm(method, tenderCash, changeReturn);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ordora-charcoal/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-ordora-border">
          <div>
            <h3 className="text-lg font-bold text-ordora-charcoal font-display">
              Payment & Settlement
            </h3>
            <span className="text-xs text-ordora-muted">Total Payable:</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black text-ordora-charcoal font-display">
              {formatCurrency(totalAmount)}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-ordora-subtle text-ordora-muted"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="grid grid-cols-3 gap-2.5 my-5">
          <button
            type="button"
            onClick={() => setMethod('cash_counter')}
            className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all ${
              method === 'cash_counter'
                ? 'border-ordora-coral bg-ordora-coral-light/30 text-ordora-coral font-bold'
                : 'border-ordora-border text-ordora-charcoal hover:border-ordora-coral/40'
            }`}
          >
            <DollarSign className="w-5 h-5" />
            <span className="text-xs">Cash</span>
          </button>

          <button
            type="button"
            onClick={() => setMethod('razorpay_upi')}
            className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all ${
              method === 'razorpay_upi'
                ? 'border-ordora-coral bg-ordora-coral-light/30 text-ordora-coral font-bold'
                : 'border-ordora-border text-ordora-charcoal hover:border-ordora-coral/40'
            }`}
          >
            <QrCode className="w-5 h-5" />
            <span className="text-xs">UPI QR</span>
          </button>

          <button
            type="button"
            onClick={() => setMethod('razorpay_card')}
            className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all ${
              method === 'razorpay_card'
                ? 'border-ordora-coral bg-ordora-coral-light/30 text-ordora-coral font-bold'
                : 'border-ordora-border text-ordora-charcoal hover:border-ordora-coral/40'
            }`}
          >
            <CreditCard className="w-5 h-5" />
            <span className="text-xs">Card Swipe</span>
          </button>
        </div>

        {/* Cash Tender Calculation */}
        {method === 'cash_counter' && (
          <div className="space-y-4 p-4 rounded-2xl bg-ordora-subtle/50 border border-ordora-border">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ordora-charcoal mb-1">
                Cash Tendered
              </label>
              <input
                type="number"
                value={tenderCash || ''}
                onChange={(e) => setTenderCash(Number(e.target.value))}
                className="w-full px-4 py-2 text-lg font-mono font-bold bg-white border border-ordora-border rounded-xl focus:outline-none focus:border-ordora-coral"
              />
            </div>

            {/* Quick Chips */}
            <div className="flex flex-wrap gap-2">
              {[totalAmount, 200, 500, 1000, 2000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleQuickCash(amt)}
                  className="px-3 py-1 bg-white border border-ordora-border text-xs font-bold rounded-lg hover:border-ordora-coral text-ordora-charcoal"
                >
                  {amt === totalAmount ? 'Exact' : `₹${amt}`}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-ordora-border flex items-center justify-between">
              <span className="text-xs font-bold text-ordora-muted uppercase">Change Due:</span>
              <span className="text-xl font-black text-ordora-success font-display">
                {formatCurrency(changeReturn)}
              </span>
            </div>
          </div>
        )}

        {/* UPI QR Simulation */}
        {method === 'razorpay_upi' && (
          <div className="p-6 rounded-2xl bg-ordora-subtle/40 border border-ordora-border text-center space-y-3">
            <div className="w-36 h-36 bg-white p-2.5 mx-auto rounded-xl border border-ordora-border shadow-soft flex items-center justify-center">
              <div className="w-full h-full bg-ordora-charcoal text-white rounded flex flex-col items-center justify-center p-2 text-center">
                <QrCode className="w-16 h-16" />
                <span className="text-[9px] font-mono mt-1">UPI: ordora@icici</span>
              </div>
            </div>
            <p className="text-xs text-ordora-muted font-medium">
              Customer scans via GPay, PhonePe, Paytm or any UPI app
            </p>
          </div>
        )}

        {/* Card Simulation */}
        {method === 'razorpay_card' && (
          <div className="p-6 rounded-2xl bg-ordora-subtle/40 border border-ordora-border text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-ordora-coral-light text-ordora-coral mx-auto flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-ordora-charcoal">POS Card Terminal Ready</h4>
            <p className="text-xs text-ordora-muted">
              Tap or insert card on connected terminal
            </p>
          </div>
        )}

        {/* Settle Action */}
        <button
          type="button"
          onClick={handleFinish}
          disabled={method === 'cash_counter' && tenderCash < totalAmount}
          className="mt-6 w-full py-3.5 bg-ordora-coral text-white font-bold text-sm rounded-xl hover:bg-ordora-coral-hover transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Confirm & Print Slip ({formatCurrency(totalAmount)})</span>
        </button>
      </div>
    </div>
  );
}
