import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { getAdminEmails } from '../../data/adminData';
import {
  ShieldAlert,
  Lock,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Mail,
  UserCheck
} from 'lucide-react';
import { motion } from 'motion/react';

interface AdminAuthGateProps {
  currentUser: UserProfile | null;
  onLoginAsAdmin: (adminEmail?: string) => void;
  onReturnToStore: () => void;
}

export const AdminAuthGate: React.FC<AdminAuthGateProps> = ({
  currentUser,
  onLoginAsAdmin,
  onReturnToStore,
}) => {
  const adminEmails = getAdminEmails();
  const primaryAdminEmail = adminEmails[0] || 'asfaqsilmi999@gmail.com';
  const [customEmailInput, setCustomEmailInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = customEmailInput.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMsg('Please enter an administrator email address.');
      return;
    }
    if (adminEmails.includes(cleanEmail)) {
      setErrorMsg('');
      onLoginAsAdmin(cleanEmail);
    } else {
      setErrorMsg(`Access Denied: '${cleanEmail}' is not recognized as an authorized admin account. Primary admin: ${primaryAdminEmail}`);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-100 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden"
      >
        {/* Top Restricted Badge Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 shadow-inner">
            <Lock className="w-6 h-6" />
          </div>

          <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">
            Admin Console
          </span>
          <h1 className="font-bold text-2xl sm:text-3xl text-white mt-1">
            Restricted Admin Portal
          </h1>
          <p className="text-xs text-slate-300 mt-2 max-w-sm mx-auto">
            This management console requires authenticated administrator credentials configured via environment variables.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Current Auth Status Note */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-900">
              <ShieldAlert className="w-4 h-4 text-blue-600" />
              <span>Authorization Check</span>
            </div>
            {currentUser ? (
              <p className="text-slate-600">
                Currently logged in as: <strong className="text-slate-900">{currentUser.name}</strong> (<span className="text-blue-600 font-mono">{currentUser.email}</span>). This account does not possess administrator privileges.
              </p>
            ) : (
              <p className="text-slate-600">
                No user session active. Please authenticate with your authorized administrator email.
              </p>
            )}
            <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200 flex items-center gap-1.5">
              <span>Authorized Admin:</span>
              <code className="bg-white px-2 py-0.5 rounded border border-slate-300 text-slate-900 font-bold">
                {primaryAdminEmail}
              </code>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick 1-Click Login Button for Admin */}
          <div className="space-y-3">
            <button
              onClick={() => onLoginAsAdmin(primaryAdminEmail)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2.5 transition-all shadow-xs cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Authenticate as Admin ({primaryAdminEmail})</span>
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider text-slate-400">
                <span className="bg-white px-3">Or sign in with custom admin email</span>
              </div>
            </div>

            {/* Custom Admin Email Form */}
            <form onSubmit={handleCustomLogin} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase block mb-1">
                  Administrator Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={customEmailInput}
                    onChange={(e) => setCustomEmailInput(e.target.value)}
                    placeholder={`e.g. ${primaryAdminEmail}`}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 py-2.5 px-4 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Verify & Open Admin Portal
              </button>
            </form>
          </div>

          {/* Return to Storefront */}
          <div className="pt-2 text-center">
            <button
              onClick={onReturnToStore}
              className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Storefront</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
