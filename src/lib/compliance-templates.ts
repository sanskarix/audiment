export interface ComplianceQuestion {
  questionText: string;
  questionType: 'yes_no' | 'rating';
  severity: 'low' | 'medium' | 'critical';
  requiresPhoto: boolean;
  order: number;
}

export interface ComplianceTemplate {
  id: string;
  title: string;
  category: 'hygiene' | 'sanitation' | 'safety' | 'operations' | 'inventory' | 'general' | 'quality';
  description: string;
  country: string; // ISO 2-letter or 'GLOBAL'
  countryName: string;
  authority: string;
  isCountryDefault?: boolean;
  isIndustryDefault?: boolean;
  industry?: string;
  industryName?: string;
  questions: ComplianceQuestion[];
}

export interface IndustryOption {
  value: string;
  label: string;
  icon: string;
  description: string;
}

export const INDUSTRY_OPTIONS: IndustryOption[] = [
  { value: 'restaurant', label: 'Restaurant & Food Service', icon: '🍽️', description: 'Commercial kitchens, QSR, cafes, bakeries, food service chains' },
  { value: 'retail', label: 'Retail & Supermarket', icon: '🛍️', description: 'Supermarkets, apparel chains, department stores, specialty retail' },
  { value: 'manufacturing', label: 'Manufacturing & Processing', icon: '🏭', description: 'Assembly plants, processing facilities, FMCG packaging, light/heavy industry' },
  { value: 'hotel', label: 'Hotel & Hospitality', icon: '🏨', description: 'Hotels, resorts, serviced residences, event and banquet venues' },
  { value: 'healthcare', label: 'Healthcare & Pharma', icon: '🏥', description: 'Diagnostic centers, clinics, retail pharmacies, care facilities' },
  { value: 'logistics', label: 'Logistics & Warehousing', icon: '📦', description: 'Distribution centers, fulfillment hubs, cold chain warehouses' },
  { value: 'facilities', label: 'Facility Management', icon: '🏢', description: 'Commercial office towers, corporate parks, residential developments' },
  { value: 'other', label: 'Other', icon: '🌐', description: 'Multi-location operations, service outlets, enterprise branch networks' },
];

export interface CountryInfo {
  code: string;
  name: string;
  flag: string;
  dialCode?: string;
  authority?: string;
  hasSpecificTemplates: boolean;
  isTop10?: boolean;
}

export const TOP_10_COUNTRIES: CountryInfo[] = [
  { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91', authority: 'FSSAI (Food Safety and Standards Authority of India)', hasSpecificTemplates: true, isTop10: true },
  { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1', authority: 'FDA (Food Code 2022) / OSHA', hasSpecificTemplates: true, isTop10: true },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44', authority: 'FSA (Food Standards Agency) / HSE', hasSpecificTemplates: true, isTop10: true },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', dialCode: '+971', authority: 'Dubai Municipality Food Code / ADAFSA', hasSpecificTemplates: true, isTop10: true },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', dialCode: '+966', authority: 'SFDA (Saudi Food & Drug Authority) / Balady', hasSpecificTemplates: true, isTop10: true },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61', authority: 'FSANZ (Food Standards Australia New Zealand)', hasSpecificTemplates: true, isTop10: true },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1', authority: 'CFIA (Canadian Food Inspection Agency) / Health Canada', hasSpecificTemplates: true, isTop10: true },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', dialCode: '+65', authority: 'SFA (Singapore Food Agency)', hasSpecificTemplates: true, isTop10: true },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49', authority: 'BVL / EU Regulation 852/2004 / DIN 10514', hasSpecificTemplates: true, isTop10: true },
  { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33', authority: 'DGAL (Paquet Hygiène & PMS) / Alim\'confiance', hasSpecificTemplates: true, isTop10: true },
];

export const ALL_COUNTRIES: CountryInfo[] = [
  ...TOP_10_COUNTRIES,
  { code: 'JP', name: 'Japan', flag: '🇯🇵', dialCode: '+81', hasSpecificTemplates: false },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', dialCode: '+55', hasSpecificTemplates: false },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', dialCode: '+52', hasSpecificTemplates: false },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', dialCode: '+27', hasSpecificTemplates: false },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', dialCode: '+64', hasSpecificTemplates: false },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', dialCode: '+60', hasSpecificTemplates: false },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', dialCode: '+62', hasSpecificTemplates: false },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', dialCode: '+66', hasSpecificTemplates: false },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', dialCode: '+63', hasSpecificTemplates: false },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', dialCode: '+84', hasSpecificTemplates: false },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', dialCode: '+82', hasSpecificTemplates: false },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', dialCode: '+39', hasSpecificTemplates: false },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', dialCode: '+34', hasSpecificTemplates: false },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', dialCode: '+31', hasSpecificTemplates: false },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', dialCode: '+32', hasSpecificTemplates: false },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', dialCode: '+41', hasSpecificTemplates: false },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', dialCode: '+43', hasSpecificTemplates: false },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', dialCode: '+46', hasSpecificTemplates: false },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', dialCode: '+47', hasSpecificTemplates: false },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', dialCode: '+45', hasSpecificTemplates: false },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', dialCode: '+358', hasSpecificTemplates: false },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪', dialCode: '+353', hasSpecificTemplates: false },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', dialCode: '+48', hasSpecificTemplates: false },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', dialCode: '+351', hasSpecificTemplates: false },
  { code: 'GR', name: 'Greece', flag: '🇬🇷', dialCode: '+30', hasSpecificTemplates: false },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', dialCode: '+90', hasSpecificTemplates: false },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', dialCode: '+974', hasSpecificTemplates: false },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼', dialCode: '+965', hasSpecificTemplates: false },
  { code: 'OM', name: 'Oman', flag: '🇴🇲', dialCode: '+968', hasSpecificTemplates: false },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭', dialCode: '+973', hasSpecificTemplates: false },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', dialCode: '+20', hasSpecificTemplates: false },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', dialCode: '+234', hasSpecificTemplates: false },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', dialCode: '+254', hasSpecificTemplates: false },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', dialCode: '+54', hasSpecificTemplates: false },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', dialCode: '+56', hasSpecificTemplates: false },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', dialCode: '+57', hasSpecificTemplates: false },
  { code: 'PE', name: 'Peru', flag: '🇵🇪', dialCode: '+51', hasSpecificTemplates: false },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', dialCode: '+92', hasSpecificTemplates: false },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', dialCode: '+880', hasSpecificTemplates: false },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', dialCode: '+94', hasSpecificTemplates: false },
  { code: 'GLOBAL', name: 'Universal / International', flag: '🌐', hasSpecificTemplates: true },
];

export const COMPLIANCE_TEMPLATES: Record<string, ComplianceTemplate[]> = {
  // ── 1. INDIA (FSSAI) ─────────────────────────────────────────────────────────
  IN: [
    {
      id: 'in-fssai-kitchen',
      title: 'FSSAI Kitchen Hygiene Standards',
      category: 'hygiene',
      description: 'Schedule 4 food safety & sanitary audit compliant with FSSAI regulations for commercial kitchens.',
      country: 'IN',
      countryName: 'India',
      authority: 'FSSAI',
      isCountryDefault: true,
      questions: [
        { questionText: 'Are all raw and cooked foods stored separately with zero cross-contamination risk?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 1 },
        { questionText: 'Are commercial chillers maintained at ≤ 5°C and deep freezers at ≤ -18°C?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 2 },
        { questionText: 'Is pest control mechanism intact, documented, and free of infestation signs?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 3 },
        { questionText: 'Are food handlers wearing clean uniforms, aprons, hairnets, and medical fitness certificates on file?', questionType: 'rating', severity: 'medium', requiresPhoto: false, order: 4 },
        { questionText: 'Are chopping boards and knives color-coded (red for raw meat, green for veg) and sanitized?', questionType: 'yes_no', severity: 'medium', requiresPhoto: true, order: 5 },
        { questionText: 'Rate the cleanliness of food contact surfaces, exhaust hoods, and preparation tables.', questionType: 'rating', severity: 'medium', requiresPhoto: true, order: 6 },
        { questionText: 'Are all food ingredients stored off the floor on pallets (>15cm) and away from walls?', questionType: 'yes_no', severity: 'medium', requiresPhoto: false, order: 7 },
        { questionText: 'Are food grade packaging containers used and FIFO/FEFO expiry labels maintained?', questionType: 'yes_no', severity: 'medium', requiresPhoto: false, order: 8 },
      ],
    },
    {
      id: 'in-fssai-washroom',
      title: 'FSSAI Washroom & Sanitation Standards',
      category: 'sanitation',
      description: 'Mandatory washroom hygiene, waste disposal and water sanitation checks compliant with FSSAI.',
      country: 'IN',
      countryName: 'India',
      authority: 'FSSAI',
      isCountryDefault: true,
      questions: [
        { questionText: 'Are washrooms completely separated from food preparation and storage areas?', questionType: 'yes_no', severity: 'critical', requiresPhoto: false, order: 1 },
        { questionText: 'Rate the continuous availability of potable water, soap dispensers, and hand sanitizers.', questionType: 'rating', severity: 'medium', requiresPhoto: true, order: 2 },
        { questionText: 'Are proper hand-drying facilities (single-use paper towels or air dryers) functional?', questionType: 'yes_no', severity: 'medium', requiresPhoto: false, order: 3 },
        { questionText: 'Rate general cleanliness, ventilation, and odor control in washrooms.', questionType: 'rating', severity: 'low', requiresPhoto: true, order: 4 },
        { questionText: 'Are garbage bins foot-operated, lined with plastic garbage bags, and non-overflowing?', questionType: 'yes_no', severity: 'medium', requiresPhoto: true, order: 5 },
        { questionText: 'Are daily cleaning and sanitation schedules signed and verified by housekeeping?', questionType: 'yes_no', severity: 'low', requiresPhoto: true, order: 6 },
        { questionText: 'Are grease traps inspected, cleaned, and free from blockages?', questionType: 'yes_no', severity: 'medium', requiresPhoto: false, order: 7 },
        { questionText: 'Are handwashing instructions displayed in English and regional languages at all hand wash sinks?', questionType: 'yes_no', severity: 'low', requiresPhoto: false, order: 8 },
      ],
    },
  ],

  // ── 2. UNITED STATES (FDA & OSHA) ──────────────────────────────────────────
  US: [
    {
      id: 'us-fda-kitchen',
      title: 'FDA Food Code Commercial Kitchen & HACCP Audit',
      category: 'hygiene',
      description: 'Comprehensive food safety audit compliant with the 2022 FDA Food Code and HACCP guidelines.',
      country: 'US',
      countryName: 'United States',
      authority: 'FDA Food Code',
      isCountryDefault: true,
      questions: [
        { questionText: 'Are cold holding foods maintained at ≤ 41°F (5°C) and hot holding foods at ≥ 135°F (57°C)?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 1 },
        { questionText: 'Is internal cook temperature logged for all animal proteins using a calibrated probe thermometer?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 2 },
        { questionText: 'Are raw animal proteins stored below and separate from ready-to-eat (RTE) foods in walk-in coolers?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 3 },
        { questionText: 'Are chemical sanitizing solution concentrations (quaternary ammonium 200-400 ppm / chlorine 50-100 ppm) verified with test strips?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 4 },
        { questionText: 'Are handwashing sinks unobstructed, accessible, stocked with soap, single-use towels, and warm water (≥ 100°F)?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 5 },
        { questionText: 'Rate food handler compliance with bare-hand contact restrictions on ready-to-eat foods.', questionType: 'rating', severity: 'critical', requiresPhoto: false, order: 6 },
        { questionText: 'Are Major 9 food allergens clearly identified and cross-contact prevention procedures followed during preparation?', questionType: 'yes_no', severity: 'medium', requiresPhoto: true, order: 7 },
        { questionText: 'Are toxic cleaning chemicals stored in original labeled containers below food prep surfaces?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 8 },
      ],
    },
    {
      id: 'us-osha-safety',
      title: 'OSHA Workplace Safety & Sanitation Standards',
      category: 'safety',
      description: 'OSHA 1910 standard compliance check for general workplace safety, egress, fire protection, and sanitation.',
      country: 'US',
      countryName: 'United States',
      authority: 'OSHA',
      isCountryDefault: true,
      questions: [
        { questionText: 'Are all emergency exit doors unlocked from the inside, lighted exit signs operational, and pathways clear?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 1 },
        { questionText: 'Rate condition of walking-working surfaces: are floors dry, clean, and free from slip/trip hazards or loose cords?', questionType: 'rating', severity: 'medium', requiresPhoto: true, order: 2 },
        { questionText: 'Are commercial fire extinguishers inspected monthly, fully charged, tagged, and unobstructed?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 3 },
        { questionText: 'Are eyewash stations and first aid kits fully stocked, clean, and accessible within 10 seconds of chemical handling?', questionType: 'yes_no', severity: 'medium', requiresPhoto: true, order: 4 },
        { questionText: 'Are Safety Data Sheets (SDS) readily accessible to all employees for hazardous cleaning chemicals?', questionType: 'yes_no', severity: 'medium', requiresPhoto: false, order: 5 },
        { questionText: 'Are commercial electrical panels accessible with a 36-inch clearance and no exposed wiring?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 6 },
        { questionText: 'Rate washroom hygiene, sanitary supply availability, and ventilation standards.', questionType: 'rating', severity: 'medium', requiresPhoto: true, order: 7 },
      ],
    },
  ],

  // ── 3. UNITED KINGDOM (FSA & HSE) ──────────────────────────────────────────
  GB: [
    {
      id: 'gb-fsa-hygiene',
      title: 'FSA Food Hygiene Rating Scheme (FHRS) Audit',
      category: 'hygiene',
      description: 'Standards mapped to UK Food Standards Agency inspection criteria across hygiene, structure, and management.',
      country: 'GB',
      countryName: 'United Kingdom',
      authority: 'FSA (FHRS)',
      isCountryDefault: true,
      questions: [
        { questionText: 'Are high-risk foods kept out of the danger zone (chilled ≤ 8°C legally required; recommended ≤ 5°C; hot held ≥ 63°C)?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 1 },
        { questionText: 'Are "Safer Food, Better Business" (SFBB) or equivalent HACCP management records signed and up-to-date daily?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 2 },
        { questionText: 'Is separation of raw and ready-to-eat foods strictly maintained with dedicated preparation areas and color-coded utensils?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 3 },
        { questionText: 'Are all 14 statutory allergens communicated accurately on menus and cross-contamination risks controlled?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 4 },
        { questionText: 'Is the 2-stage cleaning and disinfection process followed on all food contact surfaces using BS EN 1276 sanitizers?', questionType: 'yes_no', severity: 'medium', requiresPhoto: true, order: 5 },
        { questionText: 'Rate the personal hygiene, clean protective overclothing, and fitness-to-work reporting of food handlers.', questionType: 'rating', severity: 'medium', requiresPhoto: false, order: 6 },
        { questionText: 'Are pest prevention measures active with no evidence of rodent or insect activity?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 7 },
        { questionText: 'Rate structural cleanliness and condition of kitchen walls, floors, ceilings, and grease extraction filters.', questionType: 'rating', severity: 'medium', requiresPhoto: true, order: 8 },
      ],
    },
    {
      id: 'gb-hse-welfare',
      title: 'UK HSE Workplace Health, Safety & Welfare Standard',
      category: 'safety',
      description: 'Health and Safety Executive (HSE) compliance checklist for workplace facilities, fire safety, and employee welfare.',
      country: 'GB',
      countryName: 'United Kingdom',
      authority: 'UK HSE',
      isCountryDefault: true,
      questions: [
        { questionText: 'Are sanitary conveniences sufficient in number, ventilated, clean, and supplied with hot/cold running water and soap?', questionType: 'yes_no', severity: 'medium', requiresPhoto: true, order: 1 },
        { questionText: 'Are fire evacuation routes and emergency lighting unobstructed and tested weekly?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 2 },
        { questionText: 'Are slip and trip hazards eliminated with non-slip flooring in wet prep areas and washrooms?', questionType: 'rating', severity: 'medium', requiresPhoto: true, order: 3 },
        { questionText: 'Is suitable Personal Protective Equipment (PPE) provided, maintained, and worn (cut-resistant gloves, slip-resistant shoes)?', questionType: 'yes_no', severity: 'medium', requiresPhoto: false, order: 4 },
        { questionText: 'Are first aid kits fully stocked with BS 8599-compliant supplies and an appointed first aider identified?', questionType: 'yes_no', severity: 'low', requiresPhoto: true, order: 5 },
      ],
    },
  ],

  // ── 4. UNITED ARAB EMIRATES (Dubai Municipality & ADAFSA) ─────────────────
  AE: [
    {
      id: 'ae-dm-food-code',
      title: 'Dubai Municipality Food Code Kitchen Inspection',
      category: 'hygiene',
      description: 'Inspection checklist based on the Dubai Municipality Food Code and UAE GSO standards for commercial food establishments.',
      country: 'AE',
      countryName: 'United Arab Emirates',
      authority: 'Dubai Municipality',
      isCountryDefault: true,
      questions: [
        { questionText: 'Is a certified Person in Charge (PIC) present on duty and actively supervising food safety operations?', questionType: 'yes_no', severity: 'critical', requiresPhoto: false, order: 1 },
        { questionText: 'Are high-risk perishable foods held at ≤ 4°C in chillers and cooked foods held at ≥ 60°C?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 2 },
        { questionText: 'Are food products verified for approved municipality sources with valid halal certification and Arabic labelling?', questionType: 'yes_no', severity: 'medium', requiresPhoto: true, order: 3 },
        { questionText: 'Are color-coded chopping boards used correctly and free from scoring and microbial entrapment?', questionType: 'yes_no', severity: 'medium', requiresPhoto: true, order: 4 },
        { questionText: 'Is food thawing performed safely under refrigeration (≤ 4°C) or in running potable water, never at room temperature?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 5 },
        { questionText: 'Are grease traps serviced by municipality-approved contractors and service manifests on file?', questionType: 'yes_no', severity: 'medium', requiresPhoto: true, order: 6 },
        { questionText: 'Rate kitchen deep cleaning: exhaust hoods, ducting, filters, and grease removal logs.', questionType: 'rating', severity: 'medium', requiresPhoto: true, order: 7 },
        { questionText: 'Are staff occupational health cards issued by Dubai Health Authority (DHA/ADPHC) valid and current?', questionType: 'yes_no', severity: 'critical', requiresPhoto: false, order: 8 },
      ],
    },
    {
      id: 'ae-sanitation',
      title: 'UAE Commercial Facility Sanitation & Hygiene Standard',
      category: 'sanitation',
      description: 'Public health and sanitation audit for UAE commercial and hospitality premises.',
      country: 'AE',
      countryName: 'United Arab Emirates',
      authority: 'ADAFSA / DM',
      isCountryDefault: true,
      questions: [
        { questionText: 'Are staff washrooms and locker rooms segregated from food storage and maintained in spotless condition?', questionType: 'yes_no', severity: 'medium', requiresPhoto: true, order: 1 },
        { questionText: 'Are touchless handwash faucets, bactericidal hand soap, and paper towel dispensers operational?', questionType: 'rating', severity: 'medium', requiresPhoto: true, order: 2 },
        { questionText: 'Are pest control contracts registered with municipality-approved pest management companies with monthly logs?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 3 },
        { questionText: 'Are chemical dilution dispensers working accurately and Safety Data Sheets mounted on walls?', questionType: 'yes_no', severity: 'medium', requiresPhoto: false, order: 4 },
        { questionText: 'Is waste compaction and garbage storage room chilled and washed down daily?', questionType: 'yes_no', severity: 'medium', requiresPhoto: true, order: 5 },
      ],
    },
  ],

  // ── 5. SAUDI ARABIA (SFDA & Balady / MOMRA) ───────────────────────────────
  SA: [
    {
      id: 'sa-sfda-food',
      title: 'SFDA & Balady Food Safety Inspection',
      category: 'hygiene',
      description: 'Saudi Food and Drug Authority (SFDA) and Balady municipal compliance checklist for food establishments.',
      country: 'SA',
      countryName: 'Saudi Arabia',
      authority: 'SFDA / Balady',
      isCountryDefault: true,
      questions: [
        { questionText: 'Do all food handlers possess valid Balady health certificates and municipality fitness cards?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 1 },
        { questionText: 'Are walk-in coolers maintained at ≤ 4°C and freezers at ≤ -18°C with digital temperature logs recorded twice daily?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 2 },
        { questionText: 'Are raw poultry, meat, and ready-to-eat ingredients strictly segregated with dedicated prep zones?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 3 },
        { questionText: 'Are cooking oil quality levels monitored with polar compound testers (TPM ≤ 24%) and disposal logs maintained?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 4 },
        { questionText: 'Is all food packaging approved by SFDA with Arabic nutritional data, production dates, and expiry dates?', questionType: 'yes_no', severity: 'medium', requiresPhoto: true, order: 5 },
        { questionText: 'Rate personal hygiene: clean uniforms, beard nets, head covers, and restriction of personal items in prep areas.', questionType: 'rating', severity: 'medium', requiresPhoto: false, order: 6 },
        { questionText: 'Are fly killers / insect light traps (ILTs) positioned away from open food and functioning effectively?', questionType: 'yes_no', severity: 'medium', requiresPhoto: true, order: 7 },
        { questionText: 'Is a certified food safety supervisor present on site during operating hours?', questionType: 'yes_no', severity: 'medium', requiresPhoto: false, order: 8 },
      ],
    },
    {
      id: 'sa-health-safety',
      title: 'KSA Commercial Premises Health & Safety Standards',
      category: 'safety',
      description: 'Civil Defense (Salamah) and Balady sanitation standards for commercial establishments.',
      country: 'SA',
      countryName: 'Saudi Arabia',
      authority: 'Salamah / Balady',
      isCountryDefault: true,
      questions: [
        { questionText: 'Are fire safety equipment, smoke detectors, and fire blankets certified by Civil Defense (Salamah)?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 1 },
        { questionText: 'Are employee sanitary facilities clean, equipped with automatic faucets and continuous liquid soap supplies?', questionType: 'rating', severity: 'medium', requiresPhoto: true, order: 2 },
        { questionText: 'Are commercial waste storage bins sealed, foot-operated, and located away from dining and prep entrances?', questionType: 'yes_no', severity: 'medium', requiresPhoto: true, order: 3 },
        { questionText: 'Is potable water filtration system inspected with monthly bacteriological water test certificates available?', questionType: 'yes_no', severity: 'critical', requiresPhoto: false, order: 4 },
      ],
    },
  ],

  // ── 6. AUSTRALIA (FSANZ & Safe Work Australia) ────────────────────────────
  AU: [
    {
      id: 'au-fsanz-safety',
      title: 'FSANZ Food Safety Practices Standards Audit',
      category: 'hygiene',
      description: 'Audit compliant with FSANZ Food Standards Code Standard 3.2.2 and 3.2.3.',
      country: 'AU',
      countryName: 'Australia',
      authority: 'FSANZ',
      isCountryDefault: true,
      questions: [
        { questionText: 'Is potentially hazardous food received and stored under temperature control (≤ 5°C or ≥ 60°C)?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 1 },
        { questionText: 'Is the 2-hour / 4-hour rule strictly observed and documented for food cooling and temperature display?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 2 },
        { questionText: 'Is a certified Food Safety Supervisor (FSS) registered for the premises and their certificate displayed?', questionType: 'yes_no', severity: 'critical', requiresPhoto: false, order: 3 },
        { questionText: 'Are commercial dishwashers sanitizing at rinse temperatures ≥ 77°C or using an approved chemical sanitizer?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 4 },
        { questionText: 'Are ready-to-eat foods protected from contamination by covers, sneeze guards, and dedicated food utensils?', questionType: 'yes_no', severity: 'medium', requiresPhoto: true, order: 5 },
        { questionText: 'Rate cleanliness of food processing equipment, stainless steel prep benches, and cool room shelving.', questionType: 'rating', severity: 'medium', requiresPhoto: true, order: 6 },
        { questionText: 'Are food contact surfaces sanitized between raw and cooked food handling using certified sanitizers?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 7 },
        { questionText: 'Are pest eradication logs maintained and building openings sealed with fly screens and door seals?', questionType: 'yes_no', severity: 'medium', requiresPhoto: false, order: 8 },
      ],
    },
    {
      id: 'au-safework',
      title: 'Safe Work Australia Workplace Safety & Amenities Audit',
      category: 'safety',
      description: 'Work Health and Safety (WHS) checklist for workplace safety, slip mitigation, and staff amenities.',
      country: 'AU',
      countryName: 'Australia',
      authority: 'Safe Work Australia',
      isCountryDefault: true,
      questions: [
        { questionText: 'Are first aid kits fully stocked with Australian Standard items and qualified first aid officers designated?', questionType: 'yes_no', severity: 'low', requiresPhoto: true, order: 1 },
        { questionText: 'Are floor surfaces dry, slip-rated (R10+ in kitchen areas), and free of trip hazards or ponding water?', questionType: 'rating', severity: 'medium', requiresPhoto: true, order: 2 },
        { questionText: 'Are staff amenities (restrooms, washbasins, lunchrooms) clean, ventilated, and provided with hygienic supplies?', questionType: 'yes_no', severity: 'medium', requiresPhoto: true, order: 3 },
        { questionText: 'Are safety data sheets (SDS) accessible for all cleaning chemicals in accordance with WHS regulations?', questionType: 'yes_no', severity: 'medium', requiresPhoto: false, order: 4 },
      ],
    },
  ],

  // ── 7. CANADA (CFIA & Health Canada) ──────────────────────────────────────
  CA: [
    {
      id: 'ca-cfia-premises',
      title: 'CFIA & Health Canada Food Premises Compliance Checklist',
      category: 'hygiene',
      description: 'Safe Food for Canadians Regulations (SFCR) and provincial public health food premises audit.',
      country: 'CA',
      countryName: 'Canada',
      authority: 'CFIA / Health Canada',
      isCountryDefault: true,
      questions: [
        { questionText: 'Are refrigerated storage units holding hazardous foods at or below 4°C (40°F) and freezers at -18°C (0°F)?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 1 },
        { questionText: 'Are internal cook temperatures verified with a calibrated digital thermometer (e.g. poultry 74°C/165°F, pork 71°C/160°F)?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 2 },
        { questionText: 'Are manual dishwashing setups utilizing the 3-sink method (wash, rinse, sanitize with 100ppm chlorine or 200ppm quat)?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 3 },
        { questionText: 'Are raw meats stored below ready-to-eat foods and separated in coolers to prevent cross-contamination?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 4 },
        { questionText: 'Are all staff certified in Food Handler Training (e.g. FoodSafe / ServSafe Canada) with certificates available?', questionType: 'yes_no', severity: 'medium', requiresPhoto: false, order: 5 },
        { questionText: 'Rate handwash sink facilities: dedicated to handwashing only, equipped with liquid soap, paper towels, and hot water (≥ 43°C).', questionType: 'rating', severity: 'critical', requiresPhoto: true, order: 6 },
        { questionText: 'Are chemical cleaning products registered with Health Canada, labeled, and stored away from food?', questionType: 'yes_no', severity: 'medium', requiresPhoto: true, order: 7 },
        { questionText: 'Is a pest management program contracted with an approved pest control operator with service records on site?', questionType: 'yes_no', severity: 'medium', requiresPhoto: false, order: 8 },
      ],
    },
    {
      id: 'ca-ohs-sanitation',
      title: 'Canadian Occupational Health & Washroom Sanitation Checklist',
      category: 'safety',
      description: 'Canadian Centre for Occupational Health and Safety (CCOHS) and provincial sanitation standards.',
      country: 'CA',
      countryName: 'Canada',
      authority: 'CCOHS / OHS',
      isCountryDefault: true,
      questions: [
        { questionText: 'Are washroom facilities clean, sanitary, in good repair, and supplied with single-use towels and liquid soap?', questionType: 'rating', severity: 'medium', requiresPhoto: true, order: 1 },
        { questionText: 'Are emergency exits, panic hardware, and illuminated EXIT signs fully functional and unobstructed?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 2 },
        { questionText: 'Are WHMIS 2015 / GHS compliant labels and Safety Data Sheets present for all hazardous kitchen chemicals?', questionType: 'yes_no', severity: 'medium', requiresPhoto: false, order: 3 },
        { questionText: 'Are non-slip mats installed in dish pit and cooking line areas with floor drains working without backup?', questionType: 'yes_no', severity: 'medium', requiresPhoto: true, order: 4 },
      ],
    },
  ],

  // ── 8. SINGAPORE (Singapore Food Agency - SFA) ─────────────────────────────
  SG: [
    {
      id: 'sg-sfa-demerit',
      title: 'SFA Points Demerit System Food Hygiene Audit',
      category: 'hygiene',
      description: 'Singapore Food Agency Points Demerit System (PDS) audit standard for licensed retail food premises.',
      country: 'SG',
      countryName: 'Singapore',
      authority: 'SFA',
      isCountryDefault: true,
      questions: [
        { questionText: 'Are chillers maintained at ≤ 4°C and freezers at ≤ -18°C with digital temperature logs recorded daily?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 1 },
        { questionText: 'Are raw ingredients and cooked/ready-to-eat foods stored on separate shelves and color-coded containers?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 2 },
        { questionText: 'Are all food handlers registered with SFA, certified in WSQ Food Safety Course Level 1, and wearing proper attire?', questionType: 'yes_no', severity: 'critical', requiresPhoto: false, order: 3 },
        { questionText: 'Are food contact surfaces, slicing machines, and cutting boards sanitized regularly and free from micro-cracks?', questionType: 'rating', severity: 'medium', requiresPhoto: true, order: 4 },
        { questionText: 'Is there zero evidence of pest infestation (cockroaches, rodents, flies) and ILT traps serviced monthly?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 5 },
        { questionText: 'Are food defrosting operations conducted strictly inside chillers or microwave ovens, never soaked in standing water?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 6 },
        { questionText: 'Are exhaust hood grease filters clean, free of oil accumulation, and serviced by a licensed grease contractor?', questionType: 'yes_no', severity: 'medium', requiresPhoto: true, order: 7 },
        { questionText: 'Are food items stored at least 15cm off the floor and away from walls on stainless steel or heavy plastic racks?', questionType: 'yes_no', severity: 'medium', requiresPhoto: false, order: 8 },
      ],
    },
    {
      id: 'sg-sfa-sanitation',
      title: 'SFA Washroom & Premises Sanitation Excellence Standard',
      category: 'sanitation',
      description: 'Public health washroom hygiene and refuse handling standards compliant with SFA regulations.',
      country: 'SG',
      countryName: 'Singapore',
      authority: 'SFA / NEA',
      isCountryDefault: true,
      questions: [
        { questionText: 'Are washrooms thoroughly cleaned, dry-floored, and provided with soap dispensers, toilet paper, and working hand dryers?', questionType: 'rating', severity: 'medium', requiresPhoto: true, order: 1 },
        { questionText: 'Are hand wash sinks within food preparation areas foot/sensor-operated with antibacterial soap and paper towels?', questionType: 'yes_no', severity: 'medium', requiresPhoto: true, order: 2 },
        { questionText: 'Are kitchen refuse bins covered with tight-fitting lids, foot-operated, and emptied before overflow?', questionType: 'yes_no', severity: 'medium', requiresPhoto: true, order: 3 },
        { questionText: 'Are premises drainage channels and grease traps clean, odor-free, and cleared of food sludge daily?', questionType: 'yes_no', severity: 'medium', requiresPhoto: true, order: 4 },
      ],
    },
  ],

  // ── 9. GERMANY & EU (BVL / DIN / EU Reg 852/2004) ─────────────────────────
  DE: [
    {
      id: 'de-eu-haccp',
      title: 'EU Regulation 852/2004 & DIN 10514 HACCP Kitchen Inspection',
      category: 'hygiene',
      description: 'EU hygiene package and DIN 10514 hygiene training compliance checklist for food operations in Germany.',
      country: 'DE',
      countryName: 'Germany',
      authority: 'BVL / EU 852/2004',
      isCountryDefault: true,
      questions: [
        { questionText: 'Are Critical Control Points (CCPs) defined, monitored, and documented daily in accordance with HACCP principles?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 1 },
        { questionText: 'Are cooling units maintained at ≤ 7°C (chilled meat ≤ 4°C, poultry ≤ 4°C, minced meat ≤ 2°C) and freezers ≤ -18°C?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 2 },
        { questionText: 'Are heating temperatures verified at core temperature ≥ 72°C for at least 2 minutes for cooked foods?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 3 },
        { questionText: 'Are strict allergen management protocols (14 main EU allergens) implemented to prevent cross-contamination?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 4 },
        { questionText: 'Are food handlers trained in accordance with § 43 IfSG (Infektionsschutzgesetz) and DIN 10514 on file?', questionType: 'yes_no', severity: 'medium', requiresPhoto: false, order: 5 },
        { questionText: 'Rate condition and hygiene of food contact surfaces, stainless steel workbenches, and refrigeration seals.', questionType: 'rating', severity: 'medium', requiresPhoto: true, order: 6 },
        { questionText: 'Is a certified pest monitoring system (Schädlingsmonitoring nach HACCP) installed with inspection logs?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 7 },
        { questionText: 'Are cleaning and disinfection plans (Reinigungs- und Desinfektionsplan) displayed and signed daily?', questionType: 'yes_no', severity: 'medium', requiresPhoto: true, order: 8 },
      ],
    },
    {
      id: 'de-arbstattv',
      title: 'German Workplace Safety & Sanitation Standards (ArbStättV)',
      category: 'safety',
      description: 'Arbeitsstättenverordnung (ArbStättV) and ASR standards for occupational safety and sanitary facilities.',
      country: 'DE',
      countryName: 'Germany',
      authority: 'BAuA / ArbStättV',
      isCountryDefault: true,
      questions: [
        { questionText: 'Are sanitary rooms (Sanitäre Anlagen nach ASR A4.1) hygienisch, cleanly maintained, and equipped with liquid soap and paper towels?', questionType: 'rating', severity: 'medium', requiresPhoto: true, order: 1 },
        { questionText: 'Are escape routes and emergency exits (Flucht- und Rettungswege) unblocked, clearly illuminated, and marked?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 2 },
        { questionText: 'Are first aid kits (Verbandkasten nach DIN 13157/13169) complete and readily accessible?', questionType: 'yes_no', severity: 'low', requiresPhoto: true, order: 3 },
        { questionText: 'Are floors slip-resistant (R-Klassen R11 to R13 for commercial kitchens) and free from trip hazards?', questionType: 'yes_no', severity: 'medium', requiresPhoto: true, order: 4 },
      ],
    },
  ],

  // ── 10. FRANCE (DGAL / DGCCRF / PMS) ──────────────────────────────────────
  FR: [
    {
      id: 'fr-pms-haccp',
      title: 'French PMS & HACCP Commercial Kitchen Audit',
      category: 'hygiene',
      description: 'Plan de Maîtrise Sanitaire (PMS) and French food safety regulations (DGAL / Alim\'confiance).',
      country: 'FR',
      countryName: 'France',
      authority: 'DGAL / Alim\'confiance',
      isCountryDefault: true,
      questions: [
        { questionText: 'Is full batch traceability (traçabilité amont/aval) and shelf life (DLC/DLUO) documented for all received raw materials?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 1 },
        { questionText: 'Is the cold chain strictly maintained (fresh meat ≤ +4°C, dairy ≤ +4°C, deep frozen ≤ -18°C) with twice-daily checks?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 2 },
        { questionText: 'Are cooking and cooling cycles compliant (cooling from 63°C to 10°C in less than 2 hours in a blast chiller)?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 3 },
        { questionText: 'Are frying oils tested regularly for polar compounds (taux de composés polaires ≤ 25%) and changed on schedule?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 4 },
        { questionText: 'Are food handlers trained in mandatory hygiene (formation hygiène alimentaire HACCP 14h) with certificates available?', questionType: 'yes_no', severity: 'medium', requiresPhoto: false, order: 5 },
        { questionText: 'Is the Cleaning and Disinfection Plan (Plan de Nettoyage et Désinfection - PND) rigorously applied and signed?', questionType: 'rating', severity: 'medium', requiresPhoto: true, order: 6 },
        { questionText: 'Are the 14 statutory allergens communicated to consumers and cross-contamination prevented during prep?', questionType: 'yes_no', severity: 'medium', requiresPhoto: true, order: 7 },
        { questionText: 'Are pest control measures (lutte contre les nuisibles) contracted with inspection reports updated?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 8 },
      ],
    },
    {
      id: 'fr-workplace',
      title: 'French Workplace Safety & Facility Hygiene Standard',
      category: 'safety',
      description: 'Code du Travail standards for workplace safety, sanitation facilities, and fire prevention in commercial kitchens.',
      country: 'FR',
      countryName: 'France',
      authority: 'Code du Travail',
      isCountryDefault: true,
      questions: [
        { questionText: 'Are employee sanitary installations clean, ventilated, equipped with non-manual faucets and disposable towels?', questionType: 'rating', severity: 'medium', requiresPhoto: true, order: 1 },
        { questionText: 'Are emergency evacuation paths, fire extinguishers, and gas shut-off valves inspected and unobstructed?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 2 },
        { questionText: 'Are non-slip shoes and suitable personal protective equipment (PPE) worn by all staff members?', questionType: 'yes_no', severity: 'medium', requiresPhoto: false, order: 3 },
        { questionText: 'Are grease extraction hoods and ducts degreased and maintained according to fire safety regulations?', questionType: 'yes_no', severity: 'medium', requiresPhoto: true, order: 4 },
      ],
    },
  ],

  // ── 11. UNIVERSAL / GLOBAL CHECKLISTS (Codex Alimentarius & ISO 22000) ──────
  GLOBAL: [
    {
      id: 'universal-food-safety',
      title: 'Universal Food Safety & Kitchen Hygiene Standards',
      category: 'hygiene',
      description: 'Global benchmark hygiene audit based on WHO / FAO Codex Alimentarius and ISO 22000 Good Hygiene Practices (GHP).',
      country: 'GLOBAL',
      countryName: 'Universal / Global',
      authority: 'Codex Alimentarius / WHO',
      isCountryDefault: true,
      questions: [
        { questionText: 'Are high-risk perishable foods held under strict temperature control (chilled ≤ 5°C, hot held ≥ 60°C)?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 1 },
        { questionText: 'Are raw meats, poultry, and seafood strictly separated from ready-to-eat foods to eliminate cross-contamination?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 2 },
        { questionText: 'Are internal cooking temperatures verified with a sanitized probe thermometer before serving?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 3 },
        { questionText: 'Rate cleanliness and sanitization of food contact surfaces, slicing equipment, and preparation tables.', questionType: 'rating', severity: 'medium', requiresPhoto: true, order: 4 },
        { questionText: 'Are handwashing stations fully functional, unobstructed, and stocked with antibacterial soap and clean towels?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 5 },
        { questionText: 'Are food handlers wearing clean uniforms, hair restraints, and free from open cuts or communicable illnesses?', questionType: 'rating', severity: 'medium', requiresPhoto: false, order: 6 },
        { questionText: 'Is an effective pest exclusion and control program in place with no signs of pests or droppings?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 7 },
        { questionText: 'Are all ingredients stored elevated from the floor (>15cm) with clear First-In, First-Out (FIFO) labeling?', questionType: 'yes_no', severity: 'medium', requiresPhoto: false, order: 8 },
      ],
    },
    {
      id: 'universal-facility-sanitation',
      title: 'Universal Facility Sanitation, Water & Washroom Checklist',
      category: 'sanitation',
      description: 'Universal standard for commercial washroom sanitation, potable water safety, and waste management.',
      country: 'GLOBAL',
      countryName: 'Universal / Global',
      authority: 'WHO / ISO 22000',
      isCountryDefault: true,
      questions: [
        { questionText: 'Are restrooms separated from food handling zones, properly ventilated, and odor-free?', questionType: 'yes_no', severity: 'medium', requiresPhoto: false, order: 1 },
        { questionText: 'Rate restroom cleanliness, water availability, hand soap, and hygienic hand drying facilities.', questionType: 'rating', severity: 'medium', requiresPhoto: true, order: 2 },
        { questionText: 'Is continuous potable water supplied for food preparation and sanitation, with regular filter maintenance?', questionType: 'yes_no', severity: 'critical', requiresPhoto: false, order: 3 },
        { questionText: 'Are waste containers covered, foot-operated, and emptied regularly to prevent overflow and pest attraction?', questionType: 'yes_no', severity: 'medium', requiresPhoto: true, order: 4 },
        { questionText: 'Are commercial cleaning chemicals stored in a locked cabinet or dedicated area away from food products?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 5 },
        { questionText: 'Rate condition of floors, drains, and gullies: clean, dry, and free from slip hazards or grease accumulation.', questionType: 'rating', severity: 'medium', requiresPhoto: true, order: 6 },
      ],
    },
    {
      id: 'universal-workplace-safety',
      title: 'Universal Workplace Health, Fire & Safety Inspection',
      category: 'safety',
      description: 'International baseline for workplace occupational health, emergency preparedness, and fire safety.',
      country: 'GLOBAL',
      countryName: 'Universal / Global',
      authority: 'ILO / ISO 45001',
      isCountryDefault: true,
      questions: [
        { questionText: 'Are fire extinguishers tested, fully charged, tagged, and unblocked throughout the facility?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 1 },
        { questionText: 'Are emergency exit doors unlocked, illuminated, and corridors free of storage boxes or obstructions?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 2 },
        { questionText: 'Is a first aid kit fully stocked with emergency medical supplies readily accessible to staff?', questionType: 'yes_no', severity: 'medium', requiresPhoto: true, order: 3 },
        { questionText: 'Are electrical panels, cords, and machinery switches free from damage, exposed wires, or overloading?', questionType: 'yes_no', severity: 'critical', requiresPhoto: true, order: 4 },
        { questionText: 'Is appropriate Personal Protective Equipment (PPE) available and worn for high-risk tasks (heat, chemicals, cutting)?', questionType: 'yes_no', severity: 'medium', requiresPhoto: false, order: 5 },
      ],
    },
  ],
};

// ── INDUSTRY-SPECIFIC READY-TO-RUN AUDIT TEMPLATES ───────────────────────────
export const INDUSTRY_TEMPLATES: Record<string, ComplianceTemplate> = {
  // ── 1. RESTAURANT & FOOD SERVICE ───────────────────────────────────────────
  restaurant: {
    id: 'industry-restaurant-daily-ops',
    title: 'Restaurant Daily Operations & Food Safety Audit',
    category: 'hygiene',
    description: 'Comprehensive daily shift inspection covering cold chain integrity, cross-contamination, cooking critical control points, oil quality, sanitization, and food safety hygiene.',
    country: 'GLOBAL',
    countryName: 'Universal / Industry Benchmark',
    authority: 'HACCP & Codex Alimentarius',
    isIndustryDefault: true,
    industry: 'restaurant',
    industryName: 'Restaurant & Food Service',
    questions: [
      {
        questionText: 'Are walk-in chillers maintaining ≤ 4°C (40°F) and deep freezers ≤ -18°C (0°F) with digital temperature logs recorded?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: true,
        order: 1,
      },
      {
        questionText: 'Are raw animal proteins stored strictly beneath and separate from ready-to-eat (RTE) foods and fresh produce to eliminate cross-contamination?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: true,
        order: 2,
      },
      {
        questionText: 'Are all prepared ingredients and open food containers labeled with prep date, use-by date, and allergen indicators following FIFO?',
        questionType: 'yes_no',
        severity: 'medium',
        requiresPhoto: false,
        order: 3,
      },
      {
        questionText: 'Are internal cooking temperatures logged with a sanitized digital probe thermometer (poultry ≥ 74°C / 165°F, ground meats ≥ 68°C / 155°F)?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: true,
        order: 4,
      },
      {
        questionText: 'Are hot holding stations (steam tables, heat lamps, soup wells) holding cooked foods at a verified temperature of ≥ 60°C (140°F)?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: true,
        order: 5,
      },
      {
        questionText: 'Are sanitizing solution concentrations in 3-compartment sinks and wipe buckets verified with chemical test strips (quaternary 200–400 ppm / chlorine 50–100 ppm)?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: true,
        order: 6,
      },
      {
        questionText: 'Rate the cleanliness and sanitization of food contact surfaces, slicing machines, cutting boards, and stainless prep counters.',
        questionType: 'rating',
        severity: 'medium',
        requiresPhoto: true,
        order: 7,
      },
      {
        questionText: 'Are kitchen handwash stations unobstructed, fully equipped with warm running water, bactericidal liquid soap, and single-use paper towels?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: true,
        order: 8,
      },
      {
        questionText: 'Rate kitchen staff compliance with clean uniforms, aprons, hairnets/beard restraints, clean fingernails, and zero bare-hand contact with RTE food.',
        questionType: 'rating',
        severity: 'medium',
        requiresPhoto: false,
        order: 9,
      },
      {
        questionText: 'Rate kitchen extraction cleanliness: exhaust hood grease filters degreased, ventilation ducts clear, and floor gullies/grease traps unblocked.',
        questionType: 'rating',
        severity: 'medium',
        requiresPhoto: true,
        order: 10,
      },
      {
        questionText: 'Are kitchen pest exclusion defenses intact: rear screen doors sealed, air curtains operational, and prep areas free of pest activity or droppings?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: true,
        order: 11,
      },
      {
        questionText: 'Are main gas emergency shutoff valves accessible, commercial fire suppression pins intact, and kitchen rear exit doors completely unblocked?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: true,
        order: 12,
      },
    ],
  },

  // ── 2. RETAIL & SUPERMARKET ────────────────────────────────────────────────
  retail: {
    id: 'industry-retail-store-ops',
    title: 'Retail Store Operations & Visual Merchandising Audit',
    category: 'operations',
    description: 'Standardized retail walkthrough covering curb appeal, promotional planograms, shelf stock availability, pricing accuracy, stockroom safety, and loss prevention.',
    country: 'GLOBAL',
    countryName: 'Universal / Industry Benchmark',
    authority: 'NRF / Global Retail VM Standards',
    isIndustryDefault: true,
    industry: 'retail',
    industryName: 'Retail & Supermarket',
    questions: [
      {
        questionText: 'Is storefront signage fully illuminated, facade glass clean, entryway unobstructed, and current seasonal window display campaign installed?',
        questionType: 'yes_no',
        severity: 'medium',
        requiresPhoto: true,
        order: 1,
      },
      {
        questionText: 'Rate overall sales floor presentation: aisle cleanliness, polished flooring, fixture alignment, and clear customer walkways (min 36-inch width).',
        questionType: 'rating',
        severity: 'medium',
        requiresPhoto: true,
        order: 2,
      },
      {
        questionText: 'Are promotional end-caps, feature tables, and gondola headers arranged strictly according to the corporate visual merchandising (VM) planogram?',
        questionType: 'yes_no',
        severity: 'medium',
        requiresPhoto: true,
        order: 3,
      },
      {
        questionText: 'Rate shelf inventory fullness and facing: items pulled forward to shelf edge, zero visible stock voids, and top-shelf safety overhang limits respected.',
        questionType: 'rating',
        severity: 'medium',
        requiresPhoto: true,
        order: 4,
      },
      {
        questionText: 'Are electronic shelf labels (ESL) or printed shelf talkers present, aligned beneath each SKU, barcode-scannable, and matching POS checkout prices?',
        questionType: 'yes_no',
        severity: 'medium',
        requiresPhoto: false,
        order: 5,
      },
      {
        questionText: 'Are high-theft merchandise categories (electronics, cosmetics, designer apparel) secured with active EAS hard tags, spider wraps, or locked cabinets?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: true,
        order: 6,
      },
      {
        questionText: 'Rate customer checkout counter readiness: sanitized counters, receipt paper fully loaded, impulse racks organized, and cash drawers closed and locked.',
        questionType: 'rating',
        severity: 'low',
        requiresPhoto: true,
        order: 7,
      },
      {
        questionText: 'Are customer fitting rooms (or customer service desks) inspected, cleared of abandoned merchandise, clean, and mirrors streak-free?',
        questionType: 'rating',
        severity: 'low',
        requiresPhoto: false,
        order: 8,
      },
      {
        questionText: 'Is the stockroom backroom organized by category, pallets stored in marked zones off aisles, and boxes stacked stably below sprinkler clearance levels?',
        questionType: 'yes_no',
        severity: 'medium',
        requiresPhoto: true,
        order: 9,
      },
      {
        questionText: 'Are all stockroom emergency exit doors unlocked from the inside, panic hardware working, egress pathways clear, and electrical panels unobstructed?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: true,
        order: 10,
      },
      {
        questionText: 'Are retail display chillers/freezers (if applicable) operating within safe temperatures (chilled ≤ 4°C, frozen ≤ -18°C) with no condensation leaks or expired SKUs?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: true,
        order: 11,
      },
      {
        questionText: 'Are retail associates wearing official corporate uniforms with visible name tags, adhering to mobile phone floor policies, and greeting shoppers?',
        questionType: 'rating',
        severity: 'low',
        requiresPhoto: false,
        order: 12,
      },
    ],
  },

  // ── 3. MANUFACTURING & PROCESSING ──────────────────────────────────────────
  manufacturing: {
    id: 'industry-manufacturing-5s-ehs',
    title: 'Manufacturing Plant 5S, EHS & Quality Safety Walk',
    category: 'safety',
    description: 'Production floor audit verifying machine safeguarding, Lockout/Tagout (LOTO) protocols, PPE enforcement, chemical containment, 5S workspace organization, and quality control.',
    country: 'GLOBAL',
    countryName: 'Universal / Industry Benchmark',
    authority: 'OSHA 1910 / ISO 45001 / 5S Quality Standards',
    isIndustryDefault: true,
    industry: 'manufacturing',
    industryName: 'Manufacturing & Processing',
    questions: [
      {
        questionText: 'Are all machine interlocks, fixed guards, optical light curtains, and emergency stop (E-stop) buttons functional, visible, and unbypassed?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: true,
        order: 1,
      },
      {
        questionText: 'Are active maintenance and changeover jobs protected with physical lockouts, individual padlock lockout stations, danger tags, and zero-energy verification?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: true,
        order: 2,
      },
      {
        questionText: 'Are all shop floor operators, maintenance technicians, and visitors wearing mandatory PPE (steel-toe safety boots, safety glasses, hi-vis vests, hearing protection)?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: false,
        order: 3,
      },
      {
        questionText: 'Rate 5S discipline across assembly stations: hand tools shadowed and returned to shadow boards, work benches free of scrap, and designated scrap bins used.',
        questionType: 'rating',
        severity: 'medium',
        requiresPhoto: true,
        order: 4,
      },
      {
        questionText: 'Are pedestrian walkways and forklift transit lanes clearly painted with yellow demarcations, unobstructed by raw material totes, and intersection blind mirrors clean?',
        questionType: 'rating',
        severity: 'medium',
        requiresPhoto: true,
        order: 5,
      },
      {
        questionText: 'Are hazardous chemical drums stored on secondary spill containment bunds, grounding cables connected, and Safety Data Sheets (SDS) readily accessible?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: true,
        order: 6,
      },
      {
        questionText: 'Are emergency eyewash stations and deluge safety showers inspected weekly, clean, fully functional, and unobstructed within a 10-second travel distance?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: true,
        order: 7,
      },
      {
        questionText: 'Are overhead hoists, cranes, lifting chains, and synthetic slings visually inspected, safety latch hooks functional, and annual load test tags valid?',
        questionType: 'yes_no',
        severity: 'medium',
        requiresPhoto: false,
        order: 8,
      },
      {
        questionText: 'Are in-process quality control inspection sheets logged hourly with calibrated gauges, and are non-conforming defective parts segregated in locked reject bins?',
        questionType: 'yes_no',
        severity: 'medium',
        requiresPhoto: true,
        order: 9,
      },
      {
        questionText: 'Are plant fire extinguishers fully charged with pressure needles in the green zone, annual service tags valid, and fire exit rollup doors clear from inside?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: true,
        order: 10,
      },
      {
        questionText: 'Are pneumatic air lines free of audible pressure leaks, pressure regulators within rated psi, and electrical switchgear cabinets locked with no exposed wiring?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: true,
        order: 11,
      },
      {
        questionText: 'Rate overall plant housekeeping: shop floor concrete free of machine oil puddles or coolant slicks, and hazardous waste disposal drums properly closed.',
        questionType: 'rating',
        severity: 'medium',
        requiresPhoto: true,
        order: 12,
      },
    ],
  },

  // ── 4. HOTEL & HOSPITALITY ─────────────────────────────────────────────────
  hotel: {
    id: 'industry-hotel-quality-standards',
    title: 'Hotel Property Quality, Housekeeping & Guest Experience Audit',
    category: 'operations',
    description: 'Standardized property walkthrough assessing guest room housekeeping, bathroom sanitization, public lobby ambiance, elevator upkeep, staff grooming, pool safety, and hospitality brand standards.',
    country: 'GLOBAL',
    countryName: 'Universal / Industry Benchmark',
    authority: 'Forbes Travel Guide / AHLA Standards',
    isIndustryDefault: true,
    industry: 'hotel',
    industryName: 'Hotel & Hospitality',
    questions: [
      {
        questionText: 'Rate guest room bed presentation: linen immaculately clean and wrinkle-free, hospital corners tight, pillows plumped, and duvet centered to brand specifications.',
        questionType: 'rating',
        severity: 'medium',
        requiresPhoto: true,
        order: 1,
      },
      {
        questionText: 'Are guest bathroom surfaces spotless: zero stray hairs, chrome fixtures polished without water spots, toilet sanitized and sealed, and tile grout free of mildew?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: true,
        order: 2,
      },
      {
        questionText: 'Are guest room amenities fully replenished (toiletries, plush towels, tea/coffee bar, clean glassware, branded stationery, laundry bags)?',
        questionType: 'yes_no',
        severity: 'medium',
        requiresPhoto: false,
        order: 3,
      },
      {
        questionText: 'Are all room electronics fully functional (HVAC thermostat cooling/heating, bedside switches, smart TV streaming, electronic safe, mini-fridge temperature)?',
        questionType: 'yes_no',
        severity: 'medium',
        requiresPhoto: false,
        order: 4,
      },
      {
        questionText: 'Rate lobby ambiance and curb appeal: entrance glass doors clean, floral arrangements fresh, ambient temperature comfortable, background music balanced, and signature scent present.',
        questionType: 'rating',
        severity: 'low',
        requiresPhoto: true,
        order: 5,
      },
      {
        questionText: 'Rate elevator cab cleanliness, floor carpet vacuuming, corridor wall condition, and absence of unattended room service trays or housekeeping linen trolleys.',
        questionType: 'rating',
        severity: 'medium',
        requiresPhoto: true,
        order: 6,
      },
      {
        questionText: 'Are front-of-house staff in crisp corporate uniforms with name tags, acknowledging guests within 10 feet, and delivering warm, professional greetings?',
        questionType: 'rating',
        severity: 'medium',
        requiresPhoto: false,
        order: 7,
      },
      {
        questionText: 'Are all guest floor emergency stairwells completely unblocked, fire doors fully self-closing without wedges, and illuminated exit signs functional?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: true,
        order: 8,
      },
      {
        questionText: 'Are swimming pool safety devices (life rings, reaching poles) in place, depth markings clearly visible, and hourly water chemistry logs on file?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: true,
        order: 9,
      },
      {
        questionText: 'Are banquet/breakfast buffet stations maintained at safe holding temperatures (chilled food ≤ 4°C, hot chaffing units ≥ 60°C) with sneeze guards clean?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: true,
        order: 10,
      },
      {
        questionText: 'Are floor housekeeping pantries organized, clean guest linen stored elevated 6 inches off the floor, and chemical dilution dispensers operating properly?',
        questionType: 'yes_no',
        severity: 'medium',
        requiresPhoto: true,
        order: 11,
      },
      {
        questionText: 'Do guest room entrance doors close automatically and latch firmly with positive deadbolts, door chains, and optical peepholes intact?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: false,
        order: 12,
      },
    ],
  },

  // ── 5. HEALTHCARE & PHARMA ─────────────────────────────────────────────────
  healthcare: {
    id: 'industry-healthcare-clinic-pharma',
    title: 'Healthcare Clinic & Pharma Facility Compliance Audit',
    category: 'safety',
    description: 'Clinical and pharmacy facility inspection evaluating infection prevention, vaccine cold-chain integrity, biomedical waste handling, emergency cart readiness, and patient privacy.',
    country: 'GLOBAL',
    countryName: 'Universal / Industry Benchmark',
    authority: 'JCI / WHO Patient Safety / cGMP Standards',
    isIndustryDefault: true,
    industry: 'healthcare',
    industryName: 'Healthcare & Pharma',
    questions: [
      {
        questionText: 'Are vaccine, insulin, and biological cold-chain refrigerators strictly maintained at 2°C to 8°C (36°F to 46°F) with calibrated digital temperature data loggers verified twice daily?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: true,
        order: 1,
      },
      {
        questionText: 'Are color-coded biomedical waste bins (yellow, red, blue, black) lined with statutory biohazard bags, non-overflowing, foot-operated, and segregated per medical waste rules?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: true,
        order: 2,
      },
      {
        questionText: 'Are sharps disposal containers puncture-resistant, wall-mounted or safely placed, sealed before reaching the 3/4 full line, and labeled with hazardous sharps warnings?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: true,
        order: 3,
      },
      {
        questionText: 'Is the emergency crash cart / resuscitation kit inspected daily, tamper-evident break-away seal intact, emergency oxygen tank full, and defibrillator battery tested?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: true,
        order: 4,
      },
      {
        questionText: 'Are narcotics and schedule-controlled pharmaceuticals stored in a double-locked steel safe with discrepancy-free dual-signature perpetual inventory register logs?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: true,
        order: 5,
      },
      {
        questionText: 'Are clinical hand hygiene sinks and point-of-care alcohol hand rub dispensers fully stocked, unobstructed, with WHO 5 Moments of Hand Hygiene posters displayed?',
        questionType: 'yes_no',
        severity: 'medium',
        requiresPhoto: false,
        order: 6,
      },
      {
        questionText: 'Rate surface decontamination and high-level disinfection of examination tables, procedure chairs, diagnostic probe heads, and non-disposable clinical instruments.',
        questionType: 'rating',
        severity: 'critical',
        requiresPhoto: true,
        order: 7,
      },
      {
        questionText: 'Are all clinical pharmaceuticals, sterile disposable consumables, and intravenous fluids in pharmacy and ward stock strictly within valid expiration dates?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: false,
        order: 8,
      },
      {
        questionText: 'Rate clinical staff adherence to PPE protocols (nitrile gloves, fluid-resistant surgical masks, eye shields, protective gowns) between patient encounters.',
        questionType: 'rating',
        severity: 'medium',
        requiresPhoto: false,
        order: 9,
      },
      {
        questionText: 'Are autoclave and sterilizer chemical indicator strips / biological spore test results logged with daily sterilization batch records archived on file?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: true,
        order: 10,
      },
      {
        questionText: 'Are patient consultation room doors kept closed during physical exams, electronic medical record terminal screens angled away from public view, and physical charts locked (HIPAA/GDPR)?',
        questionType: 'yes_no',
        severity: 'medium',
        requiresPhoto: false,
        order: 11,
      },
      {
        questionText: 'Rate overall clinical sanitation: waiting area disinfection, sanitized patient restrooms, clean slip-resistant vinyl floors, and operational HEPA/HVAC air filtration.',
        questionType: 'rating',
        severity: 'medium',
        requiresPhoto: true,
        order: 12,
      },
    ],
  },

  // ── 6. LOGISTICS & WAREHOUSING ─────────────────────────────────────────────
  logistics: {
    id: 'industry-logistics-warehouse-dock',
    title: 'Warehouse Safety, Racking Integrity & Dock Operations Audit',
    category: 'safety',
    description: 'Comprehensive distribution center inspection evaluating heavy-duty racking structural integrity, forklift operations, loading dock safety, egress routes, and fire protection.',
    country: 'GLOBAL',
    countryName: 'Universal / Industry Benchmark',
    authority: 'OSHA 1910.178 / ANSI MH16.1 Racking Standards',
    isIndustryDefault: true,
    industry: 'logistics',
    industryName: 'Logistics & Warehousing',
    questions: [
      {
        questionText: 'Are industrial pallet rack uprights, crossbeams, and footplates free of forklift collision damage, bent uprights, missing safety locking pins, or visible deflection?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: true,
        order: 1,
      },
      {
        questionText: 'Are daily pre-shift inspection checklists completed for all active forklifts and reach trucks (horn, backup alarm, hydraulic controls, mast chains, brake test)?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: true,
        order: 2,
      },
      {
        questionText: 'Are marked pedestrian pathways, floor safety walkways, and steel bollard barriers respected with high-visibility safety vests worn by all floor personnel?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: false,
        order: 3,
      },
      {
        questionText: 'Are loading dock hydraulic levelers, dock lock vehicle restraints, wheel chocks, overhead safety netting, and red/green dock communication lights fully operational?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: true,
        order: 4,
      },
      {
        questionText: 'Are all warehouse personnel emergency exit doors unlocked from inside, lighted exit signs operational, and exterior discharge pads free of pallet stacks or trailers?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: true,
        order: 5,
      },
      {
        questionText: 'Is a minimum 18-inch (45 cm) vertical clearance maintained between top-pallet storage inventory and overhead fire sprinkler heads across all racking bays?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: true,
        order: 6,
      },
      {
        questionText: 'Rate warehouse aisle cleanliness: concrete floors clear of discarded stretch film, broken wood pallet splinters, loose strapping bands, and hydraulic oil slicks.',
        questionType: 'rating',
        severity: 'medium',
        requiresPhoto: true,
        order: 7,
      },
      {
        questionText: 'Are battery charging and propane refueling areas well-ventilated, equipped with an operational eyewash station, certified Class B/C fire extinguisher, and no-smoking signs posted?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: true,
        order: 8,
      },
      {
        questionText: 'Are outbound shipping pallets squarely built, stretch-wrapped securely to the wooden pallet base, within maximum stack height guidelines, and non-leaning?',
        questionType: 'yes_no',
        severity: 'medium',
        requiresPhoto: true,
        order: 9,
      },
      {
        questionText: 'Are hazardous goods or flammable materials stored in segregated, ventilated dangerous goods bays with chemical spill kits immediately accessible?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: true,
        order: 10,
      },
      {
        questionText: 'Are warehouse perimeter fences, trailer yard access gates, dock doors, and CCTV camera views secured against unauthorized entry (C-TPAT / TAPA standards)?',
        questionType: 'yes_no',
        severity: 'medium',
        requiresPhoto: false,
        order: 11,
      },
      {
        questionText: 'Rate the organization, labeling, and turnover discipline of inbound receiving and cross-dock staging bays: clear lane markings and zero blocked fire equipment.',
        questionType: 'rating',
        severity: 'low',
        requiresPhoto: true,
        order: 12,
      },
    ],
  },

  // ── 7. FACILITY MANAGEMENT ─────────────────────────────────────────────────
  facilities: {
    id: 'industry-facilities-building-ops',
    title: 'Commercial Facility Operations & Building Egress Audit',
    category: 'operations',
    description: 'Preventative maintenance and facilities audit covering MEP plant rooms, HVAC air filtration, fire life safety, janitorial standards, and building envelope safety.',
    country: 'GLOBAL',
    countryName: 'Universal / Industry Benchmark',
    authority: 'IFMA / BOMA / NFPA 101 Life Safety Standards',
    isIndustryDefault: true,
    industry: 'facilities',
    industryName: 'Facility Management',
    questions: [
      {
        questionText: 'Are all building emergency exit stairwells pressurized, fire doors self-closing without propping door wedges, and stair landings 100% free of stored items or trash?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: true,
        order: 1,
      },
      {
        questionText: 'Are main electrical panel rooms locked, clean, dry, with a minimum 36-inch (90 cm) unobstructed clearance in front of all switchgear and transformers?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: true,
        order: 2,
      },
      {
        questionText: 'Is the central fire alarm control panel (FACP) in normal operating condition with zero unacknowledged trouble, ground fault, or supervisory alarm signals?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: true,
        order: 3,
      },
      {
        questionText: 'Are all building fire extinguishers and hose reel cabinets inspected monthly, inspection tag signed, pressure gauge in green zone, and completely unblocked?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: true,
        order: 4,
      },
      {
        questionText: 'Are HVAC air handling units (AHU) and chiller plant rooms operating without vibration anomalies, filter differential pressures within limits, and free of condensate leaks?',
        questionType: 'yes_no',
        severity: 'medium',
        requiresPhoto: true,
        order: 5,
      },
      {
        questionText: 'Rate general cleanliness, odor control, and hygiene replenishment across public/tenant washrooms (automated faucets, soap dispensers, paper supplies, dry floors).',
        questionType: 'rating',
        severity: 'medium',
        requiresPhoto: true,
        order: 6,
      },
      {
        questionText: 'Are passenger elevators operating smoothly, emergency two-way phone buttons tested, inspection certificates current, and escalator comb plates/stop buttons clear?',
        questionType: 'yes_no',
        severity: 'medium',
        requiresPhoto: false,
        order: 7,
      },
      {
        questionText: 'Are roof storm water drains, scuppers, parapet gutters, and basement storm sump pumps cleared of leaf debris and tested for extreme weather readiness?',
        questionType: 'yes_no',
        severity: 'medium',
        requiresPhoto: true,
        order: 8,
      },
      {
        questionText: 'Are janitorial chemical closets locked, cleaning detergents stored in original labeled containers, and Safety Data Sheets (SDS) posted on walls?',
        questionType: 'yes_no',
        severity: 'medium',
        requiresPhoto: false,
        order: 9,
      },
      {
        questionText: 'Rate exterior property presentation: glass entrance doors clean, pedestrian walkways free of trip hazards, exterior lighting functional, and parking stalls marked.',
        questionType: 'rating',
        severity: 'low',
        requiresPhoto: true,
        order: 10,
      },
      {
        questionText: 'Is the emergency standby diesel generator fuel day-tank at ≥ 75% capacity, battery charger operational, and weekly automated test run log verified?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: true,
        order: 11,
      },
      {
        questionText: 'Are facility master keys accounted for, server room access logs signed, and after-hours security badge card readers functioning at perimeter doors?',
        questionType: 'yes_no',
        severity: 'medium',
        requiresPhoto: false,
        order: 12,
      },
    ],
  },

  // ── 8. OTHER / MULTI-LOCATION OPERATIONS ───────────────────────────────────
  other: {
    id: 'industry-universal-multi-location',
    title: 'Multi-Location Operational Excellence & Safety Audit',
    category: 'operations',
    description: 'Universal multi-location operations audit covering opening/closing readiness, customer area presentation, occupational health & safety, and inventory control.',
    country: 'GLOBAL',
    countryName: 'Universal / Industry Benchmark',
    authority: 'ISO 9001 / ISO 45001 Baseline Standards',
    isIndustryDefault: true,
    industry: 'other',
    industryName: 'Multi-Location Operations',
    questions: [
      {
        questionText: 'Are all emergency exit doors unlocked from the inside during operating hours, illuminated exit signs operational, and evacuation corridors fully clear?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: true,
        order: 1,
      },
      {
        questionText: 'Are portable fire extinguishers inspected, tagged within 12 months, fully charged in the green zone, and easily accessible without moving items?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: true,
        order: 2,
      },
      {
        questionText: 'Are electrical equipment, power cords, and multi-plug adaptors in safe working condition with zero exposed conductors, loose wires, or daisy-chained cords?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: true,
        order: 3,
      },
      {
        questionText: 'Rate overall cleanliness, lighting quality, temperature comfort, and brand presentation across customer-facing and operational workspaces.',
        questionType: 'rating',
        severity: 'medium',
        requiresPhoto: true,
        order: 4,
      },
      {
        questionText: 'Rate washroom cleanliness, odor control, mechanical ventilation, continuous potable water, liquid soap, and hand drying supplies.',
        questionType: 'rating',
        severity: 'medium',
        requiresPhoto: true,
        order: 5,
      },
      {
        questionText: 'Are inventory boxes and supplies stored elevated off the floor (>15 cm) on sturdy shelving with items stacked safely within weight limits?',
        questionType: 'yes_no',
        severity: 'medium',
        requiresPhoto: true,
        order: 6,
      },
      {
        questionText: 'Is a designated first aid kit fully stocked with emergency medical supplies, easily accessible to all staff, and inspected monthly?',
        questionType: 'yes_no',
        severity: 'medium',
        requiresPhoto: true,
        order: 7,
      },
      {
        questionText: 'Rate on-duty team compliance with corporate grooming, uniform guidelines, employee identification badges, and operational SOP standards.',
        questionType: 'rating',
        severity: 'low',
        requiresPhoto: false,
        order: 8,
      },
      {
        questionText: 'Are common customer counters, door handles, touch points, and point-of-sale payment terminals sanitized according to routine cleaning logs?',
        questionType: 'yes_no',
        severity: 'low',
        requiresPhoto: false,
        order: 9,
      },
      {
        questionText: 'Are closing cash handling procedures, safe drop locks, sensitive document shredding, and perimeter door latches verified and logged at end of shift?',
        questionType: 'yes_no',
        severity: 'critical',
        requiresPhoto: false,
        order: 10,
      },
      {
        questionText: 'Are any facility maintenance issues (burnt-out lights, plumbing leaks, broken furniture, HVAC noise) logged with immediate corrective action tickets assigned?',
        questionType: 'yes_no',
        severity: 'medium',
        requiresPhoto: true,
        order: 11,
      },
      {
        questionText: 'Are daily opening inspection checklists completed prior to operational hours and signed off by the on-duty shift supervisor?',
        questionType: 'yes_no',
        severity: 'medium',
        requiresPhoto: false,
        order: 12,
      },
    ],
  },
};

/**
 * Normalizes any freeform industry label or key into one of the 8 canonical keys.
 */
export function normalizeIndustry(raw?: string): string {
  if (!raw) return 'other';
  const val = raw.toLowerCase().trim();
  if (val.includes('restaurant') || val.includes('food') || val.includes('qsr') || val.includes('kitchen') || val.includes('cafe')) {
    return 'restaurant';
  }
  if (val.includes('retail') || val.includes('supermarket') || val.includes('grocery') || val.includes('store') || val.includes('merchandis')) {
    return 'retail';
  }
  if (val.includes('manufactur') || val.includes('process') || val.includes('plant') || val.includes('factory') || val.includes('industrial')) {
    return 'manufacturing';
  }
  if (val.includes('hotel') || val.includes('hospitality') || val.includes('resort') || val.includes('lodging')) {
    return 'hotel';
  }
  if (val.includes('health') || val.includes('pharma') || val.includes('clinic') || val.includes('medical') || val.includes('hospital') || val.includes('dental')) {
    return 'healthcare';
  }
  if (val.includes('logistic') || val.includes('warehouse') || val.includes('distribution') || val.includes('supply chain') || val.includes('freight')) {
    return 'logistics';
  }
  if (val.includes('facilit') || val.includes('property') || val.includes('building') || val.includes('real estate') || val.includes('maintenance')) {
    return 'facilities';
  }
  return 'other';
}

/**
 * Returns the ready-to-run template for a given industry.
 */
export function getIndustryTemplate(industryKeyOrLabel?: string): ComplianceTemplate {
  const key = normalizeIndustry(industryKeyOrLabel);
  return INDUSTRY_TEMPLATES[key] || INDUSTRY_TEMPLATES.other;
}

/**
 * Returns all industry audit templates as an array.
 */
export function getAllIndustryTemplates(): ComplianceTemplate[] {
  return Object.values(INDUSTRY_TEMPLATES);
}

/**
 * Returns initial templates to provision for a newly created organization.
 * Provisions:
 * 1. The dedicated, ready-to-run industry template for their selected industry.
 * 2. A complementary country-specific safety / sanitation compliance standard.
 * Exactly 2 templates, staying comfortably within the 5 custom templates limit on free plans.
 */
export function getInitialTemplatesForOrg(
  rawIndustry?: string,
  countryCodes: string[] = ['IN']
): ComplianceTemplate[] {
  const industryKey = normalizeIndustry(rawIndustry);
  const primaryIndustryTemplate = INDUSTRY_TEMPLATES[industryKey] || INDUSTRY_TEMPLATES.other;

  const result: ComplianceTemplate[] = [{ ...primaryIndustryTemplate }];

  const primaryCountry = countryCodes && countryCodes.length > 0 ? countryCodes[0] : 'IN';
  const countryTemplates = getDefaultTemplatesForCountry(primaryCountry);

  if (industryKey === 'restaurant') {
    // For restaurant, pair with the country's sanitation / washroom standard
    const sanitationTmpl =
      countryTemplates.find((t) => t.category === 'sanitation' || t.category === 'safety') ||
      countryTemplates[1] ||
      countryTemplates[0];
    if (sanitationTmpl && sanitationTmpl.id !== primaryIndustryTemplate.id) {
      result.push(sanitationTmpl);
    }
  } else {
    // For non-restaurant industries, pair with the country's workplace safety / sanitation standard
    const safetyTmpl =
      countryTemplates.find((t) => t.category === 'safety' || t.category === 'sanitation') ||
      COMPLIANCE_TEMPLATES.GLOBAL.find((t) => t.category === 'safety');
    if (safetyTmpl && safetyTmpl.id !== primaryIndustryTemplate.id) {
      result.push(safetyTmpl);
    }
  }

  return result;
}

/**
 * Returns compliance templates for a given country code.
 * If the country has specific templates (e.g. Top 10), returns them.
 * Otherwise, returns the universal/global templates.
 */
export function getDefaultTemplatesForCountry(countryCode?: string): ComplianceTemplate[] {
  if (!countryCode) return COMPLIANCE_TEMPLATES.GLOBAL;
  const upper = countryCode.toUpperCase();
  if (COMPLIANCE_TEMPLATES[upper]) {
    return COMPLIANCE_TEMPLATES[upper];
  }
  return COMPLIANCE_TEMPLATES.GLOBAL;
}

/**
 * Returns templates for multiple countries (deduplicated).
 */
export function getDefaultTemplatesForCountries(countryCodes: string[]): ComplianceTemplate[] {
  if (!countryCodes || countryCodes.length === 0) {
    return COMPLIANCE_TEMPLATES.GLOBAL;
  }

  const result: ComplianceTemplate[] = [];
  const seenIds = new Set<string>();

  countryCodes.forEach(code => {
    const templates = getDefaultTemplatesForCountry(code);
    templates.forEach(t => {
      if (!seenIds.has(t.id)) {
        seenIds.add(t.id);
        result.push(t);
      }
    });
  });

  return result.length > 0 ? result : COMPLIANCE_TEMPLATES.GLOBAL;
}

/**
 * Helper to find country info by code.
 */
export function getCountryInfo(code?: string): CountryInfo {
  if (!code) {
    return { code: 'GLOBAL', name: 'Universal / International', flag: '🌐', hasSpecificTemplates: true };
  }
  const upper = code.toUpperCase();
  const found = ALL_COUNTRIES.find(c => c.code === upper);
  return found || { code: upper, name: upper, flag: '🌐', hasSpecificTemplates: false };
}
