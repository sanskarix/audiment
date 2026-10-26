import os

files_to_clean = {
    'content/blog/audit-software-for-clinic-chains-in-india.mdx': (
        r'```[\s\S]*?Clinic Chain Clinical Governance Drift[\s\S]*?```',
        '''```
Clinic Chain Clinical Governance Drift:

[Sterilisation Shortcuts]
Assistant cuts cycle; instruments cross-contaminate patients.

[Biomedical Waste Segregation Breach]
Needles dumped into municipal trash; Pollution Control Board issues closure notices.

[Expired Emergency Kits]
Adrenaline ampoules sit expired in crash cart; zero central visibility.
```'''
    ),
    'content/blog/how-to-digitise-infection-control-checklists-across-hospitals.mdx': (
        r'```[\s\S]*?The Paper Infection Control Breakdown[\s\S]*?```',
        '''```
The Paper Infection Control Breakdown:

[Delayed Outbreak Signal]
Swab failure noted on paper; clinical head discovers it 2 weeks later.

[Subjective Hand Hygiene]
Observers mark 100% compliance to avoid conflict with doctors.

[Lost Clinical Time]
Nurses spend 40 hours typing audit sheets into Excel for accreditation.
```'''
    ),
    'content/blog/fssai-audit-software-for-restaurants-and-food-chains-what-to-look.mdx': (
        r'```[\s\S]*?Food Safety Officer Arrives Unannounced[\s\S]*?```',
        '''```
FSSAI Unannounced Inspection Verification Flow:

[Stage 1: Food Safety Officer Arrives Unannounced at Branch]
Auditor enters kitchen and dining areas.

[Stage 2: Physical Kitchen Inspection (30-45 Minutes)]
- Inspects walk-in chiller, handwash sinks, and exhaust hoods.
- Tests cooking oil TPM and checks food expiry tags.

[Stage 3: Documentation Audit]
- Demands past 90 days of daily temperature logs.
- Requests Form IX medical fitness certificates and pest slips.
- Checks NABL water potability test reports.

[Stage 4: Verification Outcome Comparison]
- Paper-Based Outlet: Incomplete paper binders, missing oil log entries, disputed dates, improvement notice or fines issued.
- Digital Audit Outlet: Manager opens mobile browser, exports complete 90-day PDF with verifiable live photo proof; full compliance confirmed.
```'''
    ),
    'content/blog/audit-software-for-multi-brand-cloud-kitchens-in-india.mdx': (
        r'```[\s\S]*?MULTI-BRAND CLOUD KITCHEN AUDIT[\s\S]*?```',
        '''```
Multi-Brand Cloud Kitchen Audit Framework:

[Shared Facility Audit (Once Daily at Opening)]
- Walk-in chiller temp (< 4°C)
- Deep fryer oil TPM (< 25%)
- Pest control station seal checks
- Shared handwash station supplies

[Brand-Specific SOP Audits (Twice Daily per Brand)]
- Brand A (Biryani): Rice and meat portion ratio verification
- Brand B (Burgers): Patty core temp check (> 75°C)
- Brand C (Salads): Leaf wash sanitizing PPM verification
- Packaging Standard: Tamper-proof bag sealing and brand sleeves
```'''
    ),
    'content/blog/how-to-run-shift-by-shift-hygiene-checks-across-50-qsr-outlets.mdx': (
        r'```[\s\S]*?50 Outlets Submit Shift-by-Shift Proof Audits[\s\S]*?```',
        '''```
Shift-by-Shift Hygiene Exception Routing:

[Stage 1: 50 Outlets Submit Shift-by-Shift Proof Audits]
Managers complete digital checks with mandatory live photos.

[Stage 2: Central Analytics Engine Filters Daily Data]
Automated rule engine detects temperature drift and missed inspections.

[Stage 3: Automated Outlet Segmentation]
- 42 Outlets Compliant: On-time submissions, proof photos verified, zero open critical CAPA tickets.
- 8 Outlets Flagged: Chiller temp > 6°C, 3 consecutive late audits, or unresolved 48-hour SLA tickets.

[Stage 4: Action Routing]
- Compliant Outlets: Normal operations, no physical visit needed.
- Problem Outlets: Area coach route auto-generated to visit only the 8 problem locations immediately.
```'''
    ),
    'content/blog/how-to-give-franchisees-proof-of-failed-audits-without-arguments.mdx': (
        r'```[\s\S]*?Auditor Opens Question: "Customer Merchandising Display"[\s\S]*?```',
        '''```
Photographic Proof-of-Failure Workflow:

[Stage 1: Auditor Opens Evaluation Point]
Auditor initiates inspection for "Customer Merchandising Display".

[Stage 2: Side-by-Side Reference Comparison]
- Official Brand Benchmark: Shows approved acrylic display case, 10cm product spacing, and legible price tags.
- Live On-Site Camera Capture: Shows crooked cardboard signs, cluttered promotional flyers, and missing price tags.

[Stage 3: Objective Deduction Applied]
Franchisee sees the visual contrast instantly; score deduction applied without subjective debate.
```'''
    ),
    'content/blog/how-to-hold-restaurant-outlet-managers-accountable-for-fixing-audit.mdx': (
        r'```[\s\S]*?AUDIT FINDING SEVERITY CLASSIFICATION[\s\S]*?```',
        '''```
Audit Finding Severity Classification & Resolution SLAs:

[Critical Hazard (SLA: 24 Hours)]
- Raw meat cross-contact risks
- Expired dairy batches
- Zero sanitizer concentration in 3-compartment sink
- Active pest sightings

[Operational Defect (SLA: 48 Hours)]
- Chiller running at 6°C
- Deep fryer timer broken
- Missing FIFO prep labels
- Burnt-out kitchen bulbs

[Aesthetic or Minor Defect (SLA: 7 Days)]
- Chipped dining room tile
- Scuffed baseboards
- Loose customer restroom door handle
- Faded promotional poster
```'''
    ),
    'content/blog/can-zoho-forms-or-airtable-replace-audit-software-for-restaurants.mdx': (
        r'```[\s\S]*?15-OUTLET NO-CODE STACK TOTAL ANNUAL COST BREAKDOWN[\s\S]*?```',
        '''```
Fragility of Generic Form Stacks Under Daily Operations:

[Zoho Form Intake]
Gallery photo uploads allowed; staff upload old photos with no GPS lock.

[Airtable Database Layer]
Custom script calculates score; fails whenever schema or fields change.

[Manual Email & Slack Alerts]
Sends task to store manager with no ticket tracking or required photo proof.

[Offline Failure Edge Case]
Kitchen basement loses cellular connection; inspection data lost before upload.
```'''
    ),
}

import re
for fpath, (pattern, replacement) in files_to_clean.items():
    if os.path.exists(fpath):
        txt = open(fpath, 'r', encoding='utf-8').read()
        new_txt = re.sub(pattern, replacement, txt)
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(new_txt)
        print(f"Updated {fpath}")
