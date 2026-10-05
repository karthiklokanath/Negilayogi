/**
 * MASMS - Chief Minister Negila Yogi Scheme
 * Core Types and Interfaces based on FRS v1.0 (05-10-2026)
 */

export type UserRole =
  | 'FARMER'
  | 'VENDOR'
  | 'TALUK_AO'
  | 'DISTRICT_OFFICER'
  | 'FINANCE_OFFICER'
  | 'STATE_ADMIN'
  | 'SYSTEM_ADMIN';

export type Language = 'EN' | 'KN';

export type ServiceRequestStatus =
  | 'Draft'
  | 'Submitted'
  | 'Verified'
  | 'Open for Assignment'
  | 'Accepted'
  | 'Check-In'
  | 'Work Started'
  | 'Completed'
  | 'Farmer Approved'
  | 'Taluk Approved'
  | 'District Approved'
  | 'Payment Initiated'
  | 'Paid'
  | 'Closed'
  | 'Disputed'
  | 'Rejected'
  | 'Returned';

export type VendorStatus =
  | 'Draft'
  | 'Submitted'
  | 'Under Verification'
  | 'Approved'
  | 'Rejected'
  | 'Returned for Correction';

export type EquipmentStatus = 'Approved' | 'Verification Pending' | 'Suspended' | 'Retired' | 'Under Maintenance';

export type PaymentStatus =
  | 'Initiated'
  | 'Batch Created'
  | 'Bank Processed'
  | 'Paid'
  | 'Failed'
  | 'Reversed';

export type DisputeStatus = 'Open' | 'Under Investigation' | 'Resolved (Uphold)' | 'Resolved (Partial)' | 'Resolved (Rejected)';

export interface LandParcel {
  parcel_id: string;
  farmer_id: string;
  survey_no: string;
  sub_survey_no: string;
  hissa_no: string;
  village: string;
  hobli: string;
  taluk: string;
  district: string;
  area_acres: number;
  irrigated_area: number;
  lat: number;
  lng: number;
  polygon_coords: [number, number][];
  crop_type: string;
  is_forest_horticulture: boolean;
  doc_ref?: string;
  ksrsac_status: 'FETCHED' | 'MANUAL_OFFICER_APPROVED' | 'PENDING';
}

export interface FarmerProfile {
  farmer_id: string;
  fruits_id: string;
  fid: string; // Kutumba Family ID
  name: string;
  father_spouse_name: string;
  dob: string;
  mobile: string;
  aadhaar: string;
  category: 'General' | 'OBC' | 'SC' | 'ST';
  gender: 'Male' | 'Female' | 'Other';
  district: string;
  taluk: string;
  hobli: string;
  village: string;
  bank_account: string;
  ifsc: string;
  is_aadhaar_seeded: boolean;
  is_pmkisan_eligible: boolean;
  parcels: LandParcel[];
}

export interface Equipment {
  equipment_id: string;
  vendor_id: string;
  type: string; // Tractor 4WD, Tractor 2WD, Power Tiller, Rotavator, Seed Drill, Harvester, Power Sprayer
  make_model: string;
  rc_no: string;
  hp: number;
  mfg_year: number;
  insurance_expiry: string;
  fitness_cert: string;
  photos: string[];
  operations_served: string[];
  status: EquipmentStatus;
  is_active: boolean;
  ao_approved: boolean;
}

export interface VendorRate {
  rate_id: string;
  equipment_id: string;
  operation_code: string;
  rate_per_hour: number;
  rate_per_acre: number;
}

export interface VendorProfile {
  vendor_id: string;
  fruits_id?: string;
  pan: string;
  business_type: 'Individual' | 'Partner' | 'Firm';
  name: string;
  mobile: string;
  address: string;
  district: string;
  taluk: string;
  service_areas: string[]; // Taluks or Hoblis served
  bank_account: string;
  ifsc: string;
  gst?: string;
  consent_accepted: boolean;
  status: VendorStatus;
  ao_approver_name?: string;
  ao_remarks?: string;
  approved_on?: string;
  equipment_list: Equipment[];
  rates: VendorRate[];
  rating: number; // 1-5
  total_ratings: number;
}

export interface PhotoEvidence {
  photo_id: string;
  phase: 'BEFORE_WORK' | 'DURING_WORK' | 'AFTER_WORK';
  url: string;
  lat: number;
  lng: number;
  taken_at: string;
  device_id: string;
  geo_valid: boolean;
  farmer_otp_auth: boolean;
  caption: string;
}

export interface WorkExecution {
  work_id: string;
  checkin_lat: number;
  checkin_lng: number;
  checkin_time: string;
  distance_from_farm_meters: number;
  geofence_status: 'PASS' | 'EXCEPTION_BREACH';
  start_time: string;
  end_time: string;
  hours_worked: number;
  odometer_start: number;
  odometer_end: number;
  fuel_level: string;
  area_covered: number;
  device_id: string;
  photos: PhotoEvidence[];
}

export interface ServiceRequest {
  request_id: string; // e.g. REQ-NY-2026-0042
  farmer_id: string;
  farmer_name: string;
  farmer_mobile: string;
  parcel_id: string;
  survey_no: string;
  village: string;
  taluk: string;
  district: string;
  operation_code: string;
  operation_name: string;
  area_acres: number;
  season: 'Kharif' | 'Rabi' | 'Summer';
  preferred_date: string;
  service_location: string;
  cross_district: boolean;
  status: ServiceRequestStatus;
  created_at: string;
  
  // Assignment & Vendor details
  assigned_vendor_id?: string;
  assigned_vendor_name?: string;
  assigned_vendor_mobile?: string;
  assigned_equipment_id?: string;
  assigned_equipment_name?: string;
  declared_rate?: number;
  rate_type?: 'per_acre' | 'per_hour';
  accepted_at?: string;

  // Reschedule
  reschedule_history?: {
    requested_by: 'FARMER' | 'VENDOR';
    old_date: string;
    new_date: string;
    reason: string;
    otp_confirmed: boolean;
    timestamp: string;
  }[];

  // Execution
  execution?: WorkExecution;

  // Completion & Voucher
  txn_ref?: string; // TXN-NY-2026-8812
  service_fee_amount?: number;
  farmer_paid_service_fee?: boolean;
  farmer_paid_at?: string;
  farmer_rating?: number;
  farmer_review?: string;
  farmer_otp_photo_verified?: boolean;

  // Subsidy Computation
  eligible_area?: number;
  subsidy_rate?: number; // Rs. 500
  computed_subsidy_amount?: number; // min(area, 3.0) * 500

  // Approvals
  taluk_ao_approval?: {
    status: 'APPROVED' | 'REJECTED' | 'RETURNED';
    officer_name: string;
    date: string;
    remarks: string;
    physical_inspection_done: boolean;
    inspection_notes?: string;
  };
  district_approval?: {
    status: 'APPROVED' | 'REJECTED' | 'RETURNED';
    officer_name: string;
    date: string;
    remarks: string;
    budget_allocated_check: boolean;
  };

  // Payment
  payment?: {
    payment_id: string;
    batch_id: string;
    amount: number;
    channel: 'FRUITS_DBT' | 'PFMS_DIRECT';
    channel_ref: string;
    status: PaymentStatus;
    paid_at?: string;
    receipt_no?: string;
    reversal_reason?: string;
  };
}

export interface Dispute {
  dispute_id: string;
  request_id: string;
  txn_ref: string;
  raised_by: 'FARMER' | 'VENDOR';
  complainant_name: string;
  type: 'Work Quality Issue' | 'Area Mismatch' | 'Wrong Operation' | 'Incomplete Service' | 'Payment Issue';
  description: string;
  evidence_photos: string[];
  status: DisputeStatus;
  raised_at: string;
  officer_decision?: string;
  decided_by?: string;
  decided_at?: string;
  action_taken?: string;
}

export interface SchemeConfig {
  scheme_name: string;
  scheme_kannada: string;
  financial_year: string;
  subsidy_rate_per_acre: number; // default Rs. 500
  max_eligible_acres_per_farmer: number; // default 3.0
  max_operations_per_year: number; // default 3
  geofence_radius_meters: number; // default 100m
  matching_weights: {
    distance: number; // 30%
    availability: number; // 25%
    equipment_match: number; // 25%
    rating: number; // 20%
  };
  sla_targets: {
    request_acceptance_hours: number; // 24h
    taluk_verification_days: number; // 3 days
    district_approval_days: number; // 2 days
    dbt_payment_days: number; // 7 days
    dispute_resolution_days: number; // 5 days
  };
  rate_ceilings: {
    operation_code: string;
    operation_name: string;
    operation_name_kn: string;
    max_rate_per_acre: number;
    max_rate_per_hour: number;
    unit_type: 'Per Acre' | 'Per Hour';
  }[];
}

export interface AuditEntry {
  audit_id: string;
  timestamp: string;
  event_type: string;
  entity: string;
  entity_id: string;
  actor_name: string;
  actor_role: UserRole;
  old_value?: string;
  new_value?: string;
  gps_coords?: string;
  ip_address: string;
  device_info: string;
  status: 'SUCCESS' | 'WARNING' | 'BREACH_LOGGED';
}

export interface NotificationItem {
  id: string;
  recipient_role: UserRole;
  recipient_name: string;
  title_en: string;
  title_kn: string;
  message_en: string;
  message_kn: string;
  type: 'INFO' | 'ACTION_REQUIRED' | 'OTP' | 'SUCCESS' | 'ALERT';
  timestamp: string;
  read: boolean;
  otp_code?: string;
}
