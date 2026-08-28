import React, { useState } from 'react';
import { CustomerInquiry } from '../../types';
import {
  MessageSquare,
  Search,
  Mail,
  Send,
  CheckCircle2,
  Clock,
  Phone,
  User,
  Sparkles,
  FileText,
  X,
  Check,
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminSupportDeskProps {
  inquiries: CustomerInquiry[];
  onReplyInquiry: (inquiryId: string, replyText: string, adminName: string) => void;
  onUpdateInquiryStatus: (inquiryId: string, status: 'Pending' | 'Replied' | 'Resolved') => void;
  initialSelectedInquiry?: CustomerInquiry | null;
}

const EMAIL_TEMPLATES = [
  {
    title: 'Custom Monogram Confirmation',
    subject: 'Al Sumora Atelier - Your Bespoke Monogramming Details',
    body: `Dear Customer,\n\nThank you for reaching out to the Al Sumora leather atelier regarding your bespoke monogramming request.\n\nWe have reviewed your specifications and are delighted to confirm that our master leather artisans can hand-stamp your custom initials using 24k gold foil on full-grain leather.\n\nPlease let us know if you have any additional placement preferences before crafting commences.\n\nWarm regards,\nAsfaq Silmi\nMaster Atelier | Al Sumora Pure Leather Studio`,
  },
  {
    title: 'Corporate & Bulk Order Quote',
    subject: 'Al Sumora Atelier - Corporate Gifting & Bespoke Tier Quote',
    body: `Dear Client,\n\nThank you for your interest in Al Sumora corporate gifting masterworks.\n\nFor bulk orders exceeding 10 units, we offer tailored volume tiers along with complimentary debossed corporate emblems and individual recipient monograms.\n\nKindly share your required delivery deadline and preferred leather hide finish so we can dispatch the formal invoice and leather swatch samples.\n\nWarm regards,\nAl Sumora Executive Client Services`,
  },
  {
    title: 'Order Status & Shipping Update',
    subject: 'Al Sumora Atelier - Update on Your Handcrafted Order',
    body: `Dear Customer,\n\nThank you for contacting Al Sumora Client Support regarding your order status.\n\nYour handcrafted item is progressing smoothly through our artisanal stitching and burnishing phase. Once our master artisan finishes the inspection, your package will be dispatched via insured BlueDart Air courier with live tracking.\n\nPlease feel free to reply if you need any further assistance.\n\nWarm regards,\nAl Sumora Support Desk`,
  },
  {
    title: 'Leather Care & Maintenance Guide',
    subject: 'Al Sumora Atelier - Artisan Leather Care Recommendations',
    body: `Dear Customer,\n\nThank you for your inquiry on maintaining your Al Sumora full-grain leather goods.\n\nWe recommend conditioning the leather every 3-4 months with natural beeswax or mink oil balm. Keep the leather away from prolonged intense direct moisture and store in the provided cotton dust cover.\n\nWarm regards,\nAl Sumora Leather Care Team`,
  },
];

export const AdminSupportDesk: React.FC<AdminSupportDeskProps> = ({
  inquiries,
  onReplyInquiry,
  onUpdateInquiryStatus,
  initialSelectedInquiry = null,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Replied' | 'Resolved'>('All');
  const [selectedInquiry, setSelectedInquiry] = useState<CustomerInquiry | null>(initialSelectedInquiry);

  // Reply Composer State
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [replyBody, setReplyBody] = useState('');
  const [replySubject, setReplySubject] = useState('');
  const [replyAdminName, setReplyAdminName] = useState('Asfaq Silmi (Master Atelier)');
  const [showMailSuccessAlert, setShowMailSuccessAlert] = useState(false);

  React.useEffect(() => {
    if (initialSelectedInquiry) {
      setSelectedInquiry(initialSelectedInquiry);
    }
  }, [initialSelectedInquiry]);

  const handleOpenComposer = (inq: CustomerInquiry) => {
    setSelectedInquiry(inq);
    setReplySubject(`Re: ${inq.subject}`);
    setReplyBody(
      `Dear ${inq.name},\n\nThank you for contacting Al Sumora Pure Leather Studio regarding "${inq.subject}".\n\n[Write your message here...]\n\nWarm regards,\n${replyAdminName}\nAl Sumora Pure Leather Studio`
    );
    setIsComposerOpen(true);
  };

  const handleSelectTemplate = (template: typeof EMAIL_TEMPLATES[0]) => {
    if (!selectedInquiry) return;
    setReplySubject(template.subject);
    setReplyBody(
      template.body.replace('Dear Customer', `Dear ${selectedInquiry.name}`).replace('Dear Client', `Dear ${selectedInquiry.name}`)
    );
  };

  const handleSendEmailReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry || !replyBody.trim()) return;

    // 1. Trigger Native mailto link to customer's email
    const mailtoUrl = `mailto:${encodeURIComponent(selectedInquiry.email)}?subject=${encodeURIComponent(
      replySubject.trim()
    )}&body=${encodeURIComponent(replyBody.trim())}`;

    window.location.href = mailtoUrl;

    // 2. Record Reply and update internal status
    onReplyInquiry(selectedInquiry.id, replyBody.trim(), replyAdminName);

    // 3. Update local state
    const updatedInq: CustomerInquiry = {
      ...selectedInquiry,
      status: 'Replied',
      replyNotes: replyBody.trim(),
      repliedAt: 'Just now',
      adminRepliedBy: replyAdminName,
    };
    setSelectedInquiry(updatedInq);
    setIsComposerOpen(false);
    setShowMailSuccessAlert(true);
    setTimeout(() => setShowMailSuccessAlert(false), 4000);
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || inq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
            Customer Care & Support
          </span>
          <h2 className="font-bold text-xl sm:text-2xl text-slate-900 mt-0.5">
            Support Desk & Inquiries ({inquiries.length})
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Review incoming customer inquiries, bespoke requests, and reply directly to customer emails.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200">
            {inquiries.filter((i) => i.status === 'Pending').length} Awaiting Response
          </span>
        </div>
      </div>

      {showMailSuccessAlert && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between shadow-xs"
        >
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Email client opened and inquiry status updated to "Replied"!</span>
          </div>
          <button onClick={() => setShowMailSuccessAlert(false)} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search inquiries by customer name, email, or message..."
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {(['All', 'Pending', 'Replied', 'Resolved'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                statusFilter === st
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {st} {st === 'All' ? `(${inquiries.length})` : `(${inquiries.filter((i) => i.status === st).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Inquiries */}
        <div className="lg:col-span-1 space-y-3">
          {filteredInquiries.length === 0 ? (
            <div className="p-8 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-400">
              No customer inquiries found for this filter.
            </div>
          ) : (
            filteredInquiries.map((inq) => {
              const isSelected = selectedInquiry?.id === inq.id;
              return (
                <div
                  key={inq.id}
                  onClick={() => setSelectedInquiry(inq)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 text-xs ${
                    isSelected
                      ? 'bg-blue-50/50 border-blue-600 shadow-xs ring-1 ring-blue-600'
                      : 'bg-white border-slate-200 hover:border-blue-400 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{inq.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        inq.status === 'Pending'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : inq.status === 'Replied'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {inq.status}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-blue-700 truncate">
                    {inq.subject}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {inq.message}
                  </p>

                  <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 text-[10px] text-slate-400">
                    <span>{inq.createdAt}</span>
                    <span className="font-mono text-[9px]">ID: {inq.id}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Detailed Viewer & Direct Email Action */}
        <div className="lg:col-span-2">
          {selectedInquiry ? (
            <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              {/* Inquiry Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                      Support Ticket #{selectedInquiry.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        selectedInquiry.status === 'Pending'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : selectedInquiry.status === 'Replied'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {selectedInquiry.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-xl sm:text-2xl text-slate-900 mt-1">
                    {selectedInquiry.subject}
                  </h3>
                  <span className="text-xs text-slate-500">
                    Submitted by {selectedInquiry.name} on {selectedInquiry.createdAt}
                  </span>
                </div>

                {/* Status Toggle buttons */}
                <div className="flex items-center gap-1.5 self-start sm:self-auto">
                  <button
                    onClick={() => onUpdateInquiryStatus(selectedInquiry.id, 'Pending')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      selectedInquiry.status === 'Pending' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => onUpdateInquiryStatus(selectedInquiry.id, 'Replied')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      selectedInquiry.status === 'Replied' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Replied
                  </button>
                  <button
                    onClick={() => onUpdateInquiryStatus(selectedInquiry.id, 'Resolved')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      selectedInquiry.status === 'Resolved' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Resolved
                  </button>
                </div>
              </div>

              {/* Customer Contact Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Customer Name</span>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedInquiry.name}</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Email Address</span>
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="font-semibold text-blue-600 hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{selectedInquiry.email}</span>
                  </a>
                </div>
                {selectedInquiry.phone && (
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-500 block">Phone Contact</span>
                    <div className="font-semibold text-slate-900 mt-0.5">{selectedInquiry.phone}</div>
                  </div>
                )}
                {selectedInquiry.productRef && (
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-500 block">Referenced Product</span>
                    <span className="font-mono text-[11px] text-slate-900">{selectedInquiry.productRef}</span>
                  </div>
                )}
              </div>

              {/* Inquiry Message Text */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase text-slate-900 tracking-wider block">
                  Customer Message
                </span>
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
                  {selectedInquiry.message}
                </div>
              </div>

              {/* Previous Admin Reply Log if any */}
              {selectedInquiry.replyNotes && (
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs space-y-2">
                  <div className="flex items-center justify-between text-blue-900 font-bold">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      Reply Dispatched by {selectedInquiry.adminRepliedBy || 'Administrator'}
                    </span>
                    <span className="text-[10px] text-blue-700">{selectedInquiry.repliedAt}</span>
                  </div>
                  <p className="text-blue-950 whitespace-pre-wrap leading-relaxed pl-5">
                    {selectedInquiry.replyNotes}
                  </p>
                </div>
              )}

              {/* Action Button to Open Email Composer */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => handleOpenComposer(selectedInquiry)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>Reply via Email</span>
                </button>

                <a
                  href={`mailto:${selectedInquiry.email}?subject=Re: ${encodeURIComponent(selectedInquiry.subject)}`}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <span>Open in Mail Client</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : (
            <div className="p-12 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-400 space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto text-slate-300" />
              <p>Select a customer inquiry from the left panel to inspect details and send a reply.</p>
            </div>
          )}
        </div>
      </div>

      {/* Email Composer Modal */}
      <AnimatePresence>
        {isComposerOpen && selectedInquiry && (
          <div className="fixed inset-0 z-[70] overflow-y-auto flex items-center justify-center p-4 sm:p-6 font-sans">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
              onClick={() => setIsComposerOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-10 text-slate-900 max-h-[90vh] flex flex-col"
            >
              {/* Composer Header */}
              <div className="bg-slate-50 p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">
                      Compose Email Reply
                    </h3>
                    <span className="text-[10px] text-slate-500">
                      Replying directly to customer <strong className="text-slate-900">{selectedInquiry.name}</strong> ({selectedInquiry.email})
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsComposerOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSendEmailReply} className="p-6 overflow-y-auto space-y-4 flex-1">
                {/* Template Chips */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Quick Templates:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {EMAIL_TEMPLATES.map((tmpl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectTemplate(tmpl)}
                        className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 text-[10px] font-medium text-slate-700 transition-colors cursor-pointer"
                      >
                        {tmpl.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recipient & Subject */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 uppercase block mb-1">
                      Recipient Email (To)
                    </label>
                    <input
                      disabled
                      type="text"
                      value={selectedInquiry.email}
                      className="w-full bg-slate-100 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-700 font-mono cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 uppercase block mb-1">
                      Email Subject *
                    </label>
                    <input
                      required
                      type="text"
                      value={replySubject}
                      onChange={(e) => setReplySubject(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 uppercase block mb-1">
                      Sign-off Name / Role
                    </label>
                    <input
                      type="text"
                      value={replyAdminName}
                      onChange={(e) => setReplyAdminName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                {/* Message Body */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 uppercase block mb-1">
                    Email Message Body *
                  </label>
                  <textarea
                    required
                    rows={8}
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-900 leading-relaxed focus:bg-white focus:outline-none focus:border-blue-600 font-sans"
                  />
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">
                    Will launch native email composer and log status in system.
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsComposerOpen(false)}
                      className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send Mail & Mark Replied</span>
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
