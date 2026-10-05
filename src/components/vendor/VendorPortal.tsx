/**
 * MASMS - Service Provider / Vendor Portal Component
 * Implements FR-SP, FR-EQ, FR-PM, FR-WE, FR-CM modules
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FormLabel } from '../common/FormLabel';
import { GisMap } from '../common/GisMap';
import { VendorRegistrationModal } from './VendorRegistrationModal';
import { VendorRate } from '../../types/masms';
import {
  MACHINERY_TYPES_MASTER,
  FUEL_LEVELS_MASTER,
} from '../../data/masterData';
import {
  Tractor,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Camera,
  MapPin,
  FileCheck2,
  Plus,
  Sparkles,
  Layers,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Fuel,
  Gauge,
  Navigation,
  Check,
  UserPlus,
  Play,
  CheckCheck,
  Receipt,
} from 'lucide-react';

export const VendorPortal: React.FC = () => {
  const {
    vendors,
    activeVendorId,
    schemeConfig,
    requests,
    addEquipment,
    updateRates,
    acceptRequest,
    vendorCheckInGps,
    startWork,
    completeWork,
  } = useApp();

  const vendor = vendors.find((v) => v.vendor_id === activeVendorId) || vendors[0];

  // Active / assigned requests for this vendor
  const assignedRequests = requests.filter((r) => r.assigned_vendor_id === vendor?.vendor_id);
  // Open requests in the pool
  const openRequests = requests.filter((r) => r.status === 'Open for Assignment');

  // Modals state
  const [showVendorRegModal, setShowVendorRegModal] = useState(false);
  const [showAddEquipModal, setShowAddEquipModal] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);

  // Selected job for execution
  const [selectedJobId, setSelectedJobId] = useState<string | null>(
    assignedRequests.find((r) => r.status === 'Check-In' || r.status === 'Work Started' || r.status === 'Accepted')?.request_id ||
      assignedRequests[0]?.request_id ||
      null
  );

  const activeJobExecutionReq =
    requests.find((r) => r.request_id === selectedJobId && r.assigned_vendor_id === vendor?.vendor_id) ||
    assignedRequests.find((r) => r.status === 'Check-In' || r.status === 'Work Started' || r.status === 'Accepted') ||
    assignedRequests[0] ||
    null;

  // Machinery Add form state
  const [newEquipData, setNewEquipData] = useState({
    type: 'Tractor 4WD (50 HP)',
    make_model: 'John Deere 5050 D',
    rc_no: `KA-11-TR-${Math.floor(1000 + Math.random() * 9000)}`,
    hp: 50,
    mfg_year: 2024,
    insurance_expiry: '2027-12-31',
    fitness_cert: 'FIT-KA11-2026-CERT.pdf',
    operations_served: ['OP-PLOUGH', 'OP-ROTAVATE', 'OP-SOWING'],
  });

  // Rates edit state
  const [declaredRates, setDeclaredRates] = useState<{ [opCode: string]: number }>(
    vendor?.rates.reduce((acc, r) => ({ ...acc, [r.operation_code]: r.rate_per_acre }), {}) || {
      'OP-PLOUGH': 1250,
      'OP-ROTAVATE': 1100,
      'OP-SOWING': 950,
      'OP-HARVEST': 2100,
    }
  );

  // Work Execution Live form state
  const [hoursVal, setHoursVal] = useState(4.0);
  const [areaCoveredVal, setAreaCoveredVal] = useState(2.0);
  const [prePhotoUrls] = useState<string[]>([
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=400&q=80',
  ]);
  const [postPhotoUrls] = useState<string[]>([
    'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=400&q=80',
  ]);

  // Handle Equipment Add
  const handleAddEquipmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEquipment(vendor.vendor_id, newEquipData);
    setShowAddEquipModal(false);
  };

  // Handle Rates Update
  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedRateItems: VendorRate[] = Object.entries(declaredRates).map(([opCode, rate]) => ({
      rate_id: `RATE-${vendor.vendor_id.slice(-3)}-${opCode}`,
      equipment_id: vendor.equipment_list[0]?.equipment_id || 'EQ-01',
      operation_code: opCode,
      rate_per_hour: Math.round(rate * 0.7),
      rate_per_acre: rate,
    }));
    updateRates(vendor.vendor_id, updatedRateItems);
    setShowRateModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Vendor Profile Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-amber-100 border-2 border-amber-500/30 flex items-center justify-center text-amber-800 font-bold text-xl">
            🚜
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{vendor?.name}</h2>
              <span className="text-xs bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-amber-700" />
                AO Approved Provider
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono">
              <span>PAN: <strong className="text-slate-800">{vendor?.pan}</strong></span>
              <span>·</span>
              <span>Type: <strong className="text-slate-800">{vendor?.business_type}</strong></span>
              <span>·</span>
              <span>Rating: <strong className="text-amber-700">★ {vendor?.rating} ({vendor?.total_ratings} jobs)</strong></span>
              <span>·</span>
              <span>Taluk: <strong className="text-slate-800">{vendor?.taluk}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRateModal(true)}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            Declare Rates
          </button>
          <button
            onClick={() => setShowAddEquipModal(true)}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Register Machinery
          </button>
        </div>
      </div>

      {/* Vendor Registration Callout Card */}
      <div className="bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200/90 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-amber-950 flex items-center gap-2">
              <span>Service Provider / Tractor Owner Self-Registration (FR-SP-001)</span>
              <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.2 rounded uppercase">
                FRUITS / PAN
              </span>
            </h3>
            <p className="text-xs text-amber-800/80 mt-0.5">
              New tractor owners, power tiller operators, or Custom Hiring Centers (CHCs) can register with PAN/FRUITS ID and submit for Taluk AO verification.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowVendorRegModal(true)}
          className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          Register New Service Provider
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block mb-1">Registered Equipment</span>
          <span className="text-2xl font-bold text-slate-900 tabular-nums">
            {vendor?.equipment_list.length} Units
          </span>
          <span className="text-[11px] text-emerald-700 block mt-1">All AO Verified</span>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block mb-1">Active / Assigned Bookings</span>
          <span className="text-2xl font-bold text-blue-700 tabular-nums">
            {assignedRequests.length} Bookings
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">In Execution Workflow</span>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block mb-1">Total Fee Collected</span>
          <span className="text-2xl font-bold text-emerald-700 tabular-nums">
            ₹{assignedRequests.filter((r) => r.farmer_paid_service_fee).length * 2500}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">Direct Farmer Receipts</span>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block mb-1">Service Areas / Hoblis</span>
          <span className="text-sm font-bold text-slate-800 line-clamp-1">
            {vendor?.service_areas.join(', ')}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">Mandya / Pandavapura</span>
        </div>
      </div>

      {/* MY ASSIGNED BOOKINGS & WORK ORDERS */}
      {assignedRequests.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-600" />
                <span>My Accepted Service Requests ({assignedRequests.length})</span>
              </h3>
              <p className="text-xs text-slate-500">
                Select a booking below to launch the Live GPS Work Execution Console.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {assignedRequests.map((req) => (
              <div
                key={req.request_id}
                onClick={() => setSelectedJobId(req.request_id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  activeJobExecutionReq?.request_id === req.request_id
                    ? 'border-emerald-600 bg-emerald-50/60 shadow-xs ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {req.request_id}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      req.status === 'Completed' || req.status === 'Farmer Approved' || req.status === 'Paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : req.status === 'Work Started' || req.status === 'Check-In'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    ● {req.status}
                  </span>
                </div>

                <div className="mt-2 text-xs space-y-1">
                  <div className="font-bold text-slate-800">{req.operation_name}</div>
                  <div className="text-slate-600">
                    Farmer: <strong>{req.farmer_name}</strong> (📱 {req.farmer_mobile})
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    📍 {req.village}, Sy {req.survey_no} ({req.area_acres} Ac)
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-emerald-700">Fee: ₹{req.service_fee_amount || req.area_acres * 1250}</span>
                  <span className="font-bold text-emerald-800 flex items-center gap-1">
                    {activeJobExecutionReq?.request_id === req.request_id ? '▶ Active Console' : 'Select Job →'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LIVE WORK EXECUTION CONSOLE (FR-WE & FR-CM) */}
      {activeJobExecutionReq && (
        <div className="bg-white rounded-2xl border-2 border-emerald-500/80 p-5 shadow-lg space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
              <h3 className="text-sm font-bold text-slate-900">
                Live Work Execution Console · {activeJobExecutionReq.request_id}
              </h3>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                Status: {activeJobExecutionReq.status}
              </span>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Farmer: {activeJobExecutionReq.farmer_name} (📱 {activeJobExecutionReq.farmer_mobile})
            </span>
          </div>

          {/* Interactive GIS Map for Check-in and Geofencing (VAL-WRK-01) */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-blue-600" />
                  GPS Work Site Check-In & 100-Meter Geofence Verification (BR-020)
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Target Centroid: {activeJobExecutionReq.village} Sy {activeJobExecutionReq.survey_no}
                </span>
              </div>

              {/* Quick GPS Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    vendorCheckInGps(activeJobExecutionReq.request_id, 12.6844, 76.5716);
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>📍 Capture Field GPS (32m Inside)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    vendorCheckInGps(activeJobExecutionReq.request_id, 12.6856, 76.5726);
                  }}
                  className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-lg transition-colors"
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>Simulate Breach (155m)</span>
                </button>
              </div>
            </div>

            <GisMap
              interactiveCheckin={activeJobExecutionReq.status === 'Accepted' || activeJobExecutionReq.status === 'Check-In'}
              surveyNo={activeJobExecutionReq.survey_no}
              villageName={activeJobExecutionReq.village}
              onCheckinSelect={(lat, lng, dist) => {
                vendorCheckInGps(activeJobExecutionReq.request_id, lat, lng);
              }}
            />

            {activeJobExecutionReq.execution && (
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg flex flex-wrap items-center justify-between text-xs text-slate-700 font-mono">
                <div className="flex items-center gap-2">
                  <span className="font-bold">GPS Logged:</span>
                  <span>{activeJobExecutionReq.execution.checkin_lat.toFixed(4)}, {activeJobExecutionReq.execution.checkin_lng.toFixed(4)}</span>
                  <span>·</span>
                  <span>Distance: <strong>{activeJobExecutionReq.execution.distance_from_farm_meters}m</strong></span>
                </div>
                <div>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      activeJobExecutionReq.execution.geofence_status === 'PASS'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    Geofence: {activeJobExecutionReq.execution.geofence_status}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Execution Action Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Step A: Check-In & Pre-Work Photos */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 flex items-center justify-between">
                <span>Phase 1: Check-in & Pre-Work Geo-Photos (BR-021)</span>
                {activeJobExecutionReq.status === 'Work Started' ||
                activeJobExecutionReq.status === 'Completed' ||
                activeJobExecutionReq.status === 'Farmer Approved' ||
                activeJobExecutionReq.status === 'Paid' ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Started
                  </span>
                ) : null}
              </h4>

              <div>
                <FormLabel label="Mandatory Pre-Work Photos (Tractor + Field) - Min 2 Photos" required />
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {prePhotoUrls.map((url, i) => (
                    <div key={i} className="h-20 rounded-lg overflow-hidden border border-slate-300 relative bg-slate-800">
                      <img src={url} alt="Pre-work" className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] px-1 rounded font-mono">
                        Pre-Photo #{i + 1} (Geo-tagged)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {activeJobExecutionReq.status === 'Accepted' || activeJobExecutionReq.status === 'Check-In' ? (
                <button
                  type="button"
                  onClick={() => {
                    startWork(activeJobExecutionReq.request_id, 0, 'Full', prePhotoUrls);
                  }}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Work (Capture GPS & Pre-Photos)</span>
                </button>
              ) : (
                <div className="text-xs text-emerald-800 font-bold bg-emerald-100/70 p-2 rounded-lg border border-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Work In-Progress & Field Execution Logged</span>
                </div>
              )}
            </div>

            {/* Step B: Complete Work & Generate Digital Voucher */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 flex items-center justify-between">
                <span>Phase 2: Task Completion & Digital Voucher (FR-CM-001)</span>
                {activeJobExecutionReq.status === 'Completed' ||
                activeJobExecutionReq.status === 'Farmer Approved' ||
                activeJobExecutionReq.status === 'Paid' ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                    <CheckCheck className="w-3.5 h-3.5" /> Completed
                  </span>
                ) : null}
              </h4>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <FormLabel label="Actual Hours Worked" required />
                  <input
                    type="number"
                    step="0.25"
                    value={hoursVal}
                    onChange={(e) => setHoursVal(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold bg-white"
                  />
                </div>
                <div>
                  <FormLabel label="Actual Area Covered (Acres)" required />
                  <input
                    type="number"
                    step="0.1"
                    value={areaCoveredVal}
                    onChange={(e) => setAreaCoveredVal(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold bg-white"
                  />
                </div>
              </div>

              <div>
                <FormLabel label="Mandatory Post-Work Completion Photos - Min 2 Photos" required />
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {postPhotoUrls.map((url, i) => (
                    <div key={i} className="h-20 rounded-lg overflow-hidden border border-slate-300 relative bg-slate-800">
                      <img src={url} alt="Post-work" className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] px-1 rounded font-mono">
                        Post-Photo #{i + 1} (Geo-tagged)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {activeJobExecutionReq.status === 'Work Started' ? (
                <button
                  type="button"
                  onClick={() =>
                    completeWork(
                      activeJobExecutionReq.request_id,
                      hoursVal,
                      areaCoveredVal,
                      0,
                      postPhotoUrls
                    )
                  }
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Completed & Generate Voucher</span>
                </button>
              ) : activeJobExecutionReq.status === 'Completed' ||
                activeJobExecutionReq.status === 'Farmer Approved' ||
                activeJobExecutionReq.status === 'Taluk Approved' ||
                activeJobExecutionReq.status === 'District Approved' ||
                activeJobExecutionReq.status === 'Paid' ? (
                <div className="text-xs text-emerald-800 font-bold bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Receipt className="w-4 h-4 text-emerald-700" />
                    <span>Digital Voucher: <strong className="font-mono">{activeJobExecutionReq.txn_ref}</strong></span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal">
                    Work verified & logged. Awaiting Farmer OTP photo confirmation and Taluk AO sanction.
                  </p>
                </div>
              ) : (
                <div className="text-xs text-slate-400 bg-slate-100 p-2 rounded-lg border border-slate-200 text-center">
                  Start work in Phase 1 above before marking completion.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Available Jobs / Automated Provider Matching Feed (FR-PM-001) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Tractor className="w-4 h-4 text-emerald-600" />
              <span>Available Mechanized Operation Requests (Matching Score Engine)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Ranked by distance (30%), availability (25%), equipment compatibility (25%), and rating (20%).
            </p>
          </div>
        </div>

        {openRequests.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No open requests available for assignment in this taluk.
          </div>
        ) : (
          <div className="space-y-3">
            {openRequests.map((req) => (
              <div
                key={req.request_id}
                className="border border-slate-200 rounded-xl p-4 bg-slate-50/70 hover:bg-slate-50 transition-colors flex flex-wrap items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {req.request_id}
                    </span>
                    <span className="text-xs font-bold text-slate-800">{req.operation_name}</span>
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.2 rounded-full">
                      Match Score: 94%
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 flex items-center gap-3">
                    <span>Farmer: <strong>{req.farmer_name}</strong></span>
                    <span>·</span>
                    <span>Location: <strong>{req.village}, Sy {req.survey_no} (~2.4 km)</strong></span>
                    <span>·</span>
                    <span>Area: <strong>{req.area_acres} Acres</strong></span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Target Execution: <strong>{req.preferred_date}</strong> · Est Rental Fee: ₹{req.area_acres * 1250}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const eqId = vendor?.equipment_list[0]?.equipment_id || 'EQ-01';
                    acceptRequest(req.request_id, vendor.vendor_id, eqId);
                    setSelectedJobId(req.request_id);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  Accept Request
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Registered Machinery Inventory */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Tractor className="w-4 h-4 text-amber-600" />
              <span>Registered Tractors & Machinery Implements (FR-EQ-001)</span>
            </h3>
            <p className="text-xs text-slate-500">
              1 RC Number = 1 Machinery (BR-013). Insurance & Taluk AO approval verified.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vendor?.equipment_list.map((eq) => (
            <div
              key={eq.equipment_id}
              className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{eq.type}</span>
                  <span className="text-[11px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                    RC: {eq.rc_no}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  {eq.make_model} · {eq.hp} HP · Mfg {eq.mfg_year}
                </p>
                <div className="text-[11px] text-slate-500 font-mono mt-2 space-y-0.5">
                  <div>Insurance Expiry: <strong className="text-emerald-700">{eq.insurance_expiry} (Active)</strong></div>
                  <div>Operations: {eq.operations_served.join(', ')}</div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  AO Approved & Insured
                </span>
                <span className="text-slate-400 font-mono">{eq.equipment_id}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REGISTER MACHINERY MODAL */}
      {showAddEquipModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-slate-200 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Tractor className="w-4 h-4 text-amber-600" />
                Register New Farm Machinery / Tractor
              </h3>
              <button
                onClick={() => setShowAddEquipModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEquipmentSubmit} className="space-y-3 text-xs">
              <div>
                <FormLabel label="Machinery Category / Type (Master Data)" required />
                <select
                  value={newEquipData.type}
                  onChange={(e) => setNewEquipData({ ...newEquipData, type: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  {MACHINERY_TYPES_MASTER.map((m) => (
                    <option key={m.id} value={m.name}>
                      🚜 {m.name} ({m.hp_range})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <FormLabel label="Make & Model" required />
                  <input
                    type="text"
                    value={newEquipData.make_model}
                    onChange={(e) => setNewEquipData({ ...newEquipData, make_model: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <FormLabel label="Vehicle RC Number (1 RC = 1 Unit)" required />
                  <input
                    type="text"
                    value={newEquipData.rc_no}
                    onChange={(e) => setNewEquipData({ ...newEquipData, rc_no: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <FormLabel label="Horsepower (HP)" required />
                  <input
                    type="number"
                    value={newEquipData.hp}
                    onChange={(e) => setNewEquipData({ ...newEquipData, hp: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <FormLabel label="Mfg Year" required />
                  <input
                    type="number"
                    value={newEquipData.mfg_year}
                    onChange={(e) => setNewEquipData({ ...newEquipData, mfg_year: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <FormLabel label="Insurance Expiry" required />
                  <input
                    type="date"
                    value={newEquipData.insurance_expiry}
                    onChange={(e) => setNewEquipData({ ...newEquipData, insurance_expiry: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <FormLabel label="Fitness Certificate & RC Book (Upload PDF/JPG)" required />
                <div className="p-3 border-2 border-dashed border-slate-300 rounded-lg text-center text-slate-500 bg-slate-50 cursor-pointer">
                  📁 RC_BOOK_VERIFIED_SAMPLE.pdf (Auto Attached)
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddEquipModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-600 text-white font-bold"
                >
                  Submit for AO Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DECLARE RATES MODAL (FR-EQ-002) */}
      {showRateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-slate-200 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Declare Service Rates (Enforced Dept Ceilings)
              </h3>
              <button
                onClick={() => setShowRateModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRates} className="space-y-3 text-xs">
              <p className="text-slate-500 mb-3">
                Rates declared must be at or below the maximum service-rate limits configured by the Department of Agriculture (VAL-RATE-02).
              </p>

              {schemeConfig.rate_ceilings.slice(0, 5).map((op) => (
                <div key={op.operation_code} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <span className="font-bold text-slate-900 block">{op.operation_name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Dept Ceiling: ₹{op.max_rate_per_acre}/acre
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-slate-400">₹</span>
                    <input
                      type="number"
                      value={declaredRates[op.operation_code] || op.max_rate_per_acre - 100}
                      onChange={(e) =>
                        setDeclaredRates({
                          ...declaredRates,
                          [op.operation_code]: Number(e.target.value),
                        })
                      }
                      className="w-24 p-1.5 border border-slate-300 rounded font-mono font-bold text-right"
                    />
                    <span className="text-slate-500 text-[11px]">/Ac</span>
                  </div>
                </div>
              ))}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRateModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-bold"
                >
                  Save & Publish Rates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VENDOR SELF-REGISTRATION MODAL (FR-SP-001) */}
      <VendorRegistrationModal
        isOpen={showVendorRegModal}
        onClose={() => setShowVendorRegModal(false)}
      />
    </div>
  );
};
