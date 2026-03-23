import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, role, name, organizationId, assignedLocations, managerId } = body;

    // 1. Validate inputs
    if (!email || !password || !role || !name || !organizationId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!['MANAGER', 'AUDITOR'].includes(role.toUpperCase())) {
      return NextResponse.json({ error: 'Invalid role provided' }, { status: 400 });
    }

    // 2. Create the user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    const uid = userRecord.uid;

    // 3. Create the corresponding user document in Firestore
    const userData: any = {
      uid,
      email,
      name,
      role: role.toUpperCase(),
      organizationId,
      isActive: true,
      createdAt: new Date(),
    };

    if (role.toUpperCase() === 'MANAGER') {
      userData.assignedLocations = assignedLocations || [];
    }

    if (role.toUpperCase() === 'AUDITOR') {
      userData.managerId = managerId || null;
    }

    await adminDb.collection('users').doc(uid).set(userData);

    return NextResponse.json({ success: true, uid }, { status: 201 });
  } catch (err: any) {
    console.error('Error creating user:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error while creating user' },
      { status: 500 }
    );
  }
}
