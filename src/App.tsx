/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { FarmerPortal } from './components/farmer/FarmerPortal';
import { VendorPortal } from './components/vendor/VendorPortal';
import { TalukAoPortal } from './components/officer/TalukAoPortal';
import { DistrictOfficerPortal } from './components/officer/DistrictOfficerPortal';
import { FinancePortal } from './components/officer/FinancePortal';
import { StateAdminPortal } from './components/admin/StateAdminPortal';
import { AuditPortal } from './components/admin/AuditPortal';
import { MisAnalyticsPortal } from './components/mis/MisAnalyticsPortal';
import { MobileAppFrame } from './components/mobile/MobileAppFrame';

function AppContent() {
  const { role, viewMode } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header />

      <main className="flex-1 w-full p-2.5 sm:p-6">
        {viewMode === 'MOBILE' ? (
          <MobileAppFrame />
        ) : (
          <div className="animate-in fade-in duration-200">
            {role === 'FARMER' && <FarmerPortal />}
            {role === 'VENDOR' && <VendorPortal />}
            {role === 'TALUK_AO' && <TalukAoPortal />}
            {role === 'DISTRICT_OFFICER' && <DistrictOfficerPortal />}
            {role === 'FINANCE_OFFICER' && <FinancePortal />}
            {role === 'STATE_ADMIN' && <StateAdminPortal />}
            {role === 'SYSTEM_ADMIN' && <AuditPortal />}
          </div>
        )}
      </main>

      {/* Official Government Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-white font-bold flex items-center gap-2">
              <span>🌾</span>
              <span>Chief Minister Negila Yogi Scheme (Mechanized Agricultural Activities Incentive)</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Department of Agriculture, Government of Karnataka · Developed in coordination with Center for Smart Governance (CSG)
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>FRUITS & KUTUMBA Integrated</span>
            <span>·</span>
            <span>KSRSAC GIS Enabled</span>
            <span>·</span>
            <span className="font-mono text-emerald-400">MASMS v1.0 (2026)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
