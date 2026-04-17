import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { getPostHogClient } from '@/lib/posthog-server';
import { getCallerInfo, unauthorized, forbidden } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// POST: Create a new user — Admin only
export async function POST(req: Request) {
  // ── Security: verify caller is an Admin ────────────────────────────────────
  const caller = await getCallerInfo(req);
  if (!caller) return unauthorized();
  if (caller.role !== 'admin') return forbidden();

  try {
    const body = await req.json();
    const { email, password, role, name, organizationId, managerId } = body;

    const missing = [];
    if (!email) missing.push('email');
    if (!password) missing.push('password');
    if (!role) missing.push('role');
    if (!name) missing.push('name');
    if (!organizationId) missing.push('organizationId');

    if (missing.length > 0) {
      return NextResponse.json({ error: `Missing required fields: ${missing.join(', ')}` }, { status: 400 });
    }

    // Prevent creating users in a different organization
    if (organizationId !== caller.organizationId) {
      return forbidden();
    }

    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    const uid = userRecord.uid;

    // ─── Set custom claims immediately so the ID token carries role + org ───
    await adminAuth.setCustomUserClaims(uid, {
      role: role.toLowerCase(),
      organizationId: organizationId,
    });

    const userData: any = {
      uid,
      email,
      name,
      role: role.toUpperCase(),
      organizationId,
      isActive: true,
      createdAt: new Date(),
    };

    if (role.toUpperCase() === 'AUDITOR') {
      userData.managerId = managerId || null;
    }

    await adminDb.collection('users').doc(uid).set(userData);

    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: uid,
      event: 'user_created_server',
      properties: {
        role: role.toUpperCase(),
        organization_id: organizationId,
      },
    });

    return NextResponse.json({ success: true, uid }, { status: 201 });
  } catch (err: any) {
    console.error('Error creating user:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH: Update a user — Admin only
export async function PATCH(req: Request) {
  // ── Security: verify caller is an Admin ────────────────────────────────────
  const caller = await getCallerInfo(req);
  if (!caller) return unauthorized();
  if (caller.role !== 'admin') return forbidden();

  try {
    const body = await req.json();
    const { uid, name, role, managerId, hasFlashmobAccess, isActive } = body;

    if (!uid) {
      return NextResponse.json({ error: 'Missing user UID' }, { status: 400 });
    }

    // Ensure the target user belongs to the caller's organization
    const targetDoc = await adminDb.collection('users').doc(uid).get();
    if (!targetDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    if (targetDoc.data()?.organizationId !== caller.organizationId) {
      return forbidden();
    }

    // 1. Update Auth displayName if name changed
    if (name) {
      await adminAuth.updateUser(uid, { displayName: name });
    }

    // 2. Update custom claims if role is changing
    if (role) {
      // Fetch the current user's orgId from Firestore to preserve it in claims
      const userDoc = await adminDb.collection('users').doc(uid).get();
      const orgId = userDoc.data()?.organizationId ?? '';
      await adminAuth.setCustomUserClaims(uid, {
        role: role.toLowerCase(),
        organizationId: orgId,
      });
    }

    // 3. Update Firestore document
    const updateData: any = {};
    if (name) updateData.name = name;
    if (role) updateData.role = role.toUpperCase();
    if (managerId !== undefined) updateData.managerId = managerId;
    if (hasFlashmobAccess !== undefined) updateData.hasFlashmobAccess = hasFlashmobAccess;
    if (isActive !== undefined) {
      updateData.isActive = isActive;
      await adminAuth.updateUser(uid, { disabled: !isActive });
    }

    await adminDb.collection('users').doc(uid).update(updateData);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error updating user:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: Permanent deletion — Admin only
export async function DELETE(req: Request) {
  // ── Security: verify caller is an Admin ────────────────────────────────────
  const caller = await getCallerInfo(req);
  if (!caller) return unauthorized();
  if (caller.role !== 'admin') return forbidden();

  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get('uid');

    if (!uid) {
      return NextResponse.json({ error: 'Missing user UID' }, { status: 400 });
    }

    // Prevent deleting the root admin user safely or checking role
    const userDoc = await adminDb.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Ensure target belongs to the same organization
    if (userDoc.data()?.organizationId !== caller.organizationId) {
      return forbidden();
    }

    if (userDoc.data()?.role === 'ADMIN') {
      return NextResponse.json({ error: 'Cannot delete admin account' }, { status: 403 });
    }

    // Execute both delete operations in parallel
    await Promise.all([
      adminAuth.deleteUser(uid),
      adminDb.collection('users').doc(uid).delete()
    ]);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error deleting user:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
