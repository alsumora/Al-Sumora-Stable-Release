import React, { useState } from 'react';
import { Order, OrderStatus, TrackingStep } from '../../types';
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  Sparkles,
  CreditCard,
  Printer,
  ChevronRight,
  X,
  ExternalLink,
  Edit2,
  Save,
  Check,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminOrdersManagerProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onUpdateOrderDetails: (updatedOrder: Order) => void;
  initialSelectedOrder?: Order | null;
}

export const AdminOrdersManager: React.FC<AdminOrdersManagerProps> = ({
  orders,
  onUpdateOrderStatus,
  onUpdateOrderDetails,
  initialSelectedOrder = null,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(initialSelectedOrder);

  // Fulfillment Editor in modal
  const [editingCourier, setEditingCourier] = useState(false);
  const [courierNameInput, setCourierNameInput] = useState('');
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [estimatedDeliveryInput, setEstimatedDeliveryInput] = useState('');
  const [adminNotesInput, setAdminNotesInput] = useState('');

  React.useEffect(() => {
    if (initialSelectedOrder) {
      setSelectedOrder(initialSelectedOrder);
    }
  }, [initialSelectedOrder]);

  const handleOpenInspector = (ord: Order) => {
    setSelectedOrder(ord);
    setCourierNameInput(ord.courierName || 'BlueDart Express Air');
    setTrackingNumberInput(ord.trackingNumber || 'BLUEDART-000000-IN');
    setEstimatedDeliveryInput(ord.estimatedDelivery || 'In 5-7 business days');
    setAdminNotesInput(ord.adminNotes || '');
    setEditingCourier(false);
  };

  const handleSaveFulfillment = () => {
    if (!selectedOrder) return;
    const updated: Order = {
      ...selectedOrder,
      courierName: courierNameInput.trim(),
      trackingNumber: trackingNumberInput.trim(),
      estimatedDelivery: estimatedDeliveryInput.trim(),
      adminNotes: adminNotesInput.trim(),
    };
    onUpdateOrderDetails(updated);
    setSelectedOrder(updated);
    setEditingCourier(false);
  };

  const handleStatusChange = (newStatus: OrderStatus) => {
    if (!selectedOrder) return;
    
    // Update tracking steps logic
    const steps: TrackingStep[] = [
      {
        label: 'Order Placed',
        date: selectedOrder.trackingSteps[0]?.date || 'Aug 2026',
        completed: true,
        description: 'Order confirmed and transaction verified.',
      },
      {
        label: 'Stitching',
        date: newStatus === 'Stitching' || newStatus === 'Dispatched' || newStatus === 'Delivered' ? 'Completed' : 'Pending',
        completed: newStatus === 'Dispatched' || newStatus === 'Delivered',
        current: newStatus === 'Stitching',
        description: 'Master leather artisan crafting and saddle-stitching.',
      },
      {
        label: 'Dispatched',
        date: newStatus === 'Dispatched' || newStatus === 'Delivered' ? 'Completed' : 'Pending',
        completed: newStatus === 'Delivered',
        current: newStatus === 'Dispatched',
        description: `Insured parcel in transit via ${courierNameInput || selectedOrder.courierName}.`,
      },
      {
        label: 'Delivered',
        date: newStatus === 'Delivered' ? 'Completed' : 'Pending',
        completed: newStatus === 'Delivered',
        current: newStatus === 'Delivered',
        description: 'Delivered safely to destination.',
      },
    ];

    const updated: Order = {
      ...selectedOrder,
      status: newStatus,
      trackingSteps: steps,
    };

    onUpdateOrderDetails(updated);
    setSelectedOrder(updated);
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.customerName && o.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.customerEmail && o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.transactionId && o.transactionId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      o.shippingAddress.street.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.shippingAddress.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Order Placed':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200"><Clock className="w-3 h-3" /> Order Placed</span>;
      case 'Stitching':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200"><Package className="w-3 h-3" /> Hand Stitching</span>;
      case 'Dispatched':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200"><Truck className="w-3 h-3" /> Dispatched</span>;
      case 'Delivered':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-3 h-3" /> Delivered</span>;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
            Sales Ledger & Fulfillment
          </span>
          <h2 className="font-bold text-xl sm:text-2xl text-slate-900 mt-0.5">
            Orders & Transactions ({orders.length})
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Review payment reference IDs, change order fulfillment stages, and inspect custom monogram specs.
          </p>
        </div>

        <div className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-slate-50 text-slate-800 border border-slate-300 self-start sm:self-auto">
          Total Settled: <span className="text-blue-700 font-bold">₹{orders.reduce((acc, o) => acc + (o.total || 0), 0).toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, Transaction ID, Customer, Courier..."
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 hide-scrollbar">
          {['All', 'Order Placed', 'Stitching', 'Dispatched', 'Delivered'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                statusFilter === st
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {st} {st === 'All' ? `(${orders.length})` : `(${orders.filter((o) => o.status === st).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-semibold uppercase text-[11px] border-b border-slate-200">
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-3">Customer & Location</th>
                <th className="py-3 px-3">Transaction Details</th>
                <th className="py-3 px-3">Items & Monogram</th>
                <th className="py-3 px-3">Fulfillment Status</th>
                <th className="py-3 px-3">Total Amount</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No orders match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const hasMonogram = order.items.some((i) => i.monogram?.initials);

                  return (
                    <tr key={order.id} className="hover:bg-blue-50/30 transition-colors">
                      {/* Order ID & Date */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 font-mono text-xs sm:text-sm">
                          {order.id}
                        </div>
                        <div className="text-[10px] text-slate-500">{order.createdAt}</div>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-slate-900">
                          {order.customerName || order.shippingAddress.street.split(',')[0]}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {order.customerEmail || order.shippingAddress.city}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {order.shippingAddress.city}, {order.shippingAddress.state}
                        </div>
                      </td>

                      {/* Transaction Information */}
                      <td className="py-3.5 px-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1 font-mono text-[10px] text-blue-700 font-semibold">
                            <CreditCard className="w-3 h-3 text-blue-600" />
                            <span>{order.transactionId || `TXN_${order.id.replace('-', '_')}`}</span>
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {order.paymentMethod || 'Online Prepaid'}
                          </div>
                          <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {order.paymentStatus || 'Paid / Captured'}
                          </span>
                        </div>
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-3">
                        <div className="text-slate-900 font-medium">
                          {order.items.length} product{order.items.length > 1 ? 's' : ''}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[150px]">
                          {order.items.map((i) => i.product.name).join(', ')}
                        </div>
                        {hasMonogram && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-medium bg-amber-50 text-amber-800 border border-amber-200 mt-0.5">
                            <Sparkles className="w-2.5 h-2.5 text-amber-600" /> Monogrammed
                          </span>
                        )}
                      </td>

                      {/* Fulfillment Status */}
                      <td className="py-3.5 px-3">
                        {getStatusBadge(order.status)}
                        <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                          {order.trackingNumber ? order.trackingNumber : 'Pending dispatch'}
                        </div>
                      </td>

                      {/* Total Amount */}
                      <td className="py-3.5 px-3 font-bold text-slate-900 text-sm">
                        ₹{order.total.toLocaleString('en-IN')}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenInspector(order)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 transition-colors cursor-pointer border border-slate-200"
                        >
                          Inspect & Manage
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Order & Transaction Inspector Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[70] overflow-y-auto flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
              onClick={() => setSelectedOrder(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-white w-full max-w-3xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-10 text-slate-900 max-h-[90vh] flex flex-col font-sans"
            >
              {/* Header */}
              <div className="bg-slate-50 p-5 sm:p-6 border-b border-slate-200 flex items-start justify-between shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600">
                      Order Dossier & Transaction Ledger
                    </span>
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                  <h3 className="font-bold text-xl text-slate-900 mt-0.5">
                    Order {selectedOrder.id}
                  </h3>
                  <span className="text-xs text-slate-500">
                    Placed on {selectedOrder.createdAt}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                    title="Print Invoice / Packing Slip"
                  >
                    <Printer className="w-4 h-4" />
                    <span className="hidden sm:inline">Print Invoice</span>
                  </button>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                {/* 1. Transaction & Financial Information */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold uppercase text-blue-700 tracking-wider flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4" /> Transaction Information
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Payment Status: {selectedOrder.paymentStatus || 'Paid / Captured'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Transaction Reference ID</span>
                      <strong className="font-mono text-slate-900 text-[11px]">
                        {selectedOrder.transactionId || `TXN_${selectedOrder.id.replace('-', '_')}`}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Payment Gateway / Method</span>
                      <span className="font-semibold text-slate-900">
                        {selectedOrder.paymentMethod || 'UPI / NetBanking'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Grand Total Paid</span>
                      <span className="font-bold text-sm text-slate-900">
                        ₹{selectedOrder.total.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Order Status Progression Stepper (Admin Controls) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase text-slate-900 tracking-wider">
                      Update Fulfillment Stage
                    </h4>
                    <span className="text-xs text-blue-600 font-medium">
                      Click stage to advance order
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['Order Placed', 'Stitching', 'Dispatched', 'Delivered'] as OrderStatus[]).map((stage) => {
                      const isCurrent = selectedOrder.status === stage;
                      return (
                        <button
                          key={stage}
                          type="button"
                          onClick={() => handleStatusChange(stage)}
                          className={`p-3 rounded-lg border text-center transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
                          }`}
                        >
                          <div className="text-[10px] uppercase font-semibold tracking-wider opacity-80">
                            Stage
                          </div>
                          <div className="text-xs font-bold mt-0.5">{stage}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Items & Monogram Specifications */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-900 tracking-wider">
                    Purchased Goods ({selectedOrder.items.length})
                  </h4>

                  <div className="space-y-3">
                    {selectedOrder.items.map((item, idx) => {
                      return (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={item.selectedColor.image || item.product.images[0]}
                              alt={item.product.name}
                              className="w-16 h-16 rounded-lg object-cover border border-slate-200"
                            />
                            <div className="flex-1">
                              <h5 className="font-bold text-sm text-slate-900">
                                {item.product.name}
                              </h5>
                              <div className="flex items-center gap-2 text-xs text-slate-600 mt-0.5">
                                <span className="flex items-center gap-1">
                                  <span
                                    className="w-3 h-3 rounded-full border border-slate-300"
                                    style={{ backgroundColor: item.selectedColor.hex }}
                                  />
                                  {item.selectedColor.name}
                                </span>
                                <span>•</span>
                                <span>Qty: {item.quantity}</span>
                                <span>•</span>
                                <span className="font-bold text-slate-900">
                                  ₹{item.product.price.toLocaleString('en-IN')}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Bespoke Monogram Customization Details */}
                          {item.monogram?.initials && (
                            <div className="p-3 bg-white rounded-lg border border-amber-200 space-y-1.5 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-amber-800 flex items-center gap-1">
                                  <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Monogram Personalization Specifications
                                </span>
                                <span className="px-2 py-0.5 bg-amber-50 text-amber-800 font-medium text-[10px] rounded border border-amber-200 uppercase">
                                  Finish: {item.monogram.finish || 'Gold Foil'}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                                <div>
                                  <span className="text-slate-500">Engraved Initials:</span>
                                  <div className="font-bold text-slate-900 mt-0.5">
                                    "{item.monogram.initials}"
                                  </div>
                                </div>
                                <div>
                                  <span className="text-slate-500">Placement:</span>
                                  <div className="font-medium text-slate-900 mt-0.5">
                                    {item.monogram.placement || 'Bottom Right Corner'}
                                  </div>
                                </div>
                              </div>

                              {item.monogram.description && (
                                <div className="pt-1 text-xs">
                                  <span className="text-slate-500">Custom Notes:</span>
                                  <p className="text-slate-800 italic">"{item.monogram.description}"</p>
                                </div>
                              )}

                              {item.monogram.canvasSnapshot && (
                                <div className="pt-2">
                                  <span className="text-slate-500 text-[10px] block mb-1">Canvas Preview:</span>
                                  <img
                                    src={item.monogram.canvasSnapshot}
                                    alt="Monogram Preview"
                                    className="max-h-24 rounded border border-slate-200"
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Courier & Logistics Fulfillment Editor */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-blue-600" /> Courier & Logistics Details
                    </span>
                    {!editingCourier ? (
                      <button
                        onClick={() => setEditingCourier(true)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit Logistics
                      </button>
                    ) : (
                      <button
                        onClick={handleSaveFulfillment}
                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" /> Save Changes
                      </button>
                    )}
                  </div>

                  {editingCourier ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-700 uppercase block mb-1">
                          Courier Partner
                        </label>
                        <input
                          type="text"
                          value={courierNameInput}
                          onChange={(e) => setCourierNameInput(e.target.value)}
                          placeholder="e.g. BlueDart Express Air"
                          className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-700 uppercase block mb-1">
                          Tracking AWB Number
                        </label>
                        <input
                          type="text"
                          value={trackingNumberInput}
                          onChange={(e) => setTrackingNumberInput(e.target.value)}
                          placeholder="e.g. BLUEDART-981240-IN"
                          className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-700 uppercase block mb-1">
                          Estimated Delivery Time
                        </label>
                        <input
                          type="text"
                          value={estimatedDeliveryInput}
                          onChange={(e) => setEstimatedDeliveryInput(e.target.value)}
                          placeholder="e.g. Wed, Sep 02, 2026"
                          className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-700 uppercase block mb-1">
                          Internal Notes
                        </label>
                        <input
                          type="text"
                          value={adminNotesInput}
                          onChange={(e) => setAdminNotesInput(e.target.value)}
                          placeholder="e.g. Artisan assigned"
                          className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Courier Partner:</span>
                        <strong className="text-slate-900">{selectedOrder.courierName || 'BlueDart Air'}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">AWB Tracking Number:</span>
                        <strong className="font-mono text-blue-700">{selectedOrder.trackingNumber || 'Unassigned'}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Estimated Delivery:</span>
                        <strong className="text-slate-900">{selectedOrder.estimatedDelivery || '5-7 Days'}</strong>
                      </div>
                    </div>
                  )}

                  {selectedOrder.adminNotes && !editingCourier && (
                    <div className="pt-2 text-xs border-t border-slate-200">
                      <span className="text-slate-500">Internal Notes: </span>
                      <span className="text-slate-900 font-medium">{selectedOrder.adminNotes}</span>
                    </div>
                  )}
                </div>

                {/* 5. Destination Shipping Address */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-700 tracking-wider block">
                    Shipping & Delivery Address
                  </span>
                  <div className="font-bold text-slate-900">
                    {selectedOrder.customerName || 'Aarav Sharma'} • {selectedOrder.customerPhone || '+91 98200 12345'}
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.postalCode}, {selectedOrder.shippingAddress.country}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
