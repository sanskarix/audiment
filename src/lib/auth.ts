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

  // Store session info in a cookie (readable by proxy)
  const sessionData = JSON.stringify({ uid, role, email: data.email, name: data.name, organizationId: data.organizationId });
  document.cookie = `audiment_session=${encodeURIComponent(sessionData)}; path=/; max-age=${60 * 60 * 24 * 7}`;

  return {
    uid,
    email: data.email,
    role,
    name: data.name,
    organizationId: data.organizationId,
  };
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
  // Clear session cookie
  document.cookie = 'audiment_session=; path=/; max-age=0';
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
