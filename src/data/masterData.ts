/**
 * MASMS Master Data Repository
 * Comprehensive Master Data for Karnataka Department of Agriculture
 */

export interface DistrictMaster {
  district_id: string;
  name: string;
  name_kn: string;
  taluks: {
    taluk_id: string;
    name: string;
    name_kn: string;
    hoblis: {
      hobli_id: string;
      name: string;
      name_kn: string;
      villages: string[];
    }[];
  }[];
}

export const KARNATAKA_DISTRICTS_MASTER: DistrictMaster[] = [
  {
    district_id: 'DIST-MDY',
    name: 'Mandya',
    name_kn: 'ಮಂಡ್ಯ',
    taluks: [
      {
        taluk_id: 'TAL-MDY-PAN',
        name: 'Pandavapura',
        name_kn: 'ಪಾಂಡವಪುರ',
        hoblis: [
          {
            hobli_id: 'HOB-PAN-KIK',
            name: 'Kikkeri',
            name_kn: 'ಕಿಕ್ಕೇರಿ',
            villages: ['Chinya', 'Kikkeri', 'Ganjigere', 'Maringere', 'Kyathanahalli', 'Haralahalli'],
          },
          {
            hobli_id: 'HOB-PAN-MEL',
            name: 'Melukote',
            name_kn: 'ಮೇಲುಕೋಟೆ',
            villages: ['Jakkanahalli', 'Melukote', 'Narayana Samudra', 'Shambhunathapura', 'Amruthi'],
          },
          {
            hobli_id: 'HOB-PAN-KAS',
            name: 'Kasaba',
            name_kn: 'ಕಸಬಾ',
            villages: ['Pandavapura Rural', 'Bannangadi', 'Harohalli', 'Channangehalli'],
          },
          {
            hobli_id: 'HOB-PAN-CHK',
            name: 'Chinakurali',
            name_kn: 'ಚಿನಕುರಳಿ',
            villages: ['Chinakurali', 'Gummanahalli', 'Kallihalli', 'Doddabyadarahalli'],
          },
        ],
      },
      {
        taluk_id: 'TAL-MDY-SRP',
        name: 'Srirangapatna',
        name_kn: 'ಶ್ರೀರಂಗಪಟ್ಟಣ',
        hoblis: [
          {
            hobli_id: 'HOB-SRP-ARA',
            name: 'Arakere',
            name_kn: 'ಅರಕೆರೆ',
            villages: ['Arakere', 'Tadagavadi', 'Mandagere', 'Kodiyala'],
          },
          {
            hobli_id: 'HOB-SRP-KAS',
            name: 'Kasaba',
            name_kn: 'ಕಸಬಾ',
            villages: ['Pashchimavahini', 'Ganjam', 'Mahadevapura', 'Balamuri'],
          },
          {
            hobli_id: 'HOB-SRP-KSH',
            name: 'K. Shettihalli',
            name_kn: 'ಕೆ. ಶೆಟ್ಟಿಹಳ್ಳಿ',
            villages: ['Shettihalli', 'Palahalli', 'Hosa Anandur', 'Belagola'],
          },
        ],
      },
      {
        taluk_id: 'TAL-MDY-KRP',
        name: 'Krishnarajpet (K.R. Pet)',
        name_kn: 'ಕೃಷ್ಣರಾಜಪೇಟೆ',
        hoblis: [
          {
            hobli_id: 'HOB-KRP-BOO',
            name: 'Bookanakere',
            name_kn: 'ಬೂಕನಕೆರೆ',
            villages: ['Bookanakere', 'Mandaralli', 'Singanakuppe', 'Kattekyathanahalli'],
          },
          {
            hobli_id: 'HOB-KRP-SAN',
            name: 'Santhebachahalli',
            name_kn: 'ಸಂತೆಬಾಚಹಳ್ಳಿ',
            villages: ['Santhebachahalli', 'Sindhuvalli', 'Agrahara Bachahalli'],
          },
          {
            hobli_id: 'HOB-KRP-SEE',
            name: 'Seelanere',
            name_kn: 'ಶೀಲನೆರೆ',
            villages: ['Seelanere', 'Bommenahalli', 'Aghalaya', 'Chikanayakanahalli'],
          },
        ],
      },
      {
        taluk_id: 'TAL-MDY-MAN',
        name: 'Mandya',
        name_kn: 'ಮಂಡ್ಯ',
        hoblis: [
          {
            hobli_id: 'HOB-MAN-KER',
            name: 'Keragodu',
            name_kn: 'ಕೆರೆಗೋಡು',
            villages: ['Keragodu', 'Holalu', 'Kothathi', 'Bevinahalli'],
          },
          {
            hobli_id: 'HOB-MAN-DUD',
            name: 'Dudda',
            name_kn: 'ದುದ್ದ',
            villages: ['Dudda', 'Shivalli', 'Guthalu', 'Induvalu'],
          },
        ],
      },
      {
        taluk_id: 'TAL-MDY-MAD',
        name: 'Maddur',
        name_kn: 'ಮದ್ದೂರು',
        hoblis: [
          {
            hobli_id: 'HOB-MAD-KOP',
            name: 'Koppa',
            name_kn: 'ಕೊಪ್ಪ',
            villages: ['Koppa', 'Besagarahalli', 'Nidaghatta', 'Kestur'],
          },
        ],
      },
    ],
  },
  {
    district_id: 'DIST-MYS',
    name: 'Mysuru',
    name_kn: 'ಮೈಸೂರು',
    taluks: [
      {
        taluk_id: 'TAL-MYS-HUN',
        name: 'Hunsur',
        name_kn: 'ಹುಣಸೂರು',
        hoblis: [
          {
            hobli_id: 'HOB-HUN-BIL',
            name: 'Bilikere',
            name_kn: 'ಬಿಳಿಕೆರೆ',
            villages: ['Dharmapura', 'Bilikere', 'Doddahunsur', 'Channasoge', 'Rathehalli'],
          },
          {
            hobli_id: 'HOB-HUN-HAN',
            name: 'Hanagod',
            name_kn: 'ಹನಗೋಡು',
            villages: ['Hanagod', 'Manuganahalli', 'Hosur', 'Mullur'],
          },
          {
            hobli_id: 'HOB-HUN-KAS',
            name: 'Kasaba',
            name_kn: 'ಕಸಬಾ',
            villages: ['Hunsur Rural', 'Kirangur', 'Uddur', 'Harve'],
          },
        ],
      },
      {
        taluk_id: 'TAL-MYS-PIR',
        name: 'Piriyapatna',
        name_kn: 'ಪಿರಿಯಾಪಟ್ಟಣ',
        hoblis: [
          {
            hobli_id: 'HOB-PIR-BYL',
            name: 'Bylakuppe',
            name_kn: 'ಬೈಲಕುಪ್ಪೆ',
            villages: ['Bylakuppe', 'Koppa Border', 'Chilkunda', 'Bettadapura'],
          },
        ],
      },
      {
        taluk_id: 'TAL-MYS-NAN',
        name: 'Nanjangud',
        name_kn: 'ನಂಜನಗೂಡು',
        hoblis: [
          {
            hobli_id: 'HOB-NAN-KAS',
            name: 'Kasaba',
            name_kn: 'ಕಸಬಾ',
            villages: ['Debur', 'Hullahalli', 'Kowlande', 'Tagadur'],
          },
        ],
      },
      {
        taluk_id: 'TAL-MYS-KRN',
        name: 'K.R. Nagar',
        name_kn: 'ಕೆ.ಆರ್. ನಗರ',
        hoblis: [
          {
            hobli_id: 'HOB-KRN-SAL',
            name: 'Saligrama',
            name_kn: 'ಸಾಲಿಗ್ರಾಮ',
            villages: ['Saligrama', 'Mirle', 'Chunchanakatte', 'Bherya'],
          },
        ],
      },
    ],
  },
  {
    district_id: 'DIST-HAS',
    name: 'Hassan',
    name_kn: 'ಹಾಸನ',
    taluks: [
      {
        taluk_id: 'TAL-HAS-CRN',
        name: 'Channarayapatna',
        name_kn: 'ಚನ್ನರಾಯಪಟ್ಟಣ',
        hoblis: [
          {
            hobli_id: 'HOB-CRN-SHR',
            name: 'Shravanabelagola',
            name_kn: 'ಶ್ರವಣಬೆಳಗೊಳ',
            villages: ['Shravanabelagola', 'Nuggehalli', 'Hirisave', 'Dindagur'],
          },
        ],
      },
      {
        taluk_id: 'TAL-HAS-HAS',
        name: 'Hassan',
        name_kn: 'ಹಾಸನ',
        hoblis: [
          {
            hobli_id: 'HOB-HAS-DUD',
            name: 'Dudda',
            name_kn: 'ದುದ್ದ',
            villages: ['Dudda', 'Shanthigrama', 'Kattaya', 'Salagame'],
          },
        ],
      },
      {
        taluk_id: 'TAL-HAS-HOL',
        name: 'Holenarasipura',
        name_kn: 'ಹೊಳೆನರಸೀಪುರ',
        hoblis: [
          {
            hobli_id: 'HOB-HOL-HAL',
            name: 'Hallymysore',
            name_kn: 'ಹಳ್ಳಿಮೈಸೂರು',
            villages: ['Hallymysore', 'Hangargi', 'Kadavinakote', 'Cholenahalli'],
          },
        ],
      },
    ],
  },
  {
    district_id: 'DIST-BEL',
    name: 'Belagavi',
    name_kn: 'ಬೆಳಗಾವಿ',
    taluks: [
      {
        taluk_id: 'TAL-BEL-GOK',
        name: 'Gokak',
        name_kn: 'ಗೋಕಾಕ್',
        hoblis: [
          {
            hobli_id: 'HOB-GOK-KAS',
            name: 'Kasaba',
            name_kn: 'ಕಸಬಾ',
            villages: ['Arabhavi', 'Koujalagi', 'Lolsur', 'Ghataprabha'],
          },
        ],
      },
      {
        taluk_id: 'TAL-BEL-CHK',
        name: 'Chikkodi',
        name_kn: 'ಚಿಕ್ಕೋಡಿ',
        hoblis: [
          {
            hobli_id: 'HOB-CHK-KAS',
            name: 'Kasaba',
            name_kn: 'ಕಸಬಾ',
            villages: ['Nipani', 'Sadalaga', 'Examba', 'Kabbur'],
          },
        ],
      },
    ],
  },
  {
    district_id: 'DIST-SHI',
    name: 'Shivamogga',
    name_kn: 'ಶಿವಮೊಗ್ಗ',
    taluks: [
      {
        taluk_id: 'TAL-SHI-BHA',
        name: 'Bhadravathi',
        name_kn: 'ಭದ್ರಾವತಿ',
        hoblis: [
          {
            hobli_id: 'HOB-BHA-KUD',
            name: 'Kudligere',
            name_kn: 'ಕುಡ್ಲಿಗೆರೆ',
            villages: ['Kudligere', 'Holehonnur', 'Kumsi', 'Barandur'],
          },
        ],
      },
      {
        taluk_id: 'TAL-SHI-SAG',
        name: 'Sagar',
        name_kn: 'ಸಾಗರ',
        hoblis: [
          {
            hobli_id: 'HOB-SAG-ANA',
            name: 'Anandapura',
            name_kn: 'ಆನಂದಪುರ',
            villages: ['Anandapura', 'Avinahalli', 'Talaguppa', 'Karur'],
          },
        ],
      },
    ],
  },
  {
    district_id: 'DIST-TUM',
    name: 'Tumakuru',
    name_kn: 'ತುಮಕೂರು',
    taluks: [
      {
        taluk_id: 'TAL-TUM-TIP',
        name: 'Tiptur',
        name_kn: 'ತಿಪಟೂರು',
        hoblis: [
          {
            hobli_id: 'HOB-TIP-HON',
            name: 'Honavalli',
            name_kn: 'ಹೊನ್ನವಳ್ಳಿ',
            villages: ['Honavalli', 'Kibbanahalli', 'Nonavinakere', 'Biligere'],
          },
        ],
      },
      {
        taluk_id: 'TAL-TUM-KUN',
        name: 'Kunigal',
        name_kn: 'ಕುಣಿಗಲ್',
        hoblis: [
          {
            hobli_id: 'HOB-KUN-HUT',
            name: 'Huliyurdurga',
            name_kn: 'ಹುಲಿಯೂರುದುರ್ಗ',
            villages: ['Huliyurdurga', 'Amruthur', 'Yediyur', 'Kothagere'],
          },
        ],
      },
    ],
  },
];

export const CROPS_MASTER = [
  { code: 'CROP-PAD', name: 'Paddy (ಭತ್ತ)', category: 'Cereal' },
  { code: 'CROP-RAG', name: 'Ragi / Finger Millet (ರಾಗಿ)', category: 'Millet' },
  { code: 'CROP-SUG', name: 'Sugarcane (ಕಬ್ಬು)', category: 'Commercial' },
  { code: 'CROP-MAI', name: 'Maize (ಮೆಕ್ಕೆಜೋಳ)', category: 'Cereal' },
  { code: 'CROP-COT', name: 'Cotton (ಹತ್ತಿ)', category: 'Commercial' },
  { code: 'CROP-TOB', name: 'Tobacco (ತಂಬಾಕು)', category: 'Commercial' },
  { code: 'CROP-GND', name: 'Groundnut (ಕಡಲೆಕಾಯಿ)', category: 'Oilseed' },
  { code: 'CROP-BGM', name: 'Bengal Gram / Chana (ಕಡಲೆ)', category: 'Pulse' },
  { code: 'CROP-RED', name: 'Red Gram / Tur (ತೊಗರಿ)', category: 'Pulse' },
  { code: 'CROP-SNF', name: 'Sunflower (ಸೂರ್ಯಕಾಂತಿ)', category: 'Oilseed' },
  { code: 'CROP-SOY', name: 'Soybean (ಸೋಯಾಬೀನ್)', category: 'Pulse/Oilseed' },
  { code: 'CROP-PLS', name: 'Mixed Pulses (ದ್ವಿದಳ ಧಾನ್ಯಗಳು)', category: 'Pulse' },
];

export const MACHINERY_TYPES_MASTER = [
  { id: 'MCH-TR-4WD-50', name: 'Tractor 4WD (45-55 HP)', hp_range: '45-55 HP', category: 'Heavy Tractor' },
  { id: 'MCH-TR-2WD-40', name: 'Tractor 2WD (35-45 HP)', hp_range: '35-45 HP', category: 'Standard Tractor' },
  { id: 'MCH-TR-MINI-25', name: 'Mini Tractor (20-25 HP)', hp_range: '20-25 HP', category: 'Compact Tractor' },
  { id: 'MCH-PT-15', name: 'Power Tiller (12-15 HP)', hp_range: '12-15 HP', category: 'Tiller' },
  { id: 'MCH-HARV-COMB', name: 'Combine Harvester (Track/Wheel)', hp_range: '75-110 HP', category: 'Harvester' },
  { id: 'MCH-ROT-SEED', name: 'Rotavator & Seed Drill Attachment', hp_range: '35+ HP Implements', category: 'Tillage/Sowing' },
  { id: 'MCH-PWR-SPRAY', name: 'Power Sprayer (Tractor Mounted / Boom)', hp_range: 'PTO Driven', category: 'Plant Protection' },
  { id: 'MCH-LASER-LEV', name: 'Laser Land Leveler', hp_range: '50+ HP Implements', category: 'Land Preparation' },
  { id: 'MCH-THRESHER', name: 'Multi-Crop High Capacity Thresher', hp_range: '35+ HP Implements', category: 'Post-Harvest' },
];

export const BUSINESS_ENTITIES_MASTER = [
  { id: 'Individual', label: 'Individual (Farmer / Tractor Owner)' },
  { id: 'Partner', label: 'Partnership Firm' },
  { id: 'Firm', label: 'Custom Hiring Center (CHC) / Private Enterprise' },
  { id: 'FPO', label: 'Farmer Producer Organization (FPO)' },
  { id: 'PACS', label: 'Primary Agricultural Credit Co-op Society (PACS)' },
];

export const SOCIAL_CATEGORIES_MASTER = ['General', 'OBC (Cat-1)', 'OBC (2A/2B)', 'OBC (3A/3B)', 'SC', 'ST'];

export const SEASONS_MASTER = [
  { id: 'Kharif', label: 'Kharif (ಮುಂಗಾರು) Season 2026', months: 'June - Oct' },
  { id: 'Rabi', label: 'Rabi (ಹಿಂಗಾರು) Season 2026-27', months: 'Oct - Feb' },
  { id: 'Summer', label: 'Summer (ಬೇಸಿಗೆ) Season 2027', months: 'Feb - May' },
];

export const FUEL_LEVELS_MASTER = [
  { id: 'Full', label: 'Full Tank (80L+ / 100%)' },
  { id: 'Three-Quarter', label: '3/4 Tank (~60L / 75%)' },
  { id: 'Half', label: '1/2 Tank (~40L / 50%)' },
  { id: 'Quarter', label: '1/4 Tank (~20L / 25%)' },
];
