/**
 * MASMS Bilingual Dictionary (English & Kannada)
 * Official Karnataka Government terminology
 */

export const t = {
  EN: {
    govt_title: 'Government of Karnataka',
    dept_title: 'Department of Agriculture',
    scheme_title: 'Chief Minister Negila Yogi Scheme',
    scheme_sub: 'Mechanized Agricultural Activities Incentive Scheme (Badavaru Bandhu)',
    system_name: 'MASMS — Machinery as a Service Management System',
    
    // Roles
    role_farmer: 'Requesting Farmer',
    role_vendor: 'Service Provider / Vendor',
    role_taluk_ao: 'Taluk Agriculture Officer (AO)',
    role_district_officer: 'District Officer / JDA',
    role_finance_officer: 'Finance / DBT Desk',
    role_state_admin: 'State Administrator',
    role_system_admin: 'System & Audit Console',
    role_mis: 'MIS & Analytics',

    // Global Notice for Demo
    demo_notice: 'Demo Mode Active: All mandatory fields are made non-mandatory for seamless testing. Production mandatory fields are marked with (*).',
    quick_fill_btn: '⚡ Auto-Fill Demo Data',

    // Farmer
    farmer_dashboard: 'Farmer Dashboard',
    eligibility_widget_title: 'Real-Time Scheme Eligibility (FRUITS & KUTUMBA)',
    subsidy_rate_info: 'Subsidy: ₹500 / Acre per operation (Max 3.0 Acres & 3 Operations/FY)',
    remaining_acres: 'Remaining Eligible Acres',
    remaining_ops: 'Remaining Operations',
    active_bookings: 'Active Mechanized Services',
    new_request_btn: '+ New Mechanized Operation Request',
    register_parcel_btn: '+ Register Land Parcel (GIS)',
    digital_vouchers: 'Digital Vouchers & DBT Receipts',
    
    // 6-Step Wizard
    step_1: '1. Select Land Parcel',
    step_2: '2. Select Operation',
    step_3: '3. Area & Crop Details',
    step_4: '4. Season Selection',
    step_5: '5. Preferred Date & Location',
    step_6: '6. Review & Eligibility Check',

    // Vendor
    vendor_dashboard: 'Service Provider / Machinery Owner Portal',
    register_machinery_btn: '+ Register New Machinery',
    declare_rates_btn: 'Declare Service Rates',
    available_jobs: 'Available Service Bookings',
    active_job_execution: 'Live Work Execution Console',
    gps_checkin: 'GPS Check-In (100m Geofence)',
    photo_evidence_upload: 'Pre & Post Geo-Tagged Photographs',
    mark_completion: 'Mark Task Completed & Generate Digital Voucher',

    // Officer
    verification_queue: 'Taluk AO Verification Queue',
    vendor_approval_queue: 'Vendor Registration Approvals',
    district_approval_queue: 'District Scheme Sanction Queue',
    dbt_batch_queue: 'FRUITS Direct Benefit Transfer (DBT) Payments',
    audit_trail: 'Event Audit Trail & Traceability',

    // Common actions
    approve: 'Approve',
    reject: 'Reject',
    return_correction: 'Return for Correction',
    submit: 'Submit',
    cancel: 'Cancel',
    download: 'Download Receipt',
    view_details: 'View Details',
    status: 'Status',
    date: 'Date',
    action: 'Action',
  },
  KN: {
    govt_title: 'ಕರ್ನಾಟಕ ಸರ್ಕಾರ',
    dept_title: 'ಕೃಷಿ ಇಲಾಖೆ',
    scheme_title: 'ಮುಖ್ಯಮಂತ್ರಿ ನೇಗಿಲ ಯೋಗಿ ಯೋಜನೆ',
    scheme_sub: 'ಯಾಂತ್ರೀಕೃತ ಕೃಷಿ ಚಟುವಟಿಕೆಗಳ ಪ್ರೋತ್ಸಾಹಧನ ಯೋಜನೆ (ಬಡವರ ಬಂಧು)',
    system_name: 'MASMS — ಕೃಷಿ ಯಂತ್ರೋಪಕರಣ ಸೇವಾ ನಿರ್ವಹಣಾ ವ್ಯವಸ್ಥೆ',

    // Roles
    role_farmer: 'ಫಲಾನುಭವಿ ರೈತರು',
    role_vendor: 'ಸೇವಾ ಪೂರೈಕೆದಾರರು / ಯಂತ್ರ ಮಾಲೀಕರು',
    role_taluk_ao: 'ತಾಲ್ಲೂಕು ಕೃಷಿ ಅಧಿಕಾರಿ (AO)',
    role_district_officer: 'ಜಿಲ್ಲಾ ಅಧಿಕಾರಿ / ಜಂಟಿ ಕೃಷಿ ನಿರ್ದೇಶಕರು',
    role_finance_officer: 'ಹಣಕಾಸು / ಡಿಬಿಟಿ ಶಾಖೆ',
    role_state_admin: 'ರಾಜ್ಯ ಆಡಳಿತಾಧಿಕಾರಿ',
    role_system_admin: 'ಆಡಿಟ್ ಮತ್ತು ಸಿಸ್ಟಮ್ ಕನ್ಸೋಲ್',
    role_mis: 'ವರದಿಗಳು ಮತ್ತು ಅಂಕಿಅಂಶ',

    // Global Notice for Demo
    demo_notice: 'ಡೆಮೊ ಮೋಡ್: ಎಲ್ಲಾ ಕಡ್ಡಾಯ ಕ್ಷೇತ್ರಗಳನ್ನು ಐಚ್ಛಿಕವಾಗಿ ಇರಿಸಲಾಗಿದೆ. ಉತ್ಪಾದನಾ ಹಂತದ ಕಡ್ಡಾಯ ಕ್ಷೇತ್ರಗಳನ್ನು (*) ಎಂದು ಗುರುತಿಸಲಾಗಿದೆ.',
    quick_fill_btn: '⚡ ಡೆಮೊ ಮಾಹಿತಿ ಭರ್ತಿ ಮಾಡಿ',

    // Farmer
    farmer_dashboard: 'ರೈತರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    eligibility_widget_title: 'ನೈಜ ಸಮಯದ ಯೋಜನೆ ಅರ್ಹತೆ (ಫ್ರೂಟ್ಸ್ ಮತ್ತು ಕುಟುಂಬ)',
    subsidy_rate_info: 'ಪ್ರೋತ್ಸಾಹಧನ: ₹500/ಎಕರೆಗೆ (ಗರಿಷ್ಠ 3.0 ಎಕರೆ ಮತ್ತು 3 ಕಾರ್ಯಾಚರಣೆಗಳು)',
    remaining_acres: 'ಬಾಕಿ ಉಳಿದ ಅರ್ಹ ಎಕರೆ',
    remaining_ops: 'ಬಾಕಿ ಉಳಿದ ಕಾರ್ಯಾಚರಣೆಗಳು',
    active_bookings: 'ಸಕ್ರಿಯ ಯಾಂತ್ರೀಕೃತ ಸೇವೆಗಳು',
    new_request_btn: '+ ಹೊಸ ಕೃಷಿ ಕಾರ್ಯಾಚರಣೆ ವಿನಂತಿ',
    register_parcel_btn: '+ ಜಮೀನು ನೋಂದಣಿ (GIS)',
    digital_vouchers: 'ಡಿಜಿಟಲ್ ವೋಚರ್ & ಡಿಬಿಟಿ ರಶೀದಿಗಳು',

    // 6-Step Wizard
    step_1: '1. ಜಮೀನು ಆಯ್ಕೆಮಾಡಿ',
    step_2: '2. ಕಾರ್ಯಾಚರಣೆ ಆಯ್ಕೆಮಾಡಿ',
    step_3: '3. ವಿಸ್ತೀರ್ಣ ಮತ್ತು ಬೆಳೆ ವಿವರ',
    step_4: '4. ಹಂಗಾಮು ಆಯ್ಕೆ',
    step_5: '5. ದಿನಾಂಕ ಮತ್ತು ಸ್ಥಳ',
    step_6: '6. ಪರಿಶೀಲನೆ ಮತ್ತು ಸಲ್ಲಿಕೆ',

    // Vendor
    vendor_dashboard: 'ಸೇವಾ ಪೂರೈಕೆದಾರರ ಪೋರ್ಟಲ್',
    register_machinery_btn: '+ ಹೊಸ ಯಂತ್ರ ನೋಂದಾಯಿಸಿ',
    declare_rates_btn: 'ದರ ಘೋಷಣೆ',
    available_jobs: 'ಲಭ್ಯವಿರುವ ಕೆಲಸಗಳು',
    active_job_execution: 'ಕೆಲಸ ನಿರ್ವಹಣಾ ಕನ್ಸೋಲ್',
    gps_checkin: 'GPS ಚೆಕ್-ಇನ್ (100 ಮೀ ಜಿಯೋಫೆನ್ಸ್)',
    photo_evidence_upload: 'ಜಿಯೋ-ಟ್ಯಾಗ್ ಮಾಡಿದ ಫೋಟೋಗಳು',
    mark_completion: 'ಕೆಲಸ ಪೂರ್ಣಗೊಳಿಸಿ & ವೋಚರ್ ರಚಿಸಿ',

    // Officer
    verification_queue: 'ತಾಲ್ಲೂಕು ಕೃಷಿ ಅಧಿಕಾರಿಗಳ ಪರಿಶೀಲನಾ ಪಟ್ಟಿ',
    vendor_approval_queue: 'ವೆಂಡರ್ ನೋಂದಣಿ ಅನುಮೋದನೆಗಳು',
    district_approval_queue: 'ಜಿಲ್ಲಾ ಮಟ್ಟದ ಮಂಜೂರಾತಿ ಪಟ್ಟಿ',
    dbt_batch_queue: 'ಫ್ರೂಟ್ಸ್ ಡಿಬಿಟಿ ಪಾವತಿ ಬ್ಯಾಚ್‌ಗಳು',
    audit_trail: 'ಆಡಿಟ್ ಲಾಗ್ ಮತ್ತು ಟ್ರ್ಯಾಕಿಂಗ್',

    // Common actions
    approve: 'ಅನುಮೋದಿಸಿ',
    reject: 'ತಿರಸ್ಕರಿಸಿ',
    return_correction: 'ತಿದ್ದುಪಡಿಗೆ ಹಿಂತಿರುಗಿಸಿ',
    submit: 'ಸಲ್ಲಿಸಿ',
    cancel: 'ರದ್ದುಗೊಳಿಸಿ',
    download: 'ರಶೀದಿ ಡೌನ್‌ಲೋಡ್',
    view_details: 'ವಿವರ ವೀಕ್ಷಿಸಿ',
    status: 'ಸ್ಥಿತಿ',
    date: 'ದಿನಾಂಕ',
    action: 'ಕ್ರಮ',
  },
};
