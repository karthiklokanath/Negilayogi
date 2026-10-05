/**
 * MASMS - Vendor / Service Provider Registration Component
 * Implements FR-SP-001 (FRUITS ID / PAN Registration), FR-SP-002 (Vehicle & Consent), FR-SP-003 (Service Area Jurisdiction)
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FormLabel } from '../common/FormLabel';
import { VendorProfile, Equipment, VendorRate } from '../../types/masms';
import {
  KARNATAKA_DISTRICTS_MASTER,
  MACHINERY_TYPES_MASTER,
  BUSINESS_ENTITIES_MASTER,
} from '../../data/masterData';
import {
  Tractor,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  User,
  Building2,
  MapPin,
  CreditCard,
  FileCheck2,
  AlertCircle,
  X,
} from 'lucide-react';

interface VendorRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newVendor: VendorProfile) => void;
}

export const VendorRegistrationModal: React.FC<VendorRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { registerVendor, schemeConfig } = useApp();

  // Registration Mode: FRUITS ID or PAN (BR-009, R2 OP-1)
  const [regMode, setRegMode] = useState<'PAN' | 'FRUITS'>('PAN');

  // Form State
  const [formData, setFormData] = useState({
    fruits_id: '',
    pan: 'ABCDE1234F',
    business_type: 'Individual' as 'Individual' | 'Partner' | 'Firm',
    name: 'Kikkeri Mechanized Agri Services',
    mobile: '9845987654',
    email: 'kikkeri.agri@gmail.com',
    address: 'Near Old Bus Stand, Kikkeri Hobli',
    district: 'Mandya',
    taluk: 'Pandavapura',
    service_areas_text: 'Pandavapura, Kikkeri, Krishnarajpet',
    bank_account: '501009847120',
    ifsc: 'HDFC0001892',
    bank_name: 'HDFC Bank - Pandavapura Branch',
    gst: '29ABCDE1234F1Z5',
    consent_accepted: true,
    
    // Initial Machinery Details (FR-SP-002)
    machinery_type: 'Tractor 4WD (45-55 HP)',
    make_model: 'Mahindra 575 DI Sarpanch',
    rc_no: `KA-11-TR-${Math.floor(1000 + Math.random() * 9000)}`,
    hp: 45,
    mfg_year: 2024,
    insurance_expiry: '2027-12-31',
    fitness_cert: 'FIT-CERT-KA11-2026.pdf',
    operations_served: ['OP-PLOUGH', 'OP-ROTAVATE', 'OP-SOWING'],
    rate_per_acre: 1250,
  });

  if (!isOpen) return null;

  // 1-Click Auto Fill Demo Data
  const handleAutoFillDemo = () => {
    setFormData({
      fruits_id: 'FRUITS-VND-889123',
      pan: `KAAGR${Math.floor(1000 + Math.random() * 9000)}P`,
      business_type: 'Partner',
      name: 'Sahyadri Agri Mechanization CHC',
      mobile: '9448123987',
      email: 'sahyadri.chc@karnataka.gov.in',
      address: 'APMC Market Yard, Pandavapura Town',
      district: 'Mandya',
      taluk: 'Pandavapura',
      service_areas_text: 'Pandavapura, Kikkeri, Melukote, Srirangapatna',
      bank_account: '309812457891',
      ifsc: 'SBIN0040182',
      bank_name: 'State Bank of India',
      gst: '29AAECS4512Q1ZX',
      consent_accepted: true,
      machinery_type: 'Tractor 4WD (45-55 HP)',
      make_model: 'John Deere 5050 D GearPro',
      rc_no: `KA-11-TB-${Math.floor(1000 + Math.random() * 9000)}`,
      hp: 50,
      mfg_year: 2024,
      insurance_expiry: '2027-11-30',
      fitness_cert: 'FIT-KA11-2026-CERT.pdf',
      operations_served: ['OP-PLOUGH', 'OP-ROTAVATE', 'OP-SOWING', 'OP-TRANSPORT'],
      rate_per_acre: 1200,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const serviceAreas = formData.service_areas_text
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const initialEquipment: Equipment = {
      equipment_id: `EQ-NEW-${Date.now().toString().slice(-4)}`,
      vendor_id: '',
      type: formData.machinery_type,
      make_model: formData.make_model,
      rc_no: formData.rc_no,
      hp: Number(formData.hp) || 45,
      mfg_year: Number(formData.mfg_year) || 2024,
      insurance_expiry: formData.insurance_expiry || '2027-12-31',
      fitness_cert: formData.fitness_cert || 'FIT-CERT.pdf',
      photos: ['https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=400&q=80'],
      operations_served: formData.operations_served,
      status: 'Verification Pending',
      is_active: true,
      ao_approved: false,
    };

    const initialRates: VendorRate[] = formData.operations_served.map((opCode) => ({
      rate_id: `RATE-${Date.now().toString().slice(-4)}-${opCode}`,
      equipment_id: initialEquipment.equipment_id,
      operation_code: opCode,
      rate_per_hour: Math.round(formData.rate_per_acre * 0.7),
      rate_per_acre: formData.rate_per_acre,
    }));

    const newVendor = registerVendor({
      fruits_id: regMode === 'FRUITS' ? formData.fruits_id : undefined,
      pan: formData.pan,
      business_type: formData.business_type,
      name: formData.name,
      mobile: formData.mobile,
      address: formData.address,
      district: formData.district,
      taluk: formData.taluk,
      service_areas: serviceAreas.length > 0 ? serviceAreas : [formData.taluk],
      bank_account: formData.bank_account,
      ifsc: formData.ifsc,
      gst: formData.gst,
      consent_accepted: formData.consent_accepted,
      equipment_list: [initialEquipment],
      rates: initialRates,
    });

    if (onSuccess) onSuccess(newVendor);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 my-auto max-h-[90vh] overflow-y-auto space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 font-bold text-lg">
              🚜
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Service Provider / Vendor Registration (FR-SP-001)</span>
                <span className="text-[11px] bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded">
                  Badavaru Bandhu
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Register as a Tractor / Farm Machinery Owner or Custom Hiring Center (CHC).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAutoFillDemo}
              className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
              title="Auto-fill complete sample vendor registration profile"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              Auto-Fill Demo
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* SECTION 1: Identity & Business Mode (FR-SP-001, BR-009) */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <User className="w-4 h-4 text-amber-700" />
                1. Identification & Business Constitution (BR-009)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRegMode('PAN')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                    regMode === 'PAN'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  PAN Registration
                </button>
                <button
                  type="button"
                  onClick={() => setRegMode('FRUITS')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                    regMode === 'FRUITS'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  FRUITS ID Mode
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {regMode === 'PAN' ? (
                <>
                  <div>
                    <FormLabel label="PAN Number (10 Characters)" required />
                    <input
                      type="text"
                      value={formData.pan}
                      onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                      className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold uppercase"
                      placeholder="e.g. ABCDE1234F"
                    />
                  </div>
                  <div>
                    <FormLabel label="Business Entity Type (Master Data)" required />
                    <select
                      value={formData.business_type}
                      onChange={(e) => setFormData({ ...formData, business_type: e.target.value as any })}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white font-semibold text-slate-800"
                    >
                      {BUSINESS_ENTITIES_MASTER.map((b) => (
                        <option key={b.id} value={b.id}>
                          🏢 {b.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <FormLabel label="GSTIN Number (Optional)" />
                    <input
                      type="text"
                      value={formData.gst}
                      onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                      placeholder="e.g. 29ABCDE1234F1Z5"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="sm:col-span-2">
                    <FormLabel label="FRUITS Beneficiary ID (Master Farmer/Vendor Data)" required />
                    <input
                      type="text"
                      value={formData.fruits_id}
                      onChange={(e) => setFormData({ ...formData, fruits_id: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold text-emerald-800"
                      placeholder="e.g. FRUITS-VND-449102"
                    />
                  </div>
                  <div>
                    <FormLabel label="PAN (Optional for FRUITS)" />
                    <input
                      type="text"
                      value={formData.pan}
                      onChange={(e) => setFormData({ ...formData, pan: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                      placeholder="Optional"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <FormLabel label="Service Provider / Business Name" required />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-semibold"
                  placeholder="e.g. Shankarappa Mechanized Services"
                />
              </div>
              <div>
                <FormLabel label="Mobile Number (SMS & OTP Alerts)" required />
                <input
                  type="text"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold"
                  placeholder="10-digit mobile"
                />
              </div>
              <div>
                <FormLabel label="Email Address" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  placeholder="name@gmail.com"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Operational Jurisdiction & Service Area (FR-SP-003, R2 OP-7) */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              2. Operational Jurisdiction & Service Areas (R2 OP-7)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <FormLabel label="Primary District (Master Data)" required />
                <select
                  value={formData.district}
                  onChange={(e) => {
                    const dName = e.target.value;
                    const dObj = KARNATAKA_DISTRICTS_MASTER.find((d) => d.name === dName) || KARNATAKA_DISTRICTS_MASTER[0];
                    const tObj = dObj.taluks[0];
                    setFormData({
                      ...formData,
                      district: dName,
                      taluk: tObj.name,
                      service_areas_text: tObj.hoblis.map((h) => h.name).join(', '),
                    });
                  }}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white font-semibold text-slate-800"
                >
                  {KARNATAKA_DISTRICTS_MASTER.map((d) => (
                    <option key={d.district_id} value={d.name}>
                      📍 {d.name} ({d.name_kn})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FormLabel label="Primary Taluk (Approving AO Jurisdiction)" required />
                <select
                  value={formData.taluk}
                  onChange={(e) => {
                    const tName = e.target.value;
                    const dObj = KARNATAKA_DISTRICTS_MASTER.find((d) => d.name === formData.district) || KARNATAKA_DISTRICTS_MASTER[0];
                    const tObj = dObj.taluks.find((t) => t.name === tName) || dObj.taluks[0];
                    setFormData({
                      ...formData,
                      taluk: tName,
                      service_areas_text: tObj.hoblis.map((h) => h.name).join(', '),
                    });
                  }}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white font-semibold text-slate-800"
                >
                  {(
                    KARNATAKA_DISTRICTS_MASTER.find((d) => d.name === formData.district) ||
                    KARNATAKA_DISTRICTS_MASTER[0]
                  ).taluks.map((t) => (
                    <option key={t.taluk_id} value={t.name}>
                      🏛️ {t.name} ({t.name_kn})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FormLabel label="Service Areas / Hoblis Served" required />
                <input
                  type="text"
                  value={formData.service_areas_text}
                  onChange={(e) => setFormData({ ...formData, service_areas_text: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  placeholder="Comma separated hoblis"
                />
              </div>
            </div>

            <div>
              <FormLabel label="Complete Office / Workshop Address" required />
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg"
                placeholder="Shop/Garage address, village/town"
              />
            </div>
          </div>

          {/* SECTION 3: Initial Machinery & Vehicle Details (FR-SP-002, R2 OP-5) */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Tractor className="w-4 h-4 text-amber-600" />
              3. Initial Machinery Onboarding (1 RC = 1 Unit, BR-013)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <FormLabel label="Machinery Category / Type (Master Data)" required />
                <select
                  value={formData.machinery_type}
                  onChange={(e) => setFormData({ ...formData, machinery_type: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white font-semibold text-slate-800"
                >
                  {MACHINERY_TYPES_MASTER.map((m) => (
                    <option key={m.id} value={m.name}>
                      🚜 {m.name} ({m.hp_range})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FormLabel label="Make & Model" required />
                <input
                  type="text"
                  value={formData.make_model}
                  onChange={(e) => setFormData({ ...formData, make_model: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  placeholder="e.g. Mahindra 575 DI"
                />
              </div>
              <div>
                <FormLabel label="Vehicle RC Number (1 RC = 1 Equipment)" required />
                <input
                  type="text"
                  value={formData.rc_no}
                  onChange={(e) => setFormData({ ...formData, rc_no: e.target.value.toUpperCase() })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold"
                  placeholder="e.g. KA-11-TB-8842"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <FormLabel label="Engine HP" required />
                <input
                  type="number"
                  value={formData.hp}
                  onChange={(e) => setFormData({ ...formData, hp: Number(e.target.value) })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>
              <div>
                <FormLabel label="Mfg Year" required />
                <input
                  type="number"
                  value={formData.mfg_year}
                  onChange={(e) => setFormData({ ...formData, mfg_year: Number(e.target.value) })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>
              <div>
                <FormLabel label="Insurance Expiry Date" required />
                <input
                  type="date"
                  value={formData.insurance_expiry}
                  onChange={(e) => setFormData({ ...formData, insurance_expiry: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold text-emerald-800"
                />
              </div>
              <div>
                <FormLabel label="Declared Rate (₹/Acre)" required />
                <input
                  type="number"
                  value={formData.rate_per_acre}
                  onChange={(e) => setFormData({ ...formData, rate_per_acre: Number(e.target.value) })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: Bank Account Details for Farmer Fee Receipts */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-blue-600" />
              4. Bank Account for Service Fee Settlements
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <FormLabel label="Bank Account Number" required />
                <input
                  type="text"
                  value={formData.bank_account}
                  onChange={(e) => setFormData({ ...formData, bank_account: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold"
                  placeholder="Account number"
                />
              </div>
              <div>
                <FormLabel label="Bank IFSC Code (11 Characters)" required />
                <input
                  type="text"
                  value={formData.ifsc}
                  onChange={(e) => setFormData({ ...formData, ifsc: e.target.value.toUpperCase() })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold uppercase"
                  placeholder="e.g. HDFC0001892"
                />
              </div>
              <div>
                <FormLabel label="Bank & Branch Name" />
                <input
                  type="text"
                  value={formData.bank_name}
                  onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  placeholder="Bank name"
                />
              </div>
            </div>
          </div>

          {/* SECTION 5: Declaration & Consent (VAL-REG-07) */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-2">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.consent_accepted}
                onChange={(e) => setFormData({ ...formData, consent_accepted: e.target.checked })}
                className="text-amber-600 focus:ring-amber-500 rounded mt-0.5"
              />
              <span className="text-slate-700 leading-relaxed">
                <strong>Statutory Declaration:</strong> I hereby declare that the farm machinery / tractor details provided are true and accurate. The machinery is insured, roadworthy, and complies with Department of Agriculture safety norms. I consent to GIS work tracking and Taluk Agriculture Officer (AO) verification as prescribed in the Negila Yogi Scheme SOP.
              </span>
            </label>
            <div className="text-[11px] text-slate-500 font-mono">
              Note: Vendor registration is subject to approval by the AO of the respective taluk (Pandavapura). There is no renewal/expiry fee (R2 OP-4).
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 text-xs font-bold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Submit Vendor Profile for Taluk AO Verification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
