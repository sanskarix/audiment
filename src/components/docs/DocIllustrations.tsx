import React from 'react';

// ─── Shared Illustration Shell ───────────────────────────────────────────────

interface IllustrationFrameProps {
  badge: string;
  title: string;
  children: React.ReactNode;
}

const IllustrationFrame: React.FC<IllustrationFrameProps> = ({ badge, title, children }) => (
  <div className="not-prose my-8 border border-[#e8e8e8] bg-white">
    <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-[#e8e8e8] bg-[#FAFAFA]">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-[#FF5400]" />
        <span className="font-mono text-[11px] tracking-wider uppercase text-neutral-600">
          {badge}
        </span>
      </div>
      <span className="font-mono text-[11px] text-neutral-400">
        {title}
      </span>
    </div>
    <div className="p-5 sm:p-7 max-w-2xl mx-auto">
      {children}
    </div>
  </div>
);


// ─── 1. CAPA Lifecycle Illustration (Minimal Architectural Flow) ──────────────

export const CapaLifecycleIllustration: React.FC = () => (
  <div className="not-prose my-8 border border-[#e8e8e8] bg-white">
    {/* Frame Header */}
    <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-[#e8e8e8] bg-[#FAFAFA]">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-[#FF5400]" />
        <span className="font-mono text-[11px] tracking-wider uppercase text-neutral-600">
          Workflow Architecture
        </span>
      </div>
      <span className="font-mono text-[11px] text-neutral-400">
        The 48-Hour CAPA Lifecycle
      </span>
    </div>

    {/* Diagram Body */}
    <div className="p-5 sm:p-7 max-w-xl mx-auto space-y-4">
      {/* Node 1: Submission */}
      <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono text-[10px] tracking-widest uppercase text-neutral-400">
            Phase 01 // Input
          </span>
          <span className="font-mono text-[10px] text-neutral-400">Mobile Inspector</span>
        </div>
        <div className="text-sm font-normal text-[#181818]">
          Audit Submitted by Field Auditor
        </div>
        <p className="text-xs text-neutral-500 mt-1">
          Scoring engine processes checklist responses and verifies geo-stamped evidence.
        </p>
      </div>

      {/* Hairline Connector */}
      <div className="flex flex-col items-center">
        <div className="w-px h-5 bg-[#e8e8e8]" />
        <div className="w-1.5 h-1.5 rotate-45 border-b border-r border-neutral-400 -mt-1" />
      </div>

      {/* Node 2: Decision Gate */}
      <div className="border border-neutral-900 bg-white p-4 text-center">
        <div className="font-mono text-[10px] tracking-widest uppercase text-[#FF5400] mb-1.5">
          Decision Gate
        </div>
        <div className="text-xs font-mono text-neutral-900 bg-[#FAFAFA] border border-[#e8e8e8] py-1.5 px-3 inline-block">
          Severity == &quot;Critical&quot; &amp;&amp; Answer Failed
        </div>
      </div>

      {/* Split Branch */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        {/* Branch NO */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 px-2 py-0.5 border border-[#e8e8e8] bg-[#FAFAFA]">
              No // Non-Critical
            </span>
            <div className="flex-1 h-px bg-[#e8e8e8]" />
          </div>
          <div className="border border-[#e8e8e8] bg-white p-4 flex-1 flex flex-col justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase text-neutral-400 mb-1">
                Standard Pipeline
              </div>
              <div className="text-sm font-normal text-[#181818]">
                Routine Score Calculated
              </div>
              <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                Performance recorded to location score. Normal report archived without incident escalation.
              </p>
            </div>
          </div>
        </div>

        {/* Branch YES */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#FF5400] px-2 py-0.5 border border-[#FF5400]/40 bg-white">
              Yes // Critical Incident
            </span>
            <div className="flex-1 h-px bg-[#FF5400]/40" />
          </div>
          <div className="border-l-2 border-l-[#FF5400] border border-[#e8e8e8] bg-[#FAFAFA] p-4 flex-1 flex flex-col justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase text-[#FF5400] mb-1">
                Remediation Triggered
              </div>
              <div className="text-sm font-normal text-[#181818]">
                Auto-Create CAPA Document
              </div>
              <div className="mt-2.5 pt-2.5 border-t border-[#e8e8e8] space-y-1.5 text-xs text-neutral-600 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">SLA Window</span>
                  <span className="text-[#FF5400] font-medium">Strict 48h Deadline</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Ownership</span>
                  <span className="text-neutral-800">Outlet Manager</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Dispatch</span>
                  <span className="text-neutral-800">Urgent Notification</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hairline Connector */}
      <div className="flex flex-col items-center">
        <div className="w-px h-5 bg-[#e8e8e8]" />
        <div className="w-1.5 h-1.5 rotate-45 border-b border-r border-neutral-400 -mt-1" />
      </div>

      {/* Node 3: Manager Rectification */}
      <div className="border border-[#e8e8e8] bg-white p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono text-[10px] tracking-widest uppercase text-neutral-400">
            Phase 03 // Remediation
          </span>
          <span className="font-mono text-[10px] text-neutral-400">Store Level</span>
        </div>
        <div className="text-sm font-normal text-[#181818]">
          Manager Resolves Violation on Premises
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#e8e8e8]">
          <div className="border border-[#e8e8e8] bg-[#FAFAFA] px-3 py-2">
            <div className="font-mono text-[10px] uppercase text-neutral-400">Requirement 01</div>
            <div className="text-xs text-neutral-800 mt-0.5">Mandatory in-app photo proof</div>
          </div>
          <div className="border border-[#e8e8e8] bg-[#FAFAFA] px-3 py-2">
            <div className="font-mono text-[10px] uppercase text-neutral-400">Requirement 02</div>
            <div className="text-xs text-neutral-800 mt-0.5">Corrective explanation note</div>
          </div>
        </div>
      </div>

      {/* Hairline Connector */}
      <div className="flex flex-col items-center">
        <div className="w-px h-5 bg-[#e8e8e8]" />
        <div className="w-1.5 h-1.5 rotate-45 border-b border-r border-neutral-400 -mt-1" />
      </div>

      {/* Node 4: Admin Governance */}
      <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono text-[10px] tracking-widest uppercase text-neutral-400">
            Phase 04 // Governance
          </span>
          <span className="font-mono text-[10px] text-neutral-400">Executive HQ</span>
        </div>
        <div className="text-sm font-normal text-[#181818]">
          Admin Governance &amp; Final Sign-Off
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#e8e8e8]">
          <div className="border border-[#e8e8e8] bg-white px-3 py-2 flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wide text-neutral-800">Verified</span>
            <span className="font-mono text-[10px] text-neutral-500">Status → Resolved</span>
          </div>
          <div className="border border-[#e8e8e8] bg-white px-3 py-2 flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wide text-neutral-800">Rejected</span>
            <span className="font-mono text-[10px] text-neutral-500">Back → In Progress</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ─── 2. Manager CAPA Resolution Modal Illustration ──────────────────────────

export const CapaResolutionModalIllustration: React.FC = () => (
  <div className="not-prose my-8 border border-[#e8e8e8] bg-white">
    {/* Frame Header */}
    <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-[#e8e8e8] bg-[#FAFAFA]">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-[#FF5400]" />
        <span className="font-mono text-[11px] tracking-wider uppercase text-neutral-600">
          Interface Specification
        </span>
      </div>
      <span className="font-mono text-[11px] text-neutral-400">
        Manager Resolution Tray
      </span>
    </div>

    {/* Wireframe Container */}
    <div className="p-5 sm:p-7 max-w-xl mx-auto">
      <div className="border border-[#e8e8e8] bg-white">
        {/* Tray Title Bar */}
        <div className="px-4 py-3 border-b border-[#e8e8e8] bg-[#FAFAFA] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-neutral-900">
              CAPA-104
            </span>
            <span className="font-mono text-[10px] text-neutral-400">/</span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#FF5400]">
              Critical Violation
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-600 bg-white border border-[#e8e8e8] px-2 py-0.5">
            SLA: 37h 14m Remaining
          </span>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          {/* Finding Observation */}
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
              Field Observation
            </div>
            <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-3 text-xs text-neutral-700 leading-relaxed font-normal">
              &ldquo;Cross-contamination risk in walk-in meat cooler: raw chicken stored above ready-to-eat salads.&rdquo;
            </div>
          </div>

          {/* Corrective Action Explanation */}
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
              01 // Corrective Action Log
            </div>
            <div className="border border-[#e8e8e8] bg-white p-3 text-xs text-neutral-800 leading-relaxed font-normal">
              All raw poultry moved to bottom racks. Prep trays sanitized with chlorine wash and relabeled.
            </div>
          </div>

          {/* Photographic Proof */}
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
              02 // Photographic Evidence
            </div>
            <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-3 flex items-center justify-between gap-3">
              <div>
                <div className="font-mono text-xs text-neutral-800">
                  chicken_lower_rack_verified.jpg
                </div>
                <div className="font-mono text-[10px] text-neutral-400 mt-0.5">
                  1.8 MB · EXIF Geostamped · In-App Camera
                </div>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-600 bg-white border border-[#e8e8e8] px-2 py-0.5">
                Attached
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="button"
              className="w-full bg-[#181818] hover:bg-[#FF5400] text-white text-xs font-mono uppercase tracking-wider py-2.5 px-4 transition-colors cursor-default"
            >
              Submit Resolution for Governance Sign-Off
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ─── 3. The Audit Lifecycle Illustration ─────────────────────────────────────

export const AuditLifecycleIllustration: React.FC = () => (
  <IllustrationFrame badge="System Architecture" title="End-to-End Audit Pipeline">
    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 items-stretch text-left">
      <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-3.5 flex flex-col justify-between">
        <span className="font-mono text-[10px] text-neutral-400 mb-1">Phase 01</span>
        <div className="text-xs font-normal text-[#181818]">Master Blueprint</div>
        <p className="text-[11px] text-neutral-500 mt-1">Author SOP checklists with weighted scoring</p>
      </div>

      <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-3.5 flex flex-col justify-between">
        <span className="font-mono text-[10px] text-neutral-400 mb-1">Phase 02</span>
        <div className="text-xs font-normal text-[#181818]">Schedule &amp; Dispatch</div>
        <p className="text-[11px] text-neutral-500 mt-1">Recurring or surprise unannounced audits</p>
      </div>

      <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-3.5 flex flex-col justify-between">
        <span className="font-mono text-[10px] text-neutral-400 mb-1">Phase 03</span>
        <div className="text-xs font-normal text-[#181818]">Auditor Execution</div>
        <p className="text-[11px] text-neutral-500 mt-1">Mobile questions + live camera proof</p>
      </div>

      <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-3.5 flex flex-col justify-between">
        <span className="font-mono text-[10px] text-neutral-400 mb-1">Phase 04</span>
        <div className="text-xs font-normal text-[#181818]">GPS &amp; Time Lock</div>
        <p className="text-[11px] text-neutral-500 mt-1">Physical on-site presence verification</p>
      </div>

      <div className="border-l-2 border-l-[#FF5400] border border-[#e8e8e8] bg-white p-3.5 flex flex-col justify-between">
        <span className="font-mono text-[10px] text-[#FF5400] mb-1">Phase 05</span>
        <div className="text-xs font-normal text-neutral-900">Score &amp; Auto-CAPA</div>
        <p className="text-[11px] text-neutral-500 mt-1">Pass reports or 48h resolution tickets</p>
      </div>
    </div>
  </IllustrationFrame>
);

// ─── 4. Operational Pillars Illustration ────────────────────────────────────

export const OperationalPillarsIllustration: React.FC = () => (
  <IllustrationFrame badge="Core Philosophy" title="The Three Pillars of High-Trust Auditing">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
      <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-4 flex flex-col justify-between">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#FF5400] block mb-2">
            Pillar 01
          </span>
          <h4 className="text-sm font-normal text-neutral-900 mb-1.5">Proof-Based Inspection</h4>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Mandatory in-app photo capture with live viewfinder and high-accuracy GPS coordinates to eliminate pencil-whipping.
          </p>
        </div>
      </div>

      <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-4 flex flex-col justify-between">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#FF5400] block mb-2">
            Pillar 02
          </span>
          <h4 className="text-sm font-normal text-neutral-900 mb-1.5">Unannounced Verification</h4>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Flashmob 20-second video presence sweeps and surprise audits hidden from manager calendars to capture unvarnished truth.
          </p>
        </div>
      </div>

      <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-4 flex flex-col justify-between">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#FF5400] block mb-2">
            Pillar 03
          </span>
          <h4 className="text-sm font-normal text-neutral-900 mb-1.5">Closed-Loop CAPA</h4>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Automated 48-hour SLA resolution workflows assigned immediately upon any critical checklist failure.
          </p>
        </div>
      </div>
    </div>
  </IllustrationFrame>
);

// ─── 5. Role Hierarchy Illustration ─────────────────────────────────────────

export const RoleHierarchyIllustration: React.FC = () => (
  <IllustrationFrame badge="Security Architecture" title="Role Hierarchy & Operational Boundaries">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
      <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-4 flex flex-col justify-between">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 bg-white px-2 py-0.5 border border-[#e8e8e8]">
            Headquarters
          </span>
          <h4 className="text-sm font-normal text-neutral-900 mt-3 mb-1">Admin (Owner)</h4>
          <p className="text-xs text-neutral-600 leading-relaxed">Full organization scope. Configures blueprints, locations, users, and reviews compliance health.</p>
        </div>
        <div className="mt-3 pt-3 border-t border-[#e8e8e8] font-mono text-[10px] text-neutral-400">
          Scope: /dashboard/admin
        </div>
      </div>

      <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-4 flex flex-col justify-between">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 bg-white px-2 py-0.5 border border-[#e8e8e8]">
            Branch Operations
          </span>
          <h4 className="text-sm font-normal text-neutral-900 mt-3 mb-1">Branch Manager</h4>
          <p className="text-xs text-neutral-600 leading-relaxed">Branch-level scope. Delegates audits to field staff and resolves 48-hour CAPAs with photo evidence.</p>
        </div>
        <div className="mt-3 pt-3 border-t border-[#e8e8e8] font-mono text-[10px] text-neutral-400">
          Scope: /dashboard/manager
        </div>
      </div>

      <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-4 flex flex-col justify-between">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 bg-white px-2 py-0.5 border border-[#e8e8e8]">
            Field Execution
          </span>
          <h4 className="text-sm font-normal text-neutral-900 mt-3 mb-1">Field Auditor</h4>
          <p className="text-xs text-neutral-600 leading-relaxed">Mobile inspection scope. Executes checklists on-site, snaps live photos, and verifies physical presence via GPS.</p>
        </div>
        <div className="mt-3 pt-3 border-t border-[#e8e8e8] font-mono text-[10px] text-neutral-400">
          Scope: /dashboard/auditor
        </div>
      </div>
    </div>
  </IllustrationFrame>
);

// ─── 6. Blueprint Builder Illustration ──────────────────────────────────────

export const BlueprintBuilderIllustration: React.FC = () => (
  <IllustrationFrame badge="Builder Interface" title="Interactive Blueprint Configuration">
    <div className="max-w-xl mx-auto border border-[#e8e8e8] bg-white p-4 space-y-3.5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-[#e8e8e8]">
        <div>
          <div className="font-mono text-[10px] uppercase text-neutral-400">Template Title</div>
          <div className="text-sm font-normal text-neutral-900">Daily Commercial Kitchen Hygiene Standard</div>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider bg-[#FAFAFA] text-neutral-600 px-2 py-1 border border-[#e8e8e8]">Food Safety &amp; Hygiene</span>
      </div>

      {/* Question 1 Card */}
      <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-normal text-neutral-900">[Q1] Are walk-in chillers operating between 1°C and 4°C?</span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#FF5400] bg-white border border-[#FF5400]/30 px-2 py-0.5">Critical (5x)</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-neutral-500 font-mono">
          <span>Type: Yes / No</span>
          <span>·</span>
          <span className="text-neutral-700">Photo Enforced</span>
        </div>
      </div>

      {/* Question 2 Card */}
      <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-normal text-neutral-900">[Q2] Are handwashing stations stocked with soap and sanitized towels?</span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-600 bg-white border border-[#e8e8e8] px-2 py-0.5">Medium (2x)</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-neutral-500 font-mono">
          <span>Type: Rating (1-10)</span>
          <span>·</span>
          <span>Photo Optional</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <span className="font-mono text-xs text-neutral-500">+ Add Custom Question</span>
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#FF5400] bg-white border border-[#FF5400]/40 px-3 py-1">
          Load FSSAI Defaults
        </span>
      </div>
    </div>
  </IllustrationFrame>
);

// ─── 7. In-App Camera Flow Illustration ─────────────────────────────────────

export const CameraCaptureIllustration: React.FC = () => (
  <IllustrationFrame badge="Anti-Fraud Tech" title="Live In-App Photo Capture Pipeline">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
      <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-3.5">
        <div className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-1">Step 01</div>
        <div className="text-xs font-normal text-neutral-900 mb-1">Viewfinder Initialization</div>
        <p className="text-[11px] text-neutral-500 leading-relaxed">Direct hardware stream via browser camera; device gallery upload disabled.</p>
      </div>
      <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-3.5">
        <div className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-1">Step 02</div>
        <div className="text-xs font-normal text-neutral-900 mb-1">Live Sensor Viewfinder</div>
        <p className="text-[11px] text-neutral-500 leading-relaxed">Corner guides, front/rear lens flip &amp; real-time sensor verification.</p>
      </div>
      <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-3.5">
        <div className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-1">Step 03</div>
        <div className="text-xs font-normal text-neutral-900 mb-1">Encrypted Payload</div>
        <p className="text-[11px] text-neutral-500 leading-relaxed">Streamed directly to cloud storage with immutable audit timestamp.</p>
      </div>
    </div>
  </IllustrationFrame>
);

// ─── 8. Geolocation Flow Illustration ───────────────────────────────────────

export const GeoVerificationIllustration: React.FC = () => (
  <IllustrationFrame badge="Presence Verification" title="High-Accuracy GPS Submission Gate">
    <div className="max-w-md mx-auto space-y-3">
      <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-3 text-center">
        <div className="text-xs font-normal text-neutral-900">Auditor Triggers Final Submission</div>
      </div>
      <div className="flex justify-center">
        <div className="w-px h-4 bg-[#e8e8e8]" />
      </div>
      <div className="border border-neutral-900 bg-white p-3 text-center">
        <div className="font-mono text-[10px] uppercase tracking-wider text-[#FF5400] mb-0.5">Presence Verification Gate</div>
        <div className="font-mono text-xs text-neutral-900">verifyRadius(currentCoords, branchCoords)</div>
      </div>
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="border border-[#e8e8e8] bg-white p-3 text-left">
          <span className="font-mono text-[10px] uppercase text-neutral-400 block mb-0.5">Coordinates Valid</span>
          <p className="text-[11px] text-neutral-600">Audit finalizes; location metadata locked to record.</p>
        </div>
        <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-3 text-left">
          <span className="font-mono text-[10px] uppercase text-[#FF5400] block mb-0.5">Denied / Out of Radius</span>
          <p className="text-[11px] text-neutral-600">Submission blocked until device is physically on site.</p>
        </div>
      </div>
    </div>
  </IllustrationFrame>
);

// ─── 9. Flash Verification Lifecycle Illustration ────────────────────────────

export const FlashVerificationIllustration: React.FC = () => (
  <IllustrationFrame badge="Covert Audits" title="Flash Verification Execution Lifecycle">
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-left">
      <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-3">
        <span className="font-mono text-[10px] text-neutral-400 mb-1 block">Phase 01</span>
        <div className="text-xs font-normal text-neutral-900">Admin Dispatches</div>
        <p className="text-[11px] text-neutral-500 mt-1">Target branch + deadline picker</p>
      </div>
      <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-3">
        <span className="font-mono text-[10px] text-neutral-400 mb-1 block">Phase 02</span>
        <div className="text-xs font-normal text-neutral-900">20s Video Sweep</div>
        <p className="text-[11px] text-neutral-500 mt-1">Continuous unedited surroundings capture</p>
      </div>
      <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-3">
        <span className="font-mono text-[10px] text-neutral-400 mb-1 block">Phase 03</span>
        <div className="text-xs font-normal text-neutral-900">Selfie Guide</div>
        <p className="text-[11px] text-neutral-500 mt-1">Face alignment verifies inspector identity</p>
      </div>
      <div className="border-l-2 border-l-[#FF5400] border border-[#e8e8e8] bg-white p-3">
        <span className="font-mono text-[10px] text-[#FF5400] mb-1 block">Phase 04</span>
        <div className="text-xs font-normal text-neutral-900">GPS &amp; Playback</div>
        <p className="text-[11px] text-neutral-500 mt-1">Instant streaming on HQ dashboard</p>
      </div>
    </div>
  </IllustrationFrame>
);

// ─── 10. Surprise Audits Illustration ────────────────────────────────────────

export const SurpriseAuditIllustration: React.FC = () => (
  <IllustrationFrame badge="Zero-Prep Reality" title="Surprise Audit Anti-Bias Mechanism">
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-left">
      <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-3">
        <span className="font-mono text-[10px] text-neutral-400 block mb-1">Config Flag</span>
        <div className="font-mono text-xs text-neutral-900">isSurprise = true</div>
        <p className="text-[11px] text-neutral-500 mt-1">Toggle enabled on publish</p>
      </div>
      <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-3">
        <span className="font-mono text-[10px] text-neutral-400 block mb-1">Concealment</span>
        <div className="text-xs font-normal text-neutral-900">Invisible to Branch</div>
        <p className="text-[11px] text-neutral-500 mt-1">Hidden from manager schedules</p>
      </div>
      <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-3">
        <span className="font-mono text-[10px] text-neutral-400 block mb-1">Rapid Dispatch</span>
        <div className="text-xs font-normal text-neutral-900">Same-Day Window</div>
        <p className="text-[11px] text-neutral-500 mt-1">Strict 4-8 hour completion SLA</p>
      </div>
      <div className="border-l-2 border-l-[#FF5400] border border-[#e8e8e8] bg-white p-3">
        <span className="font-mono text-[10px] text-[#FF5400] block mb-1">True Standard</span>
        <div className="text-xs font-normal text-neutral-900">No Prep Bias</div>
        <p className="text-[11px] text-neutral-500 mt-1">Evaluates natural floor reality</p>
      </div>
    </div>
  </IllustrationFrame>
);

// ─── 11. Recurring Schedule Illustration ────────────────────────────────────

export const RecurringScheduleIllustration: React.FC = () => (
  <IllustrationFrame badge="Automation Engine" title="Automated Recurring Schedule Configuration">
    <div className="max-w-md mx-auto border border-[#e8e8e8] bg-white divide-y divide-[#e8e8e8]">
      <div className="flex items-center justify-between p-3 text-xs">
        <span className="font-mono text-[10px] uppercase text-neutral-400">Frequency</span>
        <span className="font-mono text-xs text-neutral-800">Weekly (Every Monday)</span>
      </div>
      <div className="flex items-center justify-between p-3 text-xs">
        <span className="font-mono text-[10px] uppercase text-neutral-400">Execution Window</span>
        <span className="font-mono text-xs text-neutral-800">08:00 AM – 11:30 AM (Operating Hours)</span>
      </div>
      <div className="flex items-center justify-between p-3 text-xs">
        <span className="font-mono text-[10px] uppercase text-neutral-400">Duration Constraint</span>
        <span className="font-mono text-xs text-neutral-800">Fixed 3.5h Window Locked</span>
      </div>
      <div className="flex items-center justify-between p-3 text-xs">
        <span className="font-mono text-[10px] uppercase text-neutral-400">Generation Horizon</span>
        <span className="font-mono text-xs text-neutral-800">Up to 30 instances ahead</span>
      </div>
    </div>
  </IllustrationFrame>
);

// ─── 12. Compliance Dashboard Illustration ──────────────────────────────────

export const ComplianceDashboardIllustration: React.FC = () => (
  <IllustrationFrame badge="Analytics Matrix" title="Organization Compliance Health Benchmark">
    <div className="space-y-4">
      {/* 3 KPI Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-3 text-left">
          <div className="font-mono text-[10px] uppercase text-neutral-400">Audits (MTD)</div>
          <div className="text-base font-mono text-neutral-900 mt-0.5">142</div>
        </div>
        <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-3 text-left">
          <div className="font-mono text-[10px] uppercase text-neutral-400">Completion Rate</div>
          <div className="text-base font-mono text-neutral-900 mt-0.5">96.4%</div>
        </div>
        <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-3 text-left">
          <div className="font-mono text-[10px] uppercase text-neutral-400">Open CAPAs</div>
          <div className="text-base font-mono text-[#FF5400] mt-0.5">06</div>
        </div>
      </div>

      {/* Location Bars */}
      <div className="border border-[#e8e8e8] bg-white p-4 space-y-3">
        <div className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">Branch Performance Benchmark</div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span>Downtown Flagship</span>
            <span className="text-neutral-900">94% · High Compliance</span>
          </div>
          <div className="w-full bg-[#FAFAFA] h-1.5 border border-[#e8e8e8]">
            <div className="bg-neutral-900 h-full" style={{ width: '94%' }} />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span>North Metro Mall</span>
            <span className="text-neutral-700">86% · Satisfactory</span>
          </div>
          <div className="w-full bg-[#FAFAFA] h-1.5 border border-[#e8e8e8]">
            <div className="bg-neutral-600 h-full" style={{ width: '86%' }} />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span>South Highway Unit</span>
            <span className="text-[#FF5400]">58% · Action Required</span>
          </div>
          <div className="w-full bg-[#FAFAFA] h-1.5 border border-[#e8e8e8]">
            <div className="bg-[#FF5400] h-full" style={{ width: '58%' }} />
          </div>
        </div>
      </div>

      <div className="border-l-2 border-l-[#FF5400] border border-[#e8e8e8] bg-[#FAFAFA] p-3 text-xs text-neutral-700">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[#FF5400] block mb-0.5">Trend Alert // Recurring Decay</span>
        South Highway Unit has scored below 60% on 3 consecutive audit cycles.
      </div>
    </div>
  </IllustrationFrame>
);

// ─── 13. PDF Report Illustration ────────────────────────────────────────────

export const PdfReportIllustration: React.FC = () => (
  <IllustrationFrame badge="Document Engine" title="Verified Executive PDF Report Preview">
    <div className="max-w-md mx-auto border border-[#e8e8e8] bg-white p-5 space-y-3.5 text-xs">
      <div className="flex justify-between items-start border-b border-[#e8e8e8] pb-3">
        <div>
          <span className="font-mono text-[10px] tracking-wider uppercase text-[#FF5400] block">AUDIMENT VERIFIED AUDIT</span>
          <div className="text-sm font-normal text-neutral-900 mt-0.5">Indiranagar 100ft Road Flagship</div>
          <div className="font-mono text-[10px] text-neutral-400">Auditor: R. Sharma (#AUD-042) · 24 Oct 2026</div>
        </div>
        <div className="text-right">
          <div className="text-base font-mono text-neutral-900">94%</div>
          <span className="font-mono text-[10px] uppercase text-neutral-600 bg-[#FAFAFA] border border-[#e8e8e8] px-1.5 py-0.5">Grade: Tier 1</span>
        </div>
      </div>

      <div className="space-y-2 text-xs">
        <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-2.5 flex items-center justify-between">
          <span className="text-neutral-800">Q1: Walk-in chiller temp below 4°C?</span>
          <span className="font-mono text-[11px] text-neutral-600">PASS (10/10) · Photo Verified</span>
        </div>
        <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-2.5 flex items-center justify-between">
          <span className="text-neutral-800">Q2: Commercial hood filters degreased?</span>
          <span className="font-mono text-[11px] text-neutral-600">PASS (9/10) · Photo Verified</span>
        </div>
      </div>

      <div className="pt-2 border-t border-[#e8e8e8] flex items-center justify-between font-mono text-[10px] text-neutral-400">
        <span>GPS: 12.9716° N, 77.6412° E (Verified On-Premises)</span>
        <span>Cryptographic Seal Verified</span>
      </div>
    </div>
  </IllustrationFrame>
);

// ─── 14. Admin Onboarding Illustration ──────────────────────────────────────

export const AdminOnboardingIllustration: React.FC = () => (
  <IllustrationFrame badge="Setup Flow" title="Admin 4-Step Onboarding Workflow">
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-left">
      <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-3">
        <span className="font-mono text-[10px] text-neutral-400 block mb-1">Step 01</span>
        <div className="text-xs font-normal text-neutral-900">Create Outlets</div>
        <p className="text-[11px] text-neutral-500 mt-1">Branch names, addresses &amp; operating hours</p>
      </div>
      <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-3">
        <span className="font-mono text-[10px] text-neutral-400 block mb-1">Step 02</span>
        <div className="text-xs font-normal text-neutral-900">Invite Team</div>
        <p className="text-[11px] text-neutral-500 mt-1">Invite managers and pair field auditors</p>
      </div>
      <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-3">
        <span className="font-mono text-[10px] text-neutral-400 block mb-1">Step 03</span>
        <div className="text-xs font-normal text-neutral-900">Author Templates</div>
        <p className="text-[11px] text-neutral-500 mt-1">Build SOP checklists with FSSAI defaults</p>
      </div>
      <div className="border-l-2 border-l-[#FF5400] border border-[#e8e8e8] bg-white p-3">
        <span className="font-mono text-[10px] text-[#FF5400] block mb-1">Step 04</span>
        <div className="text-xs font-normal text-neutral-900">Schedule Audits</div>
        <p className="text-[11px] text-neutral-500 mt-1">Deploy recurring routines or surprise checks</p>
      </div>
    </div>
  </IllustrationFrame>
);

// ─── 15. Manager Routine Illustration ───────────────────────────────────────

export const ManagerRoutineIllustration: React.FC = () => (
  <IllustrationFrame badge="Operations Routine" title="Manager Operational Cycle">
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-left">
      <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-3">
        <span className="font-mono text-[10px] text-neutral-400 block mb-1">Routine 01</span>
        <div className="text-xs font-normal text-neutral-900">Check Overview</div>
        <p className="text-[11px] text-neutral-500 mt-1">Review alerts &amp; near-deadline tasks</p>
      </div>
      <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-3">
        <span className="font-mono text-[10px] text-neutral-400 block mb-1">Routine 02</span>
        <div className="text-xs font-normal text-neutral-900">Delegate Audits</div>
        <p className="text-[11px] text-neutral-500 mt-1">Assign inspections to active auditors</p>
      </div>
      <div className="border-l-2 border-l-[#FF5400] border border-[#e8e8e8] bg-white p-3">
        <span className="font-mono text-[10px] text-[#FF5400] block mb-1">Routine 03</span>
        <div className="text-xs font-normal text-neutral-900">Resolve CAPAs</div>
        <p className="text-[11px] text-neutral-500 mt-1">Submit mandatory photos within 48h</p>
      </div>
      <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-3">
        <span className="font-mono text-[10px] text-neutral-400 block mb-1">Routine 04</span>
        <div className="text-xs font-normal text-neutral-900">Track Trends</div>
        <p className="text-[11px] text-neutral-500 mt-1">Monitor branch score trajectories</p>
      </div>
    </div>
  </IllustrationFrame>
);

// ─── 16. Capa Ticket Steps Illustration ─────────────────────────────────────

export const CapaTicketStepsIllustration: React.FC = () => (
  <IllustrationFrame badge="Resolution Guide" title="6-Step CAPA Ticket Resolution Workflow">
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-left">
      <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-3">
        <span className="font-mono text-[10px] text-neutral-400 block mb-0.5">01 // Read Finding</span>
        <span className="text-neutral-600 text-[11px]">Review auditor finding notes</span>
      </div>
      <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-3">
        <span className="font-mono text-[10px] text-neutral-400 block mb-0.5">02 // Rectify Site</span>
        <span className="text-neutral-600 text-[11px]">Fix physical deficiency on site</span>
      </div>
      <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-3">
        <span className="font-mono text-[10px] text-neutral-400 block mb-0.5">03 // Launch Tray</span>
        <span className="text-neutral-600 text-[11px]">Open &ldquo;Resolve Item&rdquo; tray</span>
      </div>
      <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-3">
        <span className="font-mono text-[10px] text-neutral-400 block mb-0.5">04 // Log Action</span>
        <span className="text-neutral-600 text-[11px]">Document corrective fix applied</span>
      </div>
      <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-3">
        <span className="font-mono text-[10px] text-neutral-400 block mb-0.5">05 // Photo Proof</span>
        <span className="text-neutral-600 text-[11px]">Capture photographic proof</span>
      </div>
      <div className="border-l-2 border-l-[#FF5400] border border-[#e8e8e8] bg-white p-3">
        <span className="font-mono text-[10px] text-[#FF5400] block mb-0.5">06 // Sign-Off</span>
        <span className="text-neutral-600 text-[11px]">Submit for HQ review</span>
      </div>
    </div>
  </IllustrationFrame>
);

// ─── 17. Auditor Field Lifecycle Illustration ───────────────────────────────

export const AuditorLifecycleIllustration: React.FC = () => (
  <IllustrationFrame badge="Field Protocol" title="Auditor Field Inspection Sequence">
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-left">
      <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-3">
        <span className="font-mono text-[10px] text-neutral-400 block mb-1">Stage 01</span>
        <div className="text-xs font-normal text-neutral-900">Select Assignment</div>
        <p className="text-[11px] text-neutral-500 mt-1">Choose pending audit from mobile queue</p>
      </div>
      <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-3">
        <span className="font-mono text-[10px] text-neutral-400 block mb-1">Stage 02</span>
        <div className="text-xs font-normal text-neutral-900">Location Check</div>
        <p className="text-[11px] text-neutral-500 mt-1">Enable device GPS permissions</p>
      </div>
      <div className="border border-[#e8e8e8] bg-[#FAFAFA] p-3">
        <span className="font-mono text-[10px] text-neutral-400 block mb-1">Stage 03</span>
        <div className="text-xs font-normal text-neutral-900">Step-by-Step</div>
        <p className="text-[11px] text-neutral-500 mt-1">Answer criteria &amp; capture live photos</p>
      </div>
      <div className="border-l-2 border-l-[#FF5400] border border-[#e8e8e8] bg-white p-3">
        <span className="font-mono text-[10px] text-[#FF5400] block mb-1">Stage 04</span>
        <div className="text-xs font-normal text-neutral-900">GPS Submit</div>
        <p className="text-[11px] text-neutral-500 mt-1">Verify coordinates &amp; complete audit</p>
      </div>
    </div>
  </IllustrationFrame>
);

// ─── 18. Auditor Inspection Engine UI Illustration ──────────────────────────

export const AuditorInspectionEngineIllustration: React.FC = () => (
  <IllustrationFrame badge="Mobile Interface" title="Auditor Step-by-Step Inspection Engine">
    <div className="max-w-md mx-auto border border-[#e8e8e8] bg-white p-4 space-y-3.5">
      <div className="flex items-center justify-between text-xs pb-2 border-b border-[#e8e8e8]">
        <span className="font-mono text-[10px] uppercase text-neutral-400">Exit</span>
        <span className="text-xs font-normal text-neutral-800">Daily Kitchen Hygiene Standard</span>
        <span className="font-mono text-[10px] uppercase text-[#FF5400]">Q 04 of 24</span>
      </div>

      <div className="w-full bg-[#FAFAFA] h-1 border border-[#e8e8e8]">
        <div className="bg-[#FF5400] h-full" style={{ width: '16.6%' }} />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-700 bg-[#FAFAFA] border border-[#e8e8e8] px-2 py-0.5">
            Critical Severity (5x)
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#FF5400] bg-white border border-[#FF5400]/40 px-2 py-0.5">
            Photo Enforced
          </span>
        </div>
        <h4 className="text-xs font-normal text-neutral-900 leading-relaxed">
          &ldquo;Are all hot holding units maintaining food core temperatures above 60°C?&rdquo;
        </h4>
      </div>

      {/* Yes/No Buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="border-2 border-neutral-900 bg-[#FAFAFA] p-2 text-center font-mono text-xs uppercase tracking-wider text-neutral-900">
          Yes (Compliant)
        </div>
        <div className="border border-[#e8e8e8] bg-white p-2 text-center font-mono text-xs uppercase tracking-wider text-neutral-500">
          No (Violation)
        </div>
      </div>

      <div className="border border-[#e8e8e8] p-2 bg-[#FAFAFA] text-[11px] font-mono text-neutral-600">
        Observation: Hot bar soup wells measured at 64°C. Gravy warmer measured at 62°C.
      </div>

      <div className="flex items-center justify-between pt-1 text-xs font-mono">
        <span className="text-neutral-400">Previous</span>
        <span className="bg-[#181818] text-white px-3 py-1 text-[11px] uppercase tracking-wider">Next Question</span>
      </div>
    </div>
  </IllustrationFrame>
);

// ─── 19. Scoring Formula Illustration ───────────────────────────────────────

export const ScoringFormulaIllustration: React.FC = () => (
  <IllustrationFrame badge="Mathematical Engine" title="Weighted Audit Score Formula">
    <div className="max-w-md mx-auto border border-[#e8e8e8] bg-white p-5 text-center">
      <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-3">Formula // Composite Score</div>
      <div className="inline-flex items-center gap-3 text-sm font-mono text-neutral-800">
        <span>Score (%) =</span>
        <div className="inline-flex flex-col items-center">
          <span className="border-b border-neutral-900 pb-0.5 px-2">Total Weighted Points Earned</span>
          <span className="pt-0.5 px-2 text-neutral-500 text-xs">Total Maximum Possible Points</span>
        </div>
        <span>× 100</span>
      </div>
      <div className="mt-4 pt-3 border-t border-[#e8e8e8] font-mono text-[11px] text-neutral-500">
        Critical Violation Rule: Any failed critical criterion automatically overrides composite score to Critical Fail.
      </div>
    </div>
  </IllustrationFrame>
);
