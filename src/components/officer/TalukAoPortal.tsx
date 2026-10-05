/**
 * MASMS - Taluk Agriculture Officer (AO) Portal
 * Implements FR-AW-001, FR-SP-004, FR-SP-005, FR-DM-002 modules
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FormLabel } from '../common/FormLabel';
import { GisMap } from '../common/GisMap';
import { ServiceRequest, VendorProfile, Dispute } from '../../types/masms';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  MapPin,
  AlertTriangle,
  Camera,
  ShieldCheck,
  Search,
  Eye,
  Building,
  UserCheck,
  Check,
  Clock,
  Sparkles,
  ClipboardList,
} from 'lucide-react';

export const TalukAoPortal: React.FC = () => {
  const {
    requests,
    vendors,
    disputes,
    talukVerifyRequest,
    talukApproveVendor,
    talukApproveEquipment,
    resolveDispute,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'VERIFY_SERVICES' | 'VENDOR_REGISTRATIONS' | 'DISPUTES'>('VERIFY_SERVICES');

  // Verification modal state
  const [inspectingReq, setInspectingReq] = useState<ServiceRequest | null>(null);
  const [officerRemarks, setOfficerRemarks] = useState('Verified GPS trace, photo evidence and RTC records. Approved for District sanction.');
  const [physicalInspectionDone, setPhysicalInspectionDone] = useState(false);
  const [inspectionNotes, setInspectionNotes] = useState('');

  // Dispute resolution modal state
  const [inspectingDispute, setInspectingDispute] = useState<Dispute | null>(null);
  const [disputeDecision, setDisputeDecision] = useState<'Resolved (Uphold)' | 'Resolved (Partial)' | 'Resolved (Rejected)'>('Resolved (Uphold)');
  const [disputeAction, setDisputeAction] = useState('Field inspected by Hobli AO. Vendor instructed to complete remaining 0.5 acre or adjust fee.');

  // Filter requests ready for Taluk AO verification
  const pendingVerificationRequests = requests.filter(
    (r) => r.status === 'Farmer Approved' || r.status === 'Completed'
  );
  const verifiedRequests = requests.filter(
    (r) => r.status === 'Taluk Approved' || r.status === 'District Approved' || r.status === 'Paid'
  );

  // Filter vendors needing AO approval
  const pendingVendors = vendors.filter((v) => v.status === 'Under Verification' || v.status === 'Submitted');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Officer Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-100 border-2 border-blue-500/30 flex items-center justify-center text-blue-800 font-bold text-xl">
            🏛️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Taluk Agriculture Officer (AO) Desk</h2>
              <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full">
                Pandavapura Taluk, Mandya District
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Designated Verification Authority for Farmer claims, GPS traces, photo forensics & Vendor approvals.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="bg-slate-100 p-1 rounded-lg border border-slate-200 flex flex-wrap sm:flex-nowrap gap-1 text-xs w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('VERIFY_SERVICES')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all flex-1 sm:flex-initial text-center ${
              activeTab === 'VERIFY_SERVICES' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Claims Verification ({pendingVerificationRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('VENDOR_REGISTRATIONS')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all flex-1 sm:flex-initial text-center ${
              activeTab === 'VENDOR_REGISTRATIONS' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Vendor Approvals ({pendingVendors.length})
          </button>
          <button
            onClick={() => setActiveTab('DISPUTES')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all flex-1 sm:flex-initial text-center ${
              activeTab === 'DISPUTES' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Grievances ({disputes.filter((d) => d.status === 'Open' || d.status === 'Under Investigation').length})
          </button>
        </div>
      </div>

      {/* TAB 1: SERVICE VERIFICATION QUEUE (FR-AW-001) */}
      {activeTab === 'VERIFY_SERVICES' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <FileCheck2 className="w-4 h-4 text-blue-600" />
              <span>Pending Service Verification Queue (SOP Sec. 11)</span>
            </h3>

            {pendingVerificationRequests.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No pending farmer claims currently awaiting Taluk AO verification.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingVerificationRequests.map((req) => (
                  <div key={req.request_id} className="py-3.5 flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                          {req.request_id}
                        </span>
                        <span className="text-xs font-bold text-slate-800">{req.operation_name}</span>
                        <span className="text-xs bg-amber-100 text-amber-900 font-semibold px-2 py-0.2 rounded-full">
                          {req.status}
                        </span>
                        {req.execution?.geofence_status === 'EXCEPTION_BREACH' && (
                          <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2 py-0.2 rounded-full flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Geofence Exception ({req.execution.distance_from_farm_meters}m)
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-600 flex items-center gap-3">
                        <span>Farmer: <strong>{req.farmer_name}</strong></span>
                        <span>·</span>
                        <span>Land: <strong>{req.village}, Sy {req.survey_no}</strong> ({req.area_acres} Ac)</span>
                        <span>·</span>
                        <span>Vendor: <strong>{req.assigned_vendor_name}</strong></span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Voucher: {req.txn_ref || 'PENDING'} · Subsidy Claimed: ₹{req.computed_subsidy_amount || 1000}
                      </div>
                    </div>

                    <button
                      onClick={() => setInspectingReq(req)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Inspect & Verify Evidence
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recently Verified Claims */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              Recently Verified & Forwarded Claims ({verifiedRequests.length})
            </h3>
            <div className="divide-y divide-slate-100 text-xs">
              {verifiedRequests.map((req) => (
                <div key={req.request_id} className="py-2.5 flex items-center justify-between text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-mono font-bold text-slate-900">{req.request_id}</span>
                    <span>{req.farmer_name} · {req.operation_name} ({req.area_acres} Ac)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-emerald-700 font-bold">₹{req.computed_subsidy_amount}</span>
                    <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-semibold">
                      {req.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VENDOR APPROVALS (FR-SP-004 & FR-SP-005) */}
      {activeTab === 'VENDOR_REGISTRATIONS' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>Vendor Registration & Machinery Onboarding Approvals (R2 OP-3)</span>
          </h3>
          <p className="text-xs text-slate-500">
            Respective Taluk AO is the sole approving authority. No expiry/renewal policy (BR-011).
          </p>

          <div className="space-y-4">
            {vendors.map((v) => (
              <div key={v.vendor_id} className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{v.name}</span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          v.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {v.status}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">
                      PAN: {v.pan} · Type: {v.business_type} · Taluk: {v.taluk} · Mobile: {v.mobile}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {v.status !== 'Approved' && (
                      <button
                        onClick={() => talukApproveVendor(v.vendor_id, 'Approved', 'Physical RC and fitness verified.')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve Vendor
                      </button>
                    )}
                    <button
                      onClick={() => talukApproveVendor(v.vendor_id, 'Returned for Correction', 'RC book scan unclear.')}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-lg"
                    >
                      Return / Remarks
                    </button>
                  </div>
                </div>

                {/* Machinery List under this Vendor */}
                <div className="mt-3 space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    Registered Equipment Units ({v.equipment_list.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {v.equipment_list.map((eq) => (
                      <div key={eq.equipment_id} className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs flex justify-between items-center">
                        <div>
                          <strong className="text-slate-900 block">{eq.type}</strong>
                          <span className="text-slate-500 font-mono text-[11px]">
                            RC: {eq.rc_no} · {eq.hp} HP · Ins: {eq.insurance_expiry}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {eq.ao_approved ? (
                            <span className="text-[11px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded">
                              ✓ Approved
                            </span>
                          ) : (
                            <button
                              onClick={() => talukApproveEquipment(v.vendor_id, eq.equipment_id, true)}
                              className="text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded font-bold"
                            >
                              Approve RC
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DISPUTE MANAGEMENT (FR-DM-002) */}
      {activeTab === 'DISPUTES' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Service Grievance & Dispute Resolution Desk (FR-DM)</span>
          </h3>

          {disputes.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              No disputes or grievances currently logged.
            </div>
          ) : (
            <div className="space-y-3">
              {disputes.map((d) => (
                <div key={d.dispute_id} className="border border-slate-200 rounded-xl p-4 bg-slate-50 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border">
                        {d.dispute_id}
                      </span>
                      <span className="font-bold text-rose-800">{d.type}</span>
                      <span className="text-slate-500">· Txn Ref: {d.txn_ref}</span>
                    </div>
                    <span className="bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded text-[11px]">
                      {d.status}
                    </span>
                  </div>

                  <p className="text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                    "{d.description}"
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-slate-400 font-mono">Raised by: {d.complainant_name} ({d.raised_at})</span>
                    {d.status === 'Open' || d.status === 'Under Investigation' ? (
                      <button
                        onClick={() => setInspectingDispute(d)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg"
                      >
                        Investigate & Resolve
                      </button>
                    ) : (
                      <span className="text-emerald-700 font-bold">Action Taken: {d.action_taken}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* DETAILED CLAIM FORENSIC INSPECTION MODAL (FR-AW-001) */}
      {inspectingReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 my-auto max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>Taluk AO Claim Forensic Review · {inspectingReq.request_id}</span>
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Farmer: {inspectingReq.farmer_name} · Vendor: {inspectingReq.assigned_vendor_name} · Voucher: {inspectingReq.txn_ref}
                </p>
              </div>
              <button
                onClick={() => setInspectingReq(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {/* GIS Centroid & Geofence Inspection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800">
                  1. GIS Satellite & Geofence Trail Verification (100m Rule)
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded ${
                    inspectingReq.execution?.geofence_status === 'PASS'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {inspectingReq.execution?.geofence_status === 'PASS'
                    ? '✓ PASS (Within 32m of Centroid)'
                    : `⚠️ EXCEPTION (${inspectingReq.execution?.distance_from_farm_meters}m from Centroid)`}
                </span>
              </div>

              <GisMap
                surveyNo={inspectingReq.survey_no}
                villageName={inspectingReq.village}
                checkinPoint={{
                  lat: inspectingReq.execution?.checkin_lat || 12.6844,
                  lng: inspectingReq.execution?.checkin_lng || 76.5716,
                  status: inspectingReq.execution?.geofence_status || 'PASS',
                }}
              />
            </div>

            {/* Geo-tagged Photographs Forensic Check */}
            <div>
              <span className="text-xs font-bold text-slate-800 block mb-2">
                2. Geo-Tagged Photographic Evidence & Farmer OTP Authentication (BR-021/BR-022)
              </span>
              <div className="grid grid-cols-2 gap-3">
                {inspectingReq.execution?.photos.map((p) => (
                  <div key={p.photo_id} className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                    <div className="h-32 bg-slate-800 relative">
                      <img src={p.url} alt={p.caption} className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                        {p.phase}
                      </span>
                    </div>
                    <div className="p-2 text-[10px] text-slate-600 font-mono space-y-0.5">
                      <div>GPS: {p.lat.toFixed(4)}, {p.lng.toFixed(4)} · {p.taken_at}</div>
                      <div className="text-emerald-700 font-bold">
                        ✓ Farmer OTP Authenticated: Yes (481920)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Officer Action Form */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={physicalInspectionDone}
                  onChange={(e) => setPhysicalInspectionDone(e.target.checked)}
                  className="text-blue-600 focus:ring-blue-500 rounded"
                />
                <span>Random / Risk-Based Physical Field Inspection Conducted (BR-030)</span>
              </label>

              {physicalInspectionDone && (
                <div>
                  <FormLabel label="Field Inspection Observations / Soil Depth" required />
                  <input
                    type="text"
                    value={inspectionNotes}
                    onChange={(e) => setInspectionNotes(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                    placeholder="e.g. Visited plot; 8.5 inch depth verified. Satisfactory."
                  />
                </div>
              )}

              <div>
                <FormLabel label="Taluk AO Verification Remarks" required />
                <textarea
                  value={officerRemarks}
                  onChange={(e) => setOfficerRemarks(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  rows={2}
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    talukVerifyRequest(inspectingReq.request_id, 'RETURNED', officerRemarks, physicalInspectionDone, inspectionNotes);
                    setInspectingReq(null);
                  }}
                  className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg"
                >
                  Return for Correction
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      talukVerifyRequest(inspectingReq.request_id, 'REJECTED', officerRemarks, physicalInspectionDone, inspectionNotes);
                      setInspectingReq(null);
                    }}
                    className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg"
                  >
                    Reject Claim
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      talukVerifyRequest(inspectingReq.request_id, 'APPROVED', officerRemarks, physicalInspectionDone, inspectionNotes);
                      setInspectingReq(null);
                    }}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve for District Sanction
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DISPUTE RESOLUTION MODAL */}
      {inspectingDispute && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-5 shadow-2xl border border-slate-200 text-xs space-y-3 my-auto max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900">
              Resolve Dispute · {inspectingDispute.dispute_id}
            </h3>
            <p className="text-slate-500">
              Grievance on Txn: <strong>{inspectingDispute.txn_ref}</strong>
            </p>

            <div>
              <FormLabel label="Officer Order / Decision" required />
              <select
                value={disputeDecision}
                onChange={(e) => setDisputeDecision(e.target.value as any)}
                className="w-full p-2 border border-slate-300 rounded-lg"
              >
                <option value="Resolved (Uphold)">Uphold Farmer Complaint</option>
                <option value="Resolved (Partial)">Partial Adjustment Order</option>
                <option value="Resolved (Rejected)">Dismiss / Reject Complaint</option>
              </select>
            </div>

            <div>
              <FormLabel label="Action Taken / Directive" required />
              <textarea
                value={disputeAction}
                onChange={(e) => setDisputeAction(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setInspectingDispute(null)}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resolveDispute(inspectingDispute.dispute_id, disputeDecision, disputeAction);
                  setInspectingDispute(null);
                }}
                className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded-lg"
              >
                Publish Decision
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
