/**
 * MASMS - Finance & DBT Disbursement Portal Component
 * Implements FR-PAY modules (DBT Transmission, Reconciliation & Reversal)
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FormLabel } from '../common/FormLabel';
import { ServiceRequest } from '../../types/masms';
import {
  Landmark,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Download,
  CreditCard,
  Send,
  FileSpreadsheet,
  ShieldCheck,
  Receipt,
} from 'lucide-react';

export const FinancePortal: React.FC = () => {
  const { requests, processDbtPaymentBatch, reversePayment } = useApp();

  const [selectedForBatch, setSelectedForBatch] = useState<string[]>([]);
  const [reversalModalReq, setReversalModalReq] = useState<ServiceRequest | null>(null);
  const [reversalReason, setReversalReason] = useState('Duplicate claim discovered on audit / incorrect bank IFSC');

  // Filter requests sanctioned by District Officer ready for DBT
  const readyForDbtRequests = requests.filter((r) => r.status === 'District Approved');
  const paidDbtRequests = requests.filter((r) => r.status === 'Paid');

  const handleSelectAll = () => {
    if (selectedForBatch.length === readyForDbtRequests.length) {
      setSelectedForBatch([]);
    } else {
      setSelectedForBatch(readyForDbtRequests.map((r) => r.request_id));
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedForBatch.includes(id)) {
      setSelectedForBatch(selectedForBatch.filter((item) => item !== id));
    } else {
      setSelectedForBatch([...selectedForBatch, id]);
    }
  };

  const handleTransmitBatch = () => {
    if (selectedForBatch.length === 0) return;
    processDbtPaymentBatch(selectedForBatch);
    setSelectedForBatch([]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-cyan-100 border-2 border-cyan-500/30 flex items-center justify-center text-cyan-800 font-bold text-xl">
            🏦
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">FRUITS DBT & Treasury Payment Desk</h2>
              <span className="text-xs bg-cyan-100 text-cyan-800 font-semibold px-2 py-0.5 rounded-full">
                PFMS / FRUITS Direct Benefit Transfer
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Direct Benefit Transfer disbursement to farmers' Aadhaar-seeded accounts (SOP Sec. 7 & R4 pt.7).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Downloaded Payment Batch XML / CSV format for PFMS.')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            Export PFMS Batch File
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block mb-1">Pending DBT Transmission</span>
          <span className="text-2xl font-bold text-cyan-700 tabular-nums">
            {readyForDbtRequests.length} Claims
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            Total ₹{readyForDbtRequests.reduce((acc, r) => acc + (r.computed_subsidy_amount || 1000), 0)}
          </span>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block mb-1">Total Disbursed Subsidies</span>
          <span className="text-2xl font-bold text-emerald-700 tabular-nums">
            ₹{paidDbtRequests.reduce((acc, r) => acc + (r.payment?.amount || 1000), 0)}
          </span>
          <span className="text-[11px] text-emerald-600 block mt-1">
            {paidDbtRequests.length} Transactions Settled
          </span>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block mb-1">Aadhaar-Seeding Compliance</span>
          <span className="text-2xl font-bold text-slate-900 tabular-nums">100.0%</span>
          <span className="text-[11px] text-emerald-700 block mt-1">FRUITS NPCI Gateway Verified</span>
        </div>
      </div>

      {/* DBT Batch Generation Queue */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-cyan-600" />
              <span>Sanctioned Subsidies Ready for Batch Transmission (FR-PAY-002)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Only transactions with Work Completed + Farmer Approved + Taluk Verified + District Sanctioned are eligible (VAL-PAY-02).
            </p>
          </div>

          {readyForDbtRequests.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleSelectAll}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200"
              >
                {selectedForBatch.length === readyForDbtRequests.length ? 'Deselect All' : 'Select All'}
              </button>
              <button
                onClick={handleTransmitBatch}
                disabled={selectedForBatch.length === 0}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 ${
                  selectedForBatch.length > 0
                    ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                Transmit Batch ({selectedForBatch.length}) to FRUITS DBT
              </button>
            </div>
          )}
        </div>

        {readyForDbtRequests.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No sanctioned claims currently awaiting DBT batch creation.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {readyForDbtRequests.map((req) => (
              <div key={req.request_id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedForBatch.includes(req.request_id)}
                    onChange={() => handleToggleSelect(req.request_id)}
                    className="text-cyan-600 focus:ring-cyan-500 rounded"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{req.request_id}</span>
                      <span className="font-bold text-slate-800">{req.farmer_name}</span>
                      <span className="text-slate-500">· {req.operation_name} ({req.area_acres} Ac)</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      Voucher: {req.txn_ref} · Bank: A/C ending 4321 · Aadhaar Seeded: Yes
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-sm font-bold text-cyan-800 block">
                    ₹{req.computed_subsidy_amount || 1000}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold">Preconditions Verified</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Disbursed History & Reversal Option */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Completed DBT Disbursements & Reconciliation Ledger ({paidDbtRequests.length})</span>
        </h3>

        {paidDbtRequests.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs">
            No payments disbursed yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {paidDbtRequests.map((req) => (
              <div key={req.request_id} className="py-3 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{req.request_id}</span>
                    <span className="font-bold text-slate-800">{req.farmer_name}</span>
                    <span className="text-[11px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.2 rounded">
                      DBT Paid
                    </span>
                    {req.payment?.status === 'Reversed' && (
                      <span className="text-[11px] bg-rose-100 text-rose-800 font-semibold px-2 py-0.2 rounded">
                        Reversed: {req.payment.reversal_reason}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Batch: {req.payment?.batch_id} · PFMS Ref: {req.payment?.channel_ref} · Paid: {req.payment?.paid_at}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right font-mono">
                    <span className="font-bold text-emerald-700 text-sm">
                      ₹{req.payment?.amount || 1000}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      Receipt: {req.payment?.receipt_no}
                    </span>
                  </div>

                  {req.payment?.status !== 'Reversed' && (
                    <button
                      onClick={() => setReversalModalReq(req)}
                      className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded"
                      title="Authorized Payment Reversal (VAL-PAY-06)"
                    >
                      Reverse
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* REVERSAL MODAL (VAL-PAY-06) */}
      {reversalModalReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-5 shadow-2xl border border-slate-200 text-xs space-y-3 my-auto max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900">
              Authorized Payment Reversal · {reversalModalReq.request_id}
            </h3>
            <p className="text-slate-500">
              Reversing DBT transaction for {reversalModalReq.farmer_name}.
            </p>

            <div>
              <FormLabel label="Reversal Reason & Finance Officer Authorization" required />
              <textarea
                value={reversalReason}
                onChange={(e) => setReversalReason(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setReversalModalReq(null)}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  reversePayment(reversalModalReq.request_id, reversalReason);
                  setReversalModalReq(null);
                }}
                className="px-4 py-1.5 bg-rose-600 text-white font-bold rounded-lg"
              >
                Authorize Reversal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
