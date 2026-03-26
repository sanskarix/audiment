import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// POST: Create a new user
export async function POST(req: Request) {
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

    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    const uid = userRecord.uid;

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

    return NextResponse.json({ success: true, uid }, { status: 201 });
  } catch (err: any) {
    console.error('Error creating user:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH: Update a user
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { uid, name, managerId } = body;

    if (!uid) {
      return NextResponse.json({ error: 'Missing user UID' }, { status: 400 });
    }

    // 1. Update Auth displayName if name changed
    if (name) {
      await adminAuth.updateUser(uid, { displayName: name });
    }

    // 2. Update Firestore document
    const updateData: any = {};
    if (name) updateData.name = name;
    if (managerId !== undefined) updateData.managerId = managerId;

    await adminDb.collection('users').doc(uid).update(updateData);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error updating user:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: Permanent deletion
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get('uid');

    if (!uid) {
      return NextResponse.json({ error: 'Missing user UID' }, { status: 400 });
    }

    // Always prevent deleting the root admin user safely or checking role
    const userDoc = await adminDb.collection('users').doc(uid).get();
    if (userDoc.exists && userDoc.data()?.role === 'ADMIN') {
      return NextResponse.json({ error: 'Cannot delete admin account' }, { status: 403 });
    }

    // 1. Delete from Firebase Auth
    await adminAuth.deleteUser(uid);

    // 2. Delete from Firestore
    await adminDb.collection('users').doc(uid).delete();

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error deleting user:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
