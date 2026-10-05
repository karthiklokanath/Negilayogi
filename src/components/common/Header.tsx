/**
 * MASMS Official Header Component
 * Department of Agriculture, Government of Karnataka
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types/masms';
import { t } from '../../utils/translations';
import {
  Smartphone,
  Monitor,
  Bell,
  Languages,
  RotateCcw,
  Sparkles,
  Tractor,
  UserCheck,
  Building2,
  FileCheck2,
  Landmark,
  ShieldCheck,
  BarChart3,
  Trash2,
  X,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    role,
    setRole,
    lang,
    setLang,
    viewMode,
    setViewMode,
    notifications,
    markNotificationRead,
    clearTransactionData,
    resetDemoData,
    farmers,
    activeFarmerId,
    setActiveFarmerId,
    vendors,
    activeVendorId,
    setActiveVendorId,
  } = useApp();

  const [showNotifs, setShowNotifs] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const currentT = t[lang];

  const roleConfigs: { id: UserRole; label: string; icon: React.ReactNode }[] = [
    { id: 'FARMER', label: currentT.role_farmer, icon: <UserCheck className="w-4 h-4 text-emerald-600" /> },
    { id: 'VENDOR', label: currentT.role_vendor, icon: <Tractor className="w-4 h-4 text-amber-600" /> },
    { id: 'TALUK_AO', label: currentT.role_taluk_ao, icon: <FileCheck2 className="w-4 h-4 text-blue-600" /> },
    { id: 'DISTRICT_OFFICER', label: currentT.role_district_officer, icon: <Building2 className="w-4 h-4 text-purple-600" /> },
    { id: 'FINANCE_OFFICER', label: currentT.role_finance_officer, icon: <Landmark className="w-4 h-4 text-cyan-600" /> },
    { id: 'STATE_ADMIN', label: currentT.role_state_admin, icon: <ShieldCheck className="w-4 h-4 text-rose-600" /> },
    { id: 'SYSTEM_ADMIN', label: currentT.role_system_admin, icon: <BarChart3 className="w-4 h-4 text-slate-600" /> },
  ];

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
      {/* Top Govt of Karnataka Official Ribbon */}
      <div className="bg-emerald-900 text-white px-3 sm:px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2.5 font-medium text-[11px] sm:text-xs">
          <span className="flex items-center gap-1 text-amber-300">
            <span>🌾</span>
            <span className="font-bold">{currentT.govt_title}</span>
          </span>
          <span className="text-emerald-400">·</span>
          <span className="hidden xs:inline">{currentT.dept_title}</span>
          <span className="text-emerald-400 hidden sm:inline">·</span>
          <span className="text-emerald-200 hidden lg:inline">FRUITS / KUTUMBA / KSRSAC Integrated</span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] ml-auto">
          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'EN' ? 'KN' : 'EN')}
            className="flex items-center gap-1 bg-emerald-800 hover:bg-emerald-700 px-2 py-1 rounded text-amber-200 transition-colors font-bold"
            title="Switch Language / ಭಾಷೆ ಬದಲಾಯಿಸಿ"
          >
            <Languages className="w-3 h-3" />
            <span>{lang === 'EN' ? 'ಕನ್ನಡ' : 'English'}</span>
          </button>

          {/* Clear Transactions Button */}
          <button
            onClick={() => {
              if (window.confirm('Clear all active/completed service requests and transaction logs?')) {
                clearTransactionData();
              }
            }}
            className="flex items-center gap-1 bg-emerald-950/80 hover:bg-rose-900/80 px-2 py-1 rounded text-amber-200 hover:text-white transition-colors border border-emerald-700/50"
            title="Clear all service requests and transaction data"
          >
            <Trash2 className="w-3 h-3 text-rose-300 shrink-0" />
            <span className="hidden xs:inline">Clear Txns</span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => {
              if (window.confirm('Reset all demo state to pristine sample data?')) {
                resetDemoData();
              }
            }}
            className="flex items-center gap-1 text-emerald-300 hover:text-white px-1.5 py-1 transition-colors"
            title="Reset to fresh demo sample data"
          >
            <RotateCcw className="w-3 h-3 shrink-0" />
            <span className="hidden xs:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Main Brand & Controls Zone */}
      <div className="px-3 sm:px-4 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3 max-w-7xl mx-auto relative">
        {/* Brand & Scheme Emblem */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-xs shrink-0 ring-2 ring-emerald-500/20">
              <span className="text-lg sm:text-xl select-none">🚜</span>
            </div>
            <div>
              <h1 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 tracking-tight leading-tight flex items-center gap-1.5 flex-wrap">
                <span>{currentT.scheme_title}</span>
                <span className="text-[10px] font-semibold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded border border-amber-200">
                  MASMS
                </span>
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium line-clamp-1">
                {currentT.scheme_sub}
              </p>
            </div>
          </div>

          {/* Mobile Notification Bell Trigger */}
          <div className="relative md:hidden shrink-0">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 relative transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* View Mode & Role Switcher */}
        <div className="flex items-center flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
          {/* Viewport Switcher: Mobile vs Web */}
          <div className="bg-slate-100 p-0.5 sm:p-1 rounded-lg border border-slate-200 flex items-center text-xs">
            <button
              onClick={() => setViewMode('WEB')}
              className={`px-2 sm:px-2.5 py-1 rounded-md font-medium flex items-center gap-1 transition-all ${
                viewMode === 'WEB'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5 text-slate-700" />
              <span className="text-[11px] sm:text-xs">Web</span>
            </button>
            <button
              onClick={() => setViewMode('MOBILE')}
              className={`px-2 sm:px-2.5 py-1 rounded-md font-medium flex items-center gap-1 transition-all ${
                viewMode === 'MOBILE'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[11px] sm:text-xs">Mobile</span>
            </button>
          </div>

          {/* Role Switcher Dropdown */}
          <div className="relative flex-1 sm:flex-initial min-w-[140px]">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-xs rounded-lg px-2.5 py-1.5 border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-colors cursor-pointer"
            >
              {roleConfigs.map((r) => (
                <option key={r.id} value={r.id}>
                  🎭 {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Active Actor Selector for Testing */}
          {role === 'FARMER' && (
            <select
              value={activeFarmerId}
              onChange={(e) => setActiveFarmerId(e.target.value)}
              className="bg-emerald-50 text-emerald-900 text-xs rounded-lg px-2 py-1.5 border border-emerald-200 font-medium max-w-[160px] sm:max-w-none"
              title="Switch Demo Farmer Profile"
            >
              {farmers.map((f) => (
                <option key={f.farmer_id} value={f.farmer_id}>
                  👤 {f.name}
                </option>
              ))}
            </select>
          )}

          {role === 'VENDOR' && (
            <select
              value={activeVendorId}
              onChange={(e) => setActiveVendorId(e.target.value)}
              className="bg-amber-50 text-amber-900 text-xs rounded-lg px-2 py-1.5 border border-amber-200 font-medium max-w-[160px] sm:max-w-none"
              title="Switch Demo Vendor Profile"
            >
              {vendors.map((v) => (
                <option key={v.vendor_id} value={v.vendor_id}>
                  🚜 {v.name}
                </option>
              ))}
            </select>
          )}

          {/* Desktop Notification Center Trigger */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 relative transition-colors"
              title="Notifications & SMS/OTP Feed"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Notifications Dropdown Panel (Responsive) */}
        {showNotifs && (
          <div className="absolute right-3 sm:right-4 top-full mt-2 w-[calc(100vw-1.5rem)] sm:w-96 max-w-sm bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <Bell className="w-3.5 h-3.5 text-emerald-600" />
                <span>Live SMS / OTP & System Alerts</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 font-mono">
                  {unreadCount} unread
                </span>
                <button
                  onClick={() => setShowNotifs(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2 divide-y divide-slate-100">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className={`pt-2 cursor-pointer transition-colors ${
                    !n.read ? 'bg-emerald-50/50 -mx-1 p-1.5 rounded-lg' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-semibold text-slate-900">
                      {lang === 'EN' ? n.title_en : n.title_kn}
                    </h4>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap font-mono">
                      {n.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {lang === 'EN' ? n.message_en : n.message_kn}
                  </p>
                  {n.otp_code && (
                    <div className="mt-1.5 bg-amber-100 text-amber-900 font-mono text-xs px-2 py-0.5 rounded inline-block font-bold">
                      🔑 OTP: {n.otp_code}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Global Demo Notice Banner */}
      <div className="bg-amber-50 border-t border-b border-amber-200/80 px-3 sm:px-4 py-1.5 text-[11px] text-amber-900 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span className="font-medium leading-tight">
            <strong>Demo Mode:</strong> All mandatory validation fields are non-mandatory for seamless testing. Production mandatory fields retain the red (<span className="text-rose-600 font-bold">*</span>) asterisk mark.
          </span>
        </div>
      </div>
    </header>
  );
};
