# Reporting & PDF Export Engine

Audiment provides analytics and high-fidelity PDF exporting for executive reviews, regulatory compliance filings, and franchise audits.

---

## 📊 Analytics & Reporting Suite

### 1. Compliance Health Dashboard
* Calculates overall organizational compliance percentage in real time.
* Color-coded score indicators:
  * 🟢 **Green (≥ 90%):** Excellent compliance.
  * 🟡 **Amber (60% – 89%):** Needs attention.
  * 🔴 **Red (< 60%):** High failure risk.

### 2. Regional Comparison Matrix
* Renders interactive **Recharts** bar and line graphs.
* Side-by-side outlet scoring ranks best-performing vs worst-performing outlets.

---

## 📄 High-Fidelity PDF Export Engine

Audiment implements a client-side PDF export pipeline using `jsPDF` and `html2canvas-pro`.

### Pipeline Execution Steps:
1. **Report Component Cloning:** When the user clicks "Export PDF", the report view container is targeted.
2. **CSS Stripping & Cleanup:** Temporary styles remove dynamic UI buttons, dark mode overrides, and interactive controls to format clean white-page PDF layouts.
3. **HTML-to-Canvas Canvas Conversion:** `html2canvas-pro` converts the styled DOM elements into a 300 DPI high-resolution canvas.
4. **Multi-Page Page Partitioning:** `jsPDF` partitions the image canvas into standard A4 pages without cutting text or images mid-line.
5. **Direct Download:** Triggers browser file save with standardized naming (`Audit_Report_<Location>_<Date>.pdf`).
