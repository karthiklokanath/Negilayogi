/**
 * MASMS - Chief Minister Negila Yogi Scheme
 * Central Application Context & Business Rules Engine
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Language,
  FarmerProfile,
  VendorProfile,
  ServiceRequest,
  ServiceRequestStatus,
  SchemeConfig,
  Dispute,
  AuditEntry,
  NotificationItem,
  LandParcel,
  Equipment,
  VendorRate,
  PhotoEvidence,
} from '../types/masms';
import {
  INITIAL_SCHEME_CONFIG,
  INITIAL_FARMERS,
  INITIAL_VENDORS,
  INITIAL_REQUESTS,
  INITIAL_DISPUTES,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockStore';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  viewMode: 'WEB' | 'MOBILE';
  setViewMode: (mode: 'WEB' | 'MOBILE') => void;
  activeFarmerId: string;
  setActiveFarmerId: (id: string) => void;
  activeVendorId: string;
  setActiveVendorId: (id: string) => void;

  schemeConfig: SchemeConfig;
  updateSchemeConfig: (config: Partial<SchemeConfig>) => void;

  farmers: FarmerProfile[];
  vendors: VendorProfile[];
  requests: ServiceRequest[];
  disputes: Dispute[];
  auditLogs: AuditEntry[];
  notifications: NotificationItem[];

  // Farmer Actions
  registerFarmer: (farmer: Partial<FarmerProfile>) => FarmerProfile;
  addLandParcel: (farmerId: string, parcel: Partial<LandParcel>) => LandParcel;
  createServiceRequest: (req: Partial<ServiceRequest>) => ServiceRequest;
  rescheduleRequest: (
    requestId: string,
    newDate: string,
    reason: string,
    otp: string,
    requestedBy: 'FARMER' | 'VENDOR'
  ) => boolean;
  payServiceFee: (requestId: string) => void;
  authenticatePhotosOtp: (requestId: string, otp: string) => boolean;
  submitFarmerAcceptance: (
    requestId: string,
    action: 'APPROVE' | 'REJECT',
    rating?: number,
    review?: string,
    rejectReason?: string
  ) => void;
  raiseDispute: (
    requestId: string,
    type: Dispute['type'],
    description: string,
    evidencePhotos?: string[]
  ) => void;

  // Vendor Actions
  registerVendor: (vendor: Partial<VendorProfile>) => VendorProfile;
  addEquipment: (vendorId: string, equipment: Partial<Equipment>) => Equipment;
  updateRates: (vendorId: string, rates: VendorRate[]) => void;
  acceptRequest: (requestId: string, vendorId: string, equipmentId: string) => boolean;
  vendorCheckInGps: (requestId: string, lat: number, lng: number) => { distance: number; status: 'PASS' | 'EXCEPTION_BREACH' };
  startWork: (requestId: string, odometer: number, fuel: string, prePhotos: string[]) => void;
  completeWork: (
    requestId: string,
    hoursWorked: number,
    areaCovered: number,
    odometerEnd: number,
    postPhotos: string[]
  ) => void;

  // Officer Actions
  talukVerifyRequest: (
    requestId: string,
    action: 'APPROVED' | 'REJECTED' | 'RETURNED',
    remarks: string,
    physicalInspection: boolean,
    inspectionNotes?: string
  ) => void;
  talukApproveVendor: (
    vendorId: string,
    action: 'Approved' | 'Rejected' | 'Returned for Correction',
    remarks: string
  ) => void;
  talukApproveEquipment: (
    vendorId: string,
    equipmentId: string,
    approve: boolean
  ) => void;
  districtApproveRequest: (
    requestId: string,
    action: 'APPROVED' | 'REJECTED' | 'RETURNED',
    remarks: string
  ) => void;
  resolveDispute: (
    disputeId: string,
    decision: 'Resolved (Uphold)' | 'Resolved (Partial)' | 'Resolved (Rejected)',
    actionTaken: string
  ) => void;

  // Finance Actions
  processDbtPaymentBatch: (requestIds: string[]) => void;
  reversePayment: (requestId: string, reason: string) => void;

  // Helpers / Calculation Engines
  getFarmerEligibility: (farmerId: string) => {
    isFruitsEligible: boolean;
    isPmkisanEligible: boolean;
    totalAcresInFruits: number;
    maxAllowedAcres: number;
    consumedAcres: number;
    remainingAcres: number;
    maxOperations: number;
    availedOperations: number;
    remainingOperations: number;
    canApply: boolean;
    reason?: string;
  };
  addNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearTransactionData: () => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

// Geodesic distance calculator in meters (Haversine formula)
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // metres
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

const STORAGE_KEY = 'MASMS_APP_STATE_V1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('FARMER');
  const [lang, setLang] = useState<Language>('EN');
  const [viewMode, setViewMode] = useState<'WEB' | 'MOBILE'>('WEB');
  const [activeFarmerId, setActiveFarmerId] = useState<string>('FAR-KA-001');
  const [activeVendorId, setActiveVendorId] = useState<string>('VEN-KA-101');

  const [schemeConfig, setSchemeConfig] = useState<SchemeConfig>(INITIAL_SCHEME_CONFIG);
  const [farmers, setFarmers] = useState<FarmerProfile[]>(INITIAL_FARMERS);
  const [vendors, setVendors] = useState<VendorProfile[]>(INITIAL_VENDORS);
  const [requests, setRequests] = useState<ServiceRequest[]>(INITIAL_REQUESTS);
  const [disputes, setDisputes] = useState<Dispute[]>(INITIAL_DISPUTES);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Load from LocalStorage if exists
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.farmers) setFarmers(parsed.farmers);
        if (parsed.vendors) setVendors(parsed.vendors);
        if (parsed.requests) setRequests(parsed.requests);
        if (parsed.disputes) setDisputes(parsed.disputes);
        if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
        if (parsed.schemeConfig) setSchemeConfig(parsed.schemeConfig);
        if (parsed.notifications) setNotifications(parsed.notifications);
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to LocalStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          farmers,
          vendors,
          requests,
          disputes,
          auditLogs,
          schemeConfig,
          notifications,
        })
      );
    } catch {
      // ignore
    }
  }, [farmers, vendors, requests, disputes, auditLogs, schemeConfig, notifications]);

  const logAudit = (
    eventType: string,
    entity: string,
    entityId: string,
    actorName: string,
    actorRole: UserRole,
    details: {
      oldValue?: string;
      newValue?: string;
      gpsCoords?: string;
      status?: 'SUCCESS' | 'WARNING' | 'BREACH_LOGGED';
    }
  ) => {
    const entry: AuditEntry = {
      audit_id: `AUD-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      event_type: eventType,
      entity,
      entity_id: entityId,
      actor_name: actorName,
      actor_role: actorRole,
      old_value: details.oldValue,
      new_value: details.newValue,
      gps_coords: details.gpsCoords || '12.6842, 76.5714',
      ip_address: '10.120.' + Math.floor(Math.random() * 200 + 1) + '.44',
      device_info: 'Chrome 128 (MASMS Portal Client)',
      status: details.status || 'SUCCESS',
    };
    setAuditLogs((prev) => [entry, ...prev]);
  };

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const item: NotificationItem = {
      ...notif,
      id: `NOTIF-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    setNotifications((prev) => [item, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const updateSchemeConfig = (newConfig: Partial<SchemeConfig>) => {
    const updated = { ...schemeConfig, ...newConfig };
    setSchemeConfig(updated);
    logAudit(
      'SCHEME_CONFIG_UPDATED',
      'SchemeConfig',
      'GLOBAL',
      'State Administrator (Agri Dept)',
      'STATE_ADMIN',
      { newValue: JSON.stringify(newConfig) }
    );
  };

  const getFarmerEligibility = (farmerId: string) => {
    const farmer = farmers.find((f) => f.farmer_id === farmerId);
    if (!farmer) {
      return {
        isFruitsEligible: false,
        isPmkisanEligible: false,
        totalAcresInFruits: 0,
        maxAllowedAcres: schemeConfig.max_eligible_acres_per_farmer,
        consumedAcres: 0,
        remainingAcres: 0,
        maxOperations: schemeConfig.max_operations_per_year,
        availedOperations: 0,
        remainingOperations: 0,
        canApply: false,
        reason: 'Farmer not found in master records',
      };
    }

    const totalAcresInFruits = farmer.parcels.reduce((acc, p) => acc + (p.area_acres || 0), 0);
    const farmerRequests = requests.filter(
      (r) => r.farmer_id === farmerId && r.status !== 'Rejected' && r.status !== 'Returned'
    );

    // Filter completed or active requests in this FY
    const availedOperations = farmerRequests.filter(
      (r) => r.status === 'Completed' || r.status === 'Farmer Approved' || r.status === 'Taluk Approved' || r.status === 'District Approved' || r.status === 'Paid'
    ).length;

    const consumedAcres = farmerRequests
      .filter((r) => r.status === 'Taluk Approved' || r.status === 'District Approved' || r.status === 'Paid')
      .reduce((acc, r) => acc + (r.eligible_area || r.area_acres || 0), 0);

    const remainingAcres = Math.max(0, schemeConfig.max_eligible_acres_per_farmer - consumedAcres);
    const remainingOperations = Math.max(0, schemeConfig.max_operations_per_year - availedOperations);

    const hasActivePendingService = farmerRequests.some(
      (r) =>
        r.status === 'Submitted' ||
        r.status === 'Verified' ||
        r.status === 'Open for Assignment' ||
        r.status === 'Accepted' ||
        r.status === 'Check-In' ||
        r.status === 'Work Started'
    );

    let canApply = true;
    let reason = '';

    if (!farmer.is_pmkisan_eligible) {
      canApply = false;
      reason = 'Farmer not registered or ineligible in PM-KISAN database (BR-007)';
    } else if (remainingOperations <= 0) {
      canApply = false;
      reason = `Maximum scheme quota reached (${schemeConfig.max_operations_per_year} operations per year) (BR-001)`;
    } else if (remainingAcres <= 0) {
      canApply = false;
      reason = `Maximum land subsidy ceiling reached (${schemeConfig.max_eligible_acres_per_farmer} acres) (BR-002)`;
    } else if (hasActivePendingService) {
      canApply = false;
      reason = 'A mechanized service is already active/booked. Complete existing booking first (BR-017)';
    }

    return {
      isFruitsEligible: totalAcresInFruits < 3.0,
      isPmkisanEligible: farmer.is_pmkisan_eligible,
      totalAcresInFruits,
      maxAllowedAcres: schemeConfig.max_eligible_acres_per_farmer,
      consumedAcres,
      remainingAcres,
      maxOperations: schemeConfig.max_operations_per_year,
      availedOperations,
      remainingOperations,
      canApply,
      reason,
    };
  };

  const registerFarmer = (data: Partial<FarmerProfile>): FarmerProfile => {
    const newFarmer: FarmerProfile = {
      farmer_id: `FAR-KA-${String(farmers.length + 1).padStart(3, '0')}`,
      fruits_id: data.fruits_id || `FRUITS-MDY-${Math.floor(100000 + Math.random() * 900000)}`,
      fid: data.fid || `FID-KUTUMBA-${Math.floor(10000 + Math.random() * 90000)}`,
      name: data.name || 'Demo Farmer',
      father_spouse_name: data.father_spouse_name || 'Late Ramanna',
      dob: data.dob || '1982-05-10',
      mobile: data.mobile || '9876543210',
      aadhaar: data.aadhaar || 'XXXX-XXXX-1234',
      category: data.category || 'OBC',
      gender: data.gender || 'Male',
      district: data.district || 'Mandya',
      taluk: data.taluk || 'Pandavapura',
      hobli: data.hobli || 'Kikkeri',
      village: data.village || 'Chinya',
      bank_account: data.bank_account || '123456789012',
      ifsc: data.ifsc || 'SBIN0040182',
      is_aadhaar_seeded: true,
      is_pmkisan_eligible: true,
      parcels: data.parcels || [],
    };

    setFarmers((prev) => [newFarmer, ...prev]);
    setActiveFarmerId(newFarmer.farmer_id);
    logAudit(
      'FARMER_REGISTRATION_SUCCESS',
      'FarmerProfile',
      newFarmer.farmer_id,
      newFarmer.name,
      'FARMER',
      { newValue: `FRUITS ID: ${newFarmer.fruits_id}, FID: ${newFarmer.fid}` }
    );
    return newFarmer;
  };

  const addLandParcel = (farmerId: string, data: Partial<LandParcel>): LandParcel => {
    const newParcel: LandParcel = {
      parcel_id: `PARCEL-${Date.now().toString().slice(-4)}`,
      farmer_id: farmerId,
      survey_no: data.survey_no || '101',
      sub_survey_no: data.sub_survey_no || '1A',
      hissa_no: data.hissa_no || '1',
      village: data.village || 'Chinya',
      hobli: data.hobli || 'Kikkeri',
      taluk: data.taluk || 'Pandavapura',
      district: data.district || 'Mandya',
      area_acres: Number(data.area_acres) || 1.5,
      irrigated_area: Number(data.irrigated_area) || 1.2,
      lat: Number(data.lat) || 12.6842,
      lng: Number(data.lng) || 76.5714,
      polygon_coords: data.polygon_coords || [
        [12.6842, 76.5714],
        [12.6852, 76.5724],
        [12.6845, 76.5732],
        [12.6835, 76.5722],
      ],
      crop_type: data.crop_type || 'Paddy',
      is_forest_horticulture: false,
      ksrsac_status: 'FETCHED',
      doc_ref: 'RTC-UPLOADED-SAMPLE.pdf',
    };

    setFarmers((prev) =>
      prev.map((f) =>
        f.farmer_id === farmerId
          ? { ...f, parcels: [...f.parcels, newParcel] }
          : f
      )
    );

    logAudit(
      'LAND_PARCEL_REGISTERED',
      'LandParcel',
      newParcel.parcel_id,
      'Farmer',
      'FARMER',
      { newValue: `Survey No: ${newParcel.survey_no}/${newParcel.sub_survey_no}, Area: ${newParcel.area_acres} Acres` }
    );
    return newParcel;
  };

  const createServiceRequest = (data: Partial<ServiceRequest>): ServiceRequest => {
    const farmer = farmers.find((f) => f.farmer_id === (data.farmer_id || activeFarmerId));
    const op = schemeConfig.rate_ceilings.find((o) => o.operation_code === data.operation_code);
    
    const reqArea = Number(data.area_acres) || 1.5;
    const eligibleArea = Math.min(reqArea, schemeConfig.max_eligible_acres_per_farmer);
    const computedSubsidy = eligibleArea * schemeConfig.subsidy_rate_per_acre;

    const newReq: ServiceRequest = {
      request_id: `REQ-NY-2026-${String(requests.length + 101).padStart(4, '0')}`,
      farmer_id: farmer ? farmer.farmer_id : activeFarmerId,
      farmer_name: farmer ? farmer.name : 'Basavarajappa Gowda',
      farmer_mobile: farmer ? farmer.mobile : '9845123456',
      parcel_id: data.parcel_id || 'PARCEL-001',
      survey_no: data.survey_no || '142/2A',
      village: data.village || (farmer ? farmer.village : 'Chinya'),
      taluk: data.taluk || (farmer ? farmer.taluk : 'Pandavapura'),
      district: data.district || (farmer ? farmer.district : 'Mandya'),
      operation_code: data.operation_code || 'OP-PLOUGH',
      operation_name: op ? op.operation_name : 'Primary Ploughing (Tractor / MB Plough)',
      area_acres: reqArea,
      season: data.season || 'Kharif',
      preferred_date: data.preferred_date || new Date().toISOString().slice(0, 10),
      service_location: data.service_location || `${farmer?.village || 'Chinya'} Survey ${data.survey_no || '142/2A'}`,
      cross_district: Boolean(data.cross_district),
      status: 'Open for Assignment',
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
      eligible_area: eligibleArea,
      subsidy_rate: schemeConfig.subsidy_rate_per_acre,
      computed_subsidy_amount: computedSubsidy,
    };

    setRequests((prev) => [newReq, ...prev]);

    logAudit(
      'SERVICE_REQUEST_SUBMITTED',
      'ServiceRequest',
      newReq.request_id,
      newReq.farmer_name,
      'FARMER',
      { newValue: `Op: ${newReq.operation_name}, Area: ${newReq.area_acres} Acres, Est Subsidy: ₹${computedSubsidy}` }
    );

    addNotification({
      recipient_role: 'VENDOR',
      recipient_name: 'All Taluk Providers',
      title_en: 'New Farm Mechanization Booking Available',
      title_kn: 'ಹೊಸ ಕೃಷಿ ಯಾಂತ್ರೀಕರಣ ಬುಕಿಂಗ್ ಲಭ್ಯವಿದೆ',
      message_en: `Farmer ${newReq.farmer_name} requested ${newReq.operation_name} (${newReq.area_acres} Ac) at ${newReq.village}.`,
      message_kn: `ರೈತ ${newReq.farmer_name} ಅವರು ${newReq.village} ಗ್ರಾಮದಲ್ಲಿ ${newReq.operation_name} (${newReq.area_acres} ಎಕರೆ) ಕೋರಿದ್ದಾರೆ.`,
      type: 'INFO',
    });

    return newReq;
  };

  const rescheduleRequest = (
    requestId: string,
    newDate: string,
    reason: string,
    _otp: string,
    requestedBy: 'FARMER' | 'VENDOR'
  ): boolean => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.request_id === requestId) {
          const oldDate = r.preferred_date;
          const history = r.reschedule_history || [];
          return {
            ...r,
            preferred_date: newDate,
            reschedule_history: [
              ...history,
              {
                requested_by: requestedBy,
                old_date: oldDate,
                new_date: newDate,
                reason,
                otp_confirmed: true,
                timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
              },
            ],
          };
        }
        return r;
      })
    );

    logAudit(
      'BOOKING_RESCHEDULED_OTP_CONFIRMED',
      'ServiceRequest',
      requestId,
      requestedBy === 'FARMER' ? 'Farmer' : 'Vendor',
      requestedBy,
      { newValue: `New Date: ${newDate}, Reason: ${reason} (OTP Verified)` }
    );
    return true;
  };

  const registerVendor = (data: Partial<VendorProfile>): VendorProfile => {
    const newVendor: VendorProfile = {
      vendor_id: `VEN-KA-${String(vendors.length + 101)}`,
      fruits_id: data.fruits_id,
      pan: data.pan || 'ABCDE1234F',
      business_type: data.business_type || 'Individual',
      name: data.name || 'Mechanization Service Provider',
      mobile: data.mobile || '9876543211',
      address: data.address || 'Taluk Center, Mandya',
      district: data.district || 'Mandya',
      taluk: data.taluk || 'Pandavapura',
      service_areas: data.service_areas || ['Pandavapura', 'Krishnarajpet'],
      bank_account: data.bank_account || '987654321098',
      ifsc: data.ifsc || 'HDFC0001892',
      gst: data.gst,
      consent_accepted: true,
      status: 'Under Verification', // Requires Taluk AO approval (BR-010)
      equipment_list: data.equipment_list || [],
      rates: data.rates || [],
      rating: 5.0,
      total_ratings: 0,
    };

    setVendors((prev) => [newVendor, ...prev]);
    setActiveVendorId(newVendor.vendor_id);
    logAudit(
      'VENDOR_REGISTRATION_SUBMITTED',
      'VendorProfile',
      newVendor.vendor_id,
      newVendor.name,
      'VENDOR',
      { newValue: `Submitted for Taluk AO Verification (PAN: ${newVendor.pan})` }
    );
    return newVendor;
  };

  const addEquipment = (vendorId: string, data: Partial<Equipment>): Equipment => {
    const newEq: Equipment = {
      equipment_id: `EQ-${vendorId.slice(-3)}-${Date.now().toString().slice(-3)}`,
      vendor_id: vendorId,
      type: data.type || 'Tractor 4WD (45 HP)',
      make_model: data.make_model || 'Mahindra DI 575',
      rc_no: data.rc_no || `KA-${Math.floor(10 + Math.random() * 80)}-TR-${Math.floor(1000 + Math.random() * 9000)}`,
      hp: Number(data.hp) || 45,
      mfg_year: Number(data.mfg_year) || 2024,
      insurance_expiry: data.insurance_expiry || '2027-12-31',
      fitness_cert: data.fitness_cert || 'FIT-CERT-VALID.pdf',
      photos: data.photos || [],
      operations_served: data.operations_served || ['OP-PLOUGH', 'OP-ROTAVATE'],
      status: 'Verification Pending', // Requires AO approval (BR-012)
      is_active: true,
      ao_approved: false,
    };

    setVendors((prev) =>
      prev.map((v) =>
        v.vendor_id === vendorId
          ? { ...v, equipment_list: [...v.equipment_list, newEq] }
          : v
      )
    );

    logAudit(
      'EQUIPMENT_REGISTERED_AO_PENDING',
      'Equipment',
      newEq.equipment_id,
      'Vendor',
      'VENDOR',
      { newValue: `RC: ${newEq.rc_no}, Type: ${newEq.type} (Pending AO Approval)` }
    );
    return newEq;
  };

  const updateRates = (vendorId: string, newRates: VendorRate[]) => {
    setVendors((prev) =>
      prev.map((v) => (v.vendor_id === vendorId ? { ...v, rates: newRates } : v))
    );
    logAudit(
      'VENDOR_RATES_UPDATED',
      'VendorRate',
      vendorId,
      'Vendor',
      'VENDOR',
      { newValue: `${newRates.length} operations declared rates updated` }
    );
  };

  const acceptRequest = (requestId: string, vendorId: string, equipmentId: string): boolean => {
    const vendor = vendors.find((v) => v.vendor_id === vendorId);
    const equip = vendor?.equipment_list.find((e) => e.equipment_id === equipmentId);
    const req = requests.find((r) => r.request_id === requestId);

    if (!vendor || !req) return false;

    const opRate = vendor.rates.find((rt) => rt.operation_code === req.operation_code);
    const rateVal = opRate?.rate_per_acre || 1200;

    setRequests((prev) =>
      prev.map((r) => {
        if (r.request_id === requestId) {
          return {
            ...r,
            status: 'Accepted',
            assigned_vendor_id: vendor.vendor_id,
            assigned_vendor_name: vendor.name,
            assigned_vendor_mobile: vendor.mobile,
            assigned_equipment_id: equipmentId,
            assigned_equipment_name: `${equip?.type || 'Tractor'} (${equip?.rc_no || 'RC-NA'})`,
            declared_rate: rateVal,
            rate_type: 'per_acre',
            accepted_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
            service_fee_amount: (r.area_acres || 1.5) * rateVal,
          };
        }
        return r;
      })
    );

    logAudit(
      'SERVICE_REQUEST_ACCEPTED',
      'ServiceRequest',
      requestId,
      vendor.name,
      'VENDOR',
      { newValue: `Assigned Equipment: ${equip?.rc_no}, Rate: ₹${rateVal}/acre` }
    );

    addNotification({
      recipient_role: 'FARMER',
      recipient_name: req.farmer_name,
      title_en: 'Mechanized Service Provider Assigned',
      title_kn: 'ಸೇವಾ ಪೂರೈಕೆದಾರರನ್ನು ನಿಯೋಜಿಸಲಾಗಿದೆ',
      message_en: `${vendor.name} has accepted your booking for ${req.operation_name}.`,
      message_kn: `${vendor.name} ಅವರು ನಿಮ್ಮ ${req.operation_name} ಬುಕಿಂಗ್ ಅನ್ನು ಸ್ವೀಕರಿಸಿದ್ದಾರೆ.`,
      type: 'SUCCESS',
    });

    return true;
  };

  const vendorCheckInGps = (
    requestId: string,
    lat: number,
    lng: number
  ): { distance: number; status: 'PASS' | 'EXCEPTION_BREACH' } => {
    const req = requests.find((r) => r.request_id === requestId);
    const farmer = farmers.find((f) => f.farmer_id === req?.farmer_id);
    const parcel = farmer?.parcels.find((p) => p.parcel_id === req?.parcel_id) || farmer?.parcels[0];

    const targetLat = parcel?.lat || 12.6842;
    const targetLng = parcel?.lng || 76.5714;
    const dist = calculateDistanceMeters(lat, lng, targetLat, targetLng);
    const isPass = dist <= schemeConfig.geofence_radius_meters;
    const geofenceStatus: 'PASS' | 'EXCEPTION_BREACH' = isPass ? 'PASS' : 'EXCEPTION_BREACH';

    setRequests((prev) =>
      prev.map((r) => {
        if (r.request_id === requestId) {
          return {
            ...r,
            status: 'Check-In',
            execution: {
              work_id: `WRK-${Date.now().toString().slice(-6)}`,
              checkin_lat: lat,
              checkin_lng: lng,
              checkin_time: new Date().toISOString().replace('T', ' ').slice(0, 16),
              distance_from_farm_meters: dist,
              geofence_status: geofenceStatus,
              start_time: '',
              end_time: '',
              hours_worked: 0,
              odometer_start: 1200,
              odometer_end: 1200,
              fuel_level: 'High',
              area_covered: r.area_acres,
              device_id: 'DEV-GPS-SIM-01',
              photos: [],
            },
          };
        }
        return r;
      })
    );

    logAudit(
      'VENDOR_GPS_CHECKIN',
      'WorkExecution',
      requestId,
      req?.assigned_vendor_name || 'Vendor',
      'VENDOR',
      {
        newValue: `Lat: ${lat}, Lng: ${lng}, Distance: ${dist}m, Geofence: ${geofenceStatus}`,
        status: isPass ? 'SUCCESS' : 'BREACH_LOGGED',
      }
    );

    if (!isPass) {
      addNotification({
        recipient_role: 'TALUK_AO',
        recipient_name: 'Taluk AO',
        title_en: 'Geofence Exception Alert (Distance > 100m)',
        title_kn: 'ಜಿಯೋಫೆನ್ಸ್ ಉಲ್ಲಂಘನೆ ಎಚ್ಚರಿಕೆ (>100 ಮೀಟರ್)',
        message_en: `Request ${requestId} check-in is ${dist}m away from registered parcel. Requires Taluk review.`,
        message_kn: `ವಿನಂತಿ ${requestId} ಜಿಯೋ-ಸ್ಥಳ ನೋಂದಾಯಿತ ಜಮೀನಿನಿಂದ ${dist} ಮೀಟರ್ ದೂರದಲ್ಲಿದೆ.`,
        type: 'ALERT',
      });
    }

    return { distance: dist, status: geofenceStatus };
  };

  const startWork = (
    requestId: string,
    odometer: number,
    fuel: string,
    prePhotos: string[]
  ) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.request_id === requestId) {
          const checkinLat = r.execution?.checkin_lat || 12.6842;
          const checkinLng = r.execution?.checkin_lng || 76.5714;
          const photoItems: PhotoEvidence[] = prePhotos.map((url, i) => ({
            photo_id: `PHT-PRE-${i + 1}-${Date.now()}`,
            phase: 'BEFORE_WORK',
            url,
            lat: checkinLat,
            lng: checkinLng,
            taken_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
            device_id: 'DEV-MOB-01',
            geo_valid: true,
            farmer_otp_auth: false,
            caption: `Before-work photo ${i + 1} (Machinery & Farm field)`,
          }));

          const existingExecution = r.execution || {
            work_id: `WRK-${Date.now().toString().slice(-6)}`,
            checkin_lat: checkinLat,
            checkin_lng: checkinLng,
            checkin_time: new Date().toISOString().replace('T', ' ').slice(0, 16),
            distance_from_farm_meters: 32,
            geofence_status: 'PASS' as const,
            start_time: new Date().toISOString().replace('T', ' ').slice(0, 16),
            end_time: '',
            hours_worked: 0,
            odometer_start: odometer || 1200,
            odometer_end: odometer || 1200,
            fuel_level: fuel || 'Full',
            area_covered: r.area_acres,
            device_id: 'DEV-GPS-SIM-01',
            photos: [],
          };

          return {
            ...r,
            status: 'Work Started',
            execution: {
              ...existingExecution,
              start_time: new Date().toISOString().replace('T', ' ').slice(0, 16),
              odometer_start: odometer || 1200,
              fuel_level: fuel || 'Full',
              photos: [...existingExecution.photos, ...photoItems],
            },
          };
        }
        return r;
      })
    );

    logAudit(
      'WORK_COMMENCED',
      'WorkExecution',
      requestId,
      'Vendor',
      'VENDOR',
      { newValue: `Work started with ${prePhotos.length} pre-work geo-tagged photos` }
    );
  };

  const completeWork = (
    requestId: string,
    hoursWorked: number,
    areaCovered: number,
    odometerEnd: number,
    postPhotos: string[]
  ) => {
    const txnRef = `TXN-NY-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    setRequests((prev) =>
      prev.map((r) => {
        if (r.request_id === requestId) {
          const checkinLat = r.execution?.checkin_lat || 12.6842;
          const checkinLng = r.execution?.checkin_lng || 76.5714;
          const photoItems: PhotoEvidence[] = postPhotos.map((url, i) => ({
            photo_id: `PHT-POST-${i + 1}-${Date.now()}`,
            phase: 'AFTER_WORK',
            url,
            lat: checkinLat,
            lng: checkinLng,
            taken_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
            device_id: 'DEV-MOB-01',
            geo_valid: true,
            farmer_otp_auth: false,
            caption: `After-work completion photo ${i + 1}`,
          }));

          const actualArea = areaCovered || r.area_acres;
          const fee = actualArea * (r.declared_rate || 1200);
          const eligibleArea = Math.min(actualArea, schemeConfig.max_eligible_acres_per_farmer);
          const subAmt = eligibleArea * schemeConfig.subsidy_rate_per_acre;

          const existingExecution = r.execution || {
            work_id: `WRK-${Date.now().toString().slice(-6)}`,
            checkin_lat: checkinLat,
            checkin_lng: checkinLng,
            checkin_time: new Date().toISOString().replace('T', ' ').slice(0, 16),
            distance_from_farm_meters: 32,
            geofence_status: 'PASS' as const,
            start_time: new Date().toISOString().replace('T', ' ').slice(0, 16),
            end_time: '',
            hours_worked: hoursWorked || 3.5,
            odometer_start: 1200,
            odometer_end: odometerEnd || 1208,
            fuel_level: 'Full',
            area_covered: actualArea,
            device_id: 'DEV-GPS-SIM-01',
            photos: [],
          };

          return {
            ...r,
            status: 'Completed',
            txn_ref: txnRef,
            service_fee_amount: fee,
            eligible_area: eligibleArea,
            computed_subsidy_amount: subAmt,
            execution: {
              ...existingExecution,
              end_time: new Date().toISOString().replace('T', ' ').slice(0, 16),
              hours_worked: hoursWorked || 3.5,
              odometer_end: odometerEnd || 1208,
              area_covered: actualArea,
              photos: [...existingExecution.photos, ...photoItems],
            },
          };
        }
        return r;
      })
    );

    logAudit(
      'WORK_COMPLETED_DIGITAL_VOUCHER_GENERATED',
      'CompletionRecord',
      txnRef,
      'Vendor',
      'VENDOR',
      { newValue: `Txn Ref: ${txnRef}, Area Covered: ${areaCovered} Ac, Fee: ₹${(areaCovered || 1.5) * 1200}` }
    );

    addNotification({
      recipient_role: 'FARMER',
      recipient_name: 'Farmer',
      title_en: 'Mechanized Service Completed - Pay Fee & Authenticate Photos',
      title_kn: 'ಕೃಷಿ ಸೇವೆ ಪೂರ್ಣಗೊಂಡಿದೆ - ಶುಲ್ಕ ಪಾವತಿಸಿ ಮತ್ತು ಫೋಟೋ ದೃಢೀಕರಿಸಿ',
      message_en: `Work completed for ${requestId}. Please verify photos via OTP and confirm payment.`,
      message_kn: `ವಿನಂತಿ ${requestId} ರ ಕೆಲಸ ಪೂರ್ಣಗೊಂಡಿದೆ. ದಯವಿಟ್ಟು OTP ಮೂಲಕ ಫೋಟೋ ದೃಢೀಕರಿಸಿ.`,
      type: 'ACTION_REQUIRED',
      otp_code: '592810',
    });
  };

  const payServiceFee = (requestId: string) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.request_id === requestId) {
          return {
            ...r,
            farmer_paid_service_fee: true,
            farmer_paid_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
          };
        }
        return r;
      })
    );

    logAudit(
      'FARMER_PAID_SERVICE_FEE',
      'CompletionRecord',
      requestId,
      'Farmer',
      'FARMER',
      { newValue: 'Service fee paid directly to vendor via mobile app payment' }
    );
  };

  const authenticatePhotosOtp = (requestId: string, _otp: string): boolean => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.request_id === requestId) {
          const updatedPhotos = r.execution?.photos.map((p) => ({
            ...p,
            farmer_otp_auth: true,
          }));
          return {
            ...r,
            farmer_otp_photo_verified: true,
            execution: r.execution
              ? { ...r.execution, photos: updatedPhotos || [] }
              : undefined,
          };
        }
        return r;
      })
    );

    logAudit(
      'FARMER_PHOTO_OTP_AUTHENTICATED',
      'PhotoEvidence',
      requestId,
      'Farmer',
      'FARMER',
      { newValue: 'Pre and post-work photos authenticated via farmer OTP (BR-022)' }
    );
    return true;
  };

  const submitFarmerAcceptance = (
    requestId: string,
    action: 'APPROVE' | 'REJECT',
    rating?: number,
    review?: string,
    rejectReason?: string
  ) => {
    if (action === 'APPROVE') {
      setRequests((prev) =>
        prev.map((r) => {
          if (r.request_id === requestId) {
            return {
              ...r,
              status: 'Farmer Approved',
              farmer_rating: rating || 5,
              farmer_review: review || 'Satisfactory work delivered on time.',
              farmer_otp_photo_verified: true,
            };
          }
          return r;
        })
      );

      logAudit(
        'FARMER_APPROVED_SERVICE',
        'ServiceRequest',
        requestId,
        'Farmer',
        'FARMER',
        { newValue: `Rating: ${rating || 5}/5. Moved to Taluk AO Verification Queue.` }
      );

      addNotification({
        recipient_role: 'TALUK_AO',
        recipient_name: 'Taluk AO',
        title_en: 'New Claim Ready for Taluk AO Verification',
        title_kn: 'ತಾಲ್ಲೂಕು ಕೃಷಿ ಅಧಿಕಾರಿಗಳ ಪರಿಶೀಲನೆಗೆ ಸಿದ್ಧವಾಗಿರುವ ಕ್ಲೈಮ್',
        message_en: `Transaction for ${requestId} farmer-approved. Pending officer verification.`,
        message_kn: `ವಿನಂತಿ ${requestId} ರೈತರಿಂದ ಅನುಮೋದಿಸಲಾಗಿದೆ. ಕೃಷಿ ಅಧಿಕಾರಿಗಳ ಪರಿಶೀಲನೆ ಬಾಕಿ.`,
        type: 'ACTION_REQUIRED',
      });
    } else {
      setRequests((prev) =>
        prev.map((r) => {
          if (r.request_id === requestId) {
            return {
              ...r,
              status: 'Disputed',
            };
          }
          return r;
        })
      );

      const dsp: Dispute = {
        dispute_id: `DSP-${Date.now().toString().slice(-4)}`,
        request_id: requestId,
        txn_ref: requests.find((r) => r.request_id === requestId)?.txn_ref || 'TXN-NA',
        raised_by: 'FARMER',
        complainant_name: requests.find((r) => r.request_id === requestId)?.farmer_name || 'Farmer',
        type: 'Work Quality Issue',
        description: rejectReason || 'Farmer dissatisfied with mechanization quality / area mismatch',
        evidence_photos: [],
        status: 'Open',
        raised_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
      };
      setDisputes((prev) => [dsp, ...prev]);

      logAudit(
        'FARMER_REJECTED_DISPUTE_RAISED',
        'Dispute',
        dsp.dispute_id,
        'Farmer',
        'FARMER',
        { newValue: `Reason: ${rejectReason || 'Work quality dispute'}` }
      );
    }
  };

  const raiseDispute = (
    requestId: string,
    type: Dispute['type'],
    description: string,
    evidencePhotos?: string[]
  ) => {
    const req = requests.find((r) => r.request_id === requestId);
    const dsp: Dispute = {
      dispute_id: `DSP-${Date.now().toString().slice(-4)}`,
      request_id: requestId,
      txn_ref: req?.txn_ref || 'TXN-NA',
      raised_by: 'FARMER',
      complainant_name: req?.farmer_name || 'Farmer',
      type,
      description,
      evidence_photos: evidencePhotos || [],
      status: 'Open',
      raised_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    setDisputes((prev) => [dsp, ...prev]);
    setRequests((prev) =>
      prev.map((r) => (r.request_id === requestId ? { ...r, status: 'Disputed' } : r))
    );

    logAudit('DISPUTE_RAISED', 'Dispute', dsp.dispute_id, dsp.complainant_name, 'FARMER', {
      newValue: `Type: ${type}, Desc: ${description}`,
    });
  };

  const talukVerifyRequest = (
    requestId: string,
    action: 'APPROVED' | 'REJECTED' | 'RETURNED',
    remarks: string,
    physicalInspection: boolean,
    inspectionNotes?: string
  ) => {
    const nextStatus: ServiceRequestStatus =
      action === 'APPROVED' ? 'Taluk Approved' : action === 'REJECTED' ? 'Rejected' : 'Returned';

    setRequests((prev) =>
      prev.map((r) => {
        if (r.request_id === requestId) {
          return {
            ...r,
            status: nextStatus,
            taluk_ao_approval: {
              status: action,
              officer_name: 'Dr. Siddalingaiah (Taluk AO)',
              date: new Date().toISOString().replace('T', ' ').slice(0, 16),
              remarks: remarks || 'Verified GPS track, photo evidence and land records.',
              physical_inspection_done: physicalInspection,
              inspection_notes: inspectionNotes,
            },
          };
        }
        return r;
      })
    );

    logAudit(
      `TALUK_AO_${action}`,
      'ServiceRequest',
      requestId,
      'Taluk AO',
      'TALUK_AO',
      { newValue: `Decision: ${action}, Remarks: ${remarks}, Physical Inspection: ${physicalInspection}` }
    );

    if (action === 'APPROVED') {
      addNotification({
        recipient_role: 'DISTRICT_OFFICER',
        recipient_name: 'District Agri Officer',
        title_en: 'Subsidy Batch Ready for District Sanction',
        title_kn: 'ಜಿಲ್ಲಾ ಅನುಮೋದನೆಗೆ ಸಿದ್ಧವಾಗಿರುವ ಸಬ್ಸಿಡಿ ಅರ್ಜಿ',
        message_en: `Request ${requestId} approved by Taluk AO. Pending District budget clearance.`,
        message_kn: `ವಿನಂತಿ ${requestId} ತಾಲ್ಲೂಕು ಕೃಷಿ ಅಧಿಕಾರಿಯಿಂದ ಅನುಮೋದಿಸಲಾಗಿದೆ.`,
        type: 'ACTION_REQUIRED',
      });
    }
  };

  const talukApproveVendor = (
    vendorId: string,
    action: 'Approved' | 'Rejected' | 'Returned for Correction',
    remarks: string
  ) => {
    setVendors((prev) =>
      prev.map((v) => {
        if (v.vendor_id === vendorId) {
          return {
            ...v,
            status: action,
            ao_approver_name: 'Taluk AO',
            ao_remarks: remarks || 'Documents & RC verified.',
            approved_on: new Date().toISOString().slice(0, 10),
          };
        }
        return v;
      })
    );

    logAudit(
      `TALUK_AO_VENDOR_${action.toUpperCase()}`,
      'VendorProfile',
      vendorId,
      'Taluk AO',
      'TALUK_AO',
      { newValue: `Status: ${action}, Remarks: ${remarks}` }
    );
  };

  const talukApproveEquipment = (
    vendorId: string,
    equipmentId: string,
    approve: boolean
  ) => {
    setVendors((prev) =>
      prev.map((v) => {
        if (v.vendor_id === vendorId) {
          return {
            ...v,
            equipment_list: v.equipment_list.map((e) =>
              e.equipment_id === equipmentId
                ? {
                    ...e,
                    ao_approved: approve,
                    status: approve ? 'Approved' : 'Suspended',
                  }
                : e
            ),
          };
        }
        return v;
      })
    );

    logAudit(
      approve ? 'TALUK_AO_EQUIPMENT_APPROVED' : 'TALUK_AO_EQUIPMENT_REJECTED',
      'Equipment',
      equipmentId,
      'Taluk AO',
      'TALUK_AO',
      { newValue: `AO Approval: ${approve}` }
    );
  };

  const districtApproveRequest = (
    requestId: string,
    action: 'APPROVED' | 'REJECTED' | 'RETURNED',
    remarks: string
  ) => {
    const nextStatus: ServiceRequestStatus =
      action === 'APPROVED' ? 'District Approved' : action === 'REJECTED' ? 'Rejected' : 'Returned';

    setRequests((prev) =>
      prev.map((r) => {
        if (r.request_id === requestId) {
          return {
            ...r,
            status: nextStatus,
            district_approval: {
              status: action,
              officer_name: 'Joint Director of Agriculture (District)',
              date: new Date().toISOString().replace('T', ' ').slice(0, 16),
              remarks: remarks || 'Sanctioned under Chief Minister Negila Yogi Scheme FY 26-27.',
              budget_allocated_check: true,
            },
          };
        }
        return r;
      })
    );

    logAudit(
      `DISTRICT_OFFICER_${action}`,
      'ServiceRequest',
      requestId,
      'District Officer',
      'DISTRICT_OFFICER',
      { newValue: `Decision: ${action}, Remarks: ${remarks}` }
    );

    if (action === 'APPROVED') {
      addNotification({
        recipient_role: 'FINANCE_OFFICER',
        recipient_name: 'Finance Desk',
        title_en: 'Subsidy Ready for DBT Transmission',
        title_kn: 'ಡಿಬಿಟಿ ಪಾವತಿಗೆ ಸಿದ್ಧವಾಗಿರುವ ಸಬ್ಸಿಡಿ',
        message_en: `Request ${requestId} approved by District Officer. Ready for FRUITS DBT batch generation.`,
        message_kn: `ವಿನಂತಿ ${requestId} ಜಿಲ್ಲಾ ಅಧಿಕಾರಿಯಿಂದ ಅನುಮೋದನೆ ಪಡೆದಿದೆ.`,
        type: 'ACTION_REQUIRED',
      });
    }
  };

  const resolveDispute = (
    disputeId: string,
    decision: 'Resolved (Uphold)' | 'Resolved (Partial)' | 'Resolved (Rejected)',
    actionTaken: string
  ) => {
    setDisputes((prev) =>
      prev.map((d) => {
        if (d.dispute_id === disputeId) {
          return {
            ...d,
            status: decision,
            officer_decision: decision,
            action_taken: actionTaken,
            decided_by: 'Taluk AO / Grievance Officer',
            decided_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
          };
        }
        return d;
      })
    );

    logAudit(
      'DISPUTE_RESOLVED',
      'Dispute',
      disputeId,
      'Taluk AO',
      'TALUK_AO',
      { newValue: `Decision: ${decision}, Action: ${actionTaken}` }
    );
  };

  const processDbtPaymentBatch = (requestIds: string[]) => {
    const batchId = `DBT-BATCH-KA-${Date.now().toString().slice(-6)}`;

    setRequests((prev) =>
      prev.map((r) => {
        if (requestIds.includes(r.request_id)) {
          const subAmt = r.computed_subsidy_amount || 1000;
          return {
            ...r,
            status: 'Paid',
            payment: {
              payment_id: `PAY-${Date.now().toString().slice(-6)}`,
              batch_id: batchId,
              amount: subAmt,
              channel: 'FRUITS_DBT',
              channel_ref: `PFMS-DBT-KA26-${Math.floor(100000 + Math.random() * 900000)}`,
              status: 'Paid',
              paid_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
              receipt_no: `RCPT-NY-2026-${Math.floor(10000 + Math.random() * 90000)}`,
            },
          };
        }
        return r;
      })
    );

    logAudit(
      'DBT_SUBSIDY_PAYMENT_DISBURSED',
      'Payment',
      batchId,
      'Finance Officer',
      'FINANCE_OFFICER',
      { newValue: `Batch ${batchId}: Disbursed ₹${requestIds.length * 1000} to Aadhaar-seeded accounts via FRUITS DBT (BR-026)` }
    );

    addNotification({
      recipient_role: 'FARMER',
      recipient_name: 'Beneficiary Farmers',
      title_en: 'Negila Yogi Subsidy Disbursed by DBT',
      title_kn: 'ನೇಗಿಲ ಯೋಗಿ ಸಬ್ಸಿಡಿ ಡಿಬಿಟಿ ಮೂಲಕ ಜಮೆಯಾಗಿದೆ',
      message_en: 'Subsidy has been credited to your Aadhaar-seeded bank account via FRUITS DBT.',
      message_kn: 'ನಿಮ್ಮ ಆಧಾರ್ ಜೋಡಿತ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ನೇಗಿಲ ಯೋಗಿ ಸಬ್ಸಿಡಿ ಜಮೆಯಾಗಿದೆ.',
      type: 'SUCCESS',
    });
  };

  const reversePayment = (requestId: string, reason: string) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.request_id === requestId && r.payment) {
          return {
            ...r,
            payment: {
              ...r.payment,
              status: 'Reversed',
              reversal_reason: reason,
            },
          };
        }
        return r;
      })
    );

    logAudit(
      'PAYMENT_REVERSED',
      'Payment',
      requestId,
      'Finance Officer',
      'FINANCE_OFFICER',
      { newValue: `Payment reversed. Reason: ${reason}` }
    );
  };

  const clearTransactionData = () => {
    setRequests([]);
    setDisputes([]);
    setAuditLogs([]);
    setNotifications([]);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            ...parsed,
            requests: [],
            disputes: [],
            auditLogs: [],
            notifications: [],
          })
        );
      }
    } catch {
      // ignore
    }
  };

  const resetDemoData = () => {
    setFarmers(INITIAL_FARMERS);
    setVendors(INITIAL_VENDORS);
    setRequests([]);
    setDisputes([]);
    setAuditLogs([]);
    setSchemeConfig(INITIAL_SCHEME_CONFIG);
    setNotifications([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        lang,
        setLang,
        viewMode,
        setViewMode,
        activeFarmerId,
        setActiveFarmerId,
        activeVendorId,
        setActiveVendorId,
        schemeConfig,
        updateSchemeConfig,
        farmers,
        vendors,
        requests,
        disputes,
        auditLogs,
        notifications,
        registerFarmer,
        addLandParcel,
        createServiceRequest,
        rescheduleRequest,
        payServiceFee,
        authenticatePhotosOtp,
        submitFarmerAcceptance,
        raiseDispute,
        registerVendor,
        addEquipment,
        updateRates,
        acceptRequest,
        vendorCheckInGps,
        startWork,
        completeWork,
        talukVerifyRequest,
        talukApproveVendor,
        talukApproveEquipment,
        districtApproveRequest,
        resolveDispute,
        processDbtPaymentBatch,
        reversePayment,
        getFarmerEligibility,
        addNotification,
        markNotificationRead,
        clearTransactionData,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
