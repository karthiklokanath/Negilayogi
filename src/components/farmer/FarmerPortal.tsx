/**
 * MASMS - Farmer Portal Component
 * Implements FR-FM, FR-SR, FR-BK, FR-FA, FR-DM modules
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FormLabel } from '../common/FormLabel';
import { GisMap } from '../common/GisMap';
import { ServiceRequest, LandParcel } from '../../types/masms';
import {
  KARNATAKA_DISTRICTS_MASTER,
  CROPS_MASTER,
  SEASONS_MASTER,
} from '../../data/masterData';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  Star,
  FileText,
  CreditCard,
  KeyRound,
  Sparkles,
  Plus,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  Receipt,
  Download,
  Info,
} from 'lucide-react';

export const FarmerPortal: React.FC = () => {
  const {
    farmers,
    activeFarmerId,
    schemeConfig,
    getFarmerEligibility,
    requests,
    createServiceRequest,
    addLandParcel,
    rescheduleRequest,
    payServiceFee,
    authenticatePhotosOtp,
    submitFarmerAcceptance,
    raiseDispute,
    lang,
  } = useApp();

  const farmer = farmers.find((f) => f.farmer_id === activeFarmerId) || farmers[0];
  const eligibility = getFarmerEligibility(farmer?.farmer_id || '');
  const farmerRequests = requests.filter((r) => r.farmer_id === farmer?.farmer_id);

  // Modals state
  const [showWizard, setShowWizard] = useState(false);
  const [showParcelModal, setShowParcelModal] = useState(false);
  const [rescheduleModalReq, setRescheduleModalReq] = useState<ServiceRequest | null>(null);
  const [otpAuthModalReq, setOtpAuthModalReq] = useState<ServiceRequest | null>(null);
  const [ratingModalReq, setRatingModalReq] = useState<ServiceRequest | null>(null);
  const [disputeModalReq, setDisputeModalReq] = useState<ServiceRequest | null>(null);
  const [viewVoucherReq, setViewVoucherReq] = useState<ServiceRequest | null>(null);

  // 6-Step Wizard state
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardData, setWizardData] = useState({
    parcel_id: farmer?.parcels[0]?.parcel_id || '',
    operation_code: 'OP-PLOUGH',
    area_acres: 1.5,
    crop_type: 'Paddy',
    season: 'Kharif' as 'Kharif' | 'Rabi' | 'Summer',
    preferred_date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    service_location: `${farmer?.village || 'Chinya'} Survey ${farmer?.parcels[0]?.survey_no || '142/2A'}`,
    cross_district: false,
    remarks: 'Field ploughed to 9-inch depth required.',
  });

  // Reschedule Form state
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleReason, setRescheduleReason] = useState('Rainfall / Soil moisture too high');
  const [rescheduleOtp, setRescheduleOtp] = useState('741852');

  // Photo OTP Form state
  const [enteredPhotoOtp, setEnteredPhotoOtp] = useState('481920');

  // Rating Form state
  const [ratingVal, setRatingVal] = useState(5);
  const [reviewText, setReviewText] = useState('Timely ploughing completed with good depth. Fully satisfied.');

  // Dispute Form state
  const [disputeType, setDisputeType] = useState<any>('Area Mismatch');
  const [disputeDesc, setDisputeDesc] = useState('');

  // Land Parcel modal state
  const [newParcelData, setNewParcelData] = useState({
    survey_no: '188',
    sub_survey_no: '3B',
    hissa_no: '2',
    village: farmer?.village || 'Chinya',
    hobli: farmer?.hobli || 'Kikkeri',
    taluk: farmer?.taluk || 'Pandavapura',
    district: farmer?.district || 'Mandya',
    area_acres: 1.25,
    irrigated_area: 1.0,
    crop_type: 'Ragi & Pulses',
  });

  const handleQuickFillWizard = () => {
    setWizardData({
      parcel_id: farmer?.parcels[0]?.parcel_id || 'PARCEL-001',
      operation_code: 'OP-ROTAVATE',
      area_acres: 1.8,
      crop_type: 'Paddy (IR-64)',
      season: 'Kharif',
      preferred_date: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
      service_location: `${farmer?.village} Sy No ${farmer?.parcels[0]?.survey_no || '142/2A'} Kikkeri Hobli`,
      cross_district: false,
      remarks: 'Need 2-pass fine seedbed preparation for direct seeding.',
    });
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedParcel = farmer.parcels.find((p) => p.parcel_id === wizardData.parcel_id) || farmer.parcels[0];
    createServiceRequest({
      farmer_id: farmer.farmer_id,
      parcel_id: selectedParcel?.parcel_id || 'PARCEL-001',
      survey_no: `${selectedParcel?.survey_no || '142'}/${selectedParcel?.sub_survey_no || '2A'}`,
      village: selectedParcel?.village || farmer.village,
      taluk: selectedParcel?.taluk || farmer.taluk,
      district: selectedParcel?.district || farmer.district,
      operation_code: wizardData.operation_code,
      area_acres: Number(wizardData.area_acres) || 1.5,
      season: wizardData.season,
      preferred_date: wizardData.preferred_date,
      service_location: wizardData.service_location,
      cross_district: wizardData.cross_district,
    });
    setShowWizard(false);
    setWizardStep(1);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Farmer Profile Hero & Verification Status Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-800 font-bold text-xl">
            {farmer?.name ? farmer.name.slice(0, 2).toUpperCase() : 'BK'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{farmer?.name}</h2>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                FRUITS & Aadhaar Verified
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono">
              <span>FRUITS ID: <strong className="text-slate-800">{farmer?.fruits_id}</strong></span>
              <span>·</span>
              <span>KUTUMBA FID: <strong className="text-slate-800">{farmer?.fid}</strong></span>
              <span>·</span>
              <span>Taluk: <strong className="text-slate-800">{farmer?.taluk}, {farmer?.district}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowParcelModal(true)}
            className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Register Parcel (GIS)
          </button>
          <button
            onClick={() => {
              setWizardStep(1);
              setShowWizard(true);
            }}
            disabled={!eligibility.canApply}
            className={`px-4 py-2 text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5 ${
              eligibility.canApply
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            Book Mechanized Service
          </button>
        </div>
      </div>

      {/* Real-time Eligibility Engine Dashboard (FR-FM-003 & FR-SR-002) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Remaining Eligible Acres */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Remaining Eligible Acres</span>
            <span className="font-mono text-emerald-600 font-bold">Max 3.0 Ac</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tabular-nums">
              {eligibility.remainingAcres.toFixed(2)}
            </span>
            <span className="text-xs text-slate-500 font-medium">Acres available</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all"
              style={{
                width: `${Math.min(100, (eligibility.consumedAcres / schemeConfig.max_eligible_acres_per_farmer) * 100)}%`,
              }}
            />
          </div>
          <div className="text-[11px] text-slate-400 mt-1.5 flex justify-between font-mono">
            <span>Consumed: {eligibility.consumedAcres.toFixed(2)} Ac</span>
            <span>Limit: {schemeConfig.max_eligible_acres_per_farmer} Ac</span>
          </div>
        </div>

        {/* Operations Quota */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Operations Quota (FY 26-27)</span>
            <span className="font-mono text-blue-600 font-bold">Max 3 Ops</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tabular-nums">
              {eligibility.remainingOperations}
            </span>
            <span className="text-xs text-slate-500 font-medium">Operations left</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all"
              style={{
                width: `${(eligibility.availedOperations / schemeConfig.max_operations_per_year) * 100}%`,
              }}
            />
          </div>
          <div className="text-[11px] text-slate-400 mt-1.5 flex justify-between font-mono">
            <span>Availed: {eligibility.availedOperations}</span>
            <span>Cap: {schemeConfig.max_operations_per_year} / Year</span>
          </div>
        </div>

        {/* Incentive Rate & DBT Channel */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Government DBT Subsidy</span>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-1.5 py-0.5 rounded">
              Aadhaar Seeded
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-700 tabular-nums">
              ₹{schemeConfig.subsidy_rate_per_acre}
            </span>
            <span className="text-xs text-slate-500 font-medium">per acre / operation</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 leading-tight">
            Direct Benefit Transfer credited to <strong className="font-mono text-slate-700">A/C: {farmer?.bank_account?.slice(-4)}</strong> via FRUITS gateway.
          </p>
        </div>

        {/* Scheme Status / Eligibility Flag */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block mb-1">
              Beneficiary Eligibility Status
            </span>
            {eligibility.canApply ? (
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Eligible for Scheme Booking</span>
              </div>
            ) : (
              <div className="flex items-start gap-1.5 text-rose-700 font-bold text-xs">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{eligibility.reason}</span>
              </div>
            )}
          </div>
          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 font-mono">
            KUTUMBA 1-FID Check: Passed
          </div>
        </div>
      </div>

      {/* Registered Land Parcels (GIS & KSRSAC View) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Registered Land Parcels (KSRSAC Cadastral Records)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Only parcels lying within farmer's taluk are eligible for matching (R2 OP-2).
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {farmer?.parcels.length} Registered Plots
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {farmer?.parcels.map((parcel) => (
            <div
              key={parcel.parcel_id}
              className="border border-slate-200 rounded-lg p-3.5 bg-slate-50 hover:bg-slate-100/60 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    Survey No: {parcel.survey_no}/{parcel.sub_survey_no} (Hissa {parcel.hissa_no})
                  </span>
                  <span className="text-[11px] bg-emerald-100 text-emerald-800 font-medium px-2 py-0.5 rounded">
                    {parcel.area_acres} Acres
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  {parcel.village} Village, {parcel.hobli} Hobli, {parcel.taluk} Taluk
                </p>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2 font-mono">
                  <span>Crop: {parcel.crop_type}</span>
                  <span>·</span>
                  <span>Irrigated: {parcel.irrigated_area} Ac</span>
                  <span>·</span>
                  <span className="text-emerald-700 font-semibold">GIS Mapped</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-mono">
                  GPS: {parcel.lat.toFixed(4)}, {parcel.lng.toFixed(4)}
                </span>
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  KSRSAC Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active & Historical Mechanized Service Requests */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Mechanized Service Request History & Life-Cycle</span>
            </h3>
            <p className="text-xs text-slate-500">
              Tracks booking matching, GPS execution, photo OTP authentication, officer approvals, and DBT status.
            </p>
          </div>
        </div>

        {farmerRequests.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            No service requests found. Click "+ Book Mechanized Service" to create one.
          </div>
        ) : (
          <div className="space-y-4">
            {farmerRequests.map((req) => (
              <div
                key={req.request_id}
                className="border border-slate-200 rounded-xl p-4 bg-white hover:border-slate-300 transition-all shadow-xs"
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                      {req.request_id}
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {req.operation_name}
                    </span>
                    <span className="text-xs text-slate-500">
                      ({req.area_acres} Acres · {req.season})
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        req.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === 'Taluk Approved' || req.status === 'District Approved'
                          ? 'bg-blue-100 text-blue-800'
                          : req.status === 'Completed' || req.status === 'Farmer Approved'
                          ? 'bg-amber-100 text-amber-900'
                          : req.status === 'Work Started' || req.status === 'Check-In'
                          ? 'bg-purple-100 text-purple-800'
                          : req.status === 'Disputed'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      ● {req.status}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Land / Location</span>
                    <span className="font-semibold text-slate-800">
                      Survey {req.survey_no}, {req.village}
                    </span>
                    <span className="text-slate-400 block text-[11px] mt-0.5">
                      Target Date: {req.preferred_date}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Assigned Vendor</span>
                    {req.assigned_vendor_name ? (
                      <div>
                        <span className="font-semibold text-slate-800">
                          {req.assigned_vendor_name}
                        </span>
                        <span className="text-slate-500 block text-[11px]">
                          📱 {req.assigned_vendor_mobile} · {req.assigned_equipment_name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-amber-600 font-medium">Matching Nearby Providers...</span>
                    )}
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Commercials & Subsidy</span>
                    <span className="font-semibold text-slate-800">
                      Service Fee: ₹{req.service_fee_amount || req.area_acres * 1200}
                    </span>
                    <span className="text-emerald-700 font-bold block text-[11px] mt-0.5">
                      Govt DBT Subsidy: ₹{req.computed_subsidy_amount || req.area_acres * 500}
                    </span>
                  </div>
                </div>

                {/* Reschedule History (if any) */}
                {req.reschedule_history && req.reschedule_history.length > 0 && (
                  <div className="bg-amber-50 rounded-lg p-2.5 text-xs text-amber-900 border border-amber-200/80 my-2">
                    <span className="font-semibold">Reschedule Record (OTP Verified):</span>{' '}
                    Moved from {req.reschedule_history[0].old_date} to{' '}
                    <strong>{req.reschedule_history[0].new_date}</strong>. Reason:{' '}
                    {req.reschedule_history[0].reason}
                  </div>
                )}

                {/* Action Bar based on State */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {/* Reschedule Button (Pre-work states) */}
                    {(req.status === 'Accepted' || req.status === 'Open for Assignment') && (
                      <button
                        onClick={() => {
                          setRescheduleModalReq(req);
                          setRescheduleDate(req.preferred_date);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        Reschedule (OTP)
                      </button>
                    )}

                    {/* Service Fee Payment Button */}
                    {req.status === 'Completed' && !req.farmer_paid_service_fee && (
                      <button
                        onClick={() => payServiceFee(req.request_id)}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        Pay Vendor Rental Fee (₹{req.service_fee_amount || 2500})
                      </button>
                    )}

                    {/* Authenticate Photos via OTP (BR-022) */}
                    {req.status === 'Completed' && !req.farmer_otp_photo_verified && (
                      <button
                        onClick={() => setOtpAuthModalReq(req)}
                        className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        Authenticate Geo-Photos (OTP)
                      </button>
                    )}

                    {/* Farmer Acceptance & Rating */}
                    {req.status === 'Completed' && req.farmer_otp_photo_verified && req.farmer_paid_service_fee && (
                      <button
                        onClick={() => setRatingModalReq(req)}
                        className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs"
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                        Confirm & Rate Service (1-5★)
                      </button>
                    )}

                    {/* Raise Dispute button */}
                    {(req.status === 'Completed' || req.status === 'Farmer Approved') && (
                      <button
                        onClick={() => setDisputeModalReq(req)}
                        className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs flex items-center gap-1"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Raise Dispute
                      </button>
                    )}
                  </div>

                  {/* Digital Voucher & DBT Receipt Viewer */}
                  {req.txn_ref && (
                    <button
                      onClick={() => setViewVoucherReq(req)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center gap-1 font-mono"
                    >
                      <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                      Digital Voucher ({req.txn_ref})
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6-STEP SERVICE REQUEST WIZARD MODAL (FR-SR-001) */}
      {showWizard && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 my-auto max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>6-Step Mechanized Service Request Wizard</span>
                  <span className="text-[11px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                    FR-SR-001
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Step {wizardStep} of 6: Select your land, mechanized operation, area & schedule.
                </p>
              </div>
              <button
                type="button"
                onClick={handleQuickFillWizard}
                className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                Auto-Fill Demo
              </button>
            </div>

            {/* Step Indicator Bar */}
            <div className="grid grid-cols-6 gap-1 my-4">
              {[1, 2, 3, 4, 5, 6].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all ${
                    wizardStep >= s ? 'bg-emerald-600' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>

            {/* Step Forms */}
            <form onSubmit={handleCreateRequest} className="space-y-4">
              {wizardStep === 1 && (
                <div className="space-y-3">
                  <FormLabel label="Step 1: Select Registered Land Parcel" required />
                  <p className="text-xs text-slate-500 mb-2">
                    Select a parcel located in your registered taluk ({farmer?.taluk}).
                  </p>
                  <div className="space-y-2">
                    {farmer?.parcels.map((p) => (
                      <label
                        key={p.parcel_id}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                          wizardData.parcel_id === p.parcel_id
                            ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="parcel"
                            checked={wizardData.parcel_id === p.parcel_id}
                            onChange={() => setWizardData({ ...wizardData, parcel_id: p.parcel_id })}
                            className="text-emerald-600 focus:ring-emerald-500"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">
                              Survey No: {p.survey_no}/{p.sub_survey_no} (Hissa {p.hissa_no})
                            </span>
                            <span className="text-xs text-slate-500">
                              {p.village}, {p.taluk} · Area: {p.area_acres} Acres
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-mono text-emerald-700 font-semibold">
                          GPS Centroid: {p.lat.toFixed(3)}, {p.lng.toFixed(3)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-3">
                  <FormLabel label="Step 2: Select Mechanized Operation" required />
                  <p className="text-xs text-slate-500 mb-2">
                    Choose from Department of Agriculture approved operations master.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                    {schemeConfig.rate_ceilings.map((op) => (
                      <div
                        key={op.operation_code}
                        onClick={() => setWizardData({ ...wizardData, operation_code: op.operation_code })}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          wizardData.operation_code === op.operation_code
                            ? 'border-emerald-600 bg-emerald-50 shadow-xs'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{op.operation_name}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 block mt-0.5">{op.operation_name_kn}</span>
                        <div className="text-[11px] font-mono text-emerald-700 font-semibold mt-2">
                          Dept Ceiling: ₹{op.max_rate_per_acre}/acre
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-4">
                  <FormLabel label="Step 3: Enter Area (Acres) & Crop Details" required />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <FormLabel label="Requested Area (Acres)" required />
                      <input
                        type="number"
                        step="0.1"
                        value={wizardData.area_acres}
                        onChange={(e) => setWizardData({ ...wizardData, area_acres: Number(e.target.value) })}
                        className="w-full text-xs font-bold p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                        placeholder="e.g. 1.5"
                      />
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        Eligible remaining: {eligibility.remainingAcres.toFixed(2)} Acres
                      </span>
                    </div>

                    <div>
                      <FormLabel label="Current / Planned Crop (Master Data)" required />
                      <select
                        value={wizardData.crop_type}
                        onChange={(e) => setWizardData({ ...wizardData, crop_type: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white font-semibold text-slate-800"
                      >
                        {CROPS_MASTER.map((c) => (
                          <option key={c.code} value={c.name}>
                            🌾 {c.name} ({c.category})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {wizardStep === 4 && (
                <div className="space-y-4">
                  <FormLabel label="Step 4: Select Agricultural Season" required />
                  <div className="grid grid-cols-3 gap-3">
                    {(['Kharif', 'Rabi', 'Summer'] as const).map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setWizardData({ ...wizardData, season: s })}
                        className={`p-4 rounded-xl border text-center font-bold text-xs transition-all ${
                          wizardData.season === s
                            ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {s} Season 2026
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {wizardStep === 5 && (
                <div className="space-y-4">
                  <FormLabel label="Step 5: Preferred Date & Exact Location" required />
                  <div>
                    <FormLabel label="Preferred Execution Date" required />
                    <input
                      type="date"
                      value={wizardData.preferred_date}
                      onChange={(e) => setWizardData({ ...wizardData, preferred_date: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <FormLabel label="Service Location Landmark & Cart Track Details" required />
                    <input
                      type="text"
                      value={wizardData.service_location}
                      onChange={(e) => setWizardData({ ...wizardData, service_location: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                      placeholder="e.g. Chinya Sy 142/2A near Kikkeri lake"
                    />
                  </div>

                  <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wizardData.cross_district}
                      onChange={(e) => setWizardData({ ...wizardData, cross_district: e.target.checked })}
                      className="text-emerald-600 focus:ring-emerald-500 rounded"
                    />
                    <span className="text-xs text-slate-700">
                      Allow cross-district matching from neighbouring district CHCs if local tractor is busy (BR-018)
                    </span>
                  </label>
                </div>
              )}

              {wizardStep === 6 && (
                <div className="space-y-4">
                  <FormLabel label="Step 6: Review & Final Eligibility Summary" />
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Farmer:</span>
                      <strong className="text-slate-900">{farmer?.name} ({farmer?.fruits_id})</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Operation:</span>
                      <strong className="text-slate-900">{wizardData.operation_code}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Area Requested:</span>
                      <strong className="text-slate-900">{wizardData.area_acres} Acres</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Estimated Rental Fee:</span>
                      <strong className="text-slate-900">₹{wizardData.area_acres * 1250}</strong>
                    </div>
                    <div className="flex justify-between border-t border-emerald-200 pt-2 text-sm text-emerald-800 font-bold">
                      <span>Estimated Govt DBT Subsidy:</span>
                      <span>₹{Math.min(wizardData.area_acres, 3.0) * 500}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-lg text-xs text-amber-900 border border-amber-200">
                    <span className="font-semibold">Note:</span> Subsidy will be directly credited to your Aadhaar-seeded bank account after work completion, photo OTP confirmation, and Taluk AO approval.
                  </div>
                </div>
              )}

              {/* Wizard Navigation Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                {wizardStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setWizardStep(wizardStep - 1)}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    Back
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowWizard(false)}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                )}

                {wizardStep < 6 ? (
                  <button
                    type="button"
                    onClick={() => setWizardStep(wizardStep + 1)}
                    className="px-5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1"
                  >
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Submit Request for Matching
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REGISTER LAND PARCEL MODAL */}
      {showParcelModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                Register Land Parcel (GIS Cadastral Mapping)
              </h3>
              <button
                onClick={() => setShowParcelModal(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addLandParcel(farmer.farmer_id, newParcelData);
                setShowParcelModal(false);
              }}
              className="space-y-3 text-xs"
            >
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <FormLabel label="Survey No" required />
                  <input
                    type="text"
                    value={newParcelData.survey_no}
                    onChange={(e) => setNewParcelData({ ...newParcelData, survey_no: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <FormLabel label="Sub Survey" required />
                  <input
                    type="text"
                    value={newParcelData.sub_survey_no}
                    onChange={(e) => setNewParcelData({ ...newParcelData, sub_survey_no: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <FormLabel label="Hissa No" required />
                  <input
                    type="text"
                    value={newParcelData.hissa_no}
                    onChange={(e) => setNewParcelData({ ...newParcelData, hissa_no: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <FormLabel label="Total Area (Acres)" required />
                  <input
                    type="number"
                    step="0.1"
                    value={newParcelData.area_acres}
                    onChange={(e) => setNewParcelData({ ...newParcelData, area_acres: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <FormLabel label="Irrigated Area (Acres)" required />
                  <input
                    type="number"
                    step="0.1"
                    value={newParcelData.irrigated_area}
                    onChange={(e) => setNewParcelData({ ...newParcelData, irrigated_area: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <FormLabel label="District" required />
                  <select
                    value={newParcelData.district}
                    onChange={(e) => {
                      const dName = e.target.value;
                      const dObj = KARNATAKA_DISTRICTS_MASTER.find((d) => d.name === dName) || KARNATAKA_DISTRICTS_MASTER[0];
                      const tObj = dObj.taluks[0];
                      const hObj = tObj.hoblis[0];
                      setNewParcelData({
                        ...newParcelData,
                        district: dName,
                        taluk: tObj.name,
                        hobli: hObj.name,
                        village: hObj.villages[0],
                      });
                    }}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white font-semibold text-slate-800"
                  >
                    {KARNATAKA_DISTRICTS_MASTER.map((d) => (
                      <option key={d.district_id} value={d.name}>
                        {d.name} ({d.name_kn})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <FormLabel label="Taluk" required />
                  <select
                    value={newParcelData.taluk}
                    onChange={(e) => {
                      const tName = e.target.value;
                      const dObj = KARNATAKA_DISTRICTS_MASTER.find((d) => d.name === newParcelData.district) || KARNATAKA_DISTRICTS_MASTER[0];
                      const tObj = dObj.taluks.find((t) => t.name === tName) || dObj.taluks[0];
                      const hObj = tObj.hoblis[0];
                      setNewParcelData({
                        ...newParcelData,
                        taluk: tName,
                        hobli: hObj.name,
                        village: hObj.villages[0],
                      });
                    }}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white font-semibold text-slate-800"
                  >
                    {(
                      KARNATAKA_DISTRICTS_MASTER.find((d) => d.name === newParcelData.district) ||
                      KARNATAKA_DISTRICTS_MASTER[0]
                    ).taluks.map((t) => (
                      <option key={t.taluk_id} value={t.name}>
                        {t.name} ({t.name_kn})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <FormLabel label="Hobli" required />
                  <select
                    value={newParcelData.hobli}
                    onChange={(e) => {
                      const hName = e.target.value;
                      const dObj = KARNATAKA_DISTRICTS_MASTER.find((d) => d.name === newParcelData.district) || KARNATAKA_DISTRICTS_MASTER[0];
                      const tObj = dObj.taluks.find((t) => t.name === newParcelData.taluk) || dObj.taluks[0];
                      const hObj = tObj.hoblis.find((h) => h.name === hName) || tObj.hoblis[0];
                      setNewParcelData({
                        ...newParcelData,
                        hobli: hName,
                        village: hObj.villages[0] || 'Main Village',
                      });
                    }}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white font-semibold text-slate-800"
                  >
                    {(
                      (
                        KARNATAKA_DISTRICTS_MASTER.find((d) => d.name === newParcelData.district) ||
                        KARNATAKA_DISTRICTS_MASTER[0]
                      ).taluks.find((t) => t.name === newParcelData.taluk) ||
                      (
                        KARNATAKA_DISTRICTS_MASTER.find((d) => d.name === newParcelData.district) ||
                        KARNATAKA_DISTRICTS_MASTER[0]
                      ).taluks[0]
                    ).hoblis.map((h) => (
                      <option key={h.hobli_id} value={h.name}>
                        {h.name} ({h.name_kn})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <FormLabel label="Village" required />
                  <select
                    value={newParcelData.village}
                    onChange={(e) => setNewParcelData({ ...newParcelData, village: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white font-semibold text-slate-800"
                  >
                    {(
                      (
                        (
                          KARNATAKA_DISTRICTS_MASTER.find((d) => d.name === newParcelData.district) ||
                          KARNATAKA_DISTRICTS_MASTER[0]
                        ).taluks.find((t) => t.name === newParcelData.taluk) ||
                        (
                          KARNATAKA_DISTRICTS_MASTER.find((d) => d.name === newParcelData.district) ||
                          KARNATAKA_DISTRICTS_MASTER[0]
                        ).taluks[0]
                      ).hoblis.find((h) => h.name === newParcelData.hobli) ||
                      (
                        (
                          KARNATAKA_DISTRICTS_MASTER.find((d) => d.name === newParcelData.district) ||
                          KARNATAKA_DISTRICTS_MASTER[0]
                        ).taluks.find((t) => t.name === newParcelData.taluk) ||
                        (
                          KARNATAKA_DISTRICTS_MASTER.find((d) => d.name === newParcelData.district) ||
                          KARNATAKA_DISTRICTS_MASTER[0]
                        ).taluks[0]
                      ).hoblis[0]
                    ).villages.map((v) => (
                      <option key={v} value={v}>
                        🏡 {v}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <FormLabel label="Primary Crop (Master Data)" required />
                <select
                  value={newParcelData.crop_type}
                  onChange={(e) => setNewParcelData({ ...newParcelData, crop_type: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white font-semibold text-slate-800"
                >
                  {CROPS_MASTER.map((c) => (
                    <option key={c.code} value={c.name}>
                      🌱 {c.name} ({c.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <FormLabel label="RTC Document Upload (PDF/JPG)" required />
                <div className="p-3 border-2 border-dashed border-slate-300 rounded-lg text-center text-slate-500 bg-slate-50 cursor-pointer">
                  📁 RTC-2026-MANDYA-SAMPLE.pdf (Auto Attached)
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowParcelModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-bold"
                >
                  Save Parcel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OTP RESCHEDULE MODAL (FR-BK-003) */}
      {rescheduleModalReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-5 shadow-2xl border border-slate-200 my-auto max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Reschedule Mechanized Service (OTP Confirmed)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Per Scheme SOP (R2 OP-9), reschedule is effective on OTP counterparty verification.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <FormLabel label="New Execution Date" required />
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold"
                />
              </div>

              <div>
                <FormLabel label="Reason for Reschedule" required />
                <textarea
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  rows={2}
                />
              </div>

              <div>
                <FormLabel label="Counterparty Confirmation OTP (Sent via SMS)" required />
                <input
                  type="text"
                  value={rescheduleOtp}
                  onChange={(e) => setRescheduleOtp(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold tracking-widest text-center text-emerald-800 bg-emerald-50"
                  placeholder="Enter 6-digit OTP"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRescheduleModalReq(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    rescheduleRequest(
                      rescheduleModalReq.request_id,
                      rescheduleDate,
                      rescheduleReason,
                      rescheduleOtp,
                      'FARMER'
                    );
                    setRescheduleModalReq(null);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Confirm Reschedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PHOTO OTP AUTHENTICATION MODAL (FR-FA-002) */}
      {otpAuthModalReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-5 shadow-2xl border border-slate-200 my-auto max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Farmer OTP Authentication for Work Photos (BR-022)
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Review vendor-uploaded geo-tagged photographs and authenticate via OTP before officer verification.
            </p>

            {/* Photos Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {otpAuthModalReq.execution?.photos.map((p, idx) => (
                <div key={p.photo_id} className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                  <div className="h-28 bg-slate-800 flex items-center justify-center text-xs text-slate-300 overflow-hidden relative">
                    <img src={p.url} alt={p.caption} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                      {p.phase}
                    </span>
                  </div>
                  <div className="p-1.5 text-[10px] text-slate-600 font-mono">
                    <div>GPS: {p.lat.toFixed(4)}, {p.lng.toFixed(4)}</div>
                    <div className="text-slate-400">{p.taken_at}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <FormLabel label="Enter Farmer Authentication OTP (Simulated: 481920)" required />
                <input
                  type="text"
                  value={enteredPhotoOtp}
                  onChange={(e) => setEnteredPhotoOtp(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg font-mono font-bold tracking-widest text-center text-lg text-emerald-800 bg-emerald-50"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setOtpAuthModalReq(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    authenticatePhotosOtp(otpAuthModalReq.request_id, enteredPhotoOtp);
                    setOtpAuthModalReq(null);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Verify & Authenticate Photos
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RATING & REVIEW MODAL (FR-FA-001 & FR-FA-003) */}
      {ratingModalReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-5 shadow-2xl border border-slate-200 my-auto max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Confirm Service & Submit Provider Rating
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Your feedback is used in the automated provider matching algorithm (Weight: 20%).
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <FormLabel label="Service Rating (1 to 5 Stars)" required />
                <div className="flex items-center gap-2 justify-center py-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRatingVal(star)}
                      className={`text-2xl transition-transform hover:scale-110 ${
                        ratingVal >= star ? 'text-amber-400' : 'text-slate-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <FormLabel label="Farmer Review / Comments" required />
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRatingModalReq(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    submitFarmerAcceptance(ratingModalReq.request_id, 'APPROVE', ratingVal, reviewText);
                    setRatingModalReq(null);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Approve & Forward to Taluk AO
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RAISE DISPUTE MODAL (FR-DM-001) */}
      {disputeModalReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-5 shadow-2xl border border-slate-200 my-auto max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-rose-800 mb-1 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Raise Service Dispute (Grievance)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Disputes are escalated to the Taluk Agriculture Officer for forensic investigation.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <FormLabel label="Dispute Category" required />
                <select
                  value={disputeType}
                  onChange={(e) => setDisputeType(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                >
                  <option value="Work Quality Issue">Work Quality Issue (Improper depth / tillage)</option>
                  <option value="Area Mismatch">Area Mismatch (Claimed area exceeds worked field)</option>
                  <option value="Wrong Operation">Wrong Operation Performed</option>
                  <option value="Incomplete Service">Incomplete Service Left Midway</option>
                  <option value="Payment Issue">Payment / Overcharging Issue</option>
                </select>
              </div>

              <div>
                <FormLabel label="Detailed Grievance Description" required />
                <textarea
                  value={disputeDesc}
                  onChange={(e) => setDisputeDesc(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  rows={3}
                  placeholder="Explain the deficiency..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDisputeModalReq(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    raiseDispute(disputeModalReq.request_id, disputeType, disputeDesc);
                    setDisputeModalReq(null);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold"
                >
                  Submit Dispute to Taluk AO
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DIGITAL VOUCHER & DBT RECEIPT VIEWER (FR-CM-002 & FR-PAY-004) */}
      {viewVoucherReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-slate-200 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌾</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Department of Agriculture · Govt of Karnataka
                  </h3>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Chief Minister Negila Yogi Scheme Digital Voucher
                  </span>
                </div>
              </div>
              <button
                onClick={() => setViewVoucherReq(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Certificate Body */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2 font-mono">
              <div className="flex justify-between border-b border-slate-200 pb-2 font-bold text-slate-900">
                <span>VOUCHER REF: {viewVoucherReq.txn_ref}</span>
                <span>STATUS: {viewVoucherReq.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <div>
                  <span className="text-slate-400 block">Farmer Name</span>
                  <span className="font-bold text-slate-800">{viewVoucherReq.farmer_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">FRUITS ID</span>
                  <span className="font-bold text-slate-800">{farmer?.fruits_id}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Operation</span>
                  <span className="font-bold text-slate-800">{viewVoucherReq.operation_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Area Covered</span>
                  <span className="font-bold text-slate-800">{viewVoucherReq.area_acres} Acres</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Service Provider</span>
                  <span className="font-bold text-slate-800">{viewVoucherReq.assigned_vendor_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Machinery RC</span>
                  <span className="font-bold text-slate-800">{viewVoucherReq.assigned_equipment_name}</span>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-2 flex justify-between text-xs font-bold text-emerald-800">
                <span>DBT Subsidy Amount:</span>
                <span>₹{viewVoucherReq.computed_subsidy_amount || 1000}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => {
                  alert('Voucher PDF downloaded successfully.');
                  setViewVoucherReq(null);
                }}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download Certificate / PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
