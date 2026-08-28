import React, { useState, useEffect } from 'react';
import { Order, CartItem } from '../types';
import {
  X,
  Truck,
  Clock,
  MapPin,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Copy,
  Check,
  Navigation
} from 'lucide-react';

interface OrderTrackingModalProps {
  order: Order | null;
  selectedItem?: CartItem | null;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order,
  selectedItem,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!order) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [order, onClose]);

  if (!order) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(order.trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine current active step or fallback
  const activeStep = order.trackingSteps.find((s) => s.current) || order.trackingSteps[0];

  return (
    <div
      className="fixed inset-0 z-[70] overflow-y-auto bg-[#090100]/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-[#fbf9f4] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#d3c3be]/60 overflow-hidden text-[#1b1c19] my-8"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header */}
        <div className="bg-[#090100] text-white p-5 sm:p-6 border-b border-[#2c1810] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#825425]/40 border border-[#fdc087]/50 flex items-center justify-center text-[#fdc087] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-lg text-white">
                  Live Tracking • {order.id}
                </span>
              </div>
              <p className="text-xs text-[#d3c3be] mt-0.5">
                Carrier: <span className="text-white font-semibold">{order.courierName}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#d3c3be] hover:text-white transition-colors rounded-full hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Location & Estimated Arrival Card */}
          <div className="bg-white border border-[#d3c3be]/70 rounded-xl p-4 sm:p-5 space-y-3 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#f0eee9]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#f0eee9] text-[#825425] flex items-center justify-center shrink-0">
                  <Navigation className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#827470] tracking-wider block">
                    Current Location & Status
                  </span>
                  <span className="text-xs font-bold text-[#090100]">
                    {activeStep ? `${activeStep.label} (${activeStep.date})` : 'Processing'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[#827470] text-[11px]">Tracking Code:</span>
                <code className="font-mono bg-[#f0eee9] px-2 py-0.5 rounded text-[#090100] text-xs font-semibold">
                  {order.trackingNumber}
                </code>
                <button
                  onClick={handleCopy}
                  className="p-1 text-[#827470] hover:text-[#825425] transition-colors cursor-pointer"
                  title="Copy tracking code"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Destination Location */}
            <div className="flex items-start gap-2.5 text-xs text-[#504440] pt-1">
              <MapPin className="w-4 h-4 text-[#825425] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#090100]">Destination Address: </span>
                <span>
                  {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                  {order.shippingAddress.state} {order.shippingAddress.postalCode},{' '}
                  {order.shippingAddress.country}
                </span>
                <div className="text-[11px] text-[#827470] mt-0.5">
                  Estimated Delivery: <strong className="text-[#090100]">{order.estimatedDelivery}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* 4-Step Live Tracking Flow: Order Placed -> Stitching -> Dispatched -> Delivered */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-[#090100] border-b border-[#d3c3be]/40 pb-2">
              Shipment Progress
            </h4>

            <div className="relative pl-6 space-y-5 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#d3c3be]/60">
              {order.trackingSteps.map((step, idx) => {
                const isCompleted = step.completed;
                const isCurrent = step.current;

                return (
                  <div key={idx} className="relative flex items-start gap-3.5">
                    {/* Circle Node */}
                    <div
                      className={`absolute -left-[18px] top-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-[#090100] border-[#090100] text-[#fdc087]'
                          : isCurrent
                          ? 'bg-[#825425] border-[#825425] text-white ring-4 ring-[#825425]/20 animate-pulse'
                          : 'bg-white border-[#d3c3be] text-[#827470]'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#fdc087]" />
                      ) : (
                        <span className="text-[10px] font-mono font-bold">{idx + 1}</span>
                      )}
                    </div>

                    {/* Step Text Info */}
                    <div className="bg-white p-3.5 rounded-xl border border-[#d3c3be]/50 flex-1 shadow-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-xs font-bold uppercase tracking-wider ${
                            isCompleted || isCurrent ? 'text-[#090100]' : 'text-[#827470]'
                          }`}
                        >
                          {step.label}
                        </span>
                        <span className="text-[10px] font-mono text-[#825425] font-semibold bg-[#fbf9f4] px-2 py-0.5 rounded border border-[#d3c3be]/40">
                          {step.date}
                        </span>
                      </div>
                      <p className="text-xs text-[#504440] mt-1 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Product Details in this order */}
          <div className="space-y-2.5 pt-1">
            <h4 className="font-display font-bold text-sm text-[#090100] border-b border-[#d3c3be]/40 pb-2">
              Item Summary
            </h4>

            <div className="space-y-2.5">
              {order.items.map((item, idx) => {
                const isHighlighted = selectedItem?.product.id === item.product.id;

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                      isHighlighted
                        ? 'bg-[#fbf9f4] border-[#825425]'
                        : 'bg-white border-[#d3c3be]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.selectedColor.image || item.product.images[0]}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 object-cover rounded-lg border border-[#d3c3be] bg-white shrink-0"
                      />
                      <div>
                        <h5 className="font-bold text-xs text-[#090100]">
                          {item.product.name}
                        </h5>
                        <div className="text-[11px] text-[#827470] mt-0.5">
                          {item.selectedColor.name} • Qty: {item.quantity}
                        </div>
                        {item.monogram && (
                          <div className="text-[10px] text-[#825425] font-semibold flex items-center gap-1 mt-0.5">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>Monogram: "{item.monogram.initials}"</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-xs text-[#090100]">
                        ${(item.product.price * item.quantity).toLocaleString()} USD
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment info */}
          <div className="bg-[#f0eee9] p-3.5 rounded-xl text-xs text-[#504440] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#825425]" />
              <span>Paid via {order.paymentMethod}</span>
            </span>
            <span className="font-semibold text-[#090100]">
              Total: ${order.total.toLocaleString()} USD
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
