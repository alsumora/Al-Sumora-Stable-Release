import React, { useState } from 'react';
import { CustomerUser, Order } from '../../types';
import {
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  ShieldCheck,
  Award,
  Calendar,
  X,
  ExternalLink,
  Plus,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminUsersManagerProps {
  users: CustomerUser[];
  orders: Order[];
  onSelectOrder?: (order: Order) => void;
  onAddUser?: (user: CustomerUser) => void;
}

export const AdminUsersManager: React.FC<AdminUsersManagerProps> = ({
  users,
  orders,
  onSelectOrder,
  onAddUser,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<CustomerUser | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // New user form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCity, setNewCity] = useState('Mumbai');
  const [newState, setNewState] = useState('Maharashtra');

  const filteredUsers = users.filter((u) => {
    return (
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const user: CustomerUser = {
      id: `usr_${Date.now().toString().slice(-6)}`,
      name: newName.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim() || '+91 98200 00000',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      role: 'customer',
      status: 'Active',
      joinedDate: 'Aug 2026',
      ordersCount: 0,
      totalSpent: 0,
      billingAddress: {
        street: 'High Street Road',
        city: newCity,
        state: newState,
        postalCode: '400001',
        country: 'India',
      },
      shippingAddress: {
        street: 'High Street Road',
        city: newCity,
        state: newState,
        postalCode: '400001',
        country: 'India',
      },
    };

    if (onAddUser) {
      onAddUser(user);
    }
    setIsAddUserOpen(false);
    setNewName('');
    setNewEmail('');
    setNewPhone('');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
            Client Relations Directory
          </span>
          <h2 className="font-bold text-xl sm:text-2xl text-slate-900 mt-0.5">
            Registered Customers & User Records ({users.length})
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Inspect customer profiles, order histories, billing contacts, and lifetime client engagement.
          </p>
        </div>

        {onAddUser && (
          <button
            onClick={() => setIsAddUserOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer Record</span>
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, email, phone number, or ID..."
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium hidden sm:block">
          Showing {filteredUsers.length} of {users.length} registered profiles
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-semibold uppercase text-[11px] border-b border-slate-200">
                <th className="py-3 px-4">Client Profile</th>
                <th className="py-3 px-3">Contact Details</th>
                <th className="py-3 px-3">Role & Status</th>
                <th className="py-3 px-3">Primary Location</th>
                <th className="py-3 px-3">Orders Placed</th>
                <th className="py-3 px-3">Lifetime Spend</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No user accounts match your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const userOrders = orders.filter(
                    (o) =>
                      o.customerEmail?.toLowerCase() === user.email.toLowerCase() ||
                      o.shippingAddress.street === user.shippingAddress.street
                  );

                  const calculatedSpent = userOrders.reduce((sum, o) => sum + (o.total || 0), user.totalSpent || 0);

                  return (
                    <tr key={user.id} className="hover:bg-blue-50/30 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900 text-xs sm:text-sm">
                              {user.name}
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              ID: {user.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact Details */}
                      <td className="py-3.5 px-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-slate-900 font-medium">
                            <Mail className="w-3 h-3 text-blue-600" />
                            <span>{user.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{user.phone || '+91 98200 12345'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Role & Status */}
                      <td className="py-3.5 px-3">
                        <div className="flex flex-col gap-1">
                          {user.role === 'admin' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white w-fit shadow-xs">
                              <ShieldCheck className="w-3 h-3" /> Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200 w-fit">
                              Customer
                            </span>
                          )}

                          {user.status === 'VIP' && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium bg-amber-50 text-amber-800 border border-amber-200 w-fit">
                              <Award className="w-2.5 h-2.5 text-amber-600" /> VIP Patron
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Primary Location */}
                      <td className="py-3.5 px-3">
                        <div className="text-xs text-slate-900 font-medium">
                          {user.shippingAddress?.city || 'Mumbai'}, {user.shippingAddress?.state || 'MH'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {user.shippingAddress?.postalCode || '400051'}
                        </div>
                      </td>

                      {/* Orders count */}
                      <td className="py-3.5 px-3">
                        <span className="text-xs font-semibold text-slate-900">
                          {Math.max(user.ordersCount || 0, userOrders.length)} Orders
                        </span>
                      </td>

                      {/* Lifetime Spend */}
                      <td className="py-3.5 px-3 font-bold text-slate-900 text-sm">
                        ₹{calculatedSpent.toLocaleString('en-IN')}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 transition-colors cursor-pointer border border-slate-200"
                        >
                          View Dossier
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

      {/* User Dossier Inspector Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-[70] overflow-y-auto flex items-center justify-center p-4 sm:p-6 font-sans">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
              onClick={() => setSelectedUser(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-10 text-slate-900 max-h-[90vh] flex flex-col"
            >
              {/* Header Profile Header */}
              <div className="bg-slate-50 p-6 border-b border-slate-200 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    className="w-14 h-14 rounded-xl object-cover border-2 border-blue-500 shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-xl text-slate-900">
                        {selectedUser.name}
                      </h3>
                      {selectedUser.role === 'admin' && (
                        <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      Client ID: {selectedUser.id} • Joined {selectedUser.joinedDate || '2025'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                {/* Contact & Status Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold uppercase text-blue-600 tracking-wider block">
                      Contact Information
                    </span>
                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-blue-600" />
                        <span className="font-semibold text-slate-900">{selectedUser.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-700">{selectedUser.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold uppercase text-blue-600 tracking-wider block">
                      Account Status & Tier
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {selectedUser.status || 'Active'} Tier
                      </span>
                      <a
                        href={`mailto:${selectedUser.email}?subject=Personal Greeting from Support`}
                        className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 ml-auto"
                      >
                        <Mail className="w-3.5 h-3.5" /> Email Client
                      </a>
                    </div>
                  </div>
                </div>

                {/* Saved Addresses */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase text-slate-900 tracking-wider">
                    Registered Delivery & Billing Addresses
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" /> Shipping Destination
                      </div>
                      <p className="text-slate-600 leading-relaxed">
                        {selectedUser.shippingAddress?.street}, {selectedUser.shippingAddress?.city}, {selectedUser.shippingAddress?.state} - {selectedUser.shippingAddress?.postalCode}, {selectedUser.shippingAddress?.country}
                      </p>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" /> Billing Address
                      </div>
                      <p className="text-slate-600 leading-relaxed">
                        {selectedUser.billingAddress?.street}, {selectedUser.billingAddress?.city}, {selectedUser.billingAddress?.state} - {selectedUser.billingAddress?.postalCode}, {selectedUser.billingAddress?.country}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Orders History by this User */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-900 tracking-wider">
                    Client Orders History
                  </h4>
                  {orders.filter(
                    (o) =>
                      o.customerEmail?.toLowerCase() === selectedUser.email.toLowerCase() ||
                      o.shippingAddress.street === selectedUser.shippingAddress.street
                  ).length === 0 ? (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs text-slate-400">
                      No active orders recorded under this user account yet.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {orders
                        .filter(
                          (o) =>
                            o.customerEmail?.toLowerCase() === selectedUser.email.toLowerCase() ||
                            o.shippingAddress.street === selectedUser.shippingAddress.street
                        )
                        .map((ord) => (
                          <div
                            key={ord.id}
                            className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                          >
                            <div>
                              <div className="font-bold text-slate-900 font-mono">{ord.id}</div>
                              <div className="text-[10px] text-slate-500">{ord.createdAt} • {ord.status}</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-sm text-slate-900">
                                ₹{ord.total.toLocaleString('en-IN')}
                              </span>
                              {onSelectOrder && (
                                <button
                                  onClick={() => {
                                    setSelectedUser(null);
                                    onSelectOrder(ord);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-semibold cursor-pointer shadow-xs"
                                >
                                  Inspect Order
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add User Modal */}
      <AnimatePresence>
        {isAddUserOpen && (
          <div className="fixed inset-0 z-[70] overflow-y-auto flex items-center justify-center p-4 font-sans">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
              onClick={() => setIsAddUserOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-md rounded-xl shadow-2xl border border-slate-200 p-6 z-10 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="font-bold text-lg text-slate-900">
                  Register New Customer Profile
                </h3>
                <button onClick={() => setIsAddUserOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 uppercase block mb-1">Full Name *</label>
                  <input
                    required
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Yashvardhan Singhal"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 uppercase block mb-1">Email Address *</label>
                  <input
                    required
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="yash@domain.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 uppercase block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+91 98200 12345"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 uppercase block mb-1">City</label>
                    <input
                      type="text"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 uppercase block mb-1">State</label>
                    <input
                      type="text"
                      value={newState}
                      onChange={(e) => setNewState(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddUserOpen(false)}
                    className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
                  >
                    Create Profile
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
