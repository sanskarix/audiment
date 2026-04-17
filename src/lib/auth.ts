import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export type UserRole = 'admin' | 'manager' | 'auditor';

export interface AuthUser {
  uid: string;
  email: string;
  role: UserRole;
  name: string;
  organizationId: string;
}

export async function loginUser(email: string, password: string): Promise<AuthUser> {
  const credential = await signInWithEmailAndPassword(auth, email, password);

  // Force a token refresh so custom claims (role, orgId) set by the Admin SDK
  // are included immediately — without this, the cached token may be stale.
  const idToken = await credential.user.getIdToken(true);

  const uid = credential.user.uid;

  const userDoc = await getDoc(doc(db, 'users', uid));
  if (!userDoc.exists()) {
    throw new Error('User record not found in database.');
  }

  const data = userDoc.data();
  const role = (data.role || '').toLowerCase() as UserRole;

  // Validate that the role and organizationId are present
  if (!['admin', 'manager', 'auditor'].includes(role)) {
    throw new Error(`User has invalid role: ${data.role}`);
  }

  if (!data.organizationId) {
    throw new Error('User record is missing an organizationId. Please contact support.');
  }

  // ── Set HttpOnly session cookie via the server-side API route ──────────────
  // This replaces the previous `document.cookie = ...` assignment.
  // The server uses adminAuth.verifyIdToken() to validate the token and sets
  // the cookie with HttpOnly + Secure flags, making it invisible to JavaScript.
  const sessionRes = await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });

  if (!sessionRes.ok) {
    // Non-fatal: the Firebase auth is valid; we just couldn't set the HttpOnly cookie.
    // Log it but don't block the login — the Bearer token flow will still work.
    console.error('[loginUser] Failed to set server session cookie:', await sessionRes.text());
  }

  return {
    uid,
    email: data.email,
    role,
    name: data.name,
    organizationId: data.organizationId,
  };
}

export async function logoutUser(): Promise<void> {
  // ── Clear the HttpOnly cookie server-side FIRST ────────────────────────────
  // document.cookie cannot clear an HttpOnly cookie, so we must call the API.
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch (err) {
    // Non-fatal: the firebase signOut below will still invalidate the client session.
    console.error('[logoutUser] Failed to clear server session cookie:', err);
  }

  await signOut(auth);
}

export function getSessionFromCookie(cookieString: string): { uid: string; role: UserRole; name: string; email: string; organizationId: string; } | null {
  const match = cookieString.match(/audiment_session=([^;]+)/);
  if (!match) return null;
  try {
    const data = JSON.parse(decodeURIComponent(match[1]));
    if (!data.organizationId) return null;
    return { 
      uid: data.uid, 
      role: data.role, 
      name: data.name, 
      email: data.email,
      organizationId: data.organizationId 
    };
  } catch {
    return null;
  }
}
