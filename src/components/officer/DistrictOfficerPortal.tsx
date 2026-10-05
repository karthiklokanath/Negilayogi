/**
 * MASMS - District Officer Portal Component
 * Implements FR-AW-002, Budget Monitoring & Sanctions
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FormLabel } from '../common/FormLabel';
import { ServiceRequest } from '../../types/masms';
import {
  Building2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ShieldCheck,
  TrendingUp,
  Landmark,
  DollarSign,
  PieChart,
} from 'lucide-react';

export const DistrictOfficerPortal: React.FC = () => {
  const { requests, districtApproveRequest } = useApp();

  const [remarks, setRemarks] = useState('Sanctioned under Chief Minister Negila Yogi Scheme FY 2026-2027.');
  const [selectedReq, setSelectedReq] = useState<ServiceRequest | null>(null);

  // Filter requests ready for District approval
  const pendingDistrictRequests = requests.filter((r) => r.status === 'Taluk Approved');
  const approvedDistrictRequests = requests.filter(
    (r) => r.status === 'District Approved' || r.status === 'Paid'
  );

  // Budget calculations
  const totalBudget = 5000000; // 50 Lakhs allocation
  const totalSanctioned = approvedDistrictRequests.reduce(
    (acc, r) => acc + (r.computed_subsidy_amount || 1000),
    0
  );
  const remainingBudget = totalBudget - totalSanctioned;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-purple-100 border-2 border-purple-500/30 flex items-center justify-center text-purple-800 font-bold text-xl">
            🏢
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">District Agricultural Officer (DAO / JDA)</h2>
              <span className="text-xs bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded-full">
                Mandya District Administration
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Final Sanction Authority for Scheme Subsidies & District Budget Monitoring (SOP Sec. 11).
            </p>
          </div>
        </div>
      </div>

      {/* Budget & Scheme Utilization KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block mb-1">Total District Scheme Budget</span>
          <span className="text-2xl font-bold text-slate-900 tabular-nums">₹50.00 L</span>
          <span className="text-[11px] text-slate-400 block mt-1">FY 2026-27 Allocation</span>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block mb-1">Sanctioned Subsidies</span>
          <span className="text-2xl font-bold text-purple-700 tabular-nums">
            ₹{(totalSanctioned / 1000).toFixed(1)} K
          </span>
          <span className="text-[11px] text-emerald-700 block mt-1">
            {approvedDistrictRequests.length} Beneficiaries Approved
          </span>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block mb-1">Remaining Budget Head</span>
          <span className="text-2xl font-bold text-emerald-700 tabular-nums">
            ₹{(remainingBudget / 100000).toFixed(2)} L
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">Sufficient headroom</span>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block mb-1">Pending District Approval</span>
          <span className="text-2xl font-bold text-amber-700 tabular-nums">
            {pendingDistrictRequests.length} Claims
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">Verified by Taluk AOs</span>
        </div>
      </div>

      {/* District Approval Queue */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-purple-600" />
          <span>Taluk-Verified Claims Pending District Sanction (FR-AW-002)</span>
        </h3>

        {pendingDistrictRequests.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No claims awaiting District sanction. All verified claims processed.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pendingDistrictRequests.map((req) => (
              <div key={req.request_id} className="py-3.5 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {req.request_id}
                    </span>
                    <span className="text-xs font-bold text-slate-800">{req.farmer_name}</span>
                    <span className="text-xs text-slate-500">
                      ({req.village}, {req.taluk})
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.2 rounded-full">
                      AO Verified: {req.taluk_ao_approval?.officer_name}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 flex items-center gap-3">
                    <span>Operation: <strong>{req.operation_name}</strong></span>
                    <span>·</span>
                    <span>Area: <strong>{req.area_acres} Acres</strong></span>
                    <span>·</span>
                    <span>Voucher: <strong className="font-mono">{req.txn_ref}</strong></span>
                  </div>
                  <div className="text-[11px] text-emerald-800 font-mono font-bold">
                    Sanction Amount: ₹{req.computed_subsidy_amount || 1000} (₹500 x {req.eligible_area || req.area_acres} Ac)
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => districtApproveRequest(req.request_id, 'RETURNED', remarks)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg"
                  >
                    Return
                  </button>
                  <button
                    onClick={() => districtApproveRequest(req.request_id, 'REJECTED', remarks)}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-lg"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => districtApproveRequest(req.request_id, 'APPROVED', remarks)}
                    className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Grant Sanction
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sanctioned History */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3">
          Sanctioned Transactions Ready / Transmitted for DBT ({approvedDistrictRequests.length})
        </h3>
        <div className="divide-y divide-slate-100 text-xs">
          {approvedDistrictRequests.map((req) => (
            <div key={req.request_id} className="py-2.5 flex items-center justify-between text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-mono font-bold text-slate-900">{req.request_id}</span>
                <span>{req.farmer_name} · {req.operation_name} ({req.area_acres} Ac)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-purple-700 font-bold">
                  ₹{req.computed_subsidy_amount} Sanctioned
                </span>
                <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-semibold">
                  {req.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
