# scripts/execute_interlinking.py
import os
import re

BLOG_DIR = "/Users/sanskar/Documents/Asellus/Audiment/content/blog"
ROOT_LOG = "/Users/sanskar/Documents/Asellus/Audiment/linking summary.md"
DOCS_LOG = "/Users/sanskar/Documents/Asellus/Audiment/internal docs/linking summary.md"

logs = []

def append_to_file_if_missing(filepath, marker, addition, log_desc):
    if not os.path.exists(filepath):
        print(f"Skipping {filepath}, file not found")
        return False
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if link already present
    test_str = re.search(r'\[([^\]]+)\]\(([^)]+)\)', addition)
    if test_str:
        link_target = test_str.group(2)
        if link_target in content:
            # Already linked
            return False

    if marker in content:
        content = content.replace(marker, marker + "\n" + addition)
    else:
        content += "\n\n" + addition

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    logs.append(log_desc)
    print(f"Updated: {os.path.basename(filepath)} -> {log_desc}")
    return True

# 1. Update Existing Pillar Blogs with Links to New Industry Blogs and Comparison Pages
updates = [
    {
        "file": "best-audit-management-software.mdx",
        "marker": "## Which Audit Management Software Is Right for You?",
        "addition": """### Industry-Specific Audit Software Comparisons
Depending on your operational sector, standard audit tools may lack required regulatory frameworks or evidence controls. Explore our dedicated 2026 industry evaluations:
- **Food & Beverage**: [Best Restaurant Audit & Inspection Software for Multi-Unit Chains](/blog/best-restaurant-audit-software-multi-unit) and [Food Safety Audit Software](/blog/best-food-safety-audit-software)
- **Retail & Visual Merchandising**: [Best Retail Store Audit & Visual Merchandising Software](/blog/best-retail-store-audit-software-chains)
- **Franchise Networks**: [Best Franchise Audit Software for Brand Standards](/blog/best-franchise-audit-software-brand-standards)
- **Manufacturing & Industrial**: [Best Manufacturing Plant Audit Software for 5S & Safety](/blog/best-manufacturing-plant-audit-software-5s)
- **Healthcare & Clinical**: [Best Hospital & Healthcare Facility Inspection Software](/blog/best-hospital-healthcare-inspection-software)
- **Corporate & Statutory**: [Best Corporate Internal Audit & SOX Compliance Software](/blog/best-corporate-internal-audit-sox-software)
- **Logistics & Warehousing**: [Best Warehouse & Logistics Inspection Software](/blog/best-warehouse-logistics-inspection-software)

You can also compare direct alternatives in our detailed head-to-head reviews: [Audiment vs SafetyCulture](/compare/audiment-vs-safetyculture), [Audiment vs GoAudits](/compare/audiment-vs-goaudits), [Audiment vs Zenput](/compare/audiment-vs-zenput), and [Audiment vs MaintainX](/compare/audiment-vs-maintainx).
""",
        "log": "best-audit-management-software.mdx: Added Industry-Specific Audit Software Comparisons linking to restaurant, retail, franchise, manufacturing, hospital, corporate SOX, and warehouse blogs, plus comparison pages for SafetyCulture, GoAudits, Zenput, and MaintainX."
    },
    {
        "file": "best-compliance-audit-software.mdx",
        "marker": "## Frequently Asked Questions",
        "addition": """### Related Regulated Industry Audit Guides
For compliance teams in highly regulated sectors requiring strict evidence verification, explore our dedicated evaluations:
- [Best Hospital & Healthcare Facility Inspection Software in 2026](/blog/best-hospital-healthcare-inspection-software)
- [Best Pharmaceutical Quality Audit & GxP Inspection Software](/blog/best-pharmaceutical-quality-audit-software-gxp)
- [Best Corporate Internal Audit & SOX Compliance Software](/blog/best-corporate-internal-audit-sox-software)
- [Audiment vs AuditBoard: Head-to-Head Comparison](/compare/audiment-vs-auditboard)
- [Audiment vs ComplianceQuest: Enterprise Breakdown](/compare/audiment-vs-compliancequest)
""",
        "log": "best-compliance-audit-software.mdx: Added links to healthcare, pharma GxP, and corporate SOX audit blogs, plus AuditBoard and ComplianceQuest comparisons."
    },
    {
        "file": "best-field-audit-software.mdx",
        "marker": "## Frequently Asked Questions",
        "addition": """### Industry Field Inspection Evaluations
For operators managing physical infrastructure, jobsite safety, or linear assets:
- [Best Construction Site Inspection & Safety Software in 2026](/blog/best-construction-site-inspection-software)
- [Best Energy, Oil, Gas & Utility Field Inspection Software](/blog/best-energy-utility-field-inspection-software)
- [Best Warehouse & Logistics Inspection Software for 3PLs](/blog/best-warehouse-logistics-inspection-software)
- [Audiment vs Fulcrum: GIS & Field Inspection Breakdown](/compare/audiment-vs-fulcrum)
- [Audiment vs ProntoForms: Enterprise Field Workflow Comparison](/compare/audiment-vs-prontoforms)
""",
        "log": "best-field-audit-software.mdx: Added links to construction, energy utility, and warehouse blogs, plus Fulcrum and ProntoForms comparisons."
    },
    {
        "file": "best-food-safety-audit-software.mdx",
        "marker": "## Frequently Asked Questions",
        "addition": """### Related Food Industry Audit Guides
Explore operational guides for food service and manufacturing operations:
- [Best Restaurant Audit & Inspection Software for Multi-Unit Chains](/blog/best-restaurant-audit-software-multi-unit)
- [Best Food Processing Audit Software for HACCP & Hygiene](/blog/best-food-processing-haccp-audit-software)
- [Audiment vs Zenput: Operational Differences](/compare/audiment-vs-zenput)
- [Audiment vs Jolt: Kitchen Task Management vs Audit Governance](/compare/audiment-vs-jolt)
""",
        "log": "best-food-safety-audit-software.mdx: Added links to multi-unit restaurant and food processing HACCP blogs, plus Zenput and Jolt comparisons."
    },
    {
        "file": "best-franchise-audit-software.mdx",
        "marker": "## Frequently Asked Questions",
        "addition": """### Deep Dive Franchise Audit Resources
- [Best Franchise Audit Software for Brand Standards & Operations in 2026](/blog/best-franchise-audit-software-brand-standards)
- [Audiment vs MeazureUp: Franchise Audit Comparison](/compare/audiment-vs-meazureup)
- [Audiment vs Bindy: Retail & Franchise Standards](/compare/audiment-vs-bindy)
- [Audiment vs MyFieldAudits: Field Evaluation Breakdown](/compare/audiment-vs-myfieldaudits)
""",
        "log": "best-franchise-audit-software.mdx: Added links to franchise brand standards blog and MeazureUp, Bindy, and MyFieldAudits comparisons."
    },
    {
        "file": "best-inspection-checklist-apps.mdx",
        "marker": "## Frequently Asked Questions",
        "addition": """### Sector-Specific Inspection Checklists & Tools
- [Best Manufacturing Plant Audit Software for 5S & Safety in 2026](/blog/best-manufacturing-plant-audit-software-5s)
- [Best Commercial Facility Inspection & Property Audit Software](/blog/best-commercial-facility-inspection-software)
- [Best Warehouse & Logistics Inspection Software for Distribution Hubs](/blog/best-warehouse-logistics-inspection-software)
- [Audiment vs MaintainX: Frontline Inspection Comparison](/compare/audiment-vs-maintainx)
- [Audiment vs Lumiform: Digital Checklist Comparison](/compare/audiment-vs-lumiform)
""",
        "log": "best-inspection-checklist-apps.mdx: Added links to manufacturing, facility, and warehouse blogs, plus MaintainX and Lumiform comparisons."
    },
    {
        "file": "best-quality-audit-software.mdx",
        "marker": "## Frequently Asked Questions",
        "addition": """### Quality Audit Systems by Industry
- [Best Medical Device Quality Audit Software for ISO 13485 in 2026](/blog/best-medical-device-quality-audit-software)
- [Best Pharmaceutical Quality Audit & GxP Inspection Software](/blog/best-pharmaceutical-quality-audit-software-gxp)
- [Best Manufacturing Plant Audit Software for 5S & Safety](/blog/best-manufacturing-plant-audit-software-5s)
- [Audiment vs QT9 QMS: Quality Suite Comparison](/compare/audiment-vs-qt9-qms)
- [Audiment vs MasterControl: Operational Differences](/compare/audiment-vs-mastercontrol)
""",
        "log": "best-quality-audit-software.mdx: Added links to medical device, pharma GxP, and manufacturing blogs, plus QT9 QMS and MasterControl comparisons."
    },
    {
        "file": "restaurant-audit-guide.mdx",
        "marker": "## Frequently Asked Questions",
        "addition": """### Related Restaurant Audit Software Reviews
- [Best Restaurant Audit & Inspection Software for Multi-Unit Chains in 2026](/blog/best-restaurant-audit-software-multi-unit)
- [Best Food Processing Audit Software for HACCP & Hygiene](/blog/best-food-processing-haccp-audit-software)
- [Audiment vs Zenput: Full Operational Breakdown](/compare/audiment-vs-zenput)
- [Audiment vs Jolt: Frontline Kitchen Audits](/compare/audiment-vs-jolt)
""",
        "log": "restaurant-audit-guide.mdx: Added links to best restaurant audit software and food processing HACCP blogs, plus Zenput and Jolt comparisons."
    },
    {
        "file": "retail-store-audit.mdx",
        "marker": "## Frequently Asked Questions",
        "addition": """### Related Retail Operations & Audit Reviews
- [Best Retail Store Audit & Visual Merchandising Software for Chains in 2026](/blog/best-retail-store-audit-software-chains)
- [Best Commercial Facility Inspection & Property Audit Software](/blog/best-commercial-facility-inspection-software)
- [Audiment vs Bindy: Retail Brand Standards Comparison](/compare/audiment-vs-bindy)
- [Audiment vs Form.com: Enterprise Mobile Forms Review](/compare/audiment-vs-form-com)
""",
        "log": "retail-store-audit.mdx: Added links to retail store audit software and commercial facility inspection blogs, plus Bindy and Form.com comparisons."
    },
    {
        "file": "hotel-operations-audit-guide.mdx",
        "marker": "## Frequently Asked Questions",
        "addition": """### Related Hospitality Audit Reviews
- [Best Hotel Inspection & Quality Audit Software for Hospitality Chains in 2026](/blog/best-hotel-inspection-audit-software-hospitality)
- [Best Commercial Facility Inspection & Property Audit Software](/blog/best-commercial-facility-inspection-software)
- [Audiment vs GoAudits: Hospitality QA Comparison](/compare/audiment-vs-goaudits)
- [Audiment vs MyFieldAudits: Detailed Evaluation](/compare/audiment-vs-myfieldaudits)
""",
        "log": "hotel-operations-audit-guide.mdx: Added links to hotel inspection software and commercial facility blogs, plus GoAudits and MyFieldAudits comparisons."
    },
    {
        "file": "healthcare-regulated-operations-audits.mdx",
        "marker": "## Frequently Asked Questions",
        "addition": """### Healthcare & Life Sciences Compliance Reviews
- [Best Hospital & Healthcare Facility Inspection Software for Quality Compliance](/blog/best-hospital-healthcare-inspection-software)
- [Best Pharmaceutical Quality Audit & GxP Inspection Software in 2026](/blog/best-pharmaceutical-quality-audit-software-gxp)
- [Best Medical Device Quality Audit Software for ISO 13485](/blog/best-medical-device-quality-audit-software)
- [Audiment vs ComplianceQuest: Healthcare QMS Breakdown](/compare/audiment-vs-compliancequest)
- [Audiment vs Veeva Vault: Life Sciences Regulatory Comparison](/compare/audiment-vs-veeva-vault)
""",
        "log": "healthcare-regulated-operations-audits.mdx: Added links to hospital inspection, pharma GxP, and medical device blogs, plus ComplianceQuest and Veeva Vault comparisons."
    },
    {
        "file": "quality-control-manufacturing-audit-methods.mdx",
        "marker": "## Frequently Asked Questions",
        "addition": """### Manufacturing & Industrial Inspection Software
- [Best Manufacturing Plant Audit Software for 5S, Safety & Operations in 2026](/blog/best-manufacturing-plant-audit-software-5s)
- [Best Warehouse & Logistics Inspection Software for Distribution Hubs](/blog/best-warehouse-logistics-inspection-software)
- [Audiment vs MaintainX: Plant Maintenance & Audit Governance](/compare/audiment-vs-maintainx)
- [Audiment vs QT9 QMS: Quality Management Suite Comparison](/compare/audiment-vs-qt9-qms)
""",
        "log": "quality-control-manufacturing-audit-methods.mdx: Added links to manufacturing plant 5S and warehouse logistics blogs, plus MaintainX and QT9 QMS comparisons."
    },
    {
        "file": "how-to-prevent-fake-audits.mdx",
        "marker": "## Frequently Asked Questions",
        "addition": """### Related Audit Governance & Anti-Cheating Guides
- [Best Franchise Audit Software for Brand Standards & Multi-Unit Operations](/blog/best-franchise-audit-software-brand-standards)
- [Best Restaurant Audit & Inspection Software for Multi-Unit Chains](/blog/best-restaurant-audit-software-multi-unit)
- [Audiment vs SafetyCulture: Evidence Verification Breakdown](/compare/audiment-vs-safetyculture)
- [Audiment vs Checklist Apps: Why Self-Reported Forms Fail](/compare/audiment-vs-checklist-apps)
""",
        "log": "how-to-prevent-fake-audits.mdx: Added links to franchise audit software and restaurant audit software blogs, plus SafetyCulture and Checklist Apps comparisons."
    },
    {
        "file": "corrective-action-tracking.mdx",
        "marker": "## Frequently Asked Questions",
        "addition": """### Industry-Specific CAPA Implementations
- [Best Manufacturing Plant Audit Software for 5S & Safety in 2026](/blog/best-manufacturing-plant-audit-software-5s)
- [Best Hospital & Healthcare Facility Inspection Software](/blog/best-hospital-healthcare-inspection-software)
- [Best Commercial Facility Inspection & Property Audit Software](/blog/best-commercial-facility-inspection-software)
- [Audiment vs MaintainX: Automated CAPA Workflows](/compare/audiment-vs-maintainx)
""",
        "log": "corrective-action-tracking.mdx: Added links to manufacturing, healthcare, and commercial facility blogs, plus MaintainX comparison."
    },
    {
        "file": "what-is-operational-auditing.mdx",
        "marker": "## Frequently Asked Questions",
        "addition": """### Enterprise Operational Audit Software Reviews
- [Best Corporate Internal Audit & SOX Compliance Software in 2026](/blog/best-corporate-internal-audit-sox-software)
- [Best Enterprise Risk Management (ERM) & IT Compliance Software](/blog/best-enterprise-risk-management-audit-software)
- [Audiment vs AuditBoard: Physical Controls vs Financial SOX](/compare/audiment-vs-auditboard)
- [Audiment vs TeamMate+: Enterprise Internal Audit Breakdown](/compare/audiment-vs-teammate)
""",
        "log": "what-is-operational-auditing.mdx: Added links to corporate internal audit SOX and enterprise risk management blogs, plus AuditBoard and TeamMate+ comparisons."
    },
    {
        "file": "risk-management-audit-multi-location.mdx",
        "marker": "## Frequently Asked Questions",
        "addition": """### Enterprise Risk & Field Compliance Software
- [Best Enterprise Risk Management (ERM) & IT Compliance Audit Software in 2026](/blog/best-enterprise-risk-management-audit-software)
- [Best Energy, Oil, Gas & Utility Field Inspection Software](/blog/best-energy-utility-field-inspection-software)
- [Audiment vs LogicGate Risk Cloud: GRC & Operational Risk](/compare/audiment-vs-logicgate)
- [Audiment vs Hyperproof: Compliance Operations Review](/compare/audiment-vs-hyperproof)
""",
        "log": "risk-management-audit-multi-location.mdx: Added links to enterprise risk management and energy utility field inspection blogs, plus LogicGate and Hyperproof comparisons."
    },
    {
        "file": "outlet-audit-software.mdx",
        "marker": "## Frequently Asked Questions",
        "addition": """### Multi-Outlet Inspection Guides
- [Best Retail Store Audit & Visual Merchandising Software in 2026](/blog/best-retail-store-audit-software-chains)
- [Best Restaurant Audit & Inspection Software for Multi-Unit Chains](/blog/best-restaurant-audit-software-multi-unit)
- [Best Franchise Audit Software for Brand Standards](/blog/best-franchise-audit-software-brand-standards)
- [Audiment vs Bindy: Retail Audit Comparison](/compare/audiment-vs-bindy)
""",
        "log": "outlet-audit-software.mdx: Added links to retail store, restaurant, and franchise blogs, plus Bindy comparison."
    }
]

for up in updates:
    filepath = os.path.join(BLOG_DIR, up['file'])
    append_to_file_if_missing(filepath, up['marker'], up['addition'], up['log'])

# 2. Enrich the 15 New Industry Blogs with additional sister links
new_blog_updates = [
    {
        "file": "best-restaurant-audit-software-multi-unit.mdx",
        "marker": "**Related reading:**",
        "addition": """- [Best Franchise Audit Software for Brand Standards & Operations in 2026](/blog/best-franchise-audit-software-brand-standards)
- [Best Food Processing Audit Software for HACCP & Factory Hygiene](/blog/best-food-processing-haccp-audit-software)
- [How to Prevent Fake Audits Across Multi-Unit Networks](/blog/how-to-prevent-fake-audits)""",
        "log": "best-restaurant-audit-software-multi-unit.mdx: Added cross-links to franchise audit software, food processing HACCP, and fake audit prevention."
    },
    {
        "file": "best-retail-store-audit-software-chains.mdx",
        "marker": "**Related reading:**",
        "addition": """- [Best Franchise Audit Software for Brand Standards & Operations in 2026](/blog/best-franchise-audit-software-brand-standards)
- [Best Commercial Facility Inspection & Property Audit Software](/blog/best-commercial-facility-inspection-software)
- [Best Warehouse & Logistics Inspection Software for Distribution Hubs](/blog/best-warehouse-logistics-inspection-software)""",
        "log": "best-retail-store-audit-software-chains.mdx: Added cross-links to franchise brand standards, commercial facility inspection, and warehouse logistics."
    },
    {
        "file": "best-franchise-audit-software-brand-standards.mdx",
        "marker": "**Related reading:**",
        "addition": """- [Best Restaurant Audit & Inspection Software for Multi-Unit Chains](/blog/best-restaurant-audit-software-multi-unit)
- [Best Retail Store Audit & Visual Merchandising Software for Chains](/blog/best-retail-store-audit-software-chains)
- [Why Corrective Actions Fail in Multi-Location Operations](/blog/why-corrective-actions-fail-in-multi-location-operations)""",
        "log": "best-franchise-audit-software-brand-standards.mdx: Added cross-links to restaurant audit software, retail store audit software, and why corrective actions fail."
    },
    {
        "file": "best-hotel-inspection-audit-software-hospitality.mdx",
        "marker": "**Related reading:**",
        "addition": """- [Best Commercial Facility Inspection & Property Audit Software in 2026](/blog/best-commercial-facility-inspection-software)
- [Best Restaurant Audit & Inspection Software for Multi-Unit Chains](/blog/best-restaurant-audit-software-multi-unit)
- [Audiment vs GoAudits: Full Comparison](/compare/audiment-vs-goaudits)""",
        "log": "best-hotel-inspection-audit-software-hospitality.mdx: Added cross-links to commercial facility inspection, restaurant audit software, and GoAudits comparison."
    },
    {
        "file": "best-hospital-healthcare-inspection-software.mdx",
        "marker": "**Related reading:**",
        "addition": """- [Best Pharmaceutical Quality Audit & GxP Inspection Software in 2026](/blog/best-pharmaceutical-quality-audit-software-gxp)
- [Best Medical Device Quality Audit Software for ISO 13485 in 2026](/blog/best-medical-device-quality-audit-software)
- [Audiment vs ComplianceQuest: Healthcare QMS Review](/compare/audiment-vs-compliancequest)""",
        "log": "best-hospital-healthcare-inspection-software.mdx: Added cross-links to pharma quality audit, medical device ISO 13485, and ComplianceQuest comparison."
    },
    {
        "file": "best-pharmaceutical-quality-audit-software-gxp.mdx",
        "marker": "**Related reading:**",
        "addition": """- [Best Medical Device Quality Audit Software for ISO 13485 in 2026](/blog/best-medical-device-quality-audit-software)
- [Best Hospital & Healthcare Facility Inspection Software](/blog/best-hospital-healthcare-inspection-software)
- [Best Manufacturing Plant Audit Software for 5S & Safety](/blog/best-manufacturing-plant-audit-software-5s)""",
        "log": "best-pharmaceutical-quality-audit-software-gxp.mdx: Added cross-links to medical device quality audit, hospital inspection, and manufacturing plant 5S."
    },
    {
        "file": "best-medical-device-quality-audit-software.mdx",
        "marker": "**Related reading:**",
        "addition": """- [Best Pharmaceutical Quality Audit & GxP Inspection Software in 2026](/blog/best-pharmaceutical-quality-audit-software-gxp)
- [Best Manufacturing Plant Audit Software for 5S & Safety](/blog/best-manufacturing-plant-audit-software-5s)
- [Audiment vs QT9 QMS: Quality Management Suite Review](/compare/audiment-vs-qt9-qms)""",
        "log": "best-medical-device-quality-audit-software.mdx: Added cross-links to pharma quality audit, manufacturing 5S, and QT9 QMS comparison."
    },
    {
        "file": "best-manufacturing-plant-audit-software-5s.mdx",
        "marker": "**Related reading:**",
        "addition": """- [Best Warehouse & Logistics Inspection Software for Distribution Hubs](/blog/best-warehouse-logistics-inspection-software)
- [Best Food Processing Audit Software for HACCP & Factory Hygiene](/blog/best-food-processing-haccp-audit-software)
- [Best Commercial Facility Inspection & Property Audit Software](/blog/best-commercial-facility-inspection-software)""",
        "log": "best-manufacturing-plant-audit-software-5s.mdx: Added cross-links to warehouse logistics, food processing HACCP, and commercial facility software."
    },
    {
        "file": "best-food-processing-haccp-audit-software.mdx",
        "marker": "**Related reading:**",
        "addition": """- [Best Restaurant Audit & Inspection Software for Multi-Unit Chains](/blog/best-restaurant-audit-software-multi-unit)
- [Best Manufacturing Plant Audit Software for 5S & Safety in 2026](/blog/best-manufacturing-plant-audit-software-5s)
- [Audiment vs GoAudits: Food Safety Comparison](/compare/audiment-vs-goaudits)""",
        "log": "best-food-processing-haccp-audit-software.mdx: Added cross-links to restaurant audit software, manufacturing plant 5S, and GoAudits comparison."
    },
    {
        "file": "best-warehouse-logistics-inspection-software.mdx",
        "marker": "**Related reading:**",
        "addition": """- [Best Manufacturing Plant Audit Software for 5S & Safety in 2026](/blog/best-manufacturing-plant-audit-software-5s)
- [Best Construction Site Inspection & Safety Software in 2026](/blog/best-construction-site-inspection-software)
- [Best Commercial Facility Inspection & Property Audit Software](/blog/best-commercial-facility-inspection-software)""",
        "log": "best-warehouse-logistics-inspection-software.mdx: Added cross-links to manufacturing 5S, construction site inspection, and commercial facility inspection."
    },
    {
        "file": "best-construction-site-inspection-software.mdx",
        "marker": "**Related reading:**",
        "addition": """- [Best Energy, Oil, Gas & Utility Field Inspection Software in 2026](/blog/best-energy-utility-field-inspection-software)
- [Best Warehouse & Logistics Inspection Software for Distribution Hubs](/blog/best-warehouse-logistics-inspection-software)
- [Audiment vs ProntoForms: Field Inspection Comparison](/compare/audiment-vs-prontoforms)""",
        "log": "best-construction-site-inspection-software.mdx: Added cross-links to energy utility field inspection, warehouse logistics, and ProntoForms comparison."
    },
    {
        "file": "best-energy-utility-field-inspection-software.mdx",
        "marker": "**Related reading:**",
        "addition": """- [Best Construction Site Inspection & Safety Software in 2026](/blog/best-construction-site-inspection-software)
- [Best Enterprise Risk Management (ERM) & IT Compliance Software](/blog/best-enterprise-risk-management-audit-software)
- [Audiment vs Fluix: Document & Inspection Comparison](/compare/audiment-vs-fluix)""",
        "log": "best-energy-utility-field-inspection-software.mdx: Added cross-links to construction site inspection, enterprise risk management, and Fluix comparison."
    },
    {
        "file": "best-corporate-internal-audit-sox-software.mdx",
        "marker": "**Related reading:**",
        "addition": """- [Best Enterprise Risk Management (ERM) & IT Compliance Software in 2026](/blog/best-enterprise-risk-management-audit-software)
- [Audiment vs TeamMate+: Enterprise Internal Audit Breakdown](/compare/audiment-vs-teammate)
- [Audiment vs SAP Audit Management: Full Review](/compare/audiment-vs-sap-audit-management)""",
        "log": "best-corporate-internal-audit-sox-software.mdx: Added cross-links to enterprise risk management, TeamMate+ comparison, and SAP Audit Management comparison."
    },
    {
        "file": "best-enterprise-risk-management-audit-software.mdx",
        "marker": "**Related reading:**",
        "addition": """- [Best Corporate Internal Audit & SOX Compliance Software in 2026](/blog/best-corporate-internal-audit-sox-software)
- [Audiment vs LogicGate Risk Cloud: GRC Comparison](/compare/audiment-vs-logicgate)
- [Audiment vs MetricStream: Enterprise Risk Review](/compare/audiment-vs-metricstream)""",
        "log": "best-enterprise-risk-management-audit-software.mdx: Added cross-links to corporate internal audit SOX, LogicGate comparison, and MetricStream comparison."
    },
    {
        "file": "best-commercial-facility-inspection-software.mdx",
        "marker": "**Related reading:**",
        "addition": """- [Best Hotel Inspection & Quality Audit Software for Hospitality Chains](/blog/best-hotel-inspection-audit-software-hospitality)
- [Best Retail Store Audit & Visual Merchandising Software for Chains](/blog/best-retail-store-audit-software-chains)
- [Best Warehouse & Logistics Inspection Software in 2026](/blog/best-warehouse-logistics-inspection-software)""",
        "log": "best-commercial-facility-inspection-software.mdx: Added cross-links to hotel inspection, retail store audit, and warehouse logistics software."
    }
]

for up in new_blog_updates:
    filepath = os.path.join(BLOG_DIR, up['file'])
    append_to_file_if_missing(filepath, up['marker'], up['addition'], up['log'])

# Read existing log from DOCS_LOG if present
existing_log_content = ""
if os.path.exists(DOCS_LOG):
    with open(DOCS_LOG, 'r', encoding='utf-8') as f:
        existing_log_content = f.read()

# Build comprehensive updated summary
new_summary = f"""# Summary of Internal Links Added

## Comparison Pages & Industry Guides Interlinking (October 2026)
Added dedicated **Related Industry Guides & Alternative Comparisons** sections across all 32 comparison pages in `/compare/`, dynamically rendering:
- 4 curated industry-specific inspection blogs (linking to newly generated blogs for Restaurants, Retail, Franchises, Hospitality, Healthcare, Pharma, Medical Devices, Manufacturing, Food Processing, Warehousing, Construction, Energy, Corporate SOX, Enterprise Risk, and Commercial Facilities).
- 3 closely related competitor comparison pages per comparison view.

### Newly Updated Blog Interlinks (October 2026)
"""

for l in logs:
    new_summary += f"- {l}\n"

new_summary += "\n---\n\n## Historical Linking Log\n"
if existing_log_content:
    new_summary += existing_log_content.replace("# Summary of Internal Links Added\n", "")

# Write to ROOT_LOG
with open(ROOT_LOG, 'w', encoding='utf-8') as f:
    f.write(new_summary)

# Write to DOCS_LOG
with open(DOCS_LOG, 'w', encoding='utf-8') as f:
    f.write(new_summary)

print(f"\nInternal linking completed! Total new blog link sets added: {len(logs)}")
print(f"Updated linking summary written to:\n1. {ROOT_LOG}\n2. {DOCS_LOG}")
