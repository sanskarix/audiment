import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DECISIONS_FILE = path.join(process.cwd(), 'docs/ui-inventory/decisions/variant_decisions.json');

function ensureFile() {
  const dir = path.dirname(DECISIONS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DECISIONS_FILE)) {
    fs.writeFileSync(DECISIONS_FILE, JSON.stringify({ decisions: {} }, null, 2), 'utf8');
  }
}

export async function GET() {
  try {
    ensureFile();
    const data = fs.readFileSync(DECISIONS_FILE, 'utf8');
    const parsed = JSON.parse(data);
    return NextResponse.json(parsed);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    ensureFile();
    const body = await req.json();
    const { action, decision } = body;

    const data = fs.readFileSync(DECISIONS_FILE, 'utf8');
    const state = JSON.parse(data);
    if (!state.decisions) state.decisions = {};

    if (action === 'save') {
      if (!decision || !decision.sourceVariantId) {
        return NextResponse.json({ error: 'Missing sourceVariantId' }, { status: 400 });
      }

      // Check self-merge safety rule
      if (decision.decisionType === 'merge' && decision.sourceVariantId === decision.targetVariantId) {
        return NextResponse.json({ error: 'A variant cannot be merged into itself' }, { status: 400 });
      }

      // Keyed by sourceVariantId so each variant has a clear singular decision record
      const key = decision.sourceVariantId;
      state.decisions[key] = {
        decisionId: decision.decisionId || `DEC-${decision.sourceVariantId}`,
        familyId: decision.familyId,
        sourceVariantId: decision.sourceVariantId,
        decisionType: decision.decisionType, // 'merge' | 'keep_separate' | 'decide_later'
        targetVariantId: decision.decisionType === 'merge' ? decision.targetVariantId : null,
        notes: decision.notes || '',
        updatedAt: new Date().toISOString(),
        status: decision.decisionType === 'decide_later' ? 'pending' : 'design_decision_recorded_pending_system_definition',
        isImplemented: false // Explicitly clarify intent vs implementation
      };

      fs.writeFileSync(DECISIONS_FILE, JSON.stringify(state, null, 2), 'utf8');
      return NextResponse.json({ success: true, decision: state.decisions[key] });
    }

    if (action === 'delete') {
      const { sourceVariantId } = body;
      if (!sourceVariantId || !state.decisions[sourceVariantId]) {
        return NextResponse.json({ error: 'Decision not found' }, { status: 404 });
      }
      delete state.decisions[sourceVariantId];
      fs.writeFileSync(DECISIONS_FILE, JSON.stringify(state, null, 2), 'utf8');
      return NextResponse.json({ success: true, deleted: sourceVariantId });
    }

    if (action === 'reset_all') {
      state.decisions = {};
      fs.writeFileSync(DECISIONS_FILE, JSON.stringify(state, null, 2), 'utf8');
      return NextResponse.json({ success: true, message: 'All decisions reset' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
